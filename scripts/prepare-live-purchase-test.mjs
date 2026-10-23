// Operator-only: requires authenticated Wrangler access to the live D1 database.
import { randomBytes, randomUUID, createHash } from 'node:crypto';
import { mkdirSync, writeFileSync, unlinkSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { validMailbox } from '../store/environment.mjs';
const email=process.argv[2]?.trim().toLowerCase();
if(process.argv.length!==3 || !validMailbox(email)) throw Error('Usage: node scripts/prepare-live-purchase-test.mjs buyer@example.com');
const id=randomUUID(),code=randomBytes(32).toString('hex'),hash=createHash('sha256').update(code).digest('hex');
const expires=Math.floor(Date.now()/1000)+86400;
const root=fileURLToPath(new URL('../',import.meta.url)),folder=new URL('../.wrangler/',import.meta.url);
mkdirSync(folder,{recursive:true});
const file=new URL('live-purchase-test-'+id+'.sql',folder);
const sql="INSERT INTO live_purchase_tests(id,token_hash,buyer_email,expires) VALUES('"+id+"','"+hash+"','"+email.replaceAll("'","''")+"',"+expires+");\r\n";
writeFileSync(file,sql,{flag:'wx'});
try {
  const result=spawnSync(process.execPath,[fileURLToPath(new URL('../node_modules/wrangler/bin/wrangler.js',import.meta.url)),
    'd1','execute','npower-store-live','--remote','--file',fileURLToPath(file),'--yes'],{cwd:root,encoding:'utf8'});
  if(result.status!==0) throw Error('Invitation was not confirmed. Check Wrangler access and migrations before retrying.');
  console.log(JSON.stringify({url:'https://www.npowersoftware.com/checkout/live-test/',code,buyer:email,expires:new Date(expires*1000).toISOString(),id},null,2));
} finally {unlinkSync(file);}
