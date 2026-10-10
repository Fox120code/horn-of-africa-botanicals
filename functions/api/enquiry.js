// Cloudflare Pages Function: POST /api/enquiry
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}});
const clean=(value,max)=>typeof value==='string'?value.trim().slice(0,max):'';
const emailValid=value=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)&&value.length<=254;
const allowedInterests=new Set(['Raw frankincense resin','Future essential oil production','Industry collaboration','General enquiry']);
export async function onRequestPost({request,env}){
 try{
  const origin=request.headers.get('Origin');
  if(origin&&new URL(origin).origin!==new URL(request.url).origin)return json({ok:false,error:'Invalid request origin.'},403);
  const len=Number(request.headers.get('content-length')||0);
  if(len>16000)return json({ok:false,error:'Message too large.'},413);
  const data=await request.formData();
  if(clean(data.get('website'),200))return json({ok:true}); // Honeypot for automated submissions
  const name=clean(data.get('name'),120),company=clean(data.get('company'),150),email=clean(data.get('email'),254),interest=clean(data.get('interest'),80),destination=clean(data.get('destination'),100),quantity=clean(data.get('quantity'),100),message=clean(data.get('message'),3000);
  if(!name||!emailValid(email)||!message||!allowedInterests.has(interest))return json({ok:false,error:'Please enter your name, a valid email address, an enquiry type and a message.'},400);
  if(!env.RESEND_API_KEY||!env.ENQUIRY_FROM_EMAIL)return json({ok:false,error:'The enquiry service is not configured yet. Please contact us by email.'},503);
  const plain=`New website enquiry — Horn of Africa Botanicals\n\nName: ${name}\nCompany: ${company||'Not provided'}\nEmail: ${email}\nInterest: ${interest}\nDestination country: ${destination||'Not provided'}\nEstimated quantity: ${quantity||'Not provided'}\n\nMessage:\n${message}`;
  const result=await fetch('https://api.resend.com/emails',{method:'POST',headers:{'Authorization':`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({from:env.ENQUIRY_FROM_EMAIL,to:['info@hornofafricabotanicals.com'],reply_to:email,subject:`Website enquiry: ${interest}`,text:plain})});
  if(!result.ok){console.error('Email delivery provider returned status',result.status);return json({ok:false,error:'We could not send your enquiry right now. Please try again or email us directly.'},502);}
  return json({ok:true});
 }catch(error){console.error('Enquiry handler error',String(error));return json({ok:false,error:'Something went wrong. Please try again or email us directly.'},500);}
}
export function onRequestGet(){return json({ok:false,error:'Method not allowed.'},405)}
