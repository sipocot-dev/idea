"use server";
import { requireAdmin } from "@/lib/permissions";
import { db } from "@/lib/db";
import { ideas, auditLogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function assignReviewer(fd: FormData) {
  const actor = await requireAdmin();
  const ideaId = String(fd.get("ideaId") ?? "");
  const reviewerId = String(fd.get("reviewerId") ?? "");
  if (!ideaId) throw new Error("Proposal is required.");
  await db.update(ideas).set({ assignedReviewerId: reviewerId || null, updatedAt: new Date() }).where(eq(ideas.id, ideaId));
  await db.insert(auditLogs).values({ actorId: actor.id, action: "idea.reviewer_assigned", entityType: "idea", entityId: ideaId, metadata: { reviewerId: reviewerId || null } });
  revalidatePath("/admin"); redirect("/admin");
}
