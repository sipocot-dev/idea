"use server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ideaSupporters, ideas, ideaCollaborators, ideaProgressUpdates, userPoints } from "@/lib/db/schema";
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
  const [owner] = await db.select({ proposerId: ideas.proposerId }).from(ideas).where(eq(ideas.id,ideaId)).limit(1);
  if(owner?.proposerId===userId) throw new Error("You cannot support your own proposal.");
  const [existing] = await db.select({ userId: ideaSupporters.userId }).from(ideaSupporters).where(and(eq(ideaSupporters.ideaId, ideaId), eq(ideaSupporters.userId, userId))).limit(1);
  if (existing) await db.delete(ideaSupporters).where(and(eq(ideaSupporters.ideaId, ideaId), eq(ideaSupporters.userId, userId)));
  else { await db.insert(ideaSupporters).values({ ideaId, userId }).onConflictDoNothing(); await db.insert(userPoints).values({userId,eventKey:`support:${ideaId}`,points:1,reason:"Supported a community proposal"}).onConflictDoNothing(); }
  revalidatePath(`/ideas/${slug}`);
  revalidatePath("/ideas");
}

export async function requestCollaboration(fd: FormData) {
  const session = await auth(); const userId = session?.user?.id;
  if (!userId || !session.user.isActive) redirect("/login");
  const ideaId=String(fd.get("ideaId")??""); const slug=String(fd.get("slug")??""); const message=String(fd.get("message")??"").trim();
  if(!ideaId||!slug||message.length<10||message.length>500) throw new Error("Provide a collaboration message between 10 and 500 characters.");
  const [idea]=await db.select({id:ideas.id,proposerId:ideas.proposerId,willingToCollaborate:ideas.willingToCollaborate}).from(ideas).where(and(eq(ideas.id,ideaId),eq(ideas.slug,slug),eq(ideas.visibility,"public"))).limit(1);
  if(!idea||!idea.willingToCollaborate||idea.proposerId===userId) throw new Error("This proposal is not accepting collaboration requests.");
  await db.insert(ideaCollaborators).values({ideaId,userId,message}).onConflictDoNothing();
  revalidatePath(`/ideas/${slug}`); revalidatePath("/profile");
}
export async function reviewCollaboration(fd: FormData) {
  const session=await auth(); const userId=session?.user?.id; if(!userId||!session.user.isActive) redirect("/login");
  const requestId=String(fd.get("requestId")??""); const slug=String(fd.get("slug")??""); const decision=String(fd.get("decision")??"");
  if(!["accepted","declined"].includes(decision)) throw new Error("Invalid collaboration decision.");
  const [request]=await db.select({ideaId:ideaCollaborators.ideaId,userId:ideaCollaborators.userId}).from(ideaCollaborators).where(and(eq(ideaCollaborators.id,requestId),eq(ideaCollaborators.status,"pending"))).limit(1);
  if(!request) throw new Error("Request not found.");
  const [idea]=await db.select({proposerId:ideas.proposerId}).from(ideas).where(and(eq(ideas.id,request.ideaId),eq(ideas.slug,slug))).limit(1);
  if(!idea||idea.proposerId!==userId) throw new Error("Only the proposal owner can review collaboration requests.");
  await db.update(ideaCollaborators).set({status:decision,updatedAt:new Date()}).where(eq(ideaCollaborators.id,requestId));
  if(decision==="accepted") await db.insert(userPoints).values({userId:request.userId,eventKey:`collaboration-accepted:${request.ideaId}`,points:5,reason:"Accepted as a project collaborator"}).onConflictDoNothing();
  revalidatePath(`/ideas/${slug}`); revalidatePath("/my-ideas"); revalidatePath("/profile");
}
export async function publishProgress(fd: FormData) {
  const session=await auth(); const userId=session?.user?.id;
  if(!userId||!session.user.isActive) redirect("/login");
  const ideaId=String(fd.get("ideaId")??""); const slug=String(fd.get("slug")??"");
  const title=String(fd.get("title")??"").trim(); const body=String(fd.get("body")??"").trim();
  const raw=String(fd.get("percentComplete")??""); const percent=raw===""?null:Number(raw);
  if(!title||title.length>120||body.length<10||body.length>3000||(percent!==null&&(!Number.isInteger(percent)||percent<0||percent>100))) throw new Error("Invalid progress update.");
  const [idea]=await db.select({id:ideas.id,proposerId:ideas.proposerId}).from(ideas).where(and(eq(ideas.id,ideaId),eq(ideas.slug,slug))).limit(1);
  const [collab]=await db.select({id:ideaCollaborators.id}).from(ideaCollaborators).where(and(eq(ideaCollaborators.ideaId,ideaId),eq(ideaCollaborators.userId,userId),eq(ideaCollaborators.status,"accepted"))).limit(1);
  if(!idea||(idea.proposerId!==userId&&!collab)) throw new Error("Only the proposer or accepted collaborators can publish updates.");
  await db.insert(ideaProgressUpdates).values({ideaId,authorId:userId,title,body,percentComplete:percent,milestone:String(fd.get("milestone")??"").trim()||null,visibility:"public"});
  revalidatePath(`/ideas/${slug}`); revalidatePath("/my-ideas");
}
