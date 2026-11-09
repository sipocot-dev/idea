import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";
import { submitIdea } from "./actions";
import MarkdownEditor from "@/components/markdown-editor";
import ProjectCategoryLegend from "@/components/project-category-legend";

export default async function SubmitPage() {
  if (!(await auth())?.user) redirect("/login");
  const opts = await db.select().from(categories).where(eq(categories.active, true)).orderBy(asc(categories.displayOrder));
  return <div className="row justify-content-center"><div className="col-lg-9">
    <h1 className="fw-bold">Submit a proposal</h1><p className="muted">Provide enough detail for evaluation.</p>
    <ProjectCategoryLegend compact />
    <form action={submitIdea} className="card p-4 mt-4">
      <label className="form-label">Title *</label><input className="form-control mb-3" name="title" minLength={8} maxLength={160} required />
      <label className="form-label">Category *</label><select className="form-select mb-3" name="categoryId" required defaultValue=""><option value="" disabled>Select category</option>{opts.map(c=><option key={c.id} value={c.id}>{c.name} — {c.description}</option>)}</select>
      <label className="form-label">Proposal type</label><select className="form-select mb-3" name="type"><option value="idea">Community idea</option><option value="community_project">Community project</option><option value="policy_proposal">Policy proposal</option><option value="other">Other</option></select>
      <label className="form-label">Summary *</label><textarea className="form-control mb-3" name="summary" rows={3} minLength={30} maxLength={500} required />
      <label className="form-label">Detailed description *</label><MarkdownEditor name="description" minLength={100} maxLength={12000}/>
      {([["problemStatement","Problem statement"],["proposedSolution","Proposed solution"],["expectedBenefits","Expected benefits"]] as const).map(([n,l])=><div key={n}><label className="form-label">{l}</label><textarea className="form-control mb-3" name={n}/></div>)}
      <label className="form-label">Target barangay</label><input className="form-control mb-3" name="targetBarangay"/>
      {([["githubUrl","GitHub URL"],["projectUrl","Project URL"],["documentationUrl","Documentation URL"]] as const).map(([n,l])=><div key={n}><label className="form-label">{l}</label><input className="form-control mb-3" type="url" name={n}/></div>)}
      <div className="form-check mb-2"><input className="form-check-input" type="checkbox" name="isOpenSource" value="true" id="os"/><label className="form-check-label" htmlFor="os">Open source</label></div>
      <div className="form-check mb-4"><input className="form-check-input" type="checkbox" name="willingToCollaborate" value="true" id="collab"/><label className="form-check-label" htmlFor="collab">Willing to collaborate</label></div>
      <button className="btn btn-primary">Submit proposal</button>
    </form></div></div>;
}