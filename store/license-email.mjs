import { validMailbox } from './environment.mjs';
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const testRecipient='gcrocker61@gmail.com';
export function licenseEmail(order,units,{live=false,origin=live?'https://www.npowersoftware.com':'https://www.npowersoftwarenew.com'}={}){
  if(live && !validMailbox(order.buyer_email))throw Error('Verified buyer email required.');
  const heading=live?'Your licenses are ready':'Your sandbox licenses are ready';
  const thanks=live?'Thank you for purchasing Power Surfacing.':'Thank you for testing the Power Surfacing store. This was a Stripe sandbox purchase; no real money was charged.';
  if(!units.length||units.some(u=>u.status!=='issued'||!u.license_key))throw Error('Only issued licenses can be mailed.');
  const entries=units.map(u=>{
    const q=u.selection;
    return {name:q.productName,type:(q.access==='annual'?'Annual':'Perpetual')+' '+(q.licenseType==='floating'?'floating':'node-locked'),key:u.license_key,
      seats:q.licenseType==='floating'?'One concurrent user. Select floating licensing when activating.':'Activate this key on up to two computers.',
      maintenance:q.access==='annual'?'Maintenance and updates are included with your annual subscription.':q.maintenance?'The first maintenance year is included. Your first maintenance charge is '+new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(q.annualRenewal/q.quantity/100)+' per license on '+new Date(q.firstRenewal*1000).toISOString().slice(0,10)+', then yearly until canceled. Canceling maintenance does not end perpetual access.':'The first maintenance year is included. You did not enroll in automatic maintenance renewal.'};
  });
  const instructions=[live?'Open Power Surfacing.':'Open the sandbox-enabled Power Surfacing build provided for this test.',
    'Open Settings > License and click Edit Power Surfacing Studio License. Choose the matching Edition in the licensing dialog.',
    'Paste the matching license key. For a floating license, check Floating license (requires an online seat).',
    'Choose Activate while connected to the internet. Floating licenses need an ongoing internet connection.',
    ...(live?[]:['For this test, application enforcement remains passive; activation and seat limits are still validated.'])];
  const text=['nPower Software - '+heading,'',
    thanks,
    'Order: '+order.id,'',
    ...entries.flatMap(e=>[e.name+' - '+e.type,e.key,e.seats,e.maintenance,'']),
    'Activation instructions',...instructions.map((s,i)=>(i+1)+'. '+s),'',
    'Keep this message for your records. Each key above represents one purchased license.',
    'Support: '+origin+'/support/'].join('\r\n');
  const html='<!doctype html><html><body style="margin:0;background:#f2f5fa;color:#182a45;font:16px Arial,sans-serif">'+
    '<div style="max-width:660px;margin:24px auto;background:white;border:1px solid #dbe3ef;border-radius:12px;overflow:hidden">'+
    '<div style="background:#193350;color:white;padding:28px"><strong style="font-size:24px">nPower Software</strong><p style="margin-bottom:0">'+escape(heading)+'</p></div>'+
    '<div style="padding:28px"><p>'+escape(thanks)+'</p>'+
    '<p style="font-size:13px;color:#54657d">Order '+escape(order.id)+'</p>'+
    entries.map(e=>'<div style="padding:18px;margin:18px 0;border:1px solid #dbe3ef;border-radius:8px"><h2 style="font-size:19px;margin:0">'+escape(e.name)+'</h2><p>'+escape(e.type)+'</p>'+
      '<p style="font:17px Consolas,monospace;background:#eef4fb;padding:14px;overflow-wrap:anywhere">'+escape(e.key)+'</p><p>'+escape(e.seats)+'</p><p style="font-size:14px">'+escape(e.maintenance)+'</p></div>').join('')+
    '<h2 style="font-size:20px">Activate your license</h2><ol>'+instructions.map(s=>'<li style="margin-bottom:12px">'+escape(s)+'</li>').join('')+'</ol>'+
    '<p>Keep this message for your records. Each key above represents one purchased license.</p><p><a href="'+escape(origin)+'/support/">nPower Software support</a></p>'+
    '</div></div></body></html>';
  return {to:live?order.buyer_email:testRecipient,subject:(live?'':'[Sandbox] ')+'Your Power Surfacing licenses and activation instructions',html,text};
}
