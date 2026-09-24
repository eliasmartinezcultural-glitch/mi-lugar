const state={menu:false};
const $=s=>document.querySelector(s);
const safeJson=path=>fetch(path).then(r=>{if(!r.ok)throw new Error(path);return r.json();});
function renderEmpty(container,title,text){container.innerHTML='<article class="empty-card"><strong>'+title+'</strong><span>'+text+'</span></article>'}
async function loadCollection(path,selector,title,text){const c=$(selector);if(!c)return;try{const d=await safeJson(path);if(!d.items?.length)return renderEmpty(c,title,text);c.innerHTML=d.items.map(i=>'<article class="empty-card"><strong>'+i.title+'</strong><span>'+(i.summary||'')+'</span></article>').join('')}catch(e){renderEmpty(c,title,text)}}
const menuButton=$('#menuButton'),nav=$('#mainNav');
menuButton?.addEventListener('click',()=>{state.menu=!state.menu;nav.classList.toggle('open',state.menu);menuButton.setAttribute('aria-expanded',String(state.menu))});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{state.menu=false;nav.classList.remove('open');menuButton?.setAttribute('aria-expanded','false')}));
loadCollection('data/places.json','#placesGrid','Los lugares se están documentando.','La estructura ya está preparada para incorporar el territorio real.');
loadCollection('data/stories.json','#storiesGrid','Las historias se están documentando.','La estructura ya está preparada para incorporar memoria, fuentes y relatos.');
