"use server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ideaSupporters, ideas } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function toggleSupport(formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login");
  const ideaId = String(formData.get("ideaId") ?? "");
  const slug = String(formData.get("slug") ?? "");
  if (!ideaId || !slug) throw new Error("Invalid proposal.");
  const [idea] = await db.select({ id: ideas.id }).from(ideas).where(and(eq(ideas.id, ideaId), eq(ideas.slug, slug), eq(ideas.visibility, "public"))).limit(1);
  if (!idea) throw new Error("Proposal not found.");
  const [existing] = await db.select({ userId: ideaSupporters.userId }).from(ideaSupporters).where(and(eq(ideaSupporters.ideaId, ideaId), eq(ideaSupporters.userId, userId))).limit(1);
  if (existing) await db.delete(ideaSupporters).where(and(eq(ideaSupporters.ideaId, ideaId), eq(ideaSupporters.userId, userId)));
  else await db.insert(ideaSupporters).values({ ideaId, userId }).onConflictDoNothing();
  revalidatePath(`/ideas/${slug}`);
  revalidatePath("/ideas");
}
