import {auth} from "@/auth"; import {redirect} from "next/navigation";
import type {AppRole} from "@/lib/roles";
export async function requireUser(){const s=await auth();if(!s?.user?.id||!s.user.isActive)redirect("/login");return s.user;}
export async function requireAdmin(){const u=await requireUser();if(!["super_admin","admin"].includes(u.role))redirect("/");return u;}
export async function requireSuperAdmin(){const u=await requireUser();if(u.role!=="super_admin")redirect("/");return u;}
export async function requireRole(allowed: AppRole[]){const u=await requireUser();if(!allowed.includes(u.role as AppRole))redirect("/");return u;}
