import { requireAdmin } from "@/lib/permissions";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { saveCategory, toggleCategory } from "./actions";

export default async function CategoriesPage() {
  await requireAdmin();
  const rows = await db.select().from(categories).orderBy(asc(categories.displayOrder), asc(categories.name));

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold">Categories</h1>
          <p className="muted">Create, edit, and activate proposal categories.</p>
        </div>
        <a className="btn btn-outline-secondary" href="/admin">Back to admin</a>
      </div>

      <form action={saveCategory} className="card card-body mb-4">
        <h2 className="h5">Add category</h2>
        <div className="row g-2">
          <div className="col-md-5">
            <input className="form-control" name="name" placeholder="Category name" required minLength={2} maxLength={80} />
          </div>
          <div className="col-md-5">
            <input className="form-control" name="description" placeholder="Example / description" maxLength={240} />
          </div>
          <div className="col-md-2">
            <input className="form-control" name="displayOrder" type="number" min="0" defaultValue="0" />
          </div>
        </div>
        <button className="btn btn-primary mt-3">Create category</button>
      </form>

      <div className="d-grid gap-3">
        {rows.map((category) => (
          <div className="card card-body" key={category.id}>
            <form action={saveCategory}>
              <input type="hidden" name="id" value={category.id} />
              <div className="row g-2 align-items-end">
                <div className="col-md-4">
                  <label className="form-label">Category</label>
                  <input className="form-control" name="name" defaultValue={category.name} required minLength={2} maxLength={80} />
                </div>
                <div className="col-md-5">
                  <label className="form-label">Description</label>
                  <input className="form-control" name="description" defaultValue={category.description ?? ""} maxLength={240} />
                </div>
                <div className="col-md-1">
                  <label className="form-label">Order</label>
                  <input className="form-control" type="number" min="0" name="displayOrder" defaultValue={category.displayOrder} />
                </div>
                <div className="col-md-2">
                  <div className="d-flex gap-2 align-items-center">
                    <button className="btn btn-sm btn-primary">Save</button>
                    <span className={category.active ? "badge text-bg-success" : "badge text-bg-secondary"}>
                      {category.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            </form>
            <form action={toggleCategory} className="mt-2">
              <input type="hidden" name="id" value={category.id} />
              <input type="hidden" name="active" value={String(!category.active)} />
              <button className="btn btn-sm btn-outline-secondary">
                {category.active ? "Deactivate" : "Activate"}
              </button>
            </form>
          </div>
        ))}
      </div>
    </>
  );
}
