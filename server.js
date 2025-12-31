const WebSocket = require('ws');
const http = require('http');

// ═══════════════════════════════════════════════════════════════
// HTML INTÉGRÉ (pas besoin de dossier public)
// ═══════════════════════════════════════════════════════════════
const HTML = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<title>🎭 Murder Party</title>
<style>
:root{--gold:#c9a227;--dark:#8b6914;--red:#8b0000;--bg:#0a0a0a;--bg2:#141414;--txt:#e8e8e8;--txt2:#888;--green:#2ecc71;--blue:#3498db;--purple:#9b59b6}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Georgia,serif;background:var(--bg);color:var(--txt);min-height:100vh}
.screen{display:none;min-height:100vh}.screen.active{display:block}
.center{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:20px;text-align:center}
h1{color:var(--gold);font-size:1.8em;margin-bottom:15px}
.header{background:linear-gradient(rgba(139,0,0,0.3),var(--bg));border-bottom:2px solid var(--dark);padding:15px;text-align:center;position:sticky;top:0;z-index:100}
.header h1{margin:0;font-size:1.2em}
.code{font-size:2.2em;color:var(--gold);letter-spacing:.3em;font-family:monospace;margin:10px 0}
.container{max-width:700px;margin:0 auto;padding:20px;padding-bottom:140px}
.card{background:var(--bg2);border:1px solid var(--dark);border-radius:10px;padding:20px;margin:15px 0}
.card h3{color:var(--gold);margin-bottom:15px;padding-bottom:10px;border-bottom:1px solid var(--dark)}
.btn{background:linear-gradient(var(--gold),var(--dark));color:var(--bg);border:none;padding:15px 30px;font-size:1em;font-weight:bold;border-radius:6px;cursor:pointer;width:100%;margin:8px 0}
.btn:disabled{opacity:0.4;cursor:not-allowed}
.btn-secondary{background:linear-gradient(#333,#222);color:var(--txt)}
.btn-small{padding:10px 15px;width:auto;font-size:0.9em}
input,select{width:100%;padding:12px;background:var(--bg);border:2px solid var(--dark);border-radius:6px;color:var(--txt);font-size:1em;margin:8px 0;font-family:inherit}
input:focus,select:focus{border-color:var(--gold);outline:none}
label{display:block;color:var(--gold);margin:15px 0 5px;font-size:0.9em}
.mode-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:15px;margin:20px 0}
.mode-card{background:var(--bg2);border:2px solid var(--dark);border-radius:12px;padding:20px;cursor:pointer;text-align:center}
.mode-card:hover,.mode-card.sel{border-color:var(--gold)}
.mode-card .icon{font-size:2.5em;margin-bottom:10px}
.mode-card h3{color:var(--gold);font-size:1em}
.role-btns{display:flex;gap:20px;flex-wrap:wrap;justify-content:center}
.role-btn{background:var(--bg2);border:2px solid var(--dark);border-radius:12px;padding:40px 30px;cursor:pointer;text-align:center;min-width:180px}
.role-btn:hover{border-color:var(--gold)}
.role-btn .icon{font-size:3.5em;margin-bottom:15px}
.role-btn h2{color:var(--gold);font-size:1.3em}
.slot{background:rgba(201,162,39,0.05);border:2px dashed var(--dark);border-radius:10px;padding:15px;margin:10px 0;display:flex;align-items:center;gap:15px}
.slot.on{border-style:solid;border-color:var(--green);background:rgba(46,204,113,0.1)}
.slot.dead{opacity:0.5;border-color:#c0392b}
.slot .av{width:50px;height:50px;border-radius:50%;background:var(--dark);display:flex;align-items:center;justify-content:center;font-size:1.5em}
.slot .name{color:var(--gold);font-weight:bold}
.warn{background:rgba(139,0,0,0.25);border:2px solid var(--red);border-radius:10px;padding:20px;text-align:center;margin:15px 0}
.warn h3{color:#e74c3c;margin-bottom:10px}
.secret{background:rgba(155,89,182,0.2);border:2px solid var(--purple);border-radius:10px;padding:20px;margin:15px 0;text-align:center}
.secret h4{color:var(--purple);margin-bottom:10px}
.alibi{background:rgba(52,152,219,0.15);border:2px solid var(--blue);border-radius:10px;padding:15px;margin:12px 0}
.alibi h4{color:var(--blue);margin-bottom:10px}
.alibi .truth{background:rgba(231,76,60,0.2);padding:10px;border-radius:6px;margin-top:10px;color:#e74c3c;font-weight:bold}
.timeline{border-left:4px solid var(--red);margin-left:15px;padding-left:20px}
.tl-ev{padding:12px 0;border-bottom:1px solid rgba(139,0,0,0.3)}
.tl-ev .time{color:#e74c3c;font-weight:bold}
.tl-ev .tip{color:var(--txt2);font-size:0.9em;font-style:italic}
.murder-details{background:rgba(139,0,0,0.1);border-radius:8px;padding:15px;white-space:pre-line;line-height:1.8;font-size:0.9em}
.char{text-align:center;padding:30px;border:3px solid var(--gold);border-radius:15px}
.char.killer{border-color:var(--red);background:rgba(139,0,0,0.15)}
.char .icon{font-size:5em}
.char .name{font-size:1.8em;color:var(--gold);margin-top:15px}
.phase{text-align:center;padding:25px;background:linear-gradient(135deg,rgba(139,0,0,0.2),var(--bg));border:2px solid var(--red);border-radius:12px;margin:15px 0}
.phase h2{color:#e74c3c;font-size:1.4em}
.phase .timer{font-size:3em;color:var(--gold);margin:15px 0;font-family:monospace}
.vote-opt{background:rgba(201,162,39,0.08);border:2px solid var(--dark);border-radius:12px;padding:18px;margin:12px 0;cursor:pointer;display:flex;align-items:center;gap:18px}
.vote-opt:hover{border-color:var(--gold)}
.vote-opt.sel{border-color:var(--red);background:rgba(139,0,0,0.25)}
.vote-opt .icon{font-size:2.5em}
.vote-opt .name{color:var(--gold);font-weight:bold;font-size:1.2em}
.nav{position:fixed;bottom:0;left:0;right:0;background:var(--bg);border-top:2px solid var(--dark);display:flex;justify-content:space-around;padding:10px 0;z-index:100}
.nav-btn{background:none;border:none;color:var(--txt2);font-size:0.75em;padding:8px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:4px}
.nav-btn.active{color:var(--gold)}
.nav-btn .ic{font-size:1.3em}
.victory{padding:30px;border-radius:15px;text-align:center;margin:20px 0}
.victory.win{background:rgba(46,204,113,0.25);border:3px solid var(--green)}
.victory.lose{background:rgba(139,0,0,0.25);border:3px solid var(--red)}
.story{font-size:1.4em;line-height:2}
.story.gold{color:var(--gold)}
.story.danger{color:#e74c3c}
.prog{width:200px;height:5px;background:var(--bg2);margin-top:30px;border-radius:3px;overflow:hidden}
.prog-bar{height:100%;background:var(--gold);transition:width 0.3s}
.icons{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin:15px 0}
.ic-opt{width:50px;height:50px;display:flex;align-items:center;justify-content:center;font-size:1.8em;background:var(--bg2);border:2px solid var(--dark);border-radius:8px;cursor:pointer}
.ic-opt.sel{border-color:var(--gold);background:rgba(201,162,39,0.2)}
.room-cfg{display:flex;gap:10px;align-items:center;margin:8px 0}
.room-cfg input{flex:1}
.room-icon{width:45px;height:45px;display:flex;align-items:center;justify-content:center;font-size:1.3em;background:var(--bg);border:2px solid var(--dark);border-radius:6px;cursor:pointer}
.map-box{background:var(--bg);border:2px solid var(--dark);border-radius:10px;padding:15px;min-height:250px;position:relative}
.map-room{position:absolute;background:var(--bg2);border:2px solid var(--gold);border-radius:8px;padding:8px;text-align:center;min-width:70px}
.map-room .ri{font-size:1.3em}
.map-room .rn{font-size:0.7em;margin-top:3px}
.messages{max-height:250px;overflow-y:auto;background:var(--bg);border-radius:6px;padding:10px}
.msg{padding:10px;margin:8px 0;border-radius:8px;background:var(--bg2)}
.msg.mj{background:rgba(201,162,39,0.15);border-left:3px solid var(--gold)}
.msg .from{color:var(--gold);font-weight:bold;font-size:0.9em}
.msg .time{color:var(--txt2);font-size:0.8em;margin-left:10px}
.msg .txt{margin-top:5px}
.msg-in{display:flex;gap:10px;margin-top:15px}
.msg-in input{flex:1}
.kill-btn{background:linear-gradient(#c0392b,#8b0000);color:#fff;padding:15px;font-size:1.1em;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.7}}
.dead-ov{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.95);display:none;flex-direction:column;align-items:center;justify-content:center;z-index:1000}
.reveal{padding:12px;border-bottom:1px solid var(--dark)}
.killer-tag{color:#e74c3c;font-weight:bold}
.dead-tag{color:#888}
.conn{position:fixed;top:10px;right:10px;padding:8px 15px;border-radius:20px;font-size:0.8em;z-index:1000}
.conn.on{background:rgba(46,204,113,0.2);color:var(--green)}
.conn.off{background:rgba(231,76,60,0.2);color:#e74c3c}
.tabs{display:flex;border-bottom:2px solid var(--dark);margin-bottom:15px}
.tab{flex:1;padding:12px;text-align:center;cursor:pointer;color:var(--txt2);border-bottom:2px solid transparent;margin-bottom:-2px}
.tab.active{color:var(--gold);border-color:var(--gold)}
@media(max-width:500px){.role-btns{flex-direction:column}.role-btn{min-width:100%}}
</style>
</head>
<body>
<div class="conn off" id="conn">⚡</div>
<div class="dead-ov" id="deadOv"><h1 style="color:#c0392b;font-size:3em">💀 MORT(E)</h1><p style="color:var(--txt2);margin-top:20px">Le tueur vous a éliminé...</p><p style="color:var(--gold);margin-top:30px">Vous pouvez voter !</p></div>

<div class="screen active" id="s0">
<div class="center">
<h1>🎭 MURDER PARTY</h1>
<p style="color:var(--txt2);margin-bottom:40px">Jeu d'enquête et de déduction</p>
<div class="role-btns">
<div class="role-btn" onclick="pick('host')"><div class="icon">🖥️</div><h2>PC CENTRAL</h2><p style="color:var(--txt2);margin-top:10px">Créer</p></div>
<div class="role-btn" onclick="pick('player')"><div class="icon">📱</div><h2>JOUEUR</h2><p style="color:var(--txt2);margin-top:10px">Rejoindre</p></div>
</div>
</div>
</div>

<div class="screen" id="h0">
<div class="header"><h1>🎭 Mode de jeu</h1></div>
<div class="container">
<div class="mode-cards">
<div class="mode-card" onclick="selMode('scenario')" data-m="scenario"><div class="icon">🎭</div><h3>SCÉNARIO</h3></div>
<div class="mode-card" onclick="selMode('cluedo')" data-m="cluedo"><div class="icon">🔍</div><h3>CLUEDO</h3></div>
<div class="mode-card" onclick="selMode('survie')" data-m="survie"><div class="icon">☠️</div><h3>SURVIE</h3></div>
</div>
<button class="btn" onclick="goConfig()" id="btnM" disabled>Continuer →</button>
</div>
</div>

<div class="screen" id="h1">
<div class="header"><h1>⚙️ Configuration</h1></div>
<div class="container">
<div class="card"><h3>👥 Joueurs</h3><input type="number" id="numP" value="5" min="3" max="10"></div>
<div class="card"><h3>🏠 Pièces (<span id="rc">0</span>)</h3>
<div style="display:flex;gap:10px;margin-bottom:15px"><input type="number" id="numR" value="6" min="3" max="12" style="width:80px"><button class="btn btn-secondary btn-small" onclick="genRooms()">Générer</button></div>
<div id="roomsL"></div></div>
<div class="card"><h3>🗺️ Aperçu</h3><div class="map-box" id="mapPrev"></div></div>
<button class="btn" onclick="createGame()">🎭 Créer</button>
</div>
</div>

<div class="screen" id="h2">
<div class="header"><h1 id="lobbyT">🎭 En attente</h1><div class="code" id="code">XXXXX</div></div>
<div class="container">
<div class="card"><h3>📱 Lien</h3><p style="color:var(--gold);word-break:break-all;padding:15px;background:var(--bg);border-radius:6px" id="url">-</p><button class="btn btn-secondary" onclick="copyUrl()">📋 Copier</button></div>
<div class="card"><h3>👥 Joueurs (<span id="cnt">0</span>/<span id="tot">5</span>)</h3><div id="slots"></div></div>
<button class="btn" onclick="startGame()" id="btnS" disabled>🎬 Lancer</button>
</div>
</div>

<div class="screen" id="h3"><div class="center"><h1>🎭</h1><div class="story" id="hSt"></div><div class="prog"><div class="prog-bar" id="hPr"></div></div></div></div>

<div class="screen" id="h4">
<div class="header"><h1 id="hPhT">Phase 1</h1></div>
<div class="container">
<div class="phase"><h2 id="hPhN">Enquête</h2><div class="timer" id="hTi">08:00</div><p style="color:var(--txt2)" id="hObj"></p></div>
<div class="tabs"><div class="tab active" onclick="hTab('players')" data-ht="players">👥 Joueurs</div><div class="tab" onclick="hTab('msg')" data-ht="msg">💬 Messages</div></div>
<div id="hTabC"></div>
<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:20px"><button class="btn btn-secondary" onclick="nextPh()">Phase suivante →</button><button class="btn" onclick="startVote()">🗳️ Vote</button></div>
</div>
</div>

<div class="screen" id="h5">
<div class="header"><h1 id="hEndT">🎬 Fin</h1></div>
<div class="container"><div id="hEndR"></div><div class="card"><h3>📜 Révélations</h3><div id="hRev"></div></div><div class="card"><h3>🔪 Méthode</h3><div id="hMeth"></div></div><button class="btn" onclick="location.reload()">🔄 Rejouer</button></div>
</div>

<div class="screen" id="p0">
<div class="center">
<h1>📱 Rejoindre</h1>
<div class="card" style="width:100%;max-width:400px">
<label>Code</label><input type="text" id="inCode" placeholder="XXXXX" maxlength="5" style="text-transform:uppercase;text-align:center;font-size:1.8em;letter-spacing:0.3em">
<label>Prénom</label><input type="text" id="inName" placeholder="Prénom">
<label>Icône</label><div class="icons" id="icons"></div>
<button class="btn" onclick="joinGame()">Rejoindre</button>
</div>
</div>
</div>

<div class="screen" id="p1">
<div class="header"><h1>⏳ En attente</h1></div>
<div class="container"><div class="card" style="text-align:center"><div style="font-size:5em">🎭</div><p style="font-size:1.3em;margin-top:15px">Bienvenue <strong id="pName" style="color:var(--gold)"></strong></p></div><div class="card"><h3>👥 Joueurs</h3><div id="pList"></div></div></div>
</div>

<div class="screen" id="p2"><div class="center"><h1>🎭</h1><div class="story" id="pSt"></div><div class="prog"><div class="prog-bar" id="pPr"></div></div></div></div>

<div class="screen" id="p3"><div class="header"><h1>🎭 Votre rôle</h1></div><div class="container" id="pRole"></div></div>

<div class="screen" id="p4">
<div class="header"><h1 id="pPhT">Phase 1</h1><p style="color:var(--txt2);font-size:0.9em" id="pPhS"></p></div>
<div class="container" id="pCnt"></div>
<nav class="nav">
<button class="nav-btn active" onclick="pTab('mission')" data-t="mission"><span class="ic">🎯</span>Mission</button>
<button class="nav-btn" onclick="pTab('alibis')" data-t="alibis"><span class="ic">📋</span>Alibis</button>
<button class="nav-btn" onclick="pTab('msg')" data-t="msg"><span class="ic">💬</span>Chat</button>
<button class="nav-btn" onclick="pTab('vote')" data-t="vote"><span class="ic">🗳️</span>Vote</button>
</nav>
</div>

<div class="screen" id="p5"><div class="header"><h1 id="pEndT">🎬 Fin</h1></div><div class="container"><div id="pEndR"></div><button class="btn" onclick="location.reload()">🔄 Rejouer</button></div></div>

<script>
let ws,role,myId,myName,myIcon='👤',gameMode=null,gameRooms=[],gameConns=[],myData=null,players=[],allPlayers=[];
let curTab='mission',hCurTab='players',voted=false,selVote=null,scenario=null,messages=[],canKill=false,isDead=false;
const ICONS=['👤','🧥','🕵️','💼','🎤','💔','📰','💰','⚕️','👑','🎭','🎩'];
const ROOM_ICONS=['🚪','🛋️','📚','🍽️','👨‍🍳','🌿','🍸','🛏️'];
const DEF_ROOMS=[{id:'hall',name:'Hall',icon:'🚪'},{id:'salon',name:'Salon',icon:'🛋️'},{id:'bar',name:'Bar',icon:'🍸'},{id:'restaurant',name:'Restaurant',icon:'🍽️'},{id:'cuisine',name:'Cuisine',icon:'👨‍🍳'},{id:'biblio',name:'Bibliothèque',icon:'📚'},{id:'fumoir',name:'Fumoir',icon:'🎭'},{id:'jardin',name:'Jardin',icon:'🌿'}];

function show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));document.getElementById(id)?.classList.add('active');}
function fmt(s){return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');}
function copyUrl(){navigator.clipboard?.writeText(location.href);alert('Copié !');}

function connect(){
const p=location.protocol==='https:'?'wss:':'ws:';
ws=new WebSocket(p+'//'+location.host);
ws.onopen=()=>{document.getElementById('conn').className='conn on';document.getElementById('conn').textContent='✓';};
ws.onclose=()=>{document.getElementById('conn').className='conn off';document.getElementById('conn').textContent='⚡';setTimeout(connect,2000);};
ws.onmessage=e=>handle(JSON.parse(e.data));
}
function send(type,data={}){if(ws?.readyState===1)ws.send(JSON.stringify({type,...data}));}

function handle(m){
console.log(m.type,m);
if(m.type==='created'){document.getElementById('code').textContent=m.code;document.getElementById('url').textContent=location.href;document.getElementById('tot').textContent=m.numPlayers;document.getElementById('lobbyT').textContent=m.mode==='scenario'?'🎭 Scénario':m.mode==='cluedo'?'🔍 Cluedo':'☠️ Survie';gameRooms=m.rooms||[];updSlots([],m.numPlayers);show('h2');}
if(m.type==='joined'){myId=m.id;gameMode=m.mode;document.getElementById('pName').textContent=myName;show('p1');}
if(m.type==='error'){alert(m.msg);return;}
if(m.type==='player_joined'){players=m.players;document.getElementById('cnt').textContent=m.count;updSlots(m.players,m.total);document.getElementById('btnS').disabled=m.count<2;document.getElementById('pList').innerHTML=m.players.map(p=>'<div class="slot on"><div class="av">'+p.icon+'</div><div class="name">'+p.name+'</div></div>').join('');}
if(m.type==='story_start')show(role==='host'?'h3':'p2');
if(m.type==='story'){const el=document.getElementById(role==='host'?'hSt':'pSt');el.textContent=m.text;el.className='story'+(m.hl?' '+m.hl:'');document.getElementById(role==='host'?'hPr':'pPr').style.width=((m.i+1)/m.total*100)+'%';}
if(m.type==='role'){myData=m;scenario=m.scenario;gameRooms=m.rooms||[];showRole();}
if(m.type==='roles_distributed'){allPlayers=m.players;scenario=m.scenario;gameRooms=m.rooms||[];updHTab();}
if(m.type==='phase'){canKill=m.canKill&&myData?.isKiller;if(role==='host'){show('h4');document.getElementById('hPhT').textContent='Phase '+m.phase;document.getElementById('hPhN').textContent=m.name;document.getElementById('hTi').textContent=fmt(m.duration);document.getElementById('hObj').textContent=m.obj;}else{show('p4');document.getElementById('pPhT').textContent='Phase '+m.phase;document.getElementById('pPhS').textContent=m.obj;updPTab();}}
if(m.type==='timer')document.getElementById('hTi').textContent=fmt(m.t);
if(m.type==='voting'){players=m.players;if(role==='host'){document.getElementById('hPhT').textContent='🗳️ VOTE';document.getElementById('hPhN').textContent='Qui est le meurtrier ?';document.getElementById('hTi').textContent='--:--';}else{curTab='vote';document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));document.querySelector('[data-t="vote"]')?.classList.add('active');updPTab();}}
if(m.type==='message'){messages.push(m.message);if(role==='host')updHTab();else updPTab();}
if(m.type==='can_kill'){canKill=m.enabled;updPTab();}
if(m.type==='player_killed'){allPlayers=allPlayers.map(p=>p.id===m.victimId?{...p,isDead:true}:p);updHTab();}
if(m.type==='you_died'){isDead=true;document.getElementById('deadOv').style.display='flex';setTimeout(()=>document.getElementById('deadOv').style.display='none',5000);}
if(m.type==='end')showEnd(m);
}

function pick(r){role=r;if(r==='host')show('h0');else{initIcons();show('p0');}}
function initIcons(){document.getElementById('icons').innerHTML=ICONS.map((ic,i)=>'<div class="ic-opt'+(i===0?' sel':'')+'" onclick="selIcon(this,\\''+ic+'\\')">'+ic+'</div>').join('');}
function selIcon(el,ic){document.querySelectorAll('#icons .ic-opt').forEach(x=>x.classList.remove('sel'));el.classList.add('sel');myIcon=ic;}

function selMode(mode){gameMode=mode;document.querySelectorAll('.mode-card').forEach(c=>c.classList.remove('sel'));document.querySelector('[data-m="'+mode+'"]')?.classList.add('sel');document.getElementById('btnM').disabled=false;}
function goConfig(){if(!gameMode)return;genRooms();show('h1');}

function genRooms(){
const num=parseInt(document.getElementById('numR').value)||6;
gameRooms=[];
for(let i=0;i<num;i++){const d=DEF_ROOMS[i]||{id:'r'+i,name:'Pièce '+(i+1),icon:'🚪'};gameRooms.push({id:d.id,name:d.name,icon:d.icon,x:30+(i%3)*110,y:20+Math.floor(i/3)*80});}
gameConns=[];
for(let i=0;i<gameRooms.length;i++){if(i+1<gameRooms.length)gameConns.push([gameRooms[i].id,gameRooms[i+1].id]);if(i+3<gameRooms.length)gameConns.push([gameRooms[i].id,gameRooms[i+3].id]);}
renderRooms();renderMap();
}
function renderRooms(){document.getElementById('rc').textContent=gameRooms.length;document.getElementById('roomsL').innerHTML=gameRooms.map((r,i)=>'<div class="room-cfg"><input type="text" value="'+r.name+'" onchange="updRoom('+i+',this.value)"><div class="room-icon" onclick="cycleIcon('+i+')">'+r.icon+'</div></div>').join('');}
function updRoom(i,n){gameRooms[i].name=n;renderMap();}
function cycleIcon(i){const idx=ROOM_ICONS.indexOf(gameRooms[i].icon);gameRooms[i].icon=ROOM_ICONS[(idx+1)%ROOM_ICONS.length];renderRooms();renderMap();}
function renderMap(){
let h='<svg style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none" viewBox="0 0 360 260"><defs><marker id="arr" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#8b6914"/></marker></defs>';
gameConns.forEach(([a,b])=>{const rA=gameRooms.find(r=>r.id===a),rB=gameRooms.find(r=>r.id===b);if(rA&&rB)h+='<line x1="'+(rA.x+35)+'" y1="'+(rA.y+25)+'" x2="'+(rB.x+35)+'" y2="'+(rB.y+25)+'" stroke="#8b6914" stroke-width="2" stroke-dasharray="5,5" marker-end="url(#arr)"/>';});
h+='</svg>';
gameRooms.forEach(r=>{h+='<div class="map-room" style="left:'+r.x+'px;top:'+r.y+'px"><div class="ri">'+r.icon+'</div><div class="rn">'+r.name+'</div></div>';});
document.getElementById('mapPrev').innerHTML=h;
}

function createGame(){send('create',{mode:gameMode,numPlayers:parseInt(document.getElementById('numP').value)||5,rooms:gameRooms,connections:gameConns});}
function updSlots(list,total){let h='';for(let i=0;i<total;i++){const p=list[i];h+=p?'<div class="slot on"><div class="av">'+p.icon+'</div><div class="name">'+p.name+'</div></div>':'<div class="slot"><div class="av" style="opacity:0.3">?</div><div class="name" style="color:var(--txt2)">En attente...</div></div>';}document.getElementById('slots').innerHTML=h;}
function startGame(){send('start');}
function nextPh(){send('next_phase');}
function startVote(){send('start_vote');}

function hTab(t){hCurTab=t;document.querySelectorAll('[data-ht]').forEach(x=>x.classList.remove('active'));document.querySelector('[data-ht="'+t+'"]')?.classList.add('active');updHTab();}
function updHTab(){
let h='';
if(hCurTab==='players'){h=allPlayers.map(p=>'<div class="slot '+(p.isDead?'dead':'on')+'"><div class="av">'+p.icon+'</div><div><div class="name">'+p.name+(p.isKiller?' <span style="color:#e74c3c">🔪</span>':'')+(p.isDead?' <span class="dead-tag">💀</span>':'')+'</div><div style="font-size:0.8em;color:var(--txt2)">'+(p.secret?.text||'')+'</div></div></div>').join('');}
else if(hCurTab==='msg'){h='<div class="messages">'+messages.map(m=>'<div class="msg '+(m.from==='MJ'?'mj':'')+'"><span class="from">'+(m.fromIcon||'🎭')+' '+m.from+'</span><span class="time">'+m.time+'</span><div class="txt">'+m.text+'</div></div>').join('')+'</div><div class="msg-in"><select id="msgTo" style="width:130px"><option value="all">📢 Tous</option>'+allPlayers.map(p=>'<option value="'+p.id+'">🔒 '+p.name+'</option>').join('')+'</select><input type="text" id="msgTxt" placeholder="Message MJ..."><button class="btn btn-small" onclick="sendHMsg()">→</button></div>';}
document.getElementById('hTabC').innerHTML=h;
}
function sendHMsg(){const to=document.getElementById('msgTo').value,txt=document.getElementById('msgTxt').value.trim();if(!txt)return;send('send_message',{to,text:txt});document.getElementById('msgTxt').value='';}

function joinGame(){const code=document.getElementById('inCode').value.toUpperCase().trim();myName=document.getElementById('inName').value.trim();if(!code||code.length<4){alert('Code !');return;}if(!myName){alert('Prénom !');return;}send('join',{code,name:myName,icon:myIcon});}

function showRole(){
show('p3');
let h='<div class="char '+(myData.isKiller?'killer':'')+'"><div class="icon">'+myData.icon+'</div><div class="name">'+myData.name+'</div></div>';
if(myData.isKiller&&scenario){
h+='<div class="warn"><h3>☠️ VOUS ÊTES LE MEURTRIER !</h3><p style="font-size:1.2em;margin:15px 0"><strong>'+scenario.name+'</strong></p><p>'+scenario.summary+'</p></div>';
h+='<div class="card"><h3>📖 DÉROULÉ COMPLET</h3><div class="murder-details">'+scenario.details+'</div></div>';
h+='<div class="card"><h3>⏱️ Timeline</h3><div class="timeline">'+scenario.events.map(e=>'<div class="tl-ev"><div class="time">'+e.time+'</div><div>'+e.action+'</div><div class="tip">💡 '+e.tip+'</div></div>').join('')+'</div></div>';
h+='<div class="card"><h3>🎭 Conseils</h3><ul style="margin-left:20px">'+scenario.tips.map(t=>'<li style="margin:10px 0">'+t+'</li>').join('')+'</ul></div>';
}
if(myData.secret)h+='<div class="secret"><h4>🤫 SECRET</h4><p>'+myData.secret.text+'</p>'+(myData.secret.hasMotive?'<p style="color:#e74c3c;margin-top:10px;font-weight:bold">⚠️ MOBILE !</p>':'')+'</div>';
h+='<div class="card"><h3>📋 Alibis</h3>';
['phase1','phase2','phase3'].forEach((p,i)=>{const a=myData.alibis?.[p];if(a)h+='<div class="alibi"><h4>Phase '+(i+1)+'</h4><div>📍 '+a.location+'</div><div>🎬 '+a.action+'</div><div>👁️ '+a.witnesses+'</div>'+(myData.isKiller&&a.truth?'<div class="truth">⚠️ '+a.truth+'</div>':'')+'</div>';});
h+='</div><button class="btn" onclick="confirmRole()">✓ Compris</button>';
document.getElementById('pRole').innerHTML=h;
}
function confirmRole(){show('p4');updPTab();}

function pTab(t){curTab=t;document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));document.querySelector('[data-t="'+t+'"]')?.classList.add('active');updPTab();}
function updPTab(){
let h='';
if(curTab==='mission'){
h='<div class="card" style="text-align:center"><h3>🎯 Mission</h3><p style="font-size:1.2em;margin:15px 0">'+(myData?.isKiller?'Survivez !':'Trouvez le tueur !')+'</p></div>';
if(isDead)h+='<div class="warn"><h3>💀 Mort(e)</h3><p>Vous pouvez voter !</p></div>';
if(myData?.isKiller){h+='<div class="warn"><h3>⚠️ Tueur</h3><p>Mentez, accusez !</p></div>';if(canKill){h+='<div class="card"><h3>🔪 TUEZ !</h3>';players.filter(p=>p.id!==myId).forEach(p=>{h+='<button class="kill-btn" onclick="killP(\\''+p.id+'\\')" style="margin:5px 0">💀 '+p.name+'</button>';});h+='</div>';}}
}else if(curTab==='alibis'){
h='<div class="card"><h3>📋 Alibis</h3>';
if(myData?.alibis){['phase1','phase2','phase3'].forEach((p,i)=>{const a=myData.alibis[p];if(a)h+='<div class="alibi"><h4>Phase '+(i+1)+'</h4><div>📍 '+a.location+'</div><div>🎬 '+a.action+'</div><div>👁️ '+a.witnesses+'</div>'+(myData.isKiller&&a.truth?'<div class="truth">⚠️ '+a.truth+'</div>':'')+'</div>';});}
h+='</div>';
if(myData?.isKiller&&scenario)h+='<div class="card"><h3>📖 Rappel</h3><div class="murder-details" style="max-height:200px;overflow-y:auto;font-size:0.85em">'+scenario.details+'</div></div>';
}else if(curTab==='msg'){
h='<div class="card"><h3>💬 Messages</h3><div class="messages" style="max-height:200px">'+messages.map(m=>'<div class="msg '+(m.from==='MJ'?'mj':'')+'"><span class="from">'+(m.fromIcon||'👤')+' '+m.from+'</span><span class="time">'+m.time+'</span><div class="txt">'+m.text+'</div></div>').join('')+'</div><div class="msg-in"><select id="pMsgTo" style="width:90px"><option value="all">📢</option>'+players.filter(p=>p.id!==myId).map(p=>'<option value="'+p.id+'">'+p.name+'</option>').join('')+'</select><input type="text" id="pMsgTxt" placeholder="Message..."><button class="btn btn-small" onclick="sendPMsg()">→</button></div></div>';
}else if(curTab==='vote'){
if(voted)h='<div class="card" style="text-align:center"><div style="font-size:4em">✅</div><h3>Voté !</h3></div>';
else{h='<div class="card"><h3>🗳️ Qui ?</h3>';players.filter(p=>p.id!==myId).forEach(p=>{h+='<div class="vote-opt '+(selVote===p.id?'sel':'')+'" onclick="selV(\\''+p.id+'\\')"><div class="icon">'+p.icon+'</div><div class="name">'+p.name+'</div></div>';});h+='<button class="btn" onclick="confirmVote()" style="margin-top:20px"'+(selVote?'':' disabled')+'>Confirmer</button></div>';}
}
document.getElementById('pCnt').innerHTML=h;
}
function sendPMsg(){const to=document.getElementById('pMsgTo').value,txt=document.getElementById('pMsgTxt').value.trim();if(!txt)return;send('send_message',{to,text:txt});document.getElementById('pMsgTxt').value='';}
function killP(id){if(confirm('Tuer ?'))send('kill_player',{victimId:id});}
function selV(id){selVote=id;updPTab();}
function confirmVote(){if(!selVote)return;send('vote',{target:selVote});voted=true;updPTab();}

function showEnd(m){
const win=m.win==='investigators';
if(role==='host'){show('h5');document.getElementById('hEndT').textContent=win?'🎉 Victoire !':'💀 Tueur gagne !';
document.getElementById('hEndR').innerHTML='<div class="victory '+(win?'win':'lose')+'"><h2>'+(win?'Démasqué !':'Échappé...')+'</h2><p style="font-size:1.3em;margin:15px 0">Coupable: <strong style="color:var(--gold)">'+m.killerName+'</strong></p></div>';
document.getElementById('hRev').innerHTML=m.reveals.map(r=>'<div class="reveal"><strong>'+r.icon+' '+r.name+'</strong>'+(r.isKiller?' <span class="killer-tag">(TUEUR)</span>':'')+(r.isDead?' <span class="dead-tag">💀</span>':'')+'<br><span style="color:var(--txt2)">'+(r.secret||'')+'</span></div>').join('');
document.getElementById('hMeth').innerHTML=m.scenario?'<p><strong>'+m.scenario.name+'</strong></p><p style="margin-top:10px">'+m.scenario.summary+'</p>':'';
}else{show('p5');const iWin=myData?.isKiller?!win:win;
document.getElementById('pEndT').textContent=iWin?'🎉 Victoire !':'💀 Défaite...';
document.getElementById('pEndR').innerHTML='<div class="victory '+(iWin?'win':'lose')+'"><h2>'+(myData?.isKiller?(win?'Démasqué !':'Échappé !'):(win?'Trouvé !':'Échappé...'))+'</h2><p style="margin-top:15px">Meurtrier: <strong style="color:var(--gold)">'+m.killerName+'</strong></p></div><div class="card"><h3>🔪 Méthode</h3><p><strong>'+(m.scenario?.name||'')+'</strong></p><p style="margin-top:10px">'+(m.scenario?.summary||'')+'</p></div>';
}
}

connect();
<\/script>
</body>
</html>`;

// ═══════════════════════════════════════════════════════════════
// SERVEUR HTTP
// ═══════════════════════════════════════════════════════════════
const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(HTML);
});

const wss = new WebSocket.Server({ server });

// ═══════════════════════════════════════════════════════════════
// SCÉNARIOS
// ═══════════════════════════════════════════════════════════════
const SCENARIOS = [
    {
        name: 'Le Poison au Bar',
        summary: 'Vous avez versé du poison dans son verre pendant que le barman était distrait.',
        weapon: 'Arsenic',
        details: `CHRONOLOGIE EXACTE DU MEURTRE :

🕘 21h30 - Préparation
Vous êtes monté chercher la fiole d'arsenic dans votre trousse de toilette.

🕘 21h45 - Descente au bar
Vous avez commandé un whisky et observé Delcourt.

🕙 22h15 - La diversion
Vous avez renversé votre verre. Le barman nettoie...

🕙 22h17 - L'ACTE
Vous avez versé le poison dans son verre. Geste rapide.

🕙 22h25 - L'attente
Delcourt a bu. Il a grimacé légèrement.

🕙 22h30 - Départ victime
Il monte dans sa suite. Le poison agit lentement.

🕙 22h35 - Alibi
Vous allez au salon, vous faites voir.

🕚 23h05 - Le cri
Le corps est découvert.`,
        events: [
            {time: '21h30', action: 'Récupéré le poison', tip: 'Fiole dans votre chambre'},
            {time: '21h45', action: 'Au bar', tip: 'Barman témoin'},
            {time: '22h15', action: 'DIVERSION verre renversé', tip: 'Barman nettoie'},
            {time: '22h17', action: '💀 VERSÉ LE POISON', tip: 'Personne n\'a vu'},
            {time: '22h30', action: 'Delcourt monte', tip: 'Poison lent'},
            {time: '22h35', action: 'Au salon', tip: 'Créez alibi !'},
            {time: '23h05', action: 'Le cri', tip: 'Surprise !'}
        ],
        alibis: {
            phase1: {location: 'Bar', action: 'Je buvais un whisky', witnesses: 'Le barman', truth: 'Vous versiez le poison !'},
            phase2: {location: 'Salon', action: 'Je discutais', witnesses: 'Plusieurs personnes', truth: 'Vous attendiez que ça agisse'},
            phase3: {location: 'Salon', action: 'J\'ai entendu le cri', witnesses: 'Tout le monde', truth: 'Vous saviez ce qui arrivait'}
        },
        tips: ['Ne niez JAMAIS être allé au bar', 'Accusez quelqu\'un d\'autre au bar', 'La fiole est dans votre chambre - DANGER']
    },
    {
        name: 'Le Dessert Empoisonné',
        summary: 'Vous avez empoisonné son fondant au chocolat en cuisine.',
        weapon: 'Cyanure',
        details: `CHRONOLOGIE EXACTE DU MEURTRE :

🕘 21h00 - Repérage
Vous observez les allées et venues en cuisine.

🕘 21h30 - Préparation
Récupéré le cyanure dans votre chambre.

🕙 22h00 - Infiltration
Prétexte: chercher du sel. Le chef était sorti.

🕙 22h05 - L'ACTE
Versé le poison sur le fondant de Delcourt.

🕙 22h20 - Service
Il mange son dessert. Il se ressert même.

🕙 22h40 - Alibi
Vous allez au fumoir.

🕚 23h05 - Le cri
Arrêt cardiaque.`,
        events: [
            {time: '21h00', action: 'Repérage cuisine', tip: 'Noté les habitudes'},
            {time: '21h30', action: 'Récupéré cyanure', tip: 'Poudre blanche'},
            {time: '22h00', action: 'Entré en cuisine', tip: 'Assistant vous a vu ?'},
            {time: '22h05', action: '💀 EMPOISONNÉ FONDANT', tip: 'Son nom sur commande'},
            {time: '22h20', action: 'Il mange', tip: 'Il s\'est resservi'},
            {time: '22h40', action: 'Au fumoir', tip: 'Alibi fragile'},
            {time: '23h05', action: 'Le cri', tip: 'Crise cardiaque'}
        ],
        alibis: {
            phase1: {location: 'Restaurant', action: 'Je finissais de dîner', witnesses: 'Le serveur', truth: 'Vous étiez en cuisine !'},
            phase2: {location: 'Fumoir', action: 'Je fumais', witnesses: 'Personne', truth: 'Alibi FRAGILE'},
            phase3: {location: 'Fumoir', action: 'J\'ai entendu le cri', witnesses: 'Personne', truth: 'Vous attendiez'}
        },
        tips: ['Assistant cuisine = DANGER', 'Niez être allé en cuisine', 'Accusez le personnel']
    },
    {
        name: 'L\'Injection Mortelle',
        summary: 'Vous êtes entré dans sa suite avec un passe volé.',
        weapon: 'Seringue + sédatif',
        details: `CHRONOLOGIE EXACTE DU MEURTRE :

🕗 20h00 - Vol du passe
Subtilisé derrière le comptoir de réception.

🕘 21h30 - Préparation
Préparé la seringue avec sédatif mortel.

🕙 22h00 - Alibi préparé
Au bar pour être vu par le barman.

🕙 22h30 - Montée
Escalier de service vers le 2e étage.

🕙 22h35 - L'ACTE
Injection dans le cou. Il dormait.

🕙 22h40 - Fuite
Sorti par le balcon (reliés entre suites).

🕙 22h50 - Retour
Au salon, souriant.`,
        events: [
            {time: '20h00', action: 'Volé passe réception', tip: 'Réceptionniste distrait'},
            {time: '21h30', action: 'Préparé seringue', tip: 'Sédatif vétérinaire'},
            {time: '22h00', action: 'Au bar', tip: 'Barman témoin'},
            {time: '22h30', action: 'Monté au 2e', tip: 'Escalier service'},
            {time: '22h35', action: '💀 INJECTION', tip: 'Il n\'a rien senti'},
            {time: '22h40', action: 'Fuite balcon', tip: 'Balcons reliés'},
            {time: '22h50', action: 'Retour salon', tip: 'Faites-vous voir !'}
        ],
        alibis: {
            phase1: {location: 'Bar', action: 'J\'étais au bar', witnesses: 'Le barman', truth: 'AVANT le meurtre'},
            phase2: {location: 'Salon', action: 'J\'étais au salon', witnesses: '???', truth: 'MENSONGE - vous tuiez !'},
            phase3: {location: 'Salon', action: 'Je lisais', witnesses: 'Quelques-uns', truth: 'Vous veniez de descendre'}
        },
        tips: ['Porte fermée de l\'intérieur = mystère vous protège', 'Niez avoir un passe', 'Alibi phase 2 TRÈS FAIBLE']
    },
    {
        name: 'L\'Ordonnance Mortelle',
        summary: 'Vous avez échangé ses médicaments cardiaques.',
        weapon: 'Fausses pilules',
        details: `CHRONOLOGIE EXACTE DU MEURTRE :

🕕 18h00 - Information
Découvert sa maladie cardiaque par chantage.

🕖 19h00 - Infiltration
Femme de chambre vous laisse entrer.

🕖 19h05 - L'ACTE
Échangé les pilules. Même aspect.

🕖 19h10 - Sortie
Redescendu au restaurant.

🕘 21h00 - Soirée
Alibi en béton. Le piège est posé.

🕙 22h45 - Heure fatale
Il prend ses "médicaments". Surdose.

🕚 23h05 - Le cri
Arrêt cardiaque.`,
        events: [
            {time: '18h00', action: 'Découvert maladie', tip: 'Info chantage'},
            {time: '19h00', action: 'Entré suite 302', tip: 'Femme de chambre VOUS A VU'},
            {time: '19h05', action: '💀 ÉCHANGÉ PILULES', tip: 'Même couleur'},
            {time: '19h10', action: 'Redescendu', tip: 'Air naturel'},
            {time: '21h00', action: 'Soirée normale', tip: 'Piège en place'},
            {time: '22h45', action: 'Il prend pilules', tip: 'Surdose'},
            {time: '23h05', action: 'Le cri', tip: 'Accident cardiaque'}
        ],
        alibis: {
            phase1: {location: 'Bar', action: 'Au bar toute la soirée', witnesses: 'Barman', truth: 'Crime fait à 19h'},
            phase2: {location: 'Salon', action: 'Au salon', witnesses: 'Nombreux', truth: 'Piège déjà posé'},
            phase3: {location: 'Salon', action: 'Je n\'ai pas bougé', witnesses: 'Tout le monde', truth: 'Techniquement vrai'}
        },
        tips: ['Femme de chambre = DANGER #1', 'Dites ne pas savoir sa maladie', 'Accusez médecin']
    }
];

const INNOCENT_ALIBIS = {
    phase1: [
        {location: 'Bar', action: 'Buvait un verre', witnesses: 'Le barman'},
        {location: 'Salon', action: 'Lisait', witnesses: 'Personne'},
        {location: 'Restaurant', action: 'Finissait dîner', witnesses: 'Le serveur'},
        {location: 'Fumoir', action: 'Fumait', witnesses: 'Peut-être quelqu\'un'},
        {location: 'Jardin', action: 'Prenait l\'air', witnesses: 'Personne'},
        {location: 'Hall', action: 'Téléphonait', witnesses: 'Réceptionniste'}
    ],
    phase2: [
        {location: 'Bar', action: 'Autre verre', witnesses: 'Le barman'},
        {location: 'Couloir', action: 'Passait', witnesses: 'Quelqu\'un ?'},
        {location: 'Salon', action: 'Discutait', witnesses: 'À vérifier'},
        {location: 'Hall', action: 'Attendait', witnesses: 'Réceptionniste'}
    ],
    phase3: [
        {location: 'Bar', action: 'Toujours au bar', witnesses: 'Plusieurs'},
        {location: 'Salon', action: 'Arrivait', witnesses: 'Les autres'},
        {location: 'Hall', action: 'Entendu le cri', witnesses: 'Réceptionniste'}
    ]
};

const SECRETS = [
    {text: 'Delcourt vous faisait chanter', hasMotive: true},
    {text: 'Vous êtes l\'amant(e) de sa femme', hasMotive: true},
    {text: 'Il a ruiné votre père', hasMotive: true},
    {text: 'Vous lui devez 100 000€', hasMotive: true},
    {text: 'Photos compromettantes', hasMotive: true},
    {text: 'Journaliste infiltré', hasMotive: false},
    {text: 'Son enfant illégitime renié', hasMotive: true},
    {text: 'Faux alibi pour liaison', hasMotive: false}
];

const STORIES = {
    scenario: [
        {text: "La pluie tombe sur la côte normande...", delay: 3500},
        {text: "Le Grand Hôtel de l'Aurore.", delay: 3500},
        {text: "Victor Delcourt réunit ses proches.", delay: 3500},
        {text: "Homme d'affaires. Puissant. Craint.", delay: 3500},
        {text: "Certains le détestent.", delay: 3000, hl: 'danger'},
        {text: "À 22h30, il monte dans sa suite.", delay: 3000},
        {text: "À 23h05, un cri.", delay: 3500},
        {text: "Victor Delcourt est mort.", delay: 3500, hl: 'danger'},
        {text: "L'un de vous est le meurtrier.", delay: 3500, hl: 'gold'}
    ],
    cluedo: [
        {text: "Le Manoir Tudor...", delay: 3500},
        {text: "Les lumières s'éteignent !", delay: 3000},
        {text: "Un corps gît au sol.", delay: 3500, hl: 'danger'},
        {text: "QUI ? QUELLE ARME ? OÙ ?", delay: 3000, hl: 'gold'}
    ],
    survie: [
        {text: "La nuit tombe sur le refuge...", delay: 3500},
        {text: "Parmi vous, un traître.", delay: 3500, hl: 'danger'},
        {text: "Éliminez-le.", delay: 3000, hl: 'gold'}
    ]
};

const PHASES = {
    scenario: [
        {name: 'Découverte', duration: 8*60, obj: 'Alibis 21h-22h'},
        {name: 'Interrogatoires', duration: 8*60, obj: 'Période 22h-22h30'},
        {name: 'Révélations', duration: 8*60, obj: 'Secrets émergent...'},
        {name: 'Dernière chance', duration: 5*60, obj: '⚠️ LE TUEUR PEUT TUER !', canKill: true},
        {name: 'Vote final', duration: 3*60, obj: 'Désignez le coupable'}
    ],
    cluedo: [
        {name: 'Investigation', duration: 10*60, obj: 'Cherchez indices'},
        {name: 'Théories', duration: 5*60, obj: 'Hypothèses'},
        {name: 'Accusation', duration: 3*60, obj: 'QUI ARME OÙ'}
    ],
    survie: [
        {name: 'Jour 1', duration: 5*60, obj: 'Discussion'},
        {name: 'Vote 1', duration: 2*60, obj: 'Éliminez'},
        {name: 'Nuit', duration: 1*60, obj: 'Le tueur frappe...'},
        {name: 'Jour 2', duration: 5*60, obj: 'Qui est mort ?'},
        {name: 'Vote final', duration: 2*60, obj: 'Dernière chance'}
    ]
};

const RIDDLES = [
    {q: "Je suis transparent mais mortel...", hint: "C'était un POISON"},
    {q: "J'ai vu le tueur au bar...", hint: "Le meurtre = près du BAR"},
    {q: "Porte fermée de l'intérieur...", hint: "Le tueur = passé par BALCON"}
];

// ═══════════════════════════════════════════════════════════════
// GAME CLASS
// ═══════════════════════════════════════════════════════════════
const games = new Map();

class Game {
    constructor(code, cfg, hostWs) {
        this.code = code;
        this.mode = cfg.mode || 'scenario';
        this.numPlayers = cfg.numPlayers || 5;
        this.rooms = cfg.rooms || [];
        this.conns = cfg.connections || [];
        this.hostWs = hostWs;
        this.players = new Map();
        this.phase = 0;
        this.timer = null;
        this.timeRemaining = 0;
        this.started = false;
        this.ended = false;
        this.scenario = null;
        this.killerId = null;
        this.votes = new Map();
        this.messages = [];
        this.deadPlayers = new Set();
        this.canKill = false;
        this.riddleSent = false;
    }
    
    broadcast(type, data) {
        const msg = JSON.stringify({type, ...data});
        if (this.hostWs?.readyState === 1) this.hostWs.send(msg);
        this.players.forEach(p => { if (p.ws?.readyState === 1) p.ws.send(msg); });
    }
    
    sendHost(type, data) {
        if (this.hostWs?.readyState === 1) this.hostWs.send(JSON.stringify({type, ...data}));
    }
    
    sendPlayer(id, type, data) {
        const p = this.players.get(id);
        if (p?.ws?.readyState === 1) p.ws.send(JSON.stringify({type, ...data}));
    }
    
    sendMessage(fromId, toId, text) {
        const from = fromId === 'mj' ? {name: 'MJ', icon: '🎭'} : this.players.get(fromId);
        const msg = {
            from: from?.name || 'MJ',
            fromIcon: from?.icon || '🎭',
            text,
            time: new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})
        };
        this.messages.push(msg);
        if (toId === 'all') this.broadcast('message', {message: msg});
        else {
            this.sendPlayer(toId, 'message', {message: msg});
            this.sendHost('message', {message: msg});
        }
    }
    
    start() {
        if (this.started) return;
        this.started = true;
        
        this.scenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
        const ids = Array.from(this.players.keys());
        this.killerId = ids[Math.floor(Math.random() * ids.length)];
        const secrets = [...SECRETS].sort(() => Math.random() - 0.5);
        
        ids.forEach((id, i) => {
            const p = this.players.get(id);
            p.isKiller = (id === this.killerId);
            p.secret = secrets[i % secrets.length];
            if (p.isKiller) p.alibis = this.scenario.alibis;
            else p.alibis = {
                phase1: INNOCENT_ALIBIS.phase1[Math.floor(Math.random() * INNOCENT_ALIBIS.phase1.length)],
                phase2: INNOCENT_ALIBIS.phase2[Math.floor(Math.random() * INNOCENT_ALIBIS.phase2.length)],
                phase3: INNOCENT_ALIBIS.phase3[Math.floor(Math.random() * INNOCENT_ALIBIS.phase3.length)]
            };
        });
        
        console.log(`[${this.code}] Start! Killer: ${this.players.get(this.killerId)?.name}`);
        this.broadcast('game_starting', {mode: this.mode});
        setTimeout(() => this.playStory(), 1000);
    }
    
    playStory() {
        const story = STORIES[this.mode] || STORIES.scenario;
        let i = 0;
        const next = () => {
            if (i < story.length) {
                this.broadcast('story', {text: story[i].text, hl: story[i].hl, i, total: story.length});
                i++;
                setTimeout(next, story[i-1].delay);
            } else setTimeout(() => this.distributeRoles(), 3000);
        };
        this.broadcast('story_start', {});
        next();
    }
    
    distributeRoles() {
        this.players.forEach((p, id) => {
            this.sendPlayer(id, 'role', {
                name: p.name, icon: p.icon, isKiller: p.isKiller,
                secret: p.secret, alibis: p.alibis,
                scenario: p.isKiller ? this.scenario : null,
                rooms: this.rooms, mode: this.mode
            });
        });
        this.sendHost('roles_distributed', {
            players: Array.from(this.players.entries()).map(([id, p]) => ({
                id, name: p.name, icon: p.icon, isKiller: p.isKiller, secret: p.secret
            })),
            scenario: this.scenario, rooms: this.rooms
        });
        setTimeout(() => this.startPhase(1), 25000);
    }
    
    startPhase(n) {
        const phases = PHASES[this.mode] || PHASES.scenario;
        if (n > phases.length) { this.startVoting(); return; }
        
        this.phase = n;
        const ph = phases[n-1];
        this.timeRemaining = ph.duration;
        this.canKill = !!ph.canKill;
        
        if (this.canKill) this.sendPlayer(this.killerId, 'can_kill', {enabled: true});
        
        // Énigme en phase 3
        if (this.mode === 'scenario' && n === 3 && !this.riddleSent) {
            this.riddleSent = true;
            const r = RIDDLES[Math.floor(Math.random() * RIDDLES.length)];
            setTimeout(() => this.sendMessage('mj', 'all', `🔍 ÉNIGME: "${r.q}"`), 30000);
            setTimeout(() => this.sendMessage('mj', 'all', `💡 INDICE: ${r.hint}`), 180000);
        }
        
        this.broadcast('phase', {phase: n, name: ph.name, duration: ph.duration, obj: ph.obj, canKill: this.canKill});
        
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.timeRemaining--;
            if (this.timeRemaining <= 0) { clearInterval(this.timer); this.startPhase(n + 1); }
            else if (this.timeRemaining % 10 === 0 || this.timeRemaining <= 10) this.broadcast('timer', {t: this.timeRemaining});
        }, 1000);
    }
    
    killPlayer(victimId) {
        if (!this.canKill || this.deadPlayers.has(victimId) || victimId === this.killerId) return;
        this.deadPlayers.add(victimId);
        this.canKill = false;
        const v = this.players.get(victimId);
        this.broadcast('player_killed', {victimId, victimName: v?.name});
        this.sendPlayer(victimId, 'you_died', {});
        this.sendPlayer(this.killerId, 'can_kill', {enabled: false});
        this.sendMessage('mj', 'all', `💀 ${v?.name} a été retrouvé(e) mort(e) !`);
    }
    
    startVoting() {
        if (this.timer) clearInterval(this.timer);
        this.phase = 99;
        this.votes.clear();
        this.canKill = false;
        const alive = Array.from(this.players.entries()).filter(([id]) => !this.deadPlayers.has(id)).map(([id, p]) => ({id, name: p.name, icon: p.icon}));
        this.broadcast('voting', {players: alive});
    }
    
    vote(oderId, targetId) {
        this.votes.set(oderId, targetId);
        this.sendHost('vote_update', {count: this.votes.size, total: this.players.size});
        if (this.votes.size >= this.players.size) setTimeout(() => this.endGame(), 2000);
    }
    
    endGame() {
        if (this.ended) return;
        this.ended = true;
        const counts = new Map();
        this.votes.forEach(t => counts.set(t, (counts.get(t)||0)+1));
        let max = 0, accusedId = null;
        counts.forEach((c, id) => { if (c > max) { max = c; accusedId = id; } });
        const killer = this.players.get(this.killerId);
        const accused = this.players.get(accusedId);
        const win = accusedId === this.killerId;
        this.broadcast('end', {
            win: win ? 'investigators' : 'killer',
            killerId: this.killerId, killerName: killer?.name,
            accusedId, accusedName: accused?.name,
            scenario: this.scenario,
            reveals: Array.from(this.players.entries()).map(([id, p]) => ({
                id, name: p.name, icon: p.icon, isKiller: p.isKiller,
                secret: p.secret?.text, isDead: this.deadPlayers.has(id)
            }))
        });
        console.log(`[${this.code}] End! ${win ? 'Investigators win' : 'Killer wins'}`);
    }
}

// ═══════════════════════════════════════════════════════════════
// WEBSOCKET
// ═══════════════════════════════════════════════════════════════
function genCode() {
    const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) code += c[Math.floor(Math.random() * c.length)];
    return code;
}

wss.on('connection', ws => {
    console.log('+ Connected');
    ws.on('message', data => {
        try {
            const m = JSON.parse(data);
            if (m.type === 'create') {
                const code = genCode();
                const game = new Game(code, m, ws);
                games.set(code, game);
                ws.gameCode = code;
                ws.isHost = true;
                ws.send(JSON.stringify({type: 'created', code, mode: m.mode, numPlayers: m.numPlayers, rooms: m.rooms, connections: m.connections}));
                console.log(`[${code}] Created`);
            }
            else if (m.type === 'join') {
                const game = games.get(m.code?.toUpperCase());
                if (!game) { ws.send(JSON.stringify({type: 'error', msg: 'Code invalide'})); return; }
                if (game.started) { ws.send(JSON.stringify({type: 'error', msg: 'Partie commencée'})); return; }
                if (game.players.size >= game.numPlayers) { ws.send(JSON.stringify({type: 'error', msg: 'Complet'})); return; }
                const id = 'p' + Date.now();
                game.players.set(id, {ws, name: m.name, icon: m.icon || '👤'});
                ws.gameCode = m.code.toUpperCase();
                ws.oderId = id;
                ws.send(JSON.stringify({type: 'joined', id, mode: game.mode}));
                game.broadcast('player_joined', {count: game.players.size, total: game.numPlayers, players: Array.from(game.players.values()).map(p => ({name: p.name, icon: p.icon}))});
                console.log(`[${m.code}] ${m.name} joined`);
            }
            else if (m.type === 'start') { const g = games.get(ws.gameCode); if (g && ws.isHost && g.players.size >= 2) g.start(); }
            else if (m.type === 'vote') { const g = games.get(ws.gameCode); if (g && ws.oderId) g.vote(ws.oderId, m.target); }
            else if (m.type === 'next_phase') { const g = games.get(ws.gameCode); if (g && ws.isHost && g.phase < 99) { if (g.timer) clearInterval(g.timer); g.startPhase(g.phase + 1); } }
            else if (m.type === 'start_vote') { const g = games.get(ws.gameCode); if (g && ws.isHost) g.startVoting(); }
            else if (m.type === 'send_message') { const g = games.get(ws.gameCode); if (g) g.sendMessage(ws.isHost ? 'mj' : ws.oderId, m.to, m.text); }
            else if (m.type === 'kill_player') { const g = games.get(ws.gameCode); if (g && ws.oderId === g.killerId && g.canKill) g.killPlayer(m.victimId); }
        } catch(e) { console.error(e); }
    });
    ws.on('close', () => console.log('- Disconnected'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => console.log(`🎭 Murder Party v4 - Port ${PORT}`));
