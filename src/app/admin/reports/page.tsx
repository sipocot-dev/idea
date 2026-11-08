import { requireAdmin } from "@/lib/permissions";
import { db } from "@/lib/db";
import { categories, ideas } from "@/lib/db/schema";
import { count, eq } from "drizzle-orm";

export default async function ReportsPage() {
  await requireAdmin();
  const [total] = await db.select({ value: count() }).from(ideas);
  const statusRows = await db.select({ status: ideas.status, value: count() }).from(ideas).groupBy(ideas.status);
  const categoryRows = await db.select({ name: categories.name, value: count(ideas.id) }).from(categories).leftJoin(ideas, eq(ideas.categoryId, categories.id)).groupBy(categories.id, categories.name).orderBy(categories.name);
  const statuses = ["draft","submitted","under_review","for_revision","approved","in_progress","completed","rejected","archived"] as const;
  const statusCounts = new Map<string, number>(statusRows.map(x => [x.status, Number(x.value)]));
  return <><div className="d-flex justify-content-between align-items-center mb-4"><div><h1 className="fw-bold mb-1">Reports</h1><p className="muted mb-0">Proposal volume by workflow status and category.</p></div><a href="/admin" className="btn btn-outline-secondary">Back to admin</a></div><div className="card card-body mb-4"><div className="small text-secondary">Total proposals</div><div className="display-4 fw-bold">{total.value}</div></div><div className="row g-4"><div className="col-lg-6"><div className="card card-body h-100"><h2 className="h5">By status</h2>{statuses.map(s=><div className="d-flex justify-content-between border-bottom py-2" key={s}><span>{s.replaceAll("_"," ")}</span><strong>{statusCounts.get(s) ?? 0}</strong></div>)}</div></div><div className="col-lg-6"><div className="card card-body h-100"><h2 className="h5">By category</h2>{categoryRows.map(c=><div className="d-flex justify-content-between border-bottom py-2" key={c.name}><span>{c.name}</span><strong>{c.value}</strong></div>)}</div></div></div></>;
}
