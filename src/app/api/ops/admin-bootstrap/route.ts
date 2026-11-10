import { NextResponse } from "next/server";
import { randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { appSettings, users } from "@/lib/db/schema";
import { hashPassword } from "@/lib/password";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TARGET_EMAIL = "nievarez.carlangelop@gmail.com";
const TARGET_NAME = "System Administrator";
const CLAIM_KEY = "one_time_admin_bootstrap_2026_11";

function authorized(request: Request) {
  const expected = process.env.ADMIN_BOOTSTRAP_TOKEN;
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!expected || !supplied) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(supplied);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await db.transaction(async (tx) => {
      const claimed = await tx
        .insert(appSettings)
        .values({
          key: CLAIM_KEY,
          value: { claimedAt: new Date().toISOString() },
        })
        .onConflictDoNothing()
        .returning({ key: appSettings.key });

      if (claimed.length === 0) {
        return { alreadyUsed: true as const };
      }

      const password = randomBytes(24).toString("base64url");
      const passwordHash = hashPassword(password);
      const [existing] = await tx
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, TARGET_EMAIL))
        .limit(1);

      if (existing) {
        await tx.update(users).set({
          name: TARGET_NAME,
          passwordHash,
          role: "super_admin",
          isActive: true,
          emailVerified: new Date(),
          updatedAt: new Date(),
        }).where(eq(users.id, existing.id));
      } else {
        await tx.insert(users).values({
          id: randomUUID(),
          name: TARGET_NAME,
          email: TARGET_EMAIL,
          passwordHash,
          role: "super_admin",
          isActive: true,
          emailVerified: new Date(),
        });
      }

      await tx.insert(appSettings).values({
        key: "admin_bootstrap_audit",
        value: {
          email: TARGET_EMAIL,
          role: "super_admin",
          createdAt: new Date().toISOString(),
          method: "one-time-provisioning-endpoint",
        },
      }).onConflictDoUpdate({
        target: appSettings.key,
        set: {
          value: {
            email: TARGET_EMAIL,
            role: "super_admin",
            updatedAt: new Date().toISOString(),
            method: "one-time-provisioning-endpoint",
          },
          updatedAt: new Date(),
        },
      });

      return { alreadyUsed: false as const, password };
    });

    if (result.alreadyUsed) {
      return NextResponse.json({ error: "Provisioning endpoint already used" }, { status: 410 });
    }

    return NextResponse.json({
      success: true,
      email: TARGET_EMAIL,
      role: "super_admin",
      temporaryPassword: result.password,
      message: "Save this password now. It will not be returned again.",
    });
  } catch (error) {
    console.error("[admin-bootstrap] Provisioning failed", error);
    return NextResponse.json({ error: "Provisioning failed" }, { status: 500 });
  }
}
