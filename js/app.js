(() => {
'use strict';
const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
const saveKey='mi-lugar-state-v3';
const initial={water:false,feed:false,mate:false,seed:false,visited:0,ambience:false,time:'day'};
let state={...initial};
try{state={...initial,...JSON.parse(localStorage.getItem(saveKey)||'{}')}}catch(e){}
let room='house',audioCtx=null,ambienceTimer=null,mediaMode='cinema',mateStep=0,oscillators=[];
const scene=$('#scene');
function persist(){try{localStorage.setItem(saveKey,JSON.stringify(state))}catch(e){}}
function say(icon,title,text){const tip=$('#sceneTip');if(tip)tip.textContent=icon+' '+title+' · '+text}
function go(where){
 if(!$('#'+where))return;
 room=where;$$('.room').forEach(el=>el.classList.toggle('active',el.id===where));
 $$('[data-go]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.go===where));b.classList.toggle('primary',b.dataset.go===where)});
 say(where==='house'?'⌂':'🌿',where==='house'?'Volviste a casa':'Saliste al patio',where==='house'?'El living, la estufa y la mesa matera te esperan.':'El viento mueve las plantas. Podés regar la huerta o atender a las gallinas.');
 state.visited=(state.visited||0)+1;persist();
}
function openMedia(mode){
 const root=$('#mediaRoom');if(!root)return;
 root.classList.add('open');root.setAttribute('aria-hidden','false');setMediaMode(mode);
 say(mode==='cinema'?'📺':'🎵',mode==='cinema'?'El televisor se encendió':'El equipo de música está listo',mode==='cinema'?'Elegí cine para verlo aquí cuando el video permita inserción.':'Elegí música para llenar la casa.');
}
function closeMedia(){const root=$('#mediaRoom');root.classList.remove('open');root.setAttribute('aria-hidden','true');$('#mediaFrame').src='';$('#mediaPlayer').classList.remove('visible')}
function setMediaMode(mode){
 mediaMode=mode;const cinema=mode==='cinema';
 $('#mediaTitle').textContent=cinema?'El televisor del living':'El equipo de música';
 $('#mediaCopy').textContent=cinema?'Elegí una categoría o un proveedor de cine argentino. Los videos que permiten inserción se reproducen en esta pantalla.':'Elegí un estilo musical o un proveedor. Podés reproducir dentro de la casa enlaces de YouTube que permitan inserción.';
 $('#mediaLabel').textContent=cinema?'Enlace de un video o lista de YouTube':'Enlace de una canción o lista de YouTube';
 $('#mediaUrl').placeholder=cinema?'https://www.youtube.com/watch?v=…':'Enlace de canción o playlist…';
 $('#mediaStatus').textContent=cinema?'El cine se abre aquí cuando el proveedor lo permite.':'La música se escucha aquí cuando el proveedor lo permite.';
 $$('[data-media-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mediaMode===mode));
 $('#mediaChoices').innerHTML=cinema
 ?'<button class="media-choice" data-search="películas argentinas completas canal oficial YouTube">🎞️ Cine argentino en YouTube</button><button class="media-choice" data-search="documentales argentinos canal oficial YouTube">🌄 Documentales argentinos</button><button class="media-choice" data-search="cortometrajes argentinos canal oficial YouTube">🎬 Cortometrajes</button><button class="media-choice provider" id="cinearInside">🇦🇷 CINE.AR Play oficial ↗</button>'
 :'<button class="media-choice" data-search="rock argentino videos oficiales">🎸 Rock argentino</button><button class="media-choice" data-search="folklore argentino música canal oficial">🪕 Folklore argentino</button><button class="media-choice" data-search="música instrumental tranquila campo">🌾 Música tranquila</button><button class="media-choice" data-search="Banda Registrada canal oficial">🎹 Música tropical</button>';
 $('#mediaPlayer').classList.remove('visible');$('#mediaFrame').src='';
}
function parseYoutube(raw){
 try{const u=new URL(raw);if(!['youtube.com','www.youtube.com','m.youtube.com','youtu.be','www.youtu.be','youtube-nocookie.com','www.youtube-nocookie.com'].includes(u.hostname))return null;
 let id='';if(u.hostname.includes('youtu.be'))id=u.pathname.slice(1).split('/')[0];else if(u.pathname==='/watch')id=u.searchParams.get('v')||'';else if(/^\/(embed|shorts)\//.test(u.pathname))id=u.pathname.split('/')[2]||'';
 if(/^[A-Za-z0-9_-]{11}$/.test(id))return {type:'video',id};
 const list=u.searchParams.get('list');if(list&&/^[A-Za-z0-9_-]+$/.test(list))return {type:'list',id:list};
 }catch(e){}return null;
}
function loadVideo(){
 const parsed=parseYoutube($('#mediaUrl').value.trim());if(!parsed){$('#mediaStatus').textContent='No reconocí el enlace. Pegá la dirección completa de un video o una lista de YouTube.';return}
 const src=parsed.type==='video'?'https://www.youtube-nocookie.com/embed/'+parsed.id+'?autoplay=1&rel=0&playsinline=1':'https://www.youtube-nocookie.com/embed/videoseries?list='+parsed.id+'&autoplay=1&rel=0&playsinline=1';
 $('#mediaFrame').src=src;$('#mediaPlayer').classList.add('visible');$('#mediaStatus').textContent='Intentando reproducir dentro de Mi Lugar. Algunos titulares bloquean la inserción; en ese caso elegí otro video o la plataforma oficial.';
}
function fullscreenMedia(){const el=$('#mediaPlayer');if(!el.classList.contains('visible')){$('#mediaStatus').textContent='Primero elegí un video.';return}if(el.requestFullscreen)el.requestFullscreen().catch(()=>{$('#mediaStatus').textContent='Usá el control de pantalla completa del reproductor.'})}
function openMate(){mateStep=0;renderMate();$('#mateRitual').classList.add('open');$('#mateRitual').setAttribute('aria-hidden','false');say('🧉','Vamos a preparar mate','Un paso a la vez, sin apuro.')}
function closeMate(){$('#mateRitual').classList.remove('open');$('#mateRitual').setAttribute('aria-hidden','true')}
function renderMate(){
 const steps=['Calentar el agua','Preparar la yerba','Cebar el primer mate'];
 const instructions=['Poné agua en la pava y acercala a la estufa. En la vida real, calentala sin dejarla sola y evitá que hierva de más.','Llená el mate con yerba, tapá la boca, invertí con cuidado y acomodá la yerba de un lado.','Agregá un poco de agua tibia junto a la yerba y colocá la bombilla. Después cebá con agua caliente, sin inundar toda la yerba.'];
 const buttons=['🔥 Calentar la pava','🌿 Preparar la yerba','🧉 Cebar el primer mate','☕ Disfrutar el mate'];
 $('#mateInstruction').textContent=mateStep<3?instructions[mateStep]:'Listo. El primer mate está preparado. Quedate un rato, cebá otro o cerrá para volver a la casa.';
 steps.forEach((s,i)=>{const el=$('#mateStep'+(i+1));el.classList.toggle('done',i<mateStep);el.classList.toggle('current',i===mateStep&&mateStep<3)});
 $('#mateNext').textContent=buttons[mateStep];$('#mateBack').disabled=mateStep===0;
 $('#mateSteam').style.opacity=mateStep>=1?'1':'.45';
}
function nextMate(){if(mateStep<3)mateStep++;if(mateStep===3){state.mate=true;persist();say('🧉','El mate está listo','Preparaste el mate paso a paso. Podés quedarte un rato o cebar otro.');playTone('mate')}renderMate()}
function previousMate(){if(mateStep>0)mateStep--;renderMate()}
function action(which){
 switch(which){
 case'window':say('🌄','Mirar las bardas','La luz cambia sobre el paisaje. Las ramas se mueven con el viento. No hace falta hacer nada más.');break;
 case'stove':say('🔥','La estufa de leña','Las llamas titilan y el living se siente acogedor.');playTone('fire');break;
 case'mate':openMate();break;
 case'water':state.water=true;persist();say('💧','Regaste la huerta','La tierra quedó húmeda. Las plantas seguirán creciendo durante tu visita.');playTone('water');break;
 case'feed':state.feed=true;persist();say('🐔','Atendiste a las gallinas','Les acercaste agua y alimento. En este mundo es una simulación: no afecta animales reales.');playTone('feed');break;
 case'seed':state.seed=true;persist();say('🌱','Plantaste unas semillas','Preparaste un rincón de tierra para que las plantas crezcan.');break;
 case'books':say('📚','El rincón de lectura','Una biblioteca tranquila pertenece a este mundo. En la siguiente etapa se sumará lectura dentro de la casa.');break;
 case'tv':openMedia('cinema');break;case'music':openMedia('music');break;
 case'quiet':say('🍃','Un rato sin obligaciones','No hay puntajes ni apuro. Escuchá el ambiente y quedate el tiempo que quieras.');break;
 }
}
function setTime(time){
 state.time=time;scene.dataset.time=time;persist();
 const names={dawn:'amanecer',day:'día',sunset:'atardecer',night:'noche'};
 $('#timeBtn').textContent=({dawn:'🌅 Amanecer',day:'☀️ Día',sunset:'🌇 Atardecer',night:'🌙 Noche'})[time];
 say('🌗','Cambió la luz','Ahora es '+names[time]+'. El mundo adapta su ambiente sin salir de la escena.');
}
function cycleTime(){const order=['dawn','day','sunset','night'];setTime(order[(order.indexOf(state.time)+1)%order.length])}
function getAudio(){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;if(!audioCtx)audioCtx=new C();if(audioCtx.state==='suspended')audioCtx.resume();return audioCtx}
function tone(freq,duration,type='sine',volume=.025,delay=0){
 const ctx=getAudio();if(!ctx)return;const o=ctx.createOscillator(),g=ctx.createGain(),now=ctx.currentTime+delay;o.type=type;o.frequency.setValueAtTime(freq,now);g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(volume,now+.03);g.gain.exponentialRampToValueAtTime(.0001,now+duration);o.connect(g);g.connect(ctx.destination);o.start(now);o.stop(now+duration+.02);oscillators.push(o)
}
function playTone(kind){if(kind==='water'){tone(950,.11,'sine',.02);tone(1250,.14,'sine',.016,.13)}else if(kind==='feed'){tone(680,.12,'triangle',.02);tone(820,.14,'triangle',.018,.15)}else if(kind==='mate'){tone(520,.08,'sine',.018);tone(660,.13,'sine',.02,.11)}else if(kind==='fire'){tone(110,.12,'triangle',.012);tone(155,.09,'triangle',.01,.13)}}
function chirp(){const ctx=getAudio();if(!ctx||ctx.state!=='running')return;[0,.16,.38].forEach((d,i)=>{const o=ctx.createOscillator(),g=ctx.createGain(),n=ctx.currentTime+d;o.type='sine';o.frequency.setValueAtTime(1350+i*160,n);o.frequency.exponentialRampToValueAtTime(850+i*100,n+.13);g.gain.setValueAtTime(.0001,n);g.gain.exponentialRampToValueAtTime(.022,n+.025);g.gain.exponentialRampToValueAtTime(.0001,n+.16);o.connect(g);g.connect(ctx.destination);o.start(n);o.stop(n+.18)})}
function toggleAmbience(){
 if(!getAudio()){say('🔈','Sonido no disponible','Este navegador no permite generar sonido.');return}
 state.ambience=!state.ambience;persist();$('#ambienceBtn').setAttribute('aria-pressed',String(state.ambience));
 $('#ambienceBtn').textContent=state.ambience?'🔇 Silenciar campo':'🌾 Escuchar sonidos de campo';
 if(state.ambience){chirp();ambienceTimer=setInterval(()=>{if(state.ambience)chirp()},4800);say('🐦','El campo suena','Sonidos sencillos generados en tu navegador. No son grabaciones reales; los reproductores de música siguen disponibles en el equipo del living.')}
 else{clearInterval(ambienceTimer);say('🤫','Silencio','Los sonidos ambientales están apagados.')}
}
$$('[data-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.go)));
$$('[data-action]').forEach(b=>b.addEventListener('click',()=>action(b.dataset.action)));
$('#closeMedia').addEventListener('click',closeMedia);
$$('[data-media-mode]').forEach(b=>b.addEventListener('click',()=>setMediaMode(b.dataset.mediaMode)));
$('#mediaForm').addEventListener('submit',e=>{e.preventDefault();loadVideo()});
$('#mediaFull').addEventListener('click',fullscreenMedia);
$('#mediaChoices').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.search){window.open('https://www.youtube.com/results?search_query='+encodeURIComponent(b.dataset.search),'_blank','noopener');$('#mediaStatus').textContent='La búsqueda de YouTube se abrió en otra pestaña. Elegí un video que permita inserción y pegá el enlace aquí.'}else if(b.id==='cinearInside'){window.open('https://play.cine.ar/','_blank','noopener');$('#mediaStatus').textContent='CINE.AR Play se abrió en su plataforma oficial, que controla su propia reproducción.'}});
$('#closeMate').addEventListener('click',closeMate);$('#mateNext').addEventListener('click',nextMate);$('#mateBack').addEventListener('click',previousMate);
$('#mateRitual').addEventListener('click',e=>{if(e.target===$('#mateRitual'))closeMate()});
$('#ambienceBtn').addEventListener('click',toggleAmbience);$('#timeBtn').addEventListener('click',cycleTime);
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if($('#mediaRoom').classList.contains('open'))closeMedia();if($('#mateRitual').classList.contains('open'))closeMate()}});
scene.dataset.time=state.time||'day';setTime(state.time||'day');renderMate();
if(state.ambience){state.ambience=false;persist()}
})();
