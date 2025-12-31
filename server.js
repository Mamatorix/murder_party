const WebSocket = require('ws');
const http = require('http');

const HTML = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<title>Murder Party</title>
<style>
:root{--gold:#c9a227;--dark:#8b6914;--red:#8b0000;--bg:#0a0a0a;--bg2:#141414;--txt:#e8e8e8;--txt2:#888;--green:#2ecc71;--blue:#3498db;--purple:#9b59b6}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Georgia,serif;background:var(--bg);color:var(--txt);min-height:100vh}
.screen{display:none;min-height:100vh}.screen.active{display:block}
.center{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:20px;text-align:center}
h1{color:var(--gold);font-size:1.6em;margin-bottom:12px}
h2{color:var(--gold);font-size:1.2em}
h3{color:var(--gold);font-size:1em;margin-bottom:8px}
.header{background:linear-gradient(rgba(139,0,0,0.3),var(--bg));border-bottom:2px solid var(--dark);padding:12px;text-align:center;position:sticky;top:0;z-index:100}
.header h1{margin:0;font-size:1.1em}
.code{font-size:1.8em;color:var(--gold);letter-spacing:.25em;font-family:monospace;margin:6px 0}
.container{max-width:600px;margin:0 auto;padding:12px;padding-bottom:120px}
.card{background:var(--bg2);border:1px solid var(--dark);border-radius:8px;padding:12px;margin:10px 0}
.card h3{padding-bottom:6px;border-bottom:1px solid var(--dark)}
.btn{background:linear-gradient(var(--gold),var(--dark));color:var(--bg);border:none;padding:12px 20px;font-size:1em;font-weight:bold;border-radius:6px;cursor:pointer;width:100%;margin:5px 0}
.btn:disabled{opacity:0.4}
.btn-s{background:linear-gradient(#333,#222);color:var(--txt)}
.btn-sm{padding:8px 12px;width:auto;font-size:0.9em}
input,select,textarea{width:100%;padding:10px;background:var(--bg);border:2px solid var(--dark);border-radius:6px;color:var(--txt);font-size:1em;margin:5px 0}
input:focus,select:focus{border-color:var(--gold);outline:none}
label{display:block;color:var(--gold);margin:10px 0 3px;font-size:0.85em}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.mode-card{background:var(--bg2);border:2px solid var(--dark);border-radius:8px;padding:15px;cursor:pointer;text-align:center}
.mode-card:hover,.mode-card.sel{border-color:var(--gold)}
.mode-card .icon{font-size:2em;margin-bottom:6px}
.role-btns{display:flex;gap:12px;flex-wrap:wrap;justify-content:center}
.role-btn{background:var(--bg2);border:2px solid var(--dark);border-radius:10px;padding:30px 20px;cursor:pointer;text-align:center;min-width:140px}
.role-btn:hover{border-color:var(--gold)}
.role-btn .icon{font-size:2.5em;margin-bottom:8px}
.slot{background:rgba(201,162,39,0.05);border:2px dashed var(--dark);border-radius:6px;padding:10px;margin:6px 0;display:flex;align-items:center;gap:10px}
.slot.on{border-style:solid;border-color:var(--green);background:rgba(46,204,113,0.1)}
.slot.dead{opacity:0.5;border-color:#c0392b}
.slot .av{width:40px;height:40px;border-radius:50%;background:var(--dark);display:flex;align-items:center;justify-content:center;font-size:1.2em}
.slot .name{color:var(--gold);font-weight:bold}
.slot .sub{color:var(--txt2);font-size:0.8em}
.warn{background:rgba(139,0,0,0.2);border:2px solid var(--red);border-radius:8px;padding:12px;text-align:center;margin:10px 0}
.warn h3{color:#e74c3c;margin-bottom:6px}
.secret-box{background:rgba(155,89,182,0.15);border:2px solid var(--purple);border-radius:8px;padding:12px;margin:10px 0;text-align:center}
.secret-box h4{color:var(--purple);margin-bottom:6px}
.alibi{background:rgba(52,152,219,0.1);border-left:3px solid var(--blue);padding:10px;margin:8px 0;border-radius:0 6px 6px 0}
.alibi h4{color:var(--blue);margin-bottom:5px;font-size:0.9em}
.alibi .truth{background:rgba(231,76,60,0.2);padding:6px;border-radius:4px;margin-top:6px;color:#e74c3c;font-weight:bold;font-size:0.85em}
.murder-story{background:rgba(139,0,0,0.1);border-radius:6px;padding:12px;white-space:pre-line;line-height:1.6;font-size:0.85em;max-height:250px;overflow-y:auto}
.phase-box{text-align:center;padding:15px;background:linear-gradient(135deg,rgba(139,0,0,0.15),var(--bg));border:2px solid var(--red);border-radius:10px;margin:10px 0}
.phase-box h2{color:#e74c3c;font-size:1.2em}
.phase-box .timer{font-size:2.5em;color:var(--gold);margin:10px 0;font-family:monospace}
.vote-card{background:var(--bg2);border:2px solid var(--dark);border-radius:10px;padding:12px;margin:8px 0;cursor:pointer;display:flex;align-items:center;gap:12px}
.vote-card:hover{border-color:var(--gold)}
.vote-card.sel{border-color:var(--gold);background:rgba(201,162,39,0.15)}
.vote-card .icon{font-size:2em}
.vote-card .name{color:var(--gold);font-weight:bold}
.nav{position:fixed;bottom:0;left:0;right:0;background:var(--bg);border-top:2px solid var(--dark);display:flex;justify-content:space-around;padding:6px 0;z-index:100}
.nav-btn{background:none;border:none;color:var(--txt2);font-size:0.65em;padding:5px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:2px}
.nav-btn.active{color:var(--gold)}
.nav-btn .ic{font-size:1.1em}
.victory{padding:20px;border-radius:12px;text-align:center;margin:12px 0}
.victory.win{background:rgba(46,204,113,0.2);border:2px solid var(--green)}
.victory.lose{background:rgba(139,0,0,0.2);border:2px solid var(--red)}
.victory .big{font-size:2.5em;margin:10px 0}
.story{font-size:1.2em;line-height:1.8}
.story.gold{color:var(--gold)}
.story.danger{color:#e74c3c}
.prog{width:150px;height:4px;background:var(--bg2);margin-top:20px;border-radius:2px;overflow:hidden}
.prog-bar{height:100%;background:var(--gold);transition:width 0.3s}
.icons{display:flex;flex-wrap:wrap;gap:6px;justify-content:center}
.ic-opt{width:40px;height:40px;display:flex;align-items:center;justify-content:center;font-size:1.3em;background:var(--bg2);border:2px solid var(--dark);border-radius:6px;cursor:pointer}
.ic-opt.sel{border-color:var(--gold);background:rgba(201,162,39,0.2)}
.room-row{display:flex;gap:6px;align-items:center;margin:5px 0}
.room-row input{flex:1}
.room-icon{width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:1.1em;background:var(--bg);border:2px solid var(--dark);border-radius:6px;cursor:pointer}
.map-box{background:var(--bg);border:2px solid var(--dark);border-radius:8px;padding:8px;min-height:200px;position:relative}
.map-room{position:absolute;background:var(--bg2);border:2px solid var(--gold);border-radius:5px;padding:5px;text-align:center;min-width:55px;font-size:0.7em;cursor:pointer}
.map-room.here{border-color:var(--green);background:rgba(46,204,113,0.2)}
.map-room .ri{font-size:1.1em}
.messages{max-height:180px;overflow-y:auto;background:var(--bg);border-radius:6px;padding:6px}
.msg{padding:6px;margin:5px 0;border-radius:5px;background:var(--bg2);font-size:0.85em}
.msg.mj{background:rgba(201,162,39,0.1);border-left:2px solid var(--gold)}
.msg .from{color:var(--gold);font-weight:bold}
.msg .time{color:var(--txt2);font-size:0.75em;margin-left:8px}
.msg-input{display:flex;gap:6px;margin-top:8px}
.msg-input input{flex:1}
.kill-btn{background:linear-gradient(#c0392b,#8b0000);color:#fff;padding:10px;animation:pulse 1.5s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}
.dead-ov{position:fixed;inset:0;background:rgba(0,0,0,0.95);display:none;flex-direction:column;align-items:center;justify-content:center;z-index:1000}
.reveal{padding:8px;border-bottom:1px solid var(--dark);display:flex;align-items:center;gap:8px}
.reveal .av{width:30px;height:30px;border-radius:50%;background:var(--dark);display:flex;align-items:center;justify-content:center;font-size:0.9em}
.killer-tag{color:#e74c3c;font-weight:bold;font-size:0.8em}
.conn{position:fixed;top:6px;right:6px;padding:5px 10px;border-radius:12px;font-size:0.7em;z-index:1000}
.conn.on{background:rgba(46,204,113,0.2);color:var(--green)}
.conn.off{background:rgba(231,76,60,0.2);color:#e74c3c}
.tabs{display:flex;border-bottom:2px solid var(--dark);margin-bottom:10px}
.tab{flex:1;padding:8px;text-align:center;cursor:pointer;color:var(--txt2);border-bottom:2px solid transparent;margin-bottom:-2px;font-size:0.85em}
.tab.active{color:var(--gold);border-color:var(--gold)}
.notes-area{background:var(--bg);border:2px solid var(--dark);border-radius:6px;padding:8px}
.notes-area textarea{border:none;background:transparent;width:100%;min-height:100px;resize:none;color:var(--txt)}
@media(max-width:400px){.role-btns{flex-direction:column}.grid3{grid-template-columns:1fr 1fr}}
</style>
</head>
<body>
<div class="conn off" id="conn">...</div>
<div class="dead-ov" id="deadOv"><h1 style="color:#c0392b">ELIMINE</h1><p style="color:var(--txt2);margin-top:12px">Vous pouvez voter!</p></div>

<div class="screen active" id="s0">
<div class="center">
<h1>MURDER PARTY</h1>
<p style="color:var(--txt2);margin-bottom:30px">Jeu d'enquete</p>
<div class="role-btns">
<div class="role-btn" onclick="pick('host')"><div class="icon">🖥️</div><h2>MAITRE DU JEU</h2></div>
<div class="role-btn" onclick="pick('player')"><div class="icon">📱</div><h2>JOUEUR</h2></div>
</div>
</div>
</div>

<div class="screen" id="h0">
<div class="header"><h1>Mode de jeu</h1></div>
<div class="container">
<div class="grid3" style="margin:15px 0">
<div class="mode-card" onclick="selMode('scenario')" data-m="scenario"><div class="icon">🎭</div><h3>SCENARIO</h3></div>
<div class="mode-card" onclick="selMode('cluedo')" data-m="cluedo"><div class="icon">🔍</div><h3>CLUEDO</h3></div>
<div class="mode-card" onclick="selMode('survie')" data-m="survie"><div class="icon">☠️</div><h3>SURVIE</h3></div>
</div>
<button class="btn" onclick="goConfig()" id="btnMode" disabled>Continuer</button>
</div>
</div>

<div class="screen" id="h1">
<div class="header"><h1 id="cfgTitle">Configuration</h1></div>
<div class="container">
<div class="card"><h3>Joueurs</h3><input type="number" id="numP" value="5" min="3" max="10"></div>
<div class="card"><h3>Pieces (<span id="roomCnt">0</span>)</h3>
<div class="grid2" style="margin-bottom:8px"><input type="number" id="numR" value="6" min="3" max="12"><button class="btn btn-s btn-sm" onclick="genRooms()">Generer</button></div>
<div id="roomsList"></div></div>
<div class="card"><h3>Plan</h3><div class="map-box" id="mapPrev"></div></div>
<div id="extraCfg"></div>
<button class="btn" onclick="createGame()">Creer la partie</button>
</div>
</div>

<div class="screen" id="h2">
<div class="header"><h1 id="lobbyT">En attente</h1><div class="code" id="gCode">XXXXX</div></div>
<div class="container">
<div class="card"><h3>Lien</h3><p style="color:var(--gold);word-break:break-all;padding:10px;background:var(--bg);border-radius:5px;font-size:0.85em" id="gUrl">-</p><button class="btn btn-s" onclick="copyUrl()">Copier</button></div>
<div class="card"><h3>Joueurs (<span id="pCnt">0</span>/<span id="pTot">5</span>)</h3><div id="pSlots"></div></div>
<button class="btn" onclick="startGame()" id="btnStart" disabled>Lancer</button>
</div>
</div>

<div class="screen" id="h3"><div class="center"><div class="story" id="hSt"></div><div class="prog"><div class="prog-bar" id="hPr"></div></div></div></div>

<div class="screen" id="h4">
<div class="header"><h1 id="hPhT">Phase 1</h1></div>
<div class="container">
<div class="phase-box"><h2 id="hPhN">Enquete</h2><div class="timer" id="hTm">08:00</div><div id="hPhO" style="color:var(--txt2)"></div></div>
<div class="tabs"><div class="tab active" onclick="hTab('players')" data-ht="players">Joueurs</div><div class="tab" onclick="hTab('msg')" data-ht="msg">Messages</div></div>
<div id="hTabC"></div>
<div class="grid2" style="margin-top:12px"><button class="btn btn-s" onclick="nextPhase()">Phase suiv.</button><button class="btn" onclick="startVote()">Vote</button></div>
</div>
</div>

<div class="screen" id="h5">
<div class="header"><h1 id="hEndT">Fin</h1></div>
<div class="container"><div id="hEndR"></div><div class="card"><h3>Revelations</h3><div id="hRev"></div></div><button class="btn" onclick="location.reload()">Rejouer</button></div>
</div>

<div class="screen" id="p0">
<div class="center">
<h1>Rejoindre</h1>
<div class="card" style="width:100%;max-width:350px">
<label>Code</label><input type="text" id="jCode" placeholder="XXXXX" maxlength="5" style="text-transform:uppercase;text-align:center;font-size:1.5em;letter-spacing:.2em">
<label>Prenom</label><input type="text" id="jName" placeholder="Prenom">
<label>Icone</label><div class="icons" id="icPick"></div>
<button class="btn" onclick="joinGame()" style="margin-top:12px">Rejoindre</button>
</div>
</div>
</div>

<div class="screen" id="p1">
<div class="header"><h1>En attente</h1></div>
<div class="container"><div class="card" style="text-align:center"><div style="font-size:3em" id="myIc">👤</div><p style="margin-top:8px">Bienvenue <strong id="myNm" style="color:var(--gold)"></strong></p></div><div class="card"><h3>Joueurs</h3><div id="wList"></div></div></div>
</div>

<div class="screen" id="p2"><div class="center"><div class="story" id="pSt"></div><div class="prog"><div class="prog-bar" id="pPr"></div></div></div></div>

<div class="screen" id="p3"><div class="header"><h1>Votre role</h1></div><div class="container" id="roleC"></div></div>

<div class="screen" id="p4">
<div class="header"><h1 id="pPhT">Phase 1</h1><p style="color:var(--txt2);font-size:0.8em" id="pPhO"></p></div>
<div class="container" id="pTabC"></div>
<nav class="nav">
<button class="nav-btn active" onclick="pTab('mission')" data-pt="mission"><span class="ic">🎯</span>Mission</button>
<button class="nav-btn" onclick="pTab('alibis')" data-pt="alibis"><span class="ic">📋</span>Infos</button>
<button class="nav-btn" onclick="pTab('map')" data-pt="map"><span class="ic">🗺️</span>Plan</button>
<button class="nav-btn" onclick="pTab('notes')" data-pt="notes"><span class="ic">📝</span>Notes</button>
<button class="nav-btn" onclick="pTab('msg')" data-pt="msg"><span class="ic">💬</span>Chat</button>
</nav>
</div>

<div class="screen" id="p5"><div class="header"><h1>Vote</h1></div><div class="container" id="voteC"></div></div>

<div class="screen" id="p6"><div class="header"><h1 id="pEndT">Fin</h1></div><div class="container"><div id="pEndR"></div><button class="btn" onclick="location.reload()">Rejouer</button></div></div>

<script>
let ws,role,myId,myName,myIcon='👤',gameMode=null,gameRooms=[],gameConns=[],myData=null,allPlayers=[];
let scenario=null,curTab='mission',hCurTab='players',voted=false,selVote=null,messages=[];
let canKill=false,isDead=false,myNotes='',myRoom=null;
const ICONS=['👤','🧥','🕵️','💼','🎤','💔','📰','💰','⚕️','👑','🎭','🎩'];
const ROOM_ICONS=['🚪','🛋️','📚','🍽️','👨‍🍳','🌿','🍸','🛏️'];
const DEF_ROOMS=[{id:'hall',name:'Hall',icon:'🚪'},{id:'salon',name:'Salon',icon:'🛋️'},{id:'bar',name:'Bar',icon:'🍸'},{id:'salle',name:'Salle a manger',icon:'🍽️'},{id:'cuisine',name:'Cuisine',icon:'👨‍🍳'},{id:'biblio',name:'Bibliotheque',icon:'📚'},{id:'bureau',name:'Bureau',icon:'💼'},{id:'jardin',name:'Jardin',icon:'🌿'}];

function show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));document.getElementById(id)?.classList.add('active');}
function fmt(s){return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');}
function copyUrl(){navigator.clipboard?.writeText(location.href);alert('Copie!');}
function $(id){return document.getElementById(id);}

function connect(){
var proto=location.protocol==='https:'?'wss:':'ws:';
ws=new WebSocket(proto+'//'+location.host);
ws.onopen=function(){$('conn').className='conn on';$('conn').textContent='OK';};
ws.onclose=function(){$('conn').className='conn off';$('conn').textContent='...';setTimeout(connect,2000);};
ws.onmessage=function(e){handle(JSON.parse(e.data));};
}
function send(type,data){if(ws&&ws.readyState===1)ws.send(JSON.stringify(Object.assign({type:type},data||{})));}

function handle(m){
console.log(m.type,m);
if(m.type==='created'){$('gCode').textContent=m.code;$('gUrl').textContent=location.href;$('pTot').textContent=m.numPlayers;$('lobbyT').textContent=m.mode==='scenario'?'Scenario':m.mode==='cluedo'?'Cluedo':'Survie';gameRooms=m.rooms||[];updSlots([],m.numPlayers);show('h2');}
if(m.type==='joined'){myId=m.id;gameMode=m.mode;$('myNm').textContent=myName;$('myIc').textContent=myIcon;show('p1');}
if(m.type==='error'){alert(m.msg);return;}
if(m.type==='player_joined'){allPlayers=m.players;$('pCnt').textContent=m.count;updSlots(m.players,m.total);$('btnStart').disabled=m.count<2;$('wList').innerHTML=m.players.map(function(p){return '<div class="slot on"><div class="av">'+p.icon+'</div><div class="name">'+p.name+'</div></div>';}).join('');}
if(m.type==='story_start')show(role==='host'?'h3':'p2');
if(m.type==='story'){var el=$(role==='host'?'hSt':'pSt');el.textContent=m.text;el.className='story'+(m.hl?' '+m.hl:'');$(role==='host'?'hPr':'pPr').style.width=((m.i+1)/m.total*100)+'%';}
if(m.type==='role'){myData=m;scenario=m.scenario;gameRooms=m.rooms||[];myRoom=gameRooms[0]?gameRooms[0].id:null;showRole();}
if(m.type==='roles_distributed'){allPlayers=m.players;scenario=m.scenario;gameRooms=m.rooms||[];updHTab();}
if(m.type==='phase'){canKill=m.canKill&&myData&&myData.isKiller;if(role==='host'){show('h4');$('hPhT').textContent='Phase '+m.phase;$('hPhN').textContent=m.name;$('hTm').textContent=fmt(m.duration);$('hPhO').textContent=m.obj;}else{show('p4');$('pPhT').textContent='Phase '+m.phase;$('pPhO').textContent=m.obj;updPTab();}}
if(m.type==='timer')$('hTm').textContent=fmt(m.t);
if(m.type==='voting'){allPlayers=m.players;if(role==='host'){$('hPhT').textContent='VOTE';$('hPhN').textContent='Designez le coupable';$('hTm').textContent='--:--';}else showVote();}
if(m.type==='message'){messages.push(m.message);if(role==='host')updHTab();else updPTab();}
if(m.type==='can_kill'){canKill=m.enabled;updPTab();}
if(m.type==='player_killed'){allPlayers=allPlayers.map(function(p){return p.id===m.victimId?Object.assign({},p,{isDead:true}):p;});updHTab();}
if(m.type==='you_died'){isDead=true;$('deadOv').style.display='flex';setTimeout(function(){$('deadOv').style.display='none';},3000);}
if(m.type==='end')showEnd(m);
}

function pick(r){role=r;if(r==='host')show('h0');else{initIcons();show('p0');}}
function initIcons(){$('icPick').innerHTML=ICONS.map(function(ic,i){return '<div class="ic-opt'+(i===0?' sel':'')+'" onclick="pickIc(this,\''+ic+'\')">'+ic+'</div>';}).join('');}
function pickIc(el,ic){document.querySelectorAll('#icPick .ic-opt').forEach(function(x){x.classList.remove('sel');});el.classList.add('sel');myIcon=ic;}

function selMode(m){gameMode=m;document.querySelectorAll('.mode-card').forEach(function(c){c.classList.remove('sel');});document.querySelector('[data-m="'+m+'"]').classList.add('sel');$('btnMode').disabled=false;}
function goConfig(){if(!gameMode)return;$('cfgTitle').textContent=gameMode==='scenario'?'Config Scenario':gameMode==='cluedo'?'Config Cluedo':'Config Survie';genRooms();show('h1');}

function genRooms(){
var n=parseInt($('numR').value)||6;
gameRooms=[];
for(var i=0;i<n;i++){var d=DEF_ROOMS[i]||{id:'r'+i,name:'Piece '+(i+1),icon:'🚪'};gameRooms.push({id:d.id,name:d.name,icon:d.icon,x:20+(i%3)*95,y:10+Math.floor(i/3)*65});}
gameConns=[];
for(var i=0;i<gameRooms.length;i++){if(i+1<gameRooms.length&&(i+1)%3!==0)gameConns.push([gameRooms[i].id,gameRooms[i+1].id]);if(i+3<gameRooms.length)gameConns.push([gameRooms[i].id,gameRooms[i+3].id]);}
renderRooms();renderMap('mapPrev');
}
function renderRooms(){$('roomCnt').textContent=gameRooms.length;$('roomsList').innerHTML=gameRooms.map(function(r,i){return '<div class="room-row"><input value="'+r.name+'" onchange="updRm('+i+',this.value)"><div class="room-icon" onclick="cycleRm('+i+')">'+r.icon+'</div></div>';}).join('');}
function updRm(i,v){gameRooms[i].name=v;renderMap('mapPrev');}
function cycleRm(i){var idx=ROOM_ICONS.indexOf(gameRooms[i].icon);gameRooms[i].icon=ROOM_ICONS[(idx+1)%ROOM_ICONS.length];renderRooms();renderMap('mapPrev');}

function renderMap(cid){
var c=$(cid);if(!c)return;
var svg='<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none" viewBox="0 0 300 200"><defs><marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#8b6914"/></marker></defs>';
gameConns.forEach(function(cn){var a=gameRooms.find(function(r){return r.id===cn[0];}),b=gameRooms.find(function(r){return r.id===cn[1];});if(a&&b)svg+='<line x1="'+(a.x+28)+'" y1="'+(a.y+20)+'" x2="'+(b.x+28)+'" y2="'+(b.y+20)+'" stroke="#8b6914" stroke-width="2" stroke-dasharray="4,3" marker-end="url(#arr)"/>';});
svg+='</svg>';
gameRooms.forEach(function(r){var here=myRoom===r.id;svg+='<div class="map-room'+(here?' here':'')+'" style="left:'+r.x+'px;top:'+r.y+'px" onclick="moveRoom(\''+r.id+'\')"><div class="ri">'+r.icon+'</div><div>'+r.name+'</div></div>';});
c.innerHTML=svg;
}

function createGame(){send('create',{mode:gameMode,numPlayers:parseInt($('numP').value)||5,rooms:gameRooms,connections:gameConns});}
function updSlots(list,total){var h='';for(var i=0;i<total;i++){var p=list[i];h+=p?'<div class="slot on"><div class="av">'+p.icon+'</div><div class="name">'+p.name+'</div></div>':'<div class="slot"><div class="av" style="opacity:0.3">?</div><div class="name" style="color:var(--txt2)">Attente...</div></div>';}$('pSlots').innerHTML=h;}
function startGame(){send('start');}
function nextPhase(){send('next_phase');}
function startVote(){send('start_vote');}

function hTab(t){hCurTab=t;document.querySelectorAll('[data-ht]').forEach(function(x){x.classList.remove('active');});document.querySelector('[data-ht="'+t+'"]').classList.add('active');updHTab();}
function updHTab(){
var h='';
if(hCurTab==='players'){h=allPlayers.map(function(p){return '<div class="slot '+(p.isDead?'dead':'on')+'"><div class="av">'+p.icon+'</div><div><div class="name">'+p.name+(p.isKiller?' <span style="color:#e74c3c">TUEUR</span>':'')+(p.isDead?' X':'')+'</div><div class="sub">'+(p.secret?p.secret.text:'')+'</div></div></div>';}).join('');}
else if(hCurTab==='msg'){h='<div class="messages">'+messages.map(function(m){return '<div class="msg '+(m.from==='MJ'?'mj':'')+'"><span class="from">'+m.from+'</span><span class="time">'+m.time+'</span><div>'+m.text+'</div></div>';}).join('')+'</div><div class="msg-input"><select id="msgTo"><option value="all">Tous</option>'+allPlayers.map(function(p){return '<option value="'+p.id+'">'+p.name+'</option>';}).join('')+'</select><input id="msgTxt" placeholder="Message..."><button class="btn btn-sm" onclick="sendHMsg()">OK</button></div>';}
$('hTabC').innerHTML=h;
}
function sendHMsg(){var to=$('msgTo').value,txt=$('msgTxt').value.trim();if(!txt)return;send('send_message',{to:to,text:txt});$('msgTxt').value='';}

function joinGame(){var code=$('jCode').value.toUpperCase().trim();myName=$('jName').value.trim();if(!code||code.length<4){alert('Code!');return;}if(!myName){alert('Prenom!');return;}send('join',{code:code,name:myName,icon:myIcon});}

function showRole(){
show('p3');
var h='<div class="card" style="text-align:center"><div style="font-size:3em">'+myData.icon+'</div><div style="font-size:1.3em;color:var(--gold);margin-top:8px">'+myData.name+'</div></div>';
if(myData.isKiller&&scenario){
h+='<div class="warn"><h3>VOUS ETES LE MEURTRIER!</h3><p style="margin:8px 0"><strong>'+scenario.name+'</strong></p><p>'+scenario.summary+'</p></div>';
h+='<div class="card"><h3>Deroulement</h3><div class="murder-story">'+scenario.details+'</div></div>';
if(scenario.tips)h+='<div class="card"><h3>Conseils</h3><ul style="margin-left:15px">'+scenario.tips.map(function(t){return '<li style="margin:6px 0">'+t+'</li>';}).join('')+'</ul></div>';
}
if(myData.secret)h+='<div class="secret-box"><h4>Votre secret</h4><p>'+myData.secret.text+'</p>'+(myData.secret.hasMotive?'<p style="color:#e74c3c;margin-top:6px;font-weight:bold">MOBILE!</p>':'')+'</div>';
if(myData.alibis){
h+='<div class="card"><h3>Vos alibis</h3>';
['phase1','phase2','phase3'].forEach(function(p,i){var a=myData.alibis[p];if(a)h+='<div class="alibi"><h4>Phase '+(i+1)+'</h4><div>Lieu: '+a.location+'</div><div>Action: '+a.action+'</div><div>Temoins: '+a.witnesses+'</div>'+(myData.isKiller&&a.truth?'<div class="truth">REALITE: '+a.truth+'</div>':'')+'</div>';});
h+='</div>';
}
h+='<button class="btn" onclick="confirmRole()">Compris</button>';
$('roleC').innerHTML=h;
}
function confirmRole(){show('p4');updPTab();}

function pTab(t){curTab=t;document.querySelectorAll('[data-pt]').forEach(function(b){b.classList.remove('active');});document.querySelector('[data-pt="'+t+'"]').classList.add('active');updPTab();}

function updPTab(){
var h='';
if(curTab==='mission'){
h+='<div class="card" style="text-align:center"><h3>Mission</h3><p style="font-size:1.1em">'+(myData&&myData.isKiller?'Survivez!':'Trouvez le tueur!')+'</p></div>';
if(isDead)h+='<div class="warn"><h3>MORT</h3><p>Vous pouvez voter!</p></div>';
if(myData&&myData.isKiller){h+='<div class="warn"><h3>Vous etes le tueur</h3><p>Mentez, accusez!</p></div>';if(canKill){h+='<div class="card"><h3>ELIMINER</h3>';allPlayers.filter(function(p){return p.id!==myId&&!p.isDead;}).forEach(function(p){h+='<button class="kill-btn" onclick="killP(\''+p.id+'\')" style="margin:4px 0">'+p.name+'</button>';});h+='</div>';}}
}else if(curTab==='alibis'){
h+='<div class="card"><h3>Fiche enquete</h3>';
if(myData&&myData.alibis){['phase1','phase2','phase3'].forEach(function(p,i){var a=myData.alibis[p];if(a)h+='<div class="alibi"><h4>Phase '+(i+1)+'</h4><div>'+a.location+' - '+a.action+'</div><div>Temoins: '+a.witnesses+'</div>'+(myData.isKiller&&a.truth?'<div class="truth">'+a.truth+'</div>':'')+'</div>';});}
if(myData&&myData.secret)h+='<div class="secret-box"><h4>Mon secret</h4><p>'+myData.secret.text+'</p></div>';
h+='</div>';
h+='<div class="card"><h3>Autres joueurs</h3>';
allPlayers.filter(function(p){return p.id!==myId;}).forEach(function(p){h+='<div class="slot '+(p.isDead?'dead':'on')+'"><div class="av">'+p.icon+'</div><div class="name">'+p.name+(p.isDead?' X':'')+'</div></div>';});
h+='</div>';
}else if(curTab==='map'){
h+='<div class="card"><h3>Plan</h3><p style="color:var(--txt2);font-size:0.8em;margin-bottom:8px">Cliquez pour vous deplacer</p><div class="map-box" id="pMap"></div></div>';
setTimeout(function(){renderMap('pMap');},10);
}else if(curTab==='notes'){
h+='<div class="card"><h3>Notes</h3><div class="notes-area"><textarea id="notesA" placeholder="Vos notes..." onchange="myNotes=this.value">'+myNotes+'</textarea></div></div>';
}else if(curTab==='msg'){
h+='<div class="card"><h3>Messages</h3><div class="messages">'+(messages.length?messages.map(function(m){return '<div class="msg '+(m.from==='MJ'?'mj':'')+'"><span class="from">'+m.from+'</span><span class="time">'+m.time+'</span><div>'+m.text+'</div></div>';}).join(''):'<p style="color:var(--txt2);text-align:center">Aucun</p>')+'</div><div class="msg-input"><select id="pMsgTo"><option value="all">Tous</option>'+allPlayers.filter(function(p){return p.id!==myId;}).map(function(p){return '<option value="'+p.id+'">'+p.name+'</option>';}).join('')+'</select><input id="pMsgTxt" placeholder="Message..."><button class="btn btn-sm" onclick="sendPMsg()">OK</button></div></div>';
}
$('pTabC').innerHTML=h;
if(curTab==='map')renderMap('pMap');
}

function moveRoom(rid){myRoom=rid;send('move_room',{roomId:rid});updPTab();}
function sendPMsg(){var to=$('pMsgTo').value,txt=$('pMsgTxt').value.trim();if(!txt)return;send('send_message',{to:to,text:txt});$('pMsgTxt').value='';}
function killP(id){if(confirm('Eliminer?'))send('kill_player',{victimId:id});}

function showVote(){
show('p5');
var h='<div class="card" style="text-align:center"><h3>Qui est le coupable?</h3></div><div class="card">';
allPlayers.filter(function(p){return !p.isDead&&p.id!==myId;}).forEach(function(p){h+='<div class="vote-card'+(selVote===p.id?' sel':'')+'" onclick="selV(\''+p.id+'\')"><div class="icon">'+p.icon+'</div><div class="name">'+p.name+'</div></div>';});
h+='</div><button class="btn" onclick="confirmVote()"'+(selVote?'':' disabled')+'>Confirmer</button>';
if(voted)h='<div class="victory win"><div class="big">OK</div><h2>Vote enregistre!</h2></div>';
$('voteC').innerHTML=h;
}
function selV(id){selVote=id;showVote();}
function confirmVote(){if(!selVote)return;send('vote',{target:selVote});voted=true;showVote();}

function showEnd(m){
var win=m.win==='investigators';
if(role==='host'){
show('h5');$('hEndT').textContent=win?'Victoire!':'Le tueur gagne!';
$('hEndR').innerHTML='<div class="victory '+(win?'win':'lose')+'"><div class="big">'+(win?'🎉':'💀')+'</div><h2>'+(win?'Demasque!':'Echappe...')+'</h2><p style="margin-top:8px">Coupable: <strong style="color:var(--gold)">'+m.killerName+'</strong></p></div>';
$('hRev').innerHTML=m.reveals.map(function(r){return '<div class="reveal"><div class="av">'+r.icon+'</div><div><strong>'+r.name+'</strong>'+(r.isKiller?' <span class="killer-tag">TUEUR</span>':'')+(r.isDead?' X':'')+'<br><span style="color:var(--txt2);font-size:0.8em">'+(r.secret||'')+'</span></div></div>';}).join('');
}else{
show('p6');var iWin=myData&&myData.isKiller?!win:win;
$('pEndT').textContent=iWin?'Victoire!':'Defaite...';
$('pEndR').innerHTML='<div class="victory '+(iWin?'win':'lose')+'"><div class="big">'+(iWin?'🎉':'💀')+'</div><h2>'+(myData&&myData.isKiller?(win?'Demasque...':'Echappe!'):(win?'Trouve!':'Echappe...'))+'</h2><p style="margin-top:8px">Meurtrier: <strong style="color:var(--gold)">'+m.killerName+'</strong></p></div>';
}
}

connect();
<\/script>
</body>
</html>`;

const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(HTML);
});

const wss = new WebSocket.Server({ server });

const SCENARIOS = [
    {
        name: 'Le Poison au Bar',
        summary: 'Vous avez verse du poison dans son verre.',
        details: '21h30 - Recupere le poison\n21h45 - Au bar\n22h15 - Verre renverse = diversion\n22h17 - VERSE LE POISON\n22h30 - Il monte\n22h35 - Au salon (alibi)\n23h05 - Le cri',
        alibis: {
            phase1:{location:'Bar',action:'Buvais un whisky',witnesses:'Barman',truth:'Vous versiez le poison!'},
            phase2:{location:'Salon',action:'Discutais',witnesses:'Plusieurs',truth:'Attendiez que ca agisse'},
            phase3:{location:'Salon',action:'Entendu le cri',witnesses:'Tous',truth:'Vous saviez'}
        },
        tips:['Ne niez JAMAIS etre au bar','Accusez quelqu\'un d\'autre','La fiole = votre chambre']
    },
    {
        name: 'Le Dessert Fatal',
        summary: 'Vous avez empoisonne son fondant au chocolat.',
        details: '21h00 - Reperage cuisine\n21h30 - Recupere le cyanure\n22h00 - Entre en cuisine\n22h05 - EMPOISONNE LE FONDANT\n22h20 - Il mange\n22h40 - Au fumoir\n23h05 - Le cri',
        alibis: {
            phase1:{location:'Restaurant',action:'Finissais de diner',witnesses:'Serveur',truth:'Vous etiez en cuisine!'},
            phase2:{location:'Fumoir',action:'Fumais',witnesses:'Personne?',truth:'Alibi fragile'},
            phase3:{location:'Fumoir',action:'Entendu le cri',witnesses:'Personne',truth:'Vous attendiez'}
        },
        tips:['L\'assistant = DANGER','Niez etre alle en cuisine']
    },
    {
        name: 'L\'Injection Mortelle',
        summary: 'Vous etes entre avec un passe vole.',
        details: '20h00 - Vole passe reception\n21h30 - Prepare seringue\n22h00 - Au bar (alibi)\n22h30 - Monte au 2e\n22h35 - INJECTION\n22h40 - Fuite par balcon\n22h50 - Retour salon',
        alibis: {
            phase1:{location:'Bar',action:'Au bar',witnesses:'Barman',truth:'AVANT le meurtre'},
            phase2:{location:'Salon',action:'Au salon',witnesses:'???',truth:'MENSONGE - vous tuiez!'},
            phase3:{location:'Salon',action:'Lisais',witnesses:'Quelques-uns',truth:'Veniez de descendre'}
        },
        tips:['Porte fermee = mystere vous protege','Niez avoir passe']
    }
];

const INNOCENT_ALIBIS = {
    phase1:[{location:'Bar',action:'Buvait',witnesses:'Barman'},{location:'Salon',action:'Lisait',witnesses:'Personne'},{location:'Restaurant',action:'Dinait',witnesses:'Serveur'},{location:'Fumoir',action:'Fumait',witnesses:'Quelqu\'un?'}],
    phase2:[{location:'Bar',action:'Autre verre',witnesses:'Barman'},{location:'Couloir',action:'Passait',witnesses:'Quelqu\'un?'},{location:'Salon',action:'Discutait',witnesses:'A verifier'}],
    phase3:[{location:'Bar',action:'Toujours la',witnesses:'Plusieurs'},{location:'Salon',action:'Arrivait',witnesses:'Les autres'},{location:'Hall',action:'Entendu cri',witnesses:'Receptionniste'}]
};

const SECRETS = [
    {text:'La victime vous faisait chanter',hasMotive:true},
    {text:'Vous etes l\'amant(e) de sa femme',hasMotive:true},
    {text:'Il a ruine votre pere',hasMotive:true},
    {text:'Vous lui devez 100000 euros',hasMotive:true},
    {text:'Il avait des photos compromettantes',hasMotive:true},
    {text:'Vous etes journaliste infiltre',hasMotive:false},
    {text:'Vous etes son enfant illegitime',hasMotive:true}
];

const STORIES = {
    scenario:[{text:'La pluie tombe...',delay:2500},{text:'Le Grand Hotel.',delay:2500},{text:'Un diner reunit les proches.',delay:2500},{text:'Certains le detestent.',delay:2000,hl:'danger'},{text:'A 22h30, il monte.',delay:2000},{text:'A 23h05, un cri.',delay:2500},{text:'Il est mort.',delay:2500,hl:'danger'},{text:'L\'un de vous est le meurtrier.',delay:2500,hl:'gold'}],
    cluedo:[{text:'Le Manoir...',delay:2500},{text:'Les lumieres s\'eteignent!',delay:2000},{text:'Un corps git au sol.',delay:2500,hl:'danger'},{text:'QUI? QUELLE ARME? OU?',delay:2500,hl:'gold'}],
    survie:[{text:'Le refuge isole...',delay:2500},{text:'Parmi vous, un traitre.',delay:2500,hl:'danger'},{text:'Eliminez-le.',delay:2500,hl:'gold'}]
};

const PHASES = {
    scenario:[{name:'Decouverte',duration:480,obj:'Alibis 21h-22h'},{name:'Interrogatoires',duration:480,obj:'Periode 22h-22h30'},{name:'Revelations',duration:480,obj:'Secrets emergent...'},{name:'Derniere chance',duration:300,obj:'LE TUEUR PEUT TUER!',canKill:true},{name:'Deliberation',duration:180,obj:'Preparez vote'}],
    cluedo:[{name:'Investigation',duration:480,obj:'Explorez'},{name:'Accusations',duration:480,obj:'Hypotheses'},{name:'Revelation',duration:180,obj:'Dernieres accusations'}],
    survie:[{name:'Jour 1',duration:300,obj:'Discussion'},{name:'Vote 1',duration:120,obj:'Eliminez'},{name:'Nuit',duration:60,obj:'Le tueur frappe...',canKill:true},{name:'Jour 2',duration:300,obj:'Qui est mort?'},{name:'Vote final',duration:120,obj:'Derniere chance'}]
};

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
        const msg = {from: from?.name || 'MJ', text, time: new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})};
        this.messages.push(msg);
        if (toId === 'all') this.broadcast('message', {message: msg});
        else {
            this.sendPlayer(toId, 'message', {message: msg});
            if (fromId !== 'mj') this.sendPlayer(fromId, 'message', {message: msg});
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
            p.room = this.rooms[0]?.id;
            if (p.isKiller) p.alibis = this.scenario.alibis;
            else p.alibis = {
                phase1: INNOCENT_ALIBIS.phase1[Math.floor(Math.random() * INNOCENT_ALIBIS.phase1.length)],
                phase2: INNOCENT_ALIBIS.phase2[Math.floor(Math.random() * INNOCENT_ALIBIS.phase2.length)],
                phase3: INNOCENT_ALIBIS.phase3[Math.floor(Math.random() * INNOCENT_ALIBIS.phase3.length)]
            };
        });
        console.log('['+this.code+'] Start! Killer: '+this.players.get(this.killerId)?.name);
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
            } else setTimeout(() => this.distributeRoles(), 2000);
        };
        this.broadcast('story_start', {});
        next();
    }
    
    distributeRoles() {
        this.players.forEach((p, id) => {
            this.sendPlayer(id, 'role', {
                id, name: p.name, icon: p.icon, isKiller: p.isKiller,
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
        setTimeout(() => this.startPhase(1), 18000);
    }
    
    startPhase(n) {
        const phases = PHASES[this.mode] || PHASES.scenario;
        if (n > phases.length) { this.startVoting(); return; }
        this.phase = n;
        const ph = phases[n-1];
        this.timeRemaining = ph.duration;
        this.canKill = !!ph.canKill;
        if (this.canKill) this.sendPlayer(this.killerId, 'can_kill', {enabled: true});
        if (this.mode === 'scenario' && n === 3) {
            setTimeout(() => this.sendMessage('mj', 'all', 'INDICE: Quelqu\'un a ete vu pres du bar entre 22h15 et 22h20...'), 60000);
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
        this.sendMessage('mj', 'all', v?.name + ' a ete retrouve(e) mort(e)!');
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
        const win = accusedId === this.killerId;
        this.broadcast('end', {
            win: win ? 'investigators' : 'killer',
            killerId: this.killerId, killerName: killer?.name,
            scenario: this.scenario,
            reveals: Array.from(this.players.entries()).map(([id, p]) => ({
                id, name: p.name, icon: p.icon, isKiller: p.isKiller,
                secret: p.secret?.text, isDead: this.deadPlayers.has(id)
            }))
        });
        console.log('['+this.code+'] End! '+(win ? 'Investigators win' : 'Killer wins'));
    }
}

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
                ws.send(JSON.stringify({type:'created',code,mode:m.mode,numPlayers:m.numPlayers,rooms:m.rooms,connections:m.connections}));
                console.log('['+code+'] Created');
            }
            else if (m.type === 'join') {
                const game = games.get(m.code?.toUpperCase());
                if (!game) { ws.send(JSON.stringify({type:'error',msg:'Code invalide'})); return; }
                if (game.started) { ws.send(JSON.stringify({type:'error',msg:'Partie commencee'})); return; }
                if (game.players.size >= game.numPlayers) { ws.send(JSON.stringify({type:'error',msg:'Complet'})); return; }
                const id = 'p' + Date.now();
                game.players.set(id, {ws, name: m.name, icon: m.icon || '👤'});
                ws.gameCode = m.code.toUpperCase();
                ws.oderId = id;
                ws.send(JSON.stringify({type:'joined',id,mode:game.mode}));
                game.broadcast('player_joined',{count:game.players.size,total:game.numPlayers,players:Array.from(game.players.values()).map(p=>({name:p.name,icon:p.icon}))});
                console.log('['+m.code+'] '+m.name+' joined');
            }
            else if (m.type === 'start') { const g = games.get(ws.gameCode); if (g && ws.isHost && g.players.size >= 2) g.start(); }
            else if (m.type === 'vote') { const g = games.get(ws.gameCode); if (g && ws.oderId) g.vote(ws.oderId, m.target); }
            else if (m.type === 'next_phase') { const g = games.get(ws.gameCode); if (g && ws.isHost && g.phase < 99) { if (g.timer) clearInterval(g.timer); g.startPhase(g.phase + 1); } }
            else if (m.type === 'start_vote') { const g = games.get(ws.gameCode); if (g && ws.isHost) g.startVoting(); }
            else if (m.type === 'send_message') { const g = games.get(ws.gameCode); if (g) g.sendMessage(ws.isHost ? 'mj' : ws.oderId, m.to, m.text); }
            else if (m.type === 'kill_player') { const g = games.get(ws.gameCode); if (g && ws.oderId === g.killerId && g.canKill) g.killPlayer(m.victimId); }
            else if (m.type === 'move_room') { const g = games.get(ws.gameCode); if (g && ws.oderId) { const p = g.players.get(ws.oderId); if (p) p.room = m.roomId; } }
        } catch(e) { console.error(e); }
    });
    ws.on('close', () => console.log('- Disconnected'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => console.log('Murder Party v5 - Port '+PORT));
