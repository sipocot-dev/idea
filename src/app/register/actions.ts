"use server";
import {db} from "@/lib/db"; import {users,emailVerificationTokens} from "@/lib/db/schema";
import {hashPassword,randomToken,tokenDigest} from "@/lib/password"; import {sendEmail} from "@/lib/email";
import {rateLimit} from "@/lib/redis"; import {redirect} from "next/navigation";
import {eq} from "drizzle-orm"; import {revalidatePath} from "next/cache";
export async function registerUser(fd:FormData) {
 const name=String(fd.get("name")??"").trim().slice(0,120);
 const email=String(fd.get("email")??"").trim().toLowerCase();
 const password=String(fd.get("password")??"");
 if(name.length<2||!/^\S+@\S+\.\S+$/.test(email)||password.length<12||password.length>128) throw new Error("Enter a valid name and email. Password must be 12–128 characters.");
 const limit=await rateLimit(`register:${email}`,3,3600); if(!limit.allowed) throw new Error("Registration limit reached. Try again later.");
 const [existing]=await db.select({id:users.id}).from(users).where(eq(users.email,email)).limit(1);
 if(existing) throw new Error("An account with this email already exists.");
 const id=crypto.randomUUID(); const passwordHash=await hashPassword(password);
 await db.insert(users).values({id,name,email,passwordHash,role:"user",isActive:true,emailVerified:process.env.REQUIRE_EMAIL_VERIFICATION==="true"?null:new Date()});
 if(process.env.REQUIRE_EMAIL_VERIFICATION==="true") {
  const token=randomToken(); await db.insert(emailVerificationTokens).values({userId:id,tokenHash:tokenDigest(token),expiresAt:new Date(Date.now()+24*60*60*1000)});
  const url=`${process.env.APP_URL??process.env.AUTH_URL}/verify-email?token=${encodeURIComponent(token)}`;
  await sendEmail(email,"Verify your BetterSipocot Ideas account",`<p>Hello ${name.replace(/[<>&"]/g,"")},</p><p>Verify your email to activate your account.</p><p><a href="${url}">Verify email address</a></p><p>This link expires in 24 hours.</p>`);
  redirect("/login?checkEmail=1");
 }
 revalidatePath("/"); redirect("/login?registered=1");
}
