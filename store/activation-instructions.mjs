import { STANDALONE_DOWNLOADS, RENDER_WORKER_DOWNLOAD_URL } from '../src/lib/productDownloads.js';
const productIds={viz:'power-surfacing-visualize',studio:'power-surfacing-studio',studio_re:'power-surfacing-re-studio'};
export function purchaseDownloads(items) {
  const products=[...new Set(items.map(item=>item.product))].map(key=>STANDALONE_DOWNLOADS.find(p=>p.productId===productIds[key])).filter(Boolean);
  return [
    ...products.map(p=>({label:p.status==='available'?p.downloadLabel:p.title+' download information',
      path:p.status==='available'?p.url:'/pricing/downloads/#'+p.anchor})),
    {label:'Download Render Worker for Windows (rendering client)',path:RENDER_WORKER_DOWNLOAD_URL}
  ];
}
export const downloadNote='Install Power Surfacing on the computer you will use for design. You may install the free Render Worker on an unlimited number of Windows rendering machines. It does not require a separate license.';

// Shared customer instructions for the receipt and both license email formats.
export function activationSections({sandbox=false,nodeLocked=false}={}) {
  const sections=[{
    title:'Activate your license online',
    steps:[
      (sandbox?'Open the sandbox-enabled Power Surfacing build.':'Open Power Surfacing.')+' If you do not have a valid trial or other license, the Power Surfacing licensing dialog may open automatically.',
      'If the licensing dialog does not open, go to Settings > License and click Edit Power Surfacing Studio License.',
      'Select Activate Online and paste your license key into License key. Your edition and license type are detected automatically.',
      'Click Activate while connected to the internet. Restart Power Surfacing if prompted to apply your license.'
    ],
    note:'Floating licenses require an ongoing internet connection.'+
      (sandbox?' This test build keeps enforcement passive; activation and seat limits are still validated.':'')
  }];
  if(nodeLocked) sections.push({
    title:'Offline Activation of your license',
    intro:'Use these steps for a node-locked license on a computer without internet access.',
    steps:[
      'On the computer you want to license, open Power Surfacing and its licensing dialog as described above.',
      'Select Offline Activation. Power Surfacing automatically generates and displays this computer\'s Machine code (machine ID). Click Copy machine code.',
      'Paste the complete machine code into a text file. If the computer is offline, transfer that file to a computer with email access, for example using a USB drive.',
      'Email support@npowersoftware.com with the subject Offline activation request. Include your product edition, license key, order number, and the complete machine code. Use the email address you used for the purchase so we can match your request to your order.',
      'We will return a signed license file for that computer by email. Save the file and transfer it to the computer you want to activate.',
      'In Power Surfacing, return to Offline Activation, click Import signed license file..., and select the file we sent. Wait for the successful-activation message and restart Power Surfacing if prompted.'
    ],
    note:'Each computer needs its own machine code and signed license file. Repeat these steps for a second computer within your two-computer license limit. Floating licenses must be activated online.'
  });
  return sections;
}
