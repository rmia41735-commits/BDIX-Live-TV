(function () {
  'use strict';
  const mobile = matchMedia('(max-width: 1024px), (hover: none) and (pointer: coarse)');
  const pages = ['Overview','Channels','Website access','Viewer activity','Customers','Vouchers','Devices','Payments','Reports','Audit logs','API & settings'];
  let lastCard = '', activeCard = null, timer, previewActive = false;
  function settings() { return typeof configValues === 'function' ? configValues() : {}; }
  function safeImage(value) {
    try { const u = new URL(String(value || '').trim()); return u.protocol === 'https:' && !u.username && !u.password ? u.href : ''; } catch { return ''; }
  }
  function destination(value) {
    const raw = String(value || '').trim();
    const phone = raw.replace(/^tel:/i, '').replace(/[ ()-]/g, '');
    if (/^\+?[0-9]{5,16}$/.test(phone)) return 'tel:' + phone;
    const link = safeImage(raw);
    if (!link) return '';
    const u = new URL(link);
    return /\.js$/i.test(u.pathname) ? '' : link;
  }
  function closeCard() { clearTimeout(timer); activeCard?.remove(); activeCard = null; previewActive = false; }
  function showCard(card, preview) {
    closeCard();
    const panel = document.createElement('aside');
    panel.className = 'bdix-promotion';
    panel.setAttribute('aria-label', preview ? 'Promotion preview' : 'Promotion');
    panel.setAttribute('role','region');
    const close = document.createElement('button'); close.type='button'; close.className='bdix-promotion-close'; close.textContent='×'; close.setAttribute('aria-label','Close promotion'); close.onclick=closeCard; panel.append(close);
    const image = safeImage(card.image), link = destination(card.link);
    if (image) { const img=document.createElement('img'); img.alt=''; img.referrerPolicy='no-referrer'; img.addEventListener('error',()=>img.remove()); img.src=image; panel.append(img); }
    const body=document.createElement('div'); body.className='bdix-promotion-body';
    const label=document.createElement('small'); label.textContent=preview?'PREVIEW':'SPONSORED'; body.append(label);
    const title=document.createElement('h2'); title.textContent=card.name || 'Promotion'; body.append(title);
    if(link){ const a=document.createElement('a'); a.className='btn green'; a.href=link; a.textContent=link.startsWith('tel:')?'Call now':'Learn more'; if(!link.startsWith('tel:')){a.target='_blank';a.rel='noopener noreferrer';} body.append(a); }
    panel.append(body); panel.addEventListener('keydown',e=>{if(e.key==='Escape')closeCard();});
    document.body.append(panel); activeCard=panel; previewActive=preview;
    if(card.autoClose) timer=setTimeout(closeCard,5000);
  }
  function syncViewer() {
    const card=settings().mobilePromotion;
    if(typeof role==='undefined'||typeof admin==='undefined'||typeof sessionChecking==='undefined')return;
    if(admin || role!=='viewer' || sessionChecking || !mobile.matches || !card?.enabled){
      if(!previewActive && activeCard)closeCard();
      if(!card?.enabled || role!=='viewer')lastCard='';
      return;
    }
    if(document.hidden)return;
    const intro=document.getElementById('bdix-logo-intro');
    if(intro && !intro.hidden && intro.getClientRects().length && getComputedStyle(intro).visibility!=='hidden' && getComputedStyle(intro).opacity!=='0')return;
    const key=JSON.stringify(card); if(key===lastCard)return;
    showCard(card,false); lastCard=key;
  }
  function mountControls(){
    if(typeof admin==='undefined'||!admin||role!=='admin'||page!=='API & settings'||document.getElementById('bdix-promotion-form'))return;
    const form=document.createElement('form'); form.id='bdix-promotion-form'; form.className='panel bdix-promotion-settings';
    const card=settings().mobilePromotion||{};
    form.innerHTML='<h2>Mobile promotion</h2><p class="sub">Publish a promotion for signed-in mobile and tablet viewers.</p><div class="two"><label>Ad name<input name="name" maxlength="80"></label><label>Destination URL or phone<input name="link" maxlength="500" placeholder="https://example.com or +880…"></label><label>Image URL<input name="image" type="url" maxlength="500" placeholder="https://…"></label></div><label class="setting-toggle"><input name="enabled" type="checkbox"> Show on mobile</label><label class="setting-toggle"><input name="autoClose" type="checkbox"> Close after 5 seconds</label><div class="actions"><button type="button" class="btn light" data-preview>Preview card</button><button type="reset" class="btn light">Cancel edits</button><button class="btn green" type="submit">Publish promotion</button></div><p role="status" aria-live="polite"></p>';
    const fields=Object.fromEntries(Array.from(form.querySelectorAll("input[name]")).map(input=>[input.name,input]));
    fields.name.value=fields.name.defaultValue=card.name||''; fields.link.value=fields.link.defaultValue=String(card.link||'').replace(/^tel:/,''); fields.image.value=fields.image.defaultValue=card.image||'';
    fields.enabled.checked=fields.enabled.defaultChecked=!!card.enabled; fields.autoClose.checked=fields.autoClose.defaultChecked=card.autoClose!==false;
    const status=form.querySelector('[role=status]');
    function draft(){const data=new FormData(form),name=String(data.get('name')).trim(),raw=String(data.get('link')).trim(),rawImage=String(data.get('image')).trim(),link=destination(raw),image=safeImage(rawImage);if((data.has('enabled')&&!name)||(raw&&!link)||(rawImage&&!image))throw Error('Enter an ad name, a valid HTTPS landing page (not a script) or phone number, and a direct HTTPS image URL.');return {name,link,image,enabled:data.has('enabled'),autoClose:data.has('autoClose')};}
    form.querySelector('[data-preview]').onclick=()=>{try{showCard(draft(),true);status.textContent='Preview only.';}catch(e){status.textContent=e.message;}};
    form.addEventListener('reset',()=>{closeCard();status.textContent='';});
    form.onsubmit=async e=>{e.preventDefault();const button=form.querySelector('[type=submit]');if(button.disabled)return;button.disabled=true;status.textContent='Publishing…';try{const promotion=draft();const response=await request('settings',{revision:siteConfig.revision,settings:{...siteConfig.settings,mobilePromotion:promotion}});if(!response.settings?.mobilePromotion)throw Error('Settings service did not confirm the promotion.');siteConfig=response;for(const input of form.querySelectorAll('input')){input.defaultValue=input.value;input.defaultChecked=input.checked;}status.textContent='Published. Connected viewers refresh settings within 15 seconds.';if(typeof refreshCustomization==='function')await refreshCustomization();}catch(err){status.textContent=err.message;}finally{button.disabled=false;}};
    document.getElementById('main').prepend(form);
  }
  function update(){
    const main=document.getElementById('main');if(!main||typeof admin==='undefined')return;
    if(admin&&role==='admin'&&!document.getElementById('bdix-admin-pages')){const jump=document.createElement('select');jump.id='bdix-admin-pages';jump.className='bdix-admin-pages';jump.setAttribute('aria-label','Go to admin page');for(const name of pages)jump.add(new Option(name,name,false,name===page));jump.onchange=()=>go(jump.value);main.prepend(jump);}
    mountControls();syncViewer();
  }
  function init(){const main=document.getElementById('main');if(!main)return;new MutationObserver(update).observe(main,{childList:true});document.addEventListener('visibilitychange',()=>{if(!document.hidden){if(typeof refreshCustomization==='function')refreshCustomization();update();}});mobile.addEventListener?.('change',update);setInterval(update,1000);update();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
