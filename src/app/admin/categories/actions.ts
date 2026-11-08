"use server";

import { requireAdmin } from "@/lib/permissions";
import { db } from "@/lib/db";
import { categories, auditLogs } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

export async function saveCategory(fd: FormData) {
  const actor = await requireAdmin();
  const id = String(fd.get("id") ?? "").trim();
  const name = String(fd.get("name") ?? "").trim().slice(0, 80);
  const description = String(fd.get("description") ?? "").trim().slice(0, 240);
  const displayOrder = Number(fd.get("displayOrder") ?? 0);
  if (name.length < 2 || !Number.isInteger(displayOrder) || displayOrder < 0) throw new Error("Invalid category.");
  const slug = name.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  if (id) {
    await db.update(categories).set({ name, slug, description, displayOrder }).where(eq(categories.id, id));
    await db.insert(auditLogs).values({ actorId: actor.id, action: "category.updated", entityType: "category", entityId: id, metadata: { name } });
  } else {
    const [created] = await db.insert(categories).values({ name, slug, description, displayOrder }).returning({ id: categories.id });
    await db.insert(auditLogs).values({ actorId: actor.id, action: "category.created", entityType: "category", entityId: created.id, metadata: { name } });
  }
  revalidatePath("/admin/categories"); revalidatePath("/submit"); revalidatePath("/ideas");
  redirect("/admin/categories");
}

export async function toggleCategory(fd: FormData) {
  const actor = await requireAdmin();
  const id = String(fd.get("id") ?? "");
  const active = String(fd.get("active") ?? "") === "true";
  if (!id) throw new Error("Category is required.");
  await db.update(categories).set({ active }).where(eq(categories.id, id));
  await db.insert(auditLogs).values({ actorId: actor.id, action: active ? "category.activated" : "category.deactivated", entityType: "category", entityId: id, metadata: {} });
  revalidatePath("/admin/categories"); revalidatePath("/submit"); revalidatePath("/ideas");
  redirect("/admin/categories");
}
