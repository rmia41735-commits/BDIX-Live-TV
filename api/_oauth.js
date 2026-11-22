const crypto=require('node:crypto');
const base='https://bdix-live-tv-studio-4l50iv0ew-adminakhifashioncom-1315.vercel.app';
const callback=base+'/api/auth/google/callback';
const client=process.env.GOOGLE_CLIENT_ID;
const secret=process.env.GOOGLE_CLIENT_SECRET;
const key=process.env.OAUTH_COOKIE_SECRET;
const scopes='openid email profile https://www.googleapis.com/auth/youtube.readonly';
function configured(){return !!(client&&secret&&key&&key.length>=32)}
function secureCookie(name,value,maxAge,path='/'){return name+'='+encodeURIComponent(value)+'; Path='+path+'; HttpOnly; Secure; SameSite=Lax; Max-Age='+maxAge}
function parse(req,name){const str=req.headers.cookie||'';const entry=str.split(';').map(s=>s.trim()).find(s=>s.startsWith(name+'='));try{return entry?decodeURIComponent(entry.slice(name.length+1)):null}catch{return null}}
function seal(data){const iv=crypto.randomBytes(12);const c=crypto.createCipheriv('aes-256-gcm',crypto.createHash('sha256').update(key).digest(),iv);const enc=Buffer.concat([c.update(JSON.stringify(data)),c.final()]);return Buffer.concat([iv,c.getAuthTag(),enc]).toString('base64url')}
function open(value){try{const b=Buffer.from(value,'base64url');const d=crypto.createDecipheriv('aes-256-gcm',crypto.createHash('sha256').update(key).digest(),b.subarray(0,12));d.setAuthTag(b.subarray(12,28));return JSON.parse(Buffer.concat([d.update(b.subarray(28)),d.final()]).toString())}catch{return null}}
function respond(res,code,body){res.status(code).setHeader('Cache-Control','no-store').json(body)}
function sameHost(req){return req.headers.host==='bdix-live-tv-studio-4l50iv0ew-adminakhifashioncom-1315.vercel.app'}
async function token(body){const r=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(body)});if(!r.ok)throw Error('Google token exchange failed');return r.json()}
module.exports={crypto,base,callback,client,secret,scopes,configured,secureCookie,parse,seal,open,respond,sameHost,token};