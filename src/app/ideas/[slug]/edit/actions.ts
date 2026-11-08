"use server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ideas } from "@/lib/db/schema";
import { ideaInput } from "@/lib/validators";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function updateOwnIdea(slug: string, fd: FormData) {
  const session = await auth();
  if (!session?.user?.id || !session.user.isActive) redirect("/login");
  const parsed = ideaInput.safeParse(Object.fromEntries(fd.entries()));
  if (!parsed.success) throw new Error(parsed.error.issues.map(x => x.message).join("; "));
  const v = parsed.data;
  const [current] = await db.select({ id: ideas.id, status: ideas.status }).from(ideas).where(and(eq(ideas.slug, slug), eq(ideas.proposerId, session.user.id))).limit(1);
  if (!current || !["draft", "for_revision"].includes(current.status)) throw new Error("Only drafts and proposals returned for revision can be edited.");
  await db.update(ideas).set({ title: v.title, type: v.type, categoryId: v.categoryId || null, summary: v.summary, description: v.description, problemStatement: v.problemStatement, proposedSolution: v.proposedSolution, expectedBenefits: v.expectedBenefits, targetBarangay: v.targetBarangay, githubUrl: v.githubUrl || null, projectUrl: v.projectUrl || null, documentationUrl: v.documentationUrl || null, isOpenSource: v.isOpenSource, willingToCollaborate: v.willingToCollaborate, status: current.status === "for_revision" ? "submitted" : "draft", updatedAt: new Date(), submittedAt: current.status === "for_revision" ? new Date() : undefined }).where(eq(ideas.id, current.id));
  revalidatePath("/my-ideas"); revalidatePath("/ideas");
  redirect("/my-ideas");
}
