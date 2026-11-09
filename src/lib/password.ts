import {randomBytes,scryptSync,timingSafeEqual,createHash} from "node:crypto";
export function hashPassword(password:string){const salt=randomBytes(16).toString("hex");return `scrypt:${salt}:${scryptSync(password,salt,64).toString("hex")}`;}
export function verifyPassword(password:string,stored?:string|null){if(!stored)return false;const [scheme,salt,hash]=stored.split(":");if(scheme!=="scrypt"||!salt||!hash)return false;const expected=Buffer.from(hash,"hex");const actual=scryptSync(password,salt,expected.length);return expected.length===actual.length&&timingSafeEqual(expected,actual);}
export function randomToken(){return randomBytes(32).toString("base64url");}
export function tokenDigest(token:string){return createHash("sha256").update(token).digest("hex");}
