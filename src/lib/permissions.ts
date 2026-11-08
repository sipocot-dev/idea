import {auth} from "@/auth"; import {redirect} from "next/navigation";
export async function requireUser(){const s=await auth();if(!s?.user?.id||!s.user.isActive)redirect("/login");return s.user;}
export async function requireAdmin(){const u=await requireUser();if(!["super_admin","admin"].includes(u.role))redirect("/");return u;}