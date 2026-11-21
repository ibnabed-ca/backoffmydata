// Local proof of concept only. Do not expose to the public or use with real personal data.
import { Database } from 'bun:sqlite';
const secret = process.env.JWT_SECRET;
if (!secret || secret.length < 32) throw new Error('Set JWT_SECRET to at least 32 random characters');
const db = new Database(process.env.DB_PATH || 'prototype.sqlite', { create: true });
db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL)');
const enc = new TextEncoder();
const b64 = (data: Uint8Array | string) => Buffer.from(data).toString('base64url');
async function token(id: number) {
  const payload = `${b64(JSON.stringify({ alg:'HS256', typ:'JWT' }))}.${b64(JSON.stringify({ sub:String(id), exp:Math.floor(Date.now()/1000)+3600 }))}`;
  const key = await crypto.subtle.importKey('raw', enc.encode(secret!), {name:'HMAC',hash:'SHA-256'}, false, ['sign']);
  return `${payload}.${b64(new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(payload))))}`;
}
const json = (body: object, status = 200) => Response.json(body, {status, headers:{'Cache-Control':'no-store'}});
Bun.serve({ hostname:'127.0.0.1', port:Number(process.env.PORT || 3001), async fetch(req) {
  const url = new URL(req.url);
  if (req.method !== 'POST' || !['/api/signup','/api/login'].includes(url.pathname)) return json({error:'Not found'},404);
  if (Number(req.headers.get('content-length') || 0) > 4096) return json({error:'Request too large'},413);
  try {
    const {email,password} = await req.json();
    if (typeof email !== 'string' || typeof password !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 12 || password.length > 128) return json({error:'Use a valid email and a password of 12–128 characters'},400);
    const normalized = email.toLowerCase();
    if (url.pathname === '/api/signup') {
      const hash = await Bun.password.hash(password, {algorithm:'argon2id'});
      try { const result = db.query('INSERT INTO users (email,password_hash) VALUES (?,?)').run(normalized,hash); return json({token:await token(Number(result.lastInsertRowid))},201); }
      catch { return json({error:'Unable to create account'},400); }
    }
    const user = db.query('SELECT id,password_hash FROM users WHERE email = ?').get(normalized) as {id:number,password_hash:string}|null;
    if (!user || !(await Bun.password.verify(password,user.password_hash))) return json({error:'Invalid credentials'},401);
    return json({token:await token(user.id)});
  } catch { return json({error:'Invalid request'},400); }
}});
console.log('Local prototype API listening on http://127.0.0.1:3001');
