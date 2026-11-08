import "next-auth";
import type {DefaultSession} from "next-auth";
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "super_admin" | "admin" | "department_reviewer" | "evaluator" | "auditor" | "user";
      isActive: boolean;
    } & DefaultSession["user"];
  }
}
