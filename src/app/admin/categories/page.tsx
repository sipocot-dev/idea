import { requireAdmin } from "@/lib/permissions";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { saveCategory, toggleCategory } from "./actions";

export default async function CategoriesPage() {
  await requireAdmin();
  const rows = await db.select().from(categories).orderBy(asc(categories.displayOrder), asc(categories.name));
  return <><div className="d-flex justify-content-between align-items-center mb-4"><div><h1 className="fw-bold mb-1">Categories</h1><p className="muted mb-0">Create, edit, and control proposal categories.</p></div><a className="btn btn-outline-secondary" href="/admin">Back to dashboard</a></div>
    <form action={saveCategory} className="card card-body mb-4"><h2 className="h5">Add category</h2><div className="row g-2"><div className="col-md-5"><input className="form-control" name="name" placeholder="Category name" required minLength={2} maxLength={80}/></div><div className="col-md-5"><input className="form-control" name="description" placeholder="Example / description" maxLength={240}/></div><div className="col-md-2"><input className="form-control" name="displayOrder" type="number" min="0" defaultValue="0" aria-label="Display order"/></div></div><div className="mt-3"><button className="btn btn-primary">Create category</button></div></form>
    <div className="table-responsive card card-body"><table className="table align-middle"><thead><tr><th>Category</th><th>Example</th><th>Order</th><th>State</th><th>Actions</th></tr></thead><tbody>{rows.map(c=><tr key={c.id}><td colSpan={0}><form action={saveCategory} className="d-flex gap-2 align-items-center"><input type="hidden" name="id" value={c.id}/><input className="form-control" name="name" defaultValue={c.name} required/><input className="form-control" name="description" defaultValue={c.description ?? ""}/><input className="form-control" style={{maxWidth:90}} type="number" min="0" name="displayOrder" defaultValue={c.displayOrder}/><button className="btn btn-sm btn-outline-primary">Save</button></form></td><td className="small">{c.description}</td><td>{c.displayOrder}</td><td><span className={c.active ? "badge text-bg-success" : "badge text-bg-secondary"}>{c.active ? "Active" : "Inactive"}</span></td><td><form action={toggleCategory}><input type="hidden" name="id" value={c.id}/><input type="hidden" name="active" value={String(!c.active)}/><button className="btn btn-sm btn-outline-secondary">{c.active ? "Deactivate" : "Activate"}</button></form></td></tr>)}</tbody></table></div>
  </>;
}
