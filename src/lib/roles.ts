export const roles = ["super_admin","admin","municipal_representative","department_reviewer","evaluator","community_moderator","auditor","user"] as const;
export type AppRole = typeof roles[number];
export const roleLabels: Record<AppRole,string> = {
  super_admin: "Super administrator", admin: "Administrator",
  municipal_representative: "Municipal representative", department_reviewer: "Department reviewer",
  evaluator: "Evaluator", community_moderator: "Community moderator", auditor: "Auditor", user: "Registered user"
};
export const rolePermissions: Record<AppRole,string[]> = {
  super_admin: ["*"], admin: ["proposals:manage","categories:manage","users:manage","reports:read","audit:read"],
  municipal_representative: ["proposals:assigned:read","proposals:official-update"],
  department_reviewer: ["proposals:department:read","proposals:review"],
  evaluator: ["proposals:assigned:read","proposals:evaluate"],
  community_moderator: ["comments:moderate"],
  auditor: ["reports:read","audit:read","proposals:read"],
  user: ["proposals:create","proposals:own:read","proposals:own:update"]
};
