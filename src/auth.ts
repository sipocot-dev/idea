import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import Facebook from "next-auth/providers/facebook";
import Twitter from "next-auth/providers/twitter";
import Credentials from "next-auth/providers/credentials";
import {DrizzleAdapter} from "@auth/drizzle-adapter";
import {db} from "@/lib/db";
import {accounts,sessions,users,verificationTokens} from "@/lib/db/schema";
import {and,eq} from "drizzle-orm";
import {verifyPassword} from "@/lib/password";
const providers = [];
if(process.env.AUTH_GOOGLE_ID&&process.env.AUTH_GOOGLE_SECRET) providers.push(Google);
if(process.env.AUTH_GITHUB_ID&&process.env.AUTH_GITHUB_SECRET) providers.push(GitHub);
if(process.env.AUTH_MICROSOFT_ENTRA_ID_ID&&process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET) providers.push(MicrosoftEntraID);
if(process.env.AUTH_FACEBOOK_ID&&process.env.AUTH_FACEBOOK_SECRET) providers.push(Facebook);
if(process.env.AUTH_TWITTER_ID&&process.env.AUTH_TWITTER_SECRET) providers.push(Twitter);
export const {handlers,auth,signIn,signOut}=NextAuth({
 adapter:DrizzleAdapter(db,{usersTable:users,accountsTable:accounts,sessionsTable:sessions,verificationTokensTable:verificationTokens}),
 providers:[
  ...providers,
  Credentials({id:"credentials",name:"Email and password",credentials:{email:{label:"Email",type:"email"},password:{label:"Password",type:"password"}},async authorize(credentials){
   const email=String(credentials?.email??"").trim().toLowerCase(); const password=String(credentials?.password??"");
   if(!email||!password) return null;
   const [user]=await db.select().from(users).where(eq(users.email,email)).limit(1);
   if(!user||!user.isActive||!(await verifyPassword(password,user.passwordHash))) return null;
   if(process.env.REQUIRE_EMAIL_VERIFICATION==="true"&&!user.emailVerified) return null;
   return {id:user.id,name:user.name,email:user.email,image:user.image,role:user.role,isActive:user.isActive};
  }})
 ],
 session:{strategy:"jwt"},
 pages:{signIn:"/login"},
 callbacks:{
  async signIn({user,account}) {
   if(!user.id) return false;
   const [u]=await db.select({active:users.isActive,emailVerified:users.emailVerified}).from(users).where(eq(users.id,user.id)).limit(1);
   if(!u||!u.active) return false;
   if(account?.provider==="credentials"&&process.env.REQUIRE_EMAIL_VERIFICATION==="true"&&!u.emailVerified) return false;
   return true;
  },
  async jwt({token,user}) {
   if(user?.id) {
    const [u]=await db.select({role:users.role,isActive:users.isActive}).from(users).where(eq(users.id,user.id)).limit(1);
    token.uid=user.id; token.role=u?.role??"user"; token.active=u?.isActive??false;
   } else if(token.uid) {
    const [u]=await db.select({role:users.role,isActive:users.isActive}).from(users).where(eq(users.id,String(token.uid))).limit(1);
    token.role=u?.role??"user"; token.active=u?.isActive??false;
   }
   return token;
  },
  async session({session,token}) {
   if(session.user) { session.user.id=String(token.uid??""); session.user.role=String(token.role??"user") as typeof session.user.role; session.user.isActive=token.active===true; }
   return session;
  }
 }
});
