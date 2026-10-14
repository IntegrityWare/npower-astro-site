const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const testRecipient='gcrocker61@gmail.com';
export function licenseEmail(order,units){
  if(!units.length||units.some(u=>u.status!=='issued'||!u.license_key))throw Error('Only issued licenses can be mailed.');
  const entries=units.map(u=>{
    const q=u.selection;
    return {name:q.productName,type:(q.access==='annual'?'Annual':'Perpetual')+' '+(q.licenseType==='floating'?'floating':'node-locked'),key:u.license_key,
      seats:q.licenseType==='floating'?'One concurrent user. Select floating licensing when activating.':'Activate this key on up to two computers.',
      maintenance:q.access==='annual'?'Maintenance and updates are included with your annual subscription.':q.maintenance?'The first maintenance year is included. You opted into yearly maintenance afterward; canceling maintenance does not end perpetual access.':'The first maintenance year is included. You did not enroll in automatic maintenance renewal.'};
  });
  const instructions=['Open the sandbox-enabled Power Surfacing build provided for this test.',
    'Open Settings > License and click Edit Power Surfacing Studio License. Choose the matching Edition in the licensing dialog.',
    'Paste the matching license key. For a floating license, check Floating license (requires an online seat).',
    'Choose Activate while connected to the internet. Floating licenses need an ongoing internet connection.',
    'For this test, application enforcement remains passive; activation and seat limits are still validated.'];
  const text=['nPower Software - Your sandbox licenses are ready','',
    'Thank you for testing the Power Surfacing store. This was a Stripe sandbox purchase; no real money was charged.',
    'Order: '+order.id,'',
    ...entries.flatMap(e=>[e.name+' - '+e.type,e.key,e.seats,e.maintenance,'']),
    'Activation instructions',...instructions.map((s,i)=>(i+1)+'. '+s),'',
    'Keep this message for your records. Each key above represents one purchased license.',
    'Support: https://www.npowersoftwarenew.com/support/'].join('\r\n');
  const html='<!doctype html><html><body style="margin:0;background:#f2f5fa;color:#182a45;font:16px Arial,sans-serif">'+
    '<div style="max-width:660px;margin:24px auto;background:white;border:1px solid #dbe3ef;border-radius:12px;overflow:hidden">'+
    '<div style="background:#193350;color:white;padding:28px"><strong style="font-size:24px">nPower Software</strong><p style="margin-bottom:0">Your sandbox licenses are ready</p></div>'+
    '<div style="padding:28px"><p>Thank you for testing the Power Surfacing store. <strong>No real money was charged.</strong></p>'+
    '<p style="font-size:13px;color:#54657d">Order '+escape(order.id)+'</p>'+
    entries.map(e=>'<div style="padding:18px;margin:18px 0;border:1px solid #dbe3ef;border-radius:8px"><h2 style="font-size:19px;margin:0">'+escape(e.name)+'</h2><p>'+escape(e.type)+'</p>'+
      '<p style="font:17px Consolas,monospace;background:#eef4fb;padding:14px;overflow-wrap:anywhere">'+escape(e.key)+'</p><p>'+escape(e.seats)+'</p><p style="font-size:14px">'+escape(e.maintenance)+'</p></div>').join('')+
    '<h2 style="font-size:20px">Activate your license</h2><ol>'+instructions.map(s=>'<li style="margin-bottom:12px">'+escape(s)+'</li>').join('')+'</ol>'+
    '<p>Keep this message for your records. Each key above represents one purchased license.</p><p><a href="https://www.npowersoftwarenew.com/support/">nPower Software support</a></p>'+
    '</div></div></body></html>';
  return {to:testRecipient,subject:'[Sandbox] Your Power Surfacing licenses and activation instructions',html,text};
}
