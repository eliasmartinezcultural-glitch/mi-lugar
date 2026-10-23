(() => {
'use strict';
const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
const saveKey='mi-lugar-state-v3';
const initial={water:false,feed:false,mate:false,seed:false,visited:0,ambience:false,time:'day'};
let state={...initial};
try{state={...initial,...JSON.parse(localStorage.getItem(saveKey)||'{}')}}catch(e){}
let room='house',audioCtx=null,ambienceTimer=null,mediaMode='cinema',mateStep=0,oscillators=[],musicTimer=null,musicTrack='mate',musicNote=0;
let dayTimer=null;
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
 stopMusic(false);
 mediaMode=mode;const cinema=mode==='cinema';
 $('#mediaTitle').textContent=cinema?'El televisor del living':'El equipo de música';
 $('#mediaCopy').textContent=cinema?'El cine se queda en casa. Elegí una categoría y cargá un enlace que permita reproducción integrada. No se abrirán búsquedas ni pestañas externas.':'Poné música sin salir del living. Podés escuchar las melodías instrumentales de Mi Lugar o cargar un video/lista que permita reproducción integrada.';
 $('#mediaLabel').textContent=cinema?'Enlace de video o lista para reproducir en el televisor':'Enlace de canción o lista para reproducir en el living';
 $('#mediaUrl').placeholder=cinema?'Pegá aquí el enlace del video o lista':'Pegá aquí el enlace musical si querés usar un video';
 $('#mediaStatus').textContent=cinema?'La selección y el reproductor permanecen dentro de esta escena.':'Elegí una melodía propia de Mi Lugar o reproducí una fuente compatible.';
 $('[data-media-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mediaMode===mode));
 $('#mediaChoices').innerHTML=cinema
 ?'<button class="media-choice" data-kind="film">🎞️ Cine argentino</button><button class="media-choice" data-kind="doc">🌄 Documentales</button><button class="media-choice" data-kind="short">🎬 Cortometrajes argentinos</button><button class="media-choice" data-kind="family">🌻 Cine familiar</button><div class="media-section-title">CINE LIBRE · PARA PROBAR EL TELEVISOR</div><button class="media-choice film-card" data-play-id="YE7VzlLtp-4" data-play-title="Big Buck Bunny · corto animado libre">🐇 Big Buck Bunny <small>Corto animado libre · 10 min</small></button><button class="media-choice film-card" data-play-id="eRsGyueVLvQ" data-play-title="Sintel · película animada libre">🐉 Sintel <small>Película animada libre · 15 min</small></button><button class="media-choice film-card" data-play-id="4eJVGqJhp40" data-play-title="Elephants Dream · película animada libre">🐘 Elephants Dream <small>Película animada libre</small></button><button class="media-choice film-card" data-play-id="R6MlUcmOul8" data-play-title="Tears of Steel · cortometraje de ciencia ficción libre">🤖 Tears of Steel <small>Ciencia ficción · corto libre</small></button>'
 :'<button class="media-choice music-track" data-track="mate">🧉 Melodía matera <small>suave, cálida y lenta</small></button><button class="media-choice music-track" data-track="patio">🌾 Viento en el patio <small>melodía de campo</small></button><button class="media-choice music-track" data-track="fogón">🔥 Música junto al fogón <small>notas tranquilas</small></button><button class="media-choice music-track" data-track="noche">🌙 Noche patagónica <small>serena y profunda</small></button><div class="media-section-title">RADIO MUSICAL INTEGRADA</div><button class="media-choice film-card" data-play-id="jfKfPfyJRdk" data-play-title="Radio instrumental en vivo">📻 Radio instrumental en vivo <small>Reproductor integrado · conexión necesaria</small></button><button class="media-choice music-stop" data-stop-music>■ Detener la música local</button>';
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
function startMusic(track){
 const ctx=getAudio();if(!ctx){$('#mediaStatus').textContent='Este navegador no permite reproducir la melodía local.';return}
 stopMusic(false);musicTrack=track;musicNote=0;
 const patterns={
  mate:[196,247,294,247,220,294,330,294],
  patio:[174.61,220,261.63,220,196,261.63,293.66,261.63],
  'fogón':[146.83,196,220,196,164.81,220,246.94,220],
  noche:[130.81,164.81,196,164.81,146.83,196,220,196]
 };
 const names={mate:'Melodía matera',patio:'Viento en el patio','fogón':'Música junto al fogón',noche:'Noche patagónica'};
 const pattern=patterns[track]||patterns.mate;
 const playPhrase=()=>{
  if(!state.musicOn)return;
  const root=pattern[musicNote%pattern.length];
  tone(root,1.15,'sine',.045,0);
  tone(root*1.5,0.72,'triangle',.012,.08);
  if(musicNote%2===0)tone(root/2,.95,'sine',.018,.02);
  musicNote++;
 };
 state.musicOn=true;playPhrase();musicTimer=setInterval(playPhrase,1250);persist();
 $('#mediaStatus').textContent='♫ Sonando dentro de Mi Lugar: '+names[track]+'. Tocá “Detener la música” cuando quieras.';
 $('#ambienceBtn').setAttribute('aria-pressed','false');
 say('♫',names[track],'La melodía suena dentro del living. No se abrió ninguna otra página.');
}
function stopMusic(report=true){
 if(musicTimer){clearInterval(musicTimer);musicTimer=null}
 state.musicOn=false;persist();
 if(report&&$('#mediaStatus'))$('#mediaStatus').textContent='La música está detenida. Podés elegir otra melodía o volver al silencio.';
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
 case'water':state.water=true;persist();scene.classList.add('garden-watered');say('💧','Regaste la huerta','La tierra quedó húmeda. Las plantas se ven más vivas y el patio queda cuidado.');playTone('water');break;
 case'feed':state.feed=true;persist();scene.classList.add('chickens-fed');say('🐔','Atendiste a las gallinas','Las gallinas se acercan al alimento y el patio queda atendido. Es una simulación del mundo.');playTone('feed');break;
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
$('#mediaChoices').addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.track){startMusic(b.dataset.track);return}
 if(b.hasAttribute('data-stop-music')){stopMusic(true);$('#mediaFrame').src='';$('#mediaPlayer').classList.remove('visible');return}
 if(b.dataset.playId){stopMusic(false);const id=b.dataset.playId;$('#mediaFrame').src='https://www.youtube-nocookie.com/embed/'+id+'?rel=0&playsinline=1';$('#mediaPlayer').classList.add('visible');$('#mediaStatus').textContent='La pantalla de Mi Lugar está reproduciendo: '+(b.dataset.playTitle||'contenido seleccionado')+'. Si el titular bloquea la inserción, esta pieza no estará disponible en el reproductor.';return}
 if(b.dataset.kind){
  const descriptions={film:'Película o cine argentino',doc:'Documental y naturaleza',short:'Cortometrajes',family:'Cine familiar'};
  $('#mediaStatus').textContent='Elegiste: '+descriptions[b.dataset.kind]+'. Para mantenerlo dentro de Mi Lugar, pegá el enlace de un video que permita inserción en el campo de abajo. No abriremos YouTube ni otra pestaña.';
  $('#mediaUrl').focus();
 }
});
$('#closeMate').addEventListener('click',closeMate);$('#mateNext').addEventListener('click',nextMate);$('#mateBack').addEventListener('click',previousMate);
$('#mateRitual').addEventListener('click',e=>{if(e.target===$('#mateRitual'))closeMate()});
$('#ambienceBtn').addEventListener('click',toggleAmbience);$('#timeBtn').addEventListener('click',cycleTime);
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if($('#mediaRoom').classList.contains('open'))closeMedia();if($('#mateRitual').classList.contains('open'))closeMate()}});
scene.dataset.time=state.time||'day';setTime(state.time||'day');renderMate();if(state.water)scene.classList.add('garden-watered');if(state.feed)scene.classList.add('chickens-fed');
const dayOrder=['dawn','day','sunset','night'];
dayTimer=setInterval(()=>{if(document.visibilityState==='visible'){const i=dayOrder.indexOf(state.time);setTime(dayOrder[(i+1)%dayOrder.length])}},240000);
if(state.ambience){state.ambience=false;persist()}
})();
