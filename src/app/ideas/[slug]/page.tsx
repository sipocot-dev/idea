import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ideas, ideaStatusHistory, users, ideaSupporters, categories } from "@/lib/db/schema";
import { eq, and, asc, sql } from "drizzle-orm";
import { toggleSupport } from "./actions";
import MarkdownContent from "@/components/markdown-content";

const labels: Record<string,string> = { draft:"Draft", submitted:"Submitted", under_review:"Under Review", for_revision:"For Revision", approved:"Approved", in_progress:"In Progress", completed:"Completed", rejected:"Rejected", archived:"Archived" };

export default async function IdeaDetail({ params }: { params: Promise<{slug:string}> }) {
  const { slug } = await params;
  const [found] = await db.select({ id:ideas.id }).from(ideas).where(and(eq(ideas.slug,slug),eq(ideas.visibility,"public"))).limit(1);
  if (!found) notFound();
  await db.update(ideas).set({ viewCount: sql`${ideas.viewCount} + 1` }).where(eq(ideas.id,found.id));
  const [item] = await db.select({ idea:ideas, proposer:users.name, categoryName:categories.name }).from(ideas).leftJoin(users,eq(ideas.proposerId,users.id)).leftJoin(categories,eq(ideas.categoryId,categories.id)).where(eq(ideas.id,found.id)).limit(1);
  if (!item) notFound();
  const history = await db.select().from(ideaStatusHistory).where(and(eq(ideaStatusHistory.ideaId,item.idea.id),eq(ideaStatusHistory.visibility,"public"))).orderBy(asc(ideaStatusHistory.createdAt));
  const [support] = await db.select({ count:sql<number>`count(*)::int` }).from(ideaSupporters).where(eq(ideaSupporters.ideaId,item.idea.id));
  const session = await auth();
  const userId = session?.user?.id;
  const [mySupport] = userId ? await db.select({ userId:ideaSupporters.userId }).from(ideaSupporters).where(and(eq(ideaSupporters.ideaId,item.idea.id),eq(ideaSupporters.userId,userId))).limit(1) : [];
  return <div className="detail-shell">
    <Link className="back-link" href="/ideas">← Back to community ideas</Link>
    <section className="detail-hero"><div className="d-flex flex-wrap align-items-center gap-2 mb-3"><span className="detail-category">{item.categoryName??item.idea.type.replaceAll("_"," ")}</span><span className={`status status-${item.idea.status}`}>{labels[item.idea.status]}</span></div><h1>{item.idea.title}</h1><p>{item.idea.summary}</p><div className="detail-byline">Proposed by {item.proposer??"Community member"} · {new Date(item.idea.createdAt).toLocaleDateString()}</div><div className="detail-engagement"><div><strong>{support?.count??0}</strong><span>community supporters</span></div><div><strong>{item.idea.viewCount}</strong><span>project visits</span></div><form action={toggleSupport}><input type="hidden" name="ideaId" value={item.idea.id}/><input type="hidden" name="slug" value={slug}/><button className={`btn ${mySupport?"btn-light":"btn-outline-light"} btn-lg`}>{mySupport?"✓ Supporting":"♡ Support this idea"}</button></form></div>{!userId&&<small className="detail-login-note">Sign in to support this proposal. <Link href="/login">Sign in</Link></small>}</section>
    <div className="row g-3 mt-2"><div className="col-lg-8"><section className="card p-4 mb-3"><h2 className="h5">About this proposal</h2><div className="markdown-body"><MarkdownContent content={item.idea.description}/></div></section>{item.idea.problemStatement&&<section className="card p-4 mb-3"><h2 className="h5">Problem statement</h2><p className="mb-0">{item.idea.problemStatement}</p></section>}{item.idea.proposedSolution&&<section className="card p-4 mb-3"><h2 className="h5">Proposed solution</h2><p className="mb-0">{item.idea.proposedSolution}</p></section>}<section className="card p-4 mb-3"><h2 className="h5">Supporting links</h2><ul className="mb-0">{[["GitHub",item.idea.githubUrl],["Project",item.idea.projectUrl],["Documentation",item.idea.documentationUrl]].filter((x):x is [string,string]=>Boolean(x[1])).map(([label,url])=><li key={label}><a href={url} target="_blank" rel="noreferrer">{label}</a></li>)}</ul></section></div><div className="col-lg-4"><section className="card p-4 mb-3"><h2 className="h6">Project information</h2><dl className="detail-facts"><dt>Category</dt><dd>{item.categoryName??"Other"}</dd><dt>Target area</dt><dd>{item.idea.targetBarangay??"Sipocot"}</dd><dt>Open source</dt><dd>{item.idea.isOpenSource?"Yes":"Not specified"}</dd><dt>Collaboration</dt><dd>{item.idea.willingToCollaborate?"Open to collaborators":"Not specified"}</dd></dl></section><section className="card p-4"><h2 className="h6">Progress updates</h2>{history.length?history.map(h=><div className="border-start border-2 ps-3 pb-3 mb-2" key={h.id}><strong>{labels[h.toStatus]}</strong><div className="small text-secondary">{new Date(h.createdAt).toLocaleString()}</div>{h.remarks&&<p className="mb-0 mt-1">{h.remarks}</p>}</div>):<p className="muted mb-0">No public updates yet.</p>}</section></div></div>
  </div>;
}