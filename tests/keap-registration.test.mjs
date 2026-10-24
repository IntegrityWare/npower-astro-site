import test from 'node:test';
import assert from 'node:assert/strict';
import { submitVerifiedRegistration } from '../src/lib/keapRegistration.js';
import { POWER_SURFACING_DEMO as campaign, STUDIO_DEMO } from '../src/lib/trialDownloads.js';

function fixture(selectedCampaign = campaign) {
  const fields = new Map(Object.entries({
    inf_form_xid: {name:'inf_form_xid',value:selectedCampaign.formXid},
    inf_form_name: {name:'inf_form_name',value:selectedCampaign.formName},
    infusionsoft_version: {name:'infusionsoft_version',value:selectedCampaign.infusionsoftVersion},
    inf_field_Email: {name:'inf_field_Email',value:'test@example.invalid'},
    inf_field_FirstName: {name:'inf_field_FirstName',value:'Test'},
    inf_field_LastName: {name:'inf_field_LastName',value:'Registration'},
    inf_field_Company: {name:'inf_field_Company',value:'Example'},
    [selectedCampaign.followUpOption.name]: {name:selectedCampaign.followUpOption.name,value:selectedCampaign.followUpOption.value,checked:false},
  }));
  const requests=[];
  const form={
    action:selectedCampaign.formAction, method:'POST', valid:true,
    reportValidity(){return this.valid;},
    elements:{namedItem:name=>fields.get(name)},
    appendChild:field=>fields.set(field.name,field),
    ownerDocument:{
      createElement:()=>({}),
      defaultView:{screen:{width:1440,height:900},HTMLFormElement:{prototype:{
        submit(){requests.push({action:this.action,method:this.method,fields:new Map([...fields].map(([k,v])=>[k,{...v}]))});},
      }}},
    },
  };
  return {form,fields,requests};
}

test('valid registration waits for verification, preserves all fields, and posts once to Keap', async()=>{
  const {form,requests}=fixture(); let release; let calls=0;
  const verify=async()=>{calls++;return new Promise(resolve=>{release=resolve;});};
  const first=submitVerifiedRegistration(form,campaign,verify);
  assert.equal(await submitVerifiedRegistration(form,campaign,verify),false);
  assert.equal(calls,1); assert.equal(requests.length,0);
  release('test-only-provider-token');
  assert.equal(await first,true); assert.equal(requests.length,1);
  const sent=requests[0];
  assert.equal(sent.action,'https://rv346.infusionsoft.app/app/form/process/f3ad262b3e851e2b59baccd73e765df0');
  assert.equal(sent.method,'POST');
  assert.equal(sent.fields.get('g-enterprise-recaptcha-response').value,'test-only-provider-token');
  assert.equal(sent.fields.get('inf_field_Email').value,'test@example.invalid');
  assert.equal(sent.fields.get('inf_field_Company').value,'Example');
  assert.equal(sent.fields.get(campaign.followUpOption.name).checked,false);
  assert.equal(sent.fields.get('screenResolution').value,'1440x900');
  assert.ok(sent.fields.get('timeZone').value);
});

test('verification failures retain entered information and never post; retry can succeed',async()=>{
  const {form,fields,requests}=fixture();
  await assert.rejects(submitVerifiedRegistration(form,campaign,async()=>{throw Error('provider unavailable');}));
  assert.equal(requests.length,0);
  assert.equal(fields.get('inf_field_Email').value,'test@example.invalid');
  await submitVerifiedRegistration(form,campaign,async()=>'fresh-test-token');
  assert.equal(requests.length,1);
});

test('empty verification and invalid required fields cannot submit',async()=>{
  const {form,requests}=fixture();
  await assert.rejects(submitVerifiedRegistration(form,campaign,async()=>''));
  form.valid=false;
  assert.equal(await submitVerifiedRegistration(form,campaign,async()=>{throw Error('should not verify');}),false);
  assert.equal(requests.length,0);
});

test('fields cleared during verification do not post incomplete registration',async()=>{
  const {form,requests}=fixture();
  assert.equal(await submitVerifiedRegistration(form,campaign,async()=>{form.valid=false;return 'test-token';}),false);
  assert.equal(requests.length,0);
});

test('Studio registration posts to its separate Keap campaign and preserves its consent choices', async()=>{
  const {form,fields,requests}=fixture(STUDIO_DEMO);
  fields.get(STUDIO_DEMO.followUpOption.name).checked=true;
  fields.set(STUDIO_DEMO.honeypotField,{name:STUDIO_DEMO.honeypotField,value:''});
  assert.equal(await submitVerifiedRegistration(form,STUDIO_DEMO,async()=>'studio-test-token'),true);
  assert.equal(requests.length,1);
  const sent=requests[0];
  assert.equal(sent.action,'https://rv346.infusionsoft.app/app/form/process/a35b97523e0764f1aaf7049061d8abee');
  assert.notEqual(sent.action,campaign.formAction);
  assert.equal(sent.fields.get('inf_form_xid').value,'a35b97523e0764f1aaf7049061d8abee');
  assert.equal(sent.fields.get('inf_form_name').value,'Download Power Surfacing Studio');
  assert.equal(sent.fields.get('infusionsoft_version').value,'1.70.0.1022580');
  assert.equal(sent.fields.get('g-enterprise-recaptcha-response').value,'studio-test-token');
  assert.equal(sent.fields.get(STUDIO_DEMO.followUpOption.name).value,'314');
  assert.equal(sent.fields.get(STUDIO_DEMO.followUpOption.name).checked,true);
  assert.equal(sent.fields.get('inf-sbt').value,'');
});
