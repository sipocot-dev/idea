import "next-auth";
import type {DefaultSession} from "next-auth";
import "next-auth/jwt";
declare module "next-auth" {
 interface Session { user: { id:string; role:"super_admin"|"admin"|"municipal_representative"|"department_reviewer"|"evaluator"|"community_moderator"|"auditor"|"user"; isActive:boolean } & DefaultSession["user"]; }
}
declare module "next-auth/jwt" { interface JWT { uid?:string; role?:string; active?:boolean; } }
