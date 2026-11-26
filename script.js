document.querySelectorAll('[data-resin]').forEach(link=>link.addEventListener('click',()=>{document.getElementById('resinType').value=link.dataset.resin;}));

const toggle=document.getElementById('menuToggle'),nav=document.getElementById('mainNav');toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'✕ Close':'☰ Menu'});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.textContent='☰ Menu'}));document.getElementById('year').textContent=new Date().getFullYear();document.getElementById('enquiryForm').addEventListener('submit',async function(e){

 e.preventDefault();

 const form=this,button=document.getElementById('enquirySubmit'),status=document.getElementById('enquiryStatus');

 if(!form.reportValidity())return;

 button.disabled=true;button.textContent='Sending…';status.className='form-status';status.textContent='Sending your enquiry…';

 try{

  const payload=new FormData(form);const buyerMessage=payload.get('message')||'';payload.set('message','Frankincense type: '+(payload.get('resinType')||'Not specified')+'\nPreferred grade / requirements: '+(payload.get('grade')||'Not specified')+'\n\nBuyer message: '+buyerMessage);const response=await fetch('/api/enquiry',{method:'POST',body:payload,headers:{'Accept':'application/json'}});

  let result={};try{result=await response.json()}catch(_){}

  if(!response.ok||!result.ok)throw new Error(result.error||'Your enquiry could not be sent. Please try again.');

  status.className='form-status success';status.textContent='Thank you. Your enquiry has been sent to our team.';form.reset();

 }catch(err){status.className='form-status error';status.textContent=(location.protocol==='file:'?'Direct sending works only on the deployed website. Please email info@cornuafricaebotanicals.com.':err.message+' You can also email info@cornuafricaebotanicals.com.');}

 finally{button.disabled=false;button.innerHTML='Send Enquiry '+`<svg class="arrow-icon" aria-hidden="true" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19 19 5M7 5h12v12"/></svg>`;}

});
