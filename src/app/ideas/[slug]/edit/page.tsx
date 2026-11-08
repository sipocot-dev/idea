import { auth } from "@/auth";
import { db } from "@/lib/db";
import { categories, ideas } from "@/lib/db/schema";
import { and, asc, eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { updateOwnIdea } from "./actions";

export default async function EditIdeaPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth(); if (!session?.user?.id) redirect("/login");
  const { slug } = await params;
  const [idea] = await db.select().from(ideas).where(and(eq(ideas.slug, slug), eq(ideas.proposerId, session.user.id))).limit(1);
  if (!idea || !["draft", "for_revision"].includes(idea.status)) notFound();
  const options = await db.select().from(categories).where(eq(categories.active, true)).orderBy(asc(categories.displayOrder));
  const action = updateOwnIdea.bind(null, slug);
  return <div className="row justify-content-center"><div className="col-lg-9"><h1 className="fw-bold">Edit proposal</h1><p className="muted">Only drafts and proposals returned for revision can be edited.</p><form action={action} className="card p-4">
    <label className="form-label">Title</label><input className="form-control mb-3" name="title" defaultValue={idea.title} required minLength={8} maxLength={160}/>
    <label className="form-label">Category</label><select className="form-select mb-3" name="categoryId" defaultValue={idea.categoryId ?? ""}><option value="">Select category</option>{options.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
    <label className="form-label">Proposal type</label><select className="form-select mb-3" name="type" defaultValue={idea.type}><option value="idea">Community idea</option><option value="community_project">Community project</option><option value="policy_proposal">Policy proposal</option><option value="other">Other</option></select>
    <label className="form-label">Summary</label><textarea className="form-control mb-3" name="summary" rows={3} defaultValue={idea.summary} required minLength={30} maxLength={500}/>
    <label className="form-label">Description</label><textarea className="form-control mb-3" name="description" rows={7} defaultValue={idea.description} required minLength={100} maxLength={12000}/>
    {([["problemStatement","Problem statement",idea.problemStatement],["proposedSolution","Proposed solution",idea.proposedSolution],["expectedBenefits","Expected benefits",idea.expectedBenefits]] as const).map(([n,l,v])=><div key={n}><label className="form-label">{l}</label><textarea className="form-control mb-3" name={n} defaultValue={v ?? ""}/></div>)}
    <label className="form-label">Target barangay</label><input className="form-control mb-3" name="targetBarangay" defaultValue={idea.targetBarangay ?? ""}/>
    {([["githubUrl","GitHub URL",idea.githubUrl],["projectUrl","Project URL",idea.projectUrl],["documentationUrl","Documentation URL",idea.documentationUrl]] as const).map(([n,l,v])=><div key={n}><label className="form-label">{l}</label><input className="form-control mb-3" name={n} type="url" defaultValue={v ?? ""}/></div>)}
    <div className="form-check mb-2"><input className="form-check-input" type="checkbox" name="isOpenSource" value="true" defaultChecked={idea.isOpenSource}/><label className="form-check-label">Open source</label></div><div className="form-check mb-4"><input className="form-check-input" type="checkbox" name="willingToCollaborate" value="true" defaultChecked={idea.willingToCollaborate}/><label className="form-check-label">Willing to collaborate</label></div><button className="btn btn-primary">Save changes</button>
  </form></div></div>;
}
