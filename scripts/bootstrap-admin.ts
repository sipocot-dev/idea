import {randomBytes,randomUUID} from "node:crypto";import {db} from "../src/lib/db";import {users} from "../src/lib/db/schema";import {hashPassword} from "../src/lib/password";import {eq} from "drizzle-orm";
const email=process.argv[2]?.trim().toLowerCase();const name=process.argv[3]??"System Administrator";if(!email||!/^\S+@\S+\.\S+$/.test(email))throw new Error("Usage: npm run admin:bootstrap -- admin@example.com [name]");
const password=randomBytes(18).toString("base64url");const passwordHash=hashPassword(password);const [existing]=await db.select({id:users.id}).from(users).where(eq(users.email,email)).limit(1);
if(existing)await db.update(users).set({name,passwordHash,role:"super_admin",isActive:true,emailVerified:new Date(),updatedAt:new Date()}).where(eq(users.id,existing.id));
else await db.insert(users).values({id:randomUUID(),name,email,passwordHash,role:"super_admin",isActive:true,emailVerified:new Date()});
console.log("\nSuper administrator provisioned. Save this password now; it will not be shown again.\n");console.log(`Email: ${email}\nTemporary password: ${password}\n`);process.exit(0);
