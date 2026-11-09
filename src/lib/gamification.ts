import {db} from "@/lib/db";import {userPoints,userBadges} from "@/lib/db/schema";import {eq,sql} from "drizzle-orm";
export async function awardVerifiedPoints(userId:string,eventKey:string,points:number,reason:string){
 const [created]=await db.insert(userPoints).values({userId,eventKey,points,reason}).onConflictDoNothing().returning({id:userPoints.id});
 if(!created)return;
 const [totals]=await db.select({points:sql<number>`coalesce(sum(points),0)::int`,ideas:sql<number>`count(*) filter (where event_key like 'idea:%')::int`,supports:sql<number>`count(*) filter (where event_key like 'support:%')::int`,collabs:sql<number>`count(*) filter (where event_key like 'collab:%')::int`}).from(userPoints).where(eq(userPoints.userId,userId));
 const awards:string[]=[];
 if(totals.ideas>=1)awards.push("first_idea");
 if(totals.supports>=1)awards.push("first_support");
 if(totals.collabs>=1)awards.push("trusted_collaborator");
 if(totals.points>=25)awards.push("impact_25");
 for(const badgeKey of awards)await db.insert(userBadges).values({userId,badgeKey}).onConflictDoNothing();
}
