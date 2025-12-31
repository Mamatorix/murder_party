const WebSocket = require('ws');
const http = require('http');

// HTML complet
const HTML = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<title>Murder Party</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--gold:#c9a227;--dark:#8b6914;--red:#8b0000;--bg:#0a0a0a;--bg2:#151515;--txt:#eee;--txt2:#888}
body{font-family:Georgia,serif;background:var(--bg);color:var(--txt);min-height:100vh}
.screen{display:none;min-height:100vh;padding:15px}
.screen.active{display:block}
.center{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:90vh;text-align:center}
h1{color:var(--gold);font-size:1.5em;margin-bottom:10px}
h2{color:var(--gold);font-size:1.2em}
h3{color:var(--gold);font-size:1em;margin-bottom:8px}
.btn{background:linear-gradient(135deg,var(--gold),var(--dark));color:#000;border:none;padding:12px 20px;font-size:1em;font-weight:bold;border-radius:8px;cursor:pointer;width:100%;margin:5px 0}
.btn:hover{opacity:0.9}
.btn:disabled{opacity:0.4;cursor:not-allowed}
.btn-s{background:#333;color:var(--txt)}
.btn-sm{padding:8px 15px;width:auto}
.btn-danger{background:linear-gradient(135deg,#c0392b,#8b0000);color:#fff}
input,select,textarea{width:100%;padding:10px;background:#111;border:2px solid #333;border-radius:6px;color:var(--txt);font-size:1em;margin:5px 0}
input:focus,select:focus,textarea:focus{border-color:var(--gold);outline:none}
.card{background:var(--bg2);border:1px solid #333;border-radius:10px;padding:15px;margin:10px 0}
.card h3{border-bottom:1px solid #333;padding-bottom:8px;margin-bottom:10px}
.header{background:linear-gradient(180deg,rgba(139,0,0,0.3),transparent);padding:15px;text-align:center;border-bottom:2px solid var(--dark);margin:-15px -15px 15px -15px}
.header h1{margin:0;font-size:1.2em}
.code{font-size:2em;color:var(--gold);letter-spacing:0.3em;font-family:monospace;margin:5px 0}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.mode-card{background:var(--bg2);border:2px solid #333;border-radius:10px;padding:20px 10px;cursor:pointer;text-align:center;transition:all 0.2s}
.mode-card:hover{border-color:var(--gold)}
.mode-card.sel{border-color:var(--gold);background:rgba(201,162,39,0.1)}
.mode-card .icon{font-size:2em}
.mode-card h3{margin:8px 0 0 0;font-size:0.9em}
.role-btn{background:var(--bg2);border:2px solid #333;border-radius:12px;padding:30px;cursor:pointer;text-align:center;transition:all 0.2s}
.role-btn:hover{border-color:var(--gold);transform:scale(1.02)}
.role-btn .icon{font-size:3em;margin-bottom:10px}
.slot{display:flex;align-items:center;gap:10px;padding:10px;background:rgba(255,255,255,0.03);border:2px dashed #333;border-radius:8px;margin:5px 0}
.slot.on{border-style:solid;border-color:#2ecc71;background:rgba(46,204,113,0.1)}
.slot .av{width:40px;height:40px;background:#333;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.2em}
.slot .name{color:var(--gold);font-weight:bold}
.slot .sub{color:var(--txt2);font-size:0.8em}
.room-row{display:flex;gap:8px;align-items:center;margin:5px 0}
.room-row input{flex:1}
.room-icon{width:40px;height:40px;background:#111;border:2px solid #333;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:1.2em;cursor:pointer}
.room-icon:hover{border-color:var(--gold)}
.map-box{background:#0a0a0a;border:2px solid #333;border-radius:8px;min-height:200px;position:relative;overflow:hidden}
.map-room{position:absolute;background:var(--bg2);border:2px solid var(--gold);border-radius:6px;padding:5px 8px;text-align:center;font-size:0.75em;cursor:pointer;transition:all 0.2s}
.map-room:hover{transform:scale(1.1);z-index:10}
.map-room.here{border-color:#2ecc71;background:rgba(46,204,113,0.2)}
.map-room .ri{font-size:1.2em}
.icons{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:10px 0}
.ic-opt{width:45px;height:45px;background:var(--bg2);border:2px solid #333;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.5em;cursor:pointer}
.ic-opt:hover{border-color:var(--gold)}
.ic-opt.sel{border-color:var(--gold);background:rgba(201,162,39,0.2)}
.warn{background:rgba(139,0,0,0.2);border:2px solid var(--red);border-radius:8px;padding:15px;text-align:center;margin:10px 0}
.warn h3{color:#e74c3c;margin-bottom:5px}
.secret-box{background:rgba(155,89,182,0.15);border:2px solid #9b59b6;border-radius:8px;padding:15px;text-align:center;margin:10px 0}
.secret-box h4{color:#9b59b6;margin-bottom:5px}
.alibi{background:rgba(52,152,219,0.1);border-left:3px solid #3498db;padding:10px;margin:8px 0;border-radius:0 6px 6px 0}
.alibi h4{color:#3498db;margin-bottom:5px;font-size:0.9em}
.alibi .truth{background:rgba(231,76,60,0.2);color:#e74c3c;padding:8px;border-radius:4px;margin-top:8px;font-weight:bold;font-size:0.85em}
.murder-story{background:rgba(139,0,0,0.1);border-radius:6px;padding:12px;white-space:pre-line;line-height:1.6;font-size:0.85em;max-height:250px;overflow-y:auto}
.phase-box{text-align:center;padding:20px;background:linear-gradient(135deg,rgba(139,0,0,0.2),transparent);border:2px solid var(--red);border-radius:10px;margin:10px 0}
.phase-box h2{color:#e74c3c}
.phase-box .timer{font-size:2.5em;color:var(--gold);font-family:monospace;margin:10px 0}
.tabs{display:flex;border-bottom:2px solid #333;margin-bottom:10px}
.tab{flex:1;padding:10px;text-align:center;color:var(--txt2);cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-2px;font-size:0.9em}
.tab:hover{color:var(--txt)}
.tab.active{color:var(--gold);border-color:var(--gold)}
.messages{max-height:200px;overflow-y:auto;background:#0a0a0a;border-radius:6px;padding:8px}
.msg{background:var(--bg2);padding:8px;margin:5px 0;border-radius:6px;font-size:0.85em}
.msg.mj{background:rgba(201,162,39,0.1);border-left:3px solid var(--gold)}
.msg .from{color:var(--gold);font-weight:bold}
.msg .time{color:var(--txt2);font-size:0.75em;margin-left:8px}
.msg-input{display:flex;gap:8px;margin-top:10px}
.msg-input input{flex:1}
.vote-card{display:flex;align-items:center;gap:12px;padding:12px;background:var(--bg2);border:2px solid #333;border-radius:10px;margin:8px 0;cursor:pointer;transition:all 0.2s}
.vote-card:hover{border-color:var(--gold)}
.vote-card.sel{border-color:var(--gold);background:rgba(201,162,39,0.15)}
.vote-card .icon{font-size:2em}
.vote-card .name{color:var(--gold);font-weight:bold;font-size:1.1em}
.victory{padding:25px;border-radius:12px;text-align:center;margin:15px 0}
.victory.win{background:rgba(46,204,113,0.2);border:2px solid #2ecc71}
.victory.lose{background:rgba(139,0,0,0.2);border:2px solid var(--red)}
.victory .big{font-size:3em;margin:10px 0}
.story{font-size:1.3em;line-height:1.8;max-width:400px}
.story.gold{color:var(--gold)}
.story.danger{color:#e74c3c}
.prog{width:150px;height:4px;background:#333;border-radius:2px;overflow:hidden;margin-top:20px}
.prog-bar{height:100%;background:var(--gold);transition:width 0.3s}
.nav{position:fixed;bottom:0;left:0;right:0;background:var(--bg);border-top:2px solid #333;display:flex;padding:8px 0}
.nav-btn{flex:1;background:none;border:none;color:var(--txt2);font-size:0.65em;padding:5px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:2px}
.nav-btn.active{color:var(--gold)}
.nav-btn .ic{font-size:1.2em}
.reveal{display:flex;align-items:center;gap:10px;padding:8px;border-bottom:1px solid #333}
.reveal .av{width:30px;height:30px;background:#333;border-radius:50%;display:flex;align-items:center;justify-content:center}
.killer-tag{color:#e74c3c;font-weight:bold;font-size:0.8em}
.notes-area textarea{background:#0a0a0a;border:2px solid #333;border-radius:6px;min-height:120px;resize:none}
.kill-btn{background:linear-gradient(135deg,#c0392b,#8b0000);color:#fff;animation:pulse 1.5s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}
.dead-ov{position:fixed;inset:0;background:rgba(0,0,0,0.95);display:none;flex-direction:column;align-items:center;justify-content:center;z-index:1000}
.dead-ov h1{color:#c0392b;font-size:2em}
.conn{position:fixed;top:8px;right:8px;padding:5px 10px;border-radius:10px;font-size:0.7em;z-index:100}
.conn.on{background:rgba(46,204,113,0.2);color:#2ecc71}
.conn.off{background:rgba(231,76,60,0.2);color:#e74c3c}
.container{max-width:500px;margin:0 auto;padding-bottom:100px}
@media(max-width:400px){.grid3{grid-template-columns:1fr 1fr}.role-btn{padding:20px}}
</style>
</head>
<body>
<div class="conn off" id="conn">Connexion...</div>
<div class="dead-ov" id="deadOv"><h1>ELIMINE(E)</h1><p style="color:var(--txt2);margin-top:15px">Vous pouvez encore voter!</p></div>

<!-- ACCUEIL -->
<div class="screen active" id="s0">
<div class="center">
<h1 style="font-size:2em;margin-bottom:5px">MURDER PARTY</h1>
<p style="color:var(--txt2);margin-bottom:40px">Jeu d'enquete et de deduction</p>
<div class="grid2" style="max-width:350px;width:100%">
<div class="role-btn" onclick="selectRole('host')">
<div class="icon">🖥️</div>
<h2>MAITRE DU JEU</h2>
<p style="color:var(--txt2);font-size:0.8em;margin-top:5px">Creer une partie</p>
</div>
<div class="role-btn" onclick="selectRole('player')">
<div class="icon">📱</div>
<h2>JOUEUR</h2>
<p style="color:var(--txt2);font-size:0.8em;margin-top:5px">Rejoindre</p>
</div>
</div>
</div>
</div>

<!-- HOST: CHOIX MODE -->
<div class="screen" id="h0">
<div class="header"><h1>Choisir le mode</h1></div>
<div class="container">
<div class="grid3" style="margin:20px 0">
<div class="mode-card" onclick="selectMode('scenario')" id="mScenario">
<div class="icon">🎭</div>
<h3>SCENARIO</h3>
</div>
<div class="mode-card" onclick="selectMode('cluedo')" id="mCluedo">
<div class="icon">🔍</div>
<h3>CLUEDO</h3>
</div>
<div class="mode-card" onclick="selectMode('survie')" id="mSurvie">
<div class="icon">☠️</div>
<h3>SURVIE</h3>
</div>
</div>
<button class="btn" onclick="goToConfig()" id="btnGoConfig" disabled>Continuer</button>
</div>
</div>

<!-- HOST: CONFIG -->
<div class="screen" id="h1">
<div class="header"><h1 id="configTitle">Configuration</h1></div>
<div class="container">
<div class="card">
<h3>Nombre de joueurs</h3>
<input type="number" id="inputPlayers" value="5" min="3" max="10">
</div>
<div class="card">
<h3>Pieces (<span id="roomCount">0</span>)</h3>
<div class="grid2" style="margin-bottom:10px">
<input type="number" id="inputRooms" value="6" min="3" max="10">
<button class="btn btn-s btn-sm" onclick="generateRooms()">Generer</button>
</div>
<div id="roomsList"></div>
</div>
<div class="card">
<h3>Apercu du plan</h3>
<div class="map-box" id="mapPreview" style="height:180px"></div>
</div>
<button class="btn" onclick="createGame()">Creer la partie</button>
</div>
</div>

<!-- HOST: LOBBY -->
<div class="screen" id="h2">
<div class="header">
<h1 id="lobbyTitle">En attente</h1>
<div class="code" id="gameCode">-----</div>
</div>
<div class="container">
<div class="card">
<h3>Lien de la partie</h3>
<p style="word-break:break-all;background:#111;padding:10px;border-radius:6px;font-size:0.85em;color:var(--gold)" id="gameUrl">-</p>
<button class="btn btn-s" onclick="copyLink()" style="margin-top:8px">Copier le lien</button>
</div>
<div class="card">
<h3>Joueurs (<span id="playerCount">0</span>/<span id="playerTotal">5</span>)</h3>
<div id="playerSlots"></div>
</div>
<button class="btn" onclick="startGame()" id="btnStart" disabled>Lancer la partie</button>
</div>
</div>

<!-- HOST: STORY -->
<div class="screen" id="h3">
<div class="center">
<div class="story" id="hostStory"></div>
<div class="prog"><div class="prog-bar" id="hostProg"></div></div>
</div>
</div>

<!-- HOST: GAME -->
<div class="screen" id="h4">
<div class="header"><h1 id="hostPhaseTitle">Phase 1</h1></div>
<div class="container">
<div class="phase-box">
<h2 id="hostPhaseName">Enquete</h2>
<div class="timer" id="hostTimer">08:00</div>
<p style="color:var(--txt2)" id="hostPhaseObj"></p>
</div>
<div class="tabs">
<div class="tab active" onclick="hostTab('players')" data-ht="players">Joueurs</div>
<div class="tab" onclick="hostTab('messages')" data-ht="messages">Messages</div>
</div>
<div id="hostTabContent"></div>
<div class="grid2" style="margin-top:15px">
<button class="btn btn-s" onclick="nextPhase()">Phase suivante</button>
<button class="btn" onclick="forceVote()">Lancer le vote</button>
</div>
</div>
</div>

<!-- HOST: FIN -->
<div class="screen" id="h5">
<div class="header"><h1 id="hostEndTitle">Fin de partie</h1></div>
<div class="container">
<div id="hostEndResult"></div>
<div class="card">
<h3>Revelations</h3>
<div id="hostReveals"></div>
</div>
<button class="btn" onclick="location.reload()">Nouvelle partie</button>
</div>
</div>

<!-- PLAYER: JOIN -->
<div class="screen" id="p0">
<div class="center">
<h1>Rejoindre une partie</h1>
<div style="width:100%;max-width:350px">
<div class="card">
<label style="color:var(--gold)">Code de la partie</label>
<input type="text" id="inputCode" placeholder="XXXXX" maxlength="5" style="text-transform:uppercase;text-align:center;font-size:1.5em;letter-spacing:0.2em">
<label style="color:var(--gold);margin-top:15px">Ton prenom</label>
<input type="text" id="inputName" placeholder="Prenom">
<label style="color:var(--gold);margin-top:15px">Ton icone</label>
<div class="icons" id="iconPicker"></div>
<button class="btn" onclick="joinGame()" style="margin-top:15px">Rejoindre</button>
</div>
</div>
</div>
</div>

<!-- PLAYER: WAIT -->
<div class="screen" id="p1">
<div class="header"><h1>En attente du lancement</h1></div>
<div class="container">
<div class="card" style="text-align:center">
<div style="font-size:3em" id="myIcon">👤</div>
<p style="margin-top:10px">Bienvenue <strong style="color:var(--gold)" id="myName"></strong></p>
</div>
<div class="card">
<h3>Joueurs connectes</h3>
<div id="waitList"></div>
</div>
</div>
</div>

<!-- PLAYER: STORY -->
<div class="screen" id="p2">
<div class="center">
<div class="story" id="playerStory"></div>
<div class="prog"><div class="prog-bar" id="playerProg"></div></div>
</div>
</div>

<!-- PLAYER: ROLE -->
<div class="screen" id="p3">
<div class="header"><h1>Votre role</h1></div>
<div class="container" id="roleContent"></div>
</div>

<!-- PLAYER: GAME -->
<div class="screen" id="p4">
<div class="header">
<h1 id="playerPhaseTitle">Phase 1</h1>
<p style="color:var(--txt2);font-size:0.85em" id="playerPhaseObj"></p>
</div>
<div class="container" id="playerContent"></div>
<nav class="nav">
<button class="nav-btn active" onclick="playerTab('mission')" data-pt="mission"><span class="ic">🎯</span>Mission</button>
<button class="nav-btn" onclick="playerTab('info')" data-pt="info"><span class="ic">📋</span>Infos</button>
<button class="nav-btn" onclick="playerTab('map')" data-pt="map"><span class="ic">🗺️</span>Plan</button>
<button class="nav-btn" onclick="playerTab('notes')" data-pt="notes"><span class="ic">📝</span>Notes</button>
<button class="nav-btn" onclick="playerTab('chat')" data-pt="chat"><span class="ic">💬</span>Chat</button>
</nav>
</div>

<!-- PLAYER: VOTE -->
<div class="screen" id="p5">
<div class="header"><h1>Vote final</h1></div>
<div class="container" id="voteContent"></div>
</div>

<!-- PLAYER: FIN -->
<div class="screen" id="p6">
<div class="header"><h1 id="playerEndTitle">Fin de partie</h1></div>
<div class="container"><div id="playerEndResult"></div><button class="btn" onclick="location.reload()">Rejouer</button></div>
</div>

<script>
// === VARIABLES ===
var ws = null;
var role = null;
var myId = null;
var myName = '';
var myIcon = '👤';
var gameMode = null;
var gameRooms = [];
var gameConns = [];
var myData = null;
var allPlayers = [];
var scenario = null;
var messages = [];
var curTab = 'mission';
var hostCurTab = 'players';
var voted = false;
var selVote = null;
var canKill = false;
var isDead = false;
var myNotes = '';
var myRoom = null;

var ICONS = ['👤','🕵️','💼','🎤','💔','📰','💰','⚕️','👑','🎭','🎩','👓'];
var ROOM_ICONS = ['🚪','🛋️','📚','🍽️','👨‍🍳','🌿','🍸','🛏️'];
var DEFAULT_ROOMS = [
    {id:'hall',name:'Hall',icon:'🚪'},
    {id:'salon',name:'Salon',icon:'🛋️'},
    {id:'bar',name:'Bar',icon:'🍸'},
    {id:'salle',name:'Salle a manger',icon:'🍽️'},
    {id:'cuisine',name:'Cuisine',icon:'👨‍🍳'},
    {id:'biblio',name:'Bibliotheque',icon:'📚'},
    {id:'bureau',name:'Bureau',icon:'💼'},
    {id:'jardin',name:'Jardin',icon:'🌿'}
];

// === UTILS ===
function $(id) { return document.getElementById(id); }
function show(id) {
    var screens = document.querySelectorAll('.screen');
    for (var i = 0; i < screens.length; i++) {
        screens[i].classList.remove('active');
    }
    $(id).classList.add('active');
}
function formatTime(s) {
    var m = Math.floor(s / 60);
    var sec = s % 60;
    return (m < 10 ? '0' : '') + m + ':' + (sec < 10 ? '0' : '') + sec;
}
function copyLink() {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(location.href);
        alert('Lien copie!');
    }
}

// === WEBSOCKET ===
function connect() {
    var proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
    ws = new WebSocket(proto + '//' + location.host);
    ws.onopen = function() {
        $('conn').className = 'conn on';
        $('conn').textContent = 'Connecte';
    };
    ws.onclose = function() {
        $('conn').className = 'conn off';
        $('conn').textContent = 'Deconnecte';
        setTimeout(connect, 2000);
    };
    ws.onmessage = function(e) {
        handleMessage(JSON.parse(e.data));
    };
}

function send(type, data) {
    if (ws && ws.readyState === 1) {
        var msg = {type: type};
        if (data) {
            for (var k in data) msg[k] = data[k];
        }
        ws.send(JSON.stringify(msg));
    }
}

function handleMessage(m) {
    console.log('Received:', m.type, m);
    
    if (m.type === 'created') {
        $('gameCode').textContent = m.code;
        $('gameUrl').textContent = location.href;
        $('playerTotal').textContent = m.numPlayers;
        $('lobbyTitle').textContent = m.mode === 'scenario' ? 'Scenario' : m.mode === 'cluedo' ? 'Cluedo' : 'Survie';
        gameRooms = m.rooms || [];
        gameConns = m.connections || [];
        updateSlots([], m.numPlayers);
        show('h2');
    }
    
    if (m.type === 'joined') {
        myId = m.id;
        gameMode = m.mode;
        $('myName').textContent = myName;
        $('myIcon').textContent = myIcon;
        show('p1');
    }
    
    if (m.type === 'error') {
        alert(m.msg);
    }
    
    if (m.type === 'player_joined') {
        allPlayers = m.players;
        $('playerCount').textContent = m.count;
        updateSlots(m.players, m.total);
        $('btnStart').disabled = m.count < 2;
        var html = '';
        for (var i = 0; i < m.players.length; i++) {
            var p = m.players[i];
            html += '<div class="slot on"><div class="av">' + p.icon + '</div><div class="name">' + p.name + '</div></div>';
        }
        $('waitList').innerHTML = html;
    }
    
    if (m.type === 'story_start') {
        show(role === 'host' ? 'h3' : 'p2');
    }
    
    if (m.type === 'story') {
        var el = $(role === 'host' ? 'hostStory' : 'playerStory');
        el.textContent = m.text;
        el.className = 'story' + (m.hl ? ' ' + m.hl : '');
        $(role === 'host' ? 'hostProg' : 'playerProg').style.width = ((m.i + 1) / m.total * 100) + '%';
    }
    
    if (m.type === 'role') {
        myData = m;
        scenario = m.scenario;
        gameRooms = m.rooms || [];
        gameConns = m.connections || [];
        myRoom = gameRooms.length > 0 ? gameRooms[0].id : null;
        showRoleScreen();
    }
    
    if (m.type === 'roles_distributed') {
        allPlayers = m.players;
        scenario = m.scenario;
        gameRooms = m.rooms || [];
        gameConns = m.connections || [];
        updateHostTab();
    }
    
    if (m.type === 'phase') {
        canKill = m.canKill && myData && myData.isKiller;
        if (role === 'host') {
            show('h4');
            $('hostPhaseTitle').textContent = 'Phase ' + m.phase;
            $('hostPhaseName').textContent = m.name;
            $('hostTimer').textContent = formatTime(m.duration);
            $('hostPhaseObj').textContent = m.obj;
        } else {
            show('p4');
            $('playerPhaseTitle').textContent = 'Phase ' + m.phase;
            $('playerPhaseObj').textContent = m.obj;
            updatePlayerTab();
        }
    }
    
    if (m.type === 'timer') {
        $('hostTimer').textContent = formatTime(m.t);
    }
    
    if (m.type === 'voting') {
        allPlayers = m.players;
        if (role === 'host') {
            $('hostPhaseTitle').textContent = 'VOTE FINAL';
            $('hostPhaseName').textContent = 'Qui est le coupable?';
            $('hostTimer').textContent = '--:--';
        } else {
            showVoteScreen();
        }
    }
    
    if (m.type === 'message') {
        messages.push(m.message);
        if (role === 'host') updateHostTab();
        else updatePlayerTab();
    }
    
    if (m.type === 'can_kill') {
        canKill = m.enabled;
        updatePlayerTab();
    }
    
    if (m.type === 'player_killed') {
        for (var i = 0; i < allPlayers.length; i++) {
            if (allPlayers[i].id === m.victimId) {
                allPlayers[i].isDead = true;
            }
        }
        updateHostTab();
    }
    
    if (m.type === 'you_died') {
        isDead = true;
        $('deadOv').style.display = 'flex';
        setTimeout(function() {
            $('deadOv').style.display = 'none';
        }, 3000);
    }
    
    if (m.type === 'end') {
        showEndScreen(m);
    }
}

// === ROLE SELECTION ===
function selectRole(r) {
    role = r;
    if (r === 'host') {
        show('h0');
    } else {
        initIconPicker();
        show('p0');
    }
}

function initIconPicker() {
    var html = '';
    for (var i = 0; i < ICONS.length; i++) {
        html += '<div class="ic-opt' + (i === 0 ? ' sel' : '') + '" onclick="pickIcon(this, \'' + ICONS[i] + '\')">' + ICONS[i] + '</div>';
    }
    $('iconPicker').innerHTML = html;
}

function pickIcon(el, icon) {
    var opts = document.querySelectorAll('#iconPicker .ic-opt');
    for (var i = 0; i < opts.length; i++) opts[i].classList.remove('sel');
    el.classList.add('sel');
    myIcon = icon;
}

// === HOST: MODE SELECTION ===
function selectMode(mode) {
    gameMode = mode;
    $('mScenario').classList.remove('sel');
    $('mCluedo').classList.remove('sel');
    $('mSurvie').classList.remove('sel');
    $('m' + mode.charAt(0).toUpperCase() + mode.slice(1)).classList.add('sel');
    $('btnGoConfig').disabled = false;
}

function goToConfig() {
    if (!gameMode) return;
    $('configTitle').textContent = 'Configuration ' + gameMode;
    generateRooms();
    show('h1');
}

// === HOST: ROOM CONFIG ===
function generateRooms() {
    var num = parseInt($('inputRooms').value) || 6;
    if (num < 3) num = 3;
    if (num > 10) num = 10;
    
    gameRooms = [];
    for (var i = 0; i < num; i++) {
        var def = DEFAULT_ROOMS[i] || {id: 'room' + i, name: 'Piece ' + (i + 1), icon: '🚪'};
        gameRooms.push({
            id: def.id,
            name: def.name,
            icon: def.icon,
            x: 15 + (i % 3) * 90,
            y: 10 + Math.floor(i / 3) * 55
        });
    }
    
    // Generate connections
    gameConns = [];
    for (var i = 0; i < gameRooms.length; i++) {
        if (i + 1 < gameRooms.length && (i + 1) % 3 !== 0) {
            gameConns.push([gameRooms[i].id, gameRooms[i + 1].id]);
        }
        if (i + 3 < gameRooms.length) {
            gameConns.push([gameRooms[i].id, gameRooms[i + 3].id]);
        }
    }
    
    renderRoomList();
    renderMap('mapPreview');
}

function renderRoomList() {
    $('roomCount').textContent = gameRooms.length;
    var html = '';
    for (var i = 0; i < gameRooms.length; i++) {
        html += '<div class="room-row">' +
            '<input value="' + gameRooms[i].name + '" onchange="updateRoomName(' + i + ', this.value)">' +
            '<div class="room-icon" onclick="cycleRoomIcon(' + i + ')">' + gameRooms[i].icon + '</div>' +
            '</div>';
    }
    $('roomsList').innerHTML = html;
}

function updateRoomName(index, name) {
    gameRooms[index].name = name;
    renderMap('mapPreview');
}

function cycleRoomIcon(index) {
    var currentIdx = ROOM_ICONS.indexOf(gameRooms[index].icon);
    gameRooms[index].icon = ROOM_ICONS[(currentIdx + 1) % ROOM_ICONS.length];
    renderRoomList();
    renderMap('mapPreview');
}

function renderMap(containerId) {
    var container = $(containerId);
    if (!container) return;
    
    var html = '<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none" viewBox="0 0 280 170">';
    html += '<defs><marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#8b6914"/></marker></defs>';
    
    for (var i = 0; i < gameConns.length; i++) {
        var conn = gameConns[i];
        var roomA = null, roomB = null;
        for (var j = 0; j < gameRooms.length; j++) {
            if (gameRooms[j].id === conn[0]) roomA = gameRooms[j];
            if (gameRooms[j].id === conn[1]) roomB = gameRooms[j];
        }
        if (roomA && roomB) {
            html += '<line x1="' + (roomA.x + 28) + '" y1="' + (roomA.y + 18) + '" x2="' + (roomB.x + 28) + '" y2="' + (roomB.y + 18) + '" stroke="#8b6914" stroke-width="2" stroke-dasharray="4,3" marker-end="url(#arr)"/>';
        }
    }
    html += '</svg>';
    
    for (var i = 0; i < gameRooms.length; i++) {
        var r = gameRooms[i];
        var isHere = myRoom === r.id;
        html += '<div class="map-room' + (isHere ? ' here' : '') + '" style="left:' + r.x + 'px;top:' + r.y + 'px" onclick="moveToRoom(\'' + r.id + '\')">' +
            '<div class="ri">' + r.icon + '</div>' +
            '<div>' + r.name + '</div>' +
            '</div>';
    }
    
    container.innerHTML = html;
}

// === HOST: CREATE GAME ===
function createGame() {
    send('create', {
        mode: gameMode,
        numPlayers: parseInt($('inputPlayers').value) || 5,
        rooms: gameRooms,
        connections: gameConns
    });
}

function updateSlots(players, total) {
    var html = '';
    for (var i = 0; i < total; i++) {
        var p = players[i];
        if (p) {
            html += '<div class="slot on"><div class="av">' + p.icon + '</div><div class="name">' + p.name + '</div></div>';
        } else {
            html += '<div class="slot"><div class="av" style="opacity:0.3">?</div><div class="name" style="color:var(--txt2)">En attente...</div></div>';
        }
    }
    $('playerSlots').innerHTML = html;
}

function startGame() {
    send('start');
}

function nextPhase() {
    send('next_phase');
}

function forceVote() {
    send('start_vote');
}

// === HOST: TABS ===
function hostTab(tab) {
    hostCurTab = tab;
    var tabs = document.querySelectorAll('[data-ht]');
    for (var i = 0; i < tabs.length; i++) tabs[i].classList.remove('active');
    document.querySelector('[data-ht="' + tab + '"]').classList.add('active');
    updateHostTab();
}

function updateHostTab() {
    var html = '';
    
    if (hostCurTab === 'players') {
        for (var i = 0; i < allPlayers.length; i++) {
            var p = allPlayers[i];
            html += '<div class="slot ' + (p.isDead ? 'dead' : 'on') + '">' +
                '<div class="av">' + p.icon + '</div>' +
                '<div style="flex:1">' +
                '<div class="name">' + p.name + (p.isKiller ? ' <span style="color:#e74c3c">[TUEUR]</span>' : '') + (p.isDead ? ' [MORT]' : '') + '</div>' +
                '<div class="sub">' + (p.secret ? p.secret.text : '') + '</div>' +
                '</div></div>';
        }
    } else if (hostCurTab === 'messages') {
        html = '<div class="messages">';
        for (var i = 0; i < messages.length; i++) {
            var m = messages[i];
            html += '<div class="msg ' + (m.from === 'MJ' ? 'mj' : '') + '">' +
                '<span class="from">' + m.from + '</span><span class="time">' + m.time + '</span>' +
                '<div>' + m.text + '</div></div>';
        }
        html += '</div>';
        html += '<div class="msg-input">' +
            '<select id="msgTo"><option value="all">Tous</option>';
        for (var i = 0; i < allPlayers.length; i++) {
            html += '<option value="' + allPlayers[i].id + '">' + allPlayers[i].name + '</option>';
        }
        html += '</select>' +
            '<input id="msgText" placeholder="Message...">' +
            '<button class="btn btn-sm" onclick="sendHostMessage()">OK</button></div>';
    }
    
    $('hostTabContent').innerHTML = html;
}

function sendHostMessage() {
    var to = $('msgTo').value;
    var text = $('msgText').value.trim();
    if (!text) return;
    send('send_message', {to: to, text: text});
    $('msgText').value = '';
}

// === PLAYER: JOIN ===
function joinGame() {
    var code = $('inputCode').value.toUpperCase().trim();
    myName = $('inputName').value.trim();
    if (!code || code.length < 4) {
        alert('Entrez le code!');
        return;
    }
    if (!myName) {
        alert('Entrez votre prenom!');
        return;
    }
    send('join', {code: code, name: myName, icon: myIcon});
}

// === PLAYER: ROLE ===
function showRoleScreen() {
    show('p3');
    var html = '';
    
    html += '<div class="card" style="text-align:center">' +
        '<div style="font-size:3em">' + myData.icon + '</div>' +
        '<div style="font-size:1.3em;color:var(--gold);margin-top:8px">' + myData.name + '</div>' +
        '</div>';
    
    if (myData.isKiller && scenario) {
        html += '<div class="warn">' +
            '<h3>VOUS ETES LE MEURTRIER!</h3>' +
            '<p style="margin:8px 0"><strong>' + scenario.name + '</strong></p>' +
            '<p>' + scenario.summary + '</p>' +
            '</div>';
        html += '<div class="card"><h3>Deroulement du meurtre</h3>' +
            '<div class="murder-story">' + scenario.details + '</div></div>';
        if (scenario.tips) {
            html += '<div class="card"><h3>Conseils</h3><ul style="margin-left:20px">';
            for (var i = 0; i < scenario.tips.length; i++) {
                html += '<li style="margin:5px 0">' + scenario.tips[i] + '</li>';
            }
            html += '</ul></div>';
        }
    }
    
    if (myData.secret) {
        html += '<div class="secret-box">' +
            '<h4>Votre secret</h4>' +
            '<p>' + myData.secret.text + '</p>' +
            (myData.secret.hasMotive ? '<p style="color:#e74c3c;margin-top:8px;font-weight:bold">Vous avez un MOBILE!</p>' : '') +
            '</div>';
    }
    
    if (myData.alibis) {
        html += '<div class="card"><h3>Vos alibis</h3>';
        var phases = ['phase1', 'phase2', 'phase3'];
        var times = ['21h-22h', '22h-22h30', '22h30-23h'];
        for (var i = 0; i < phases.length; i++) {
            var a = myData.alibis[phases[i]];
            if (a) {
                html += '<div class="alibi">' +
                    '<h4>Phase ' + (i + 1) + ' (' + times[i] + ')</h4>' +
                    '<div>Lieu: ' + a.location + '</div>' +
                    '<div>Action: ' + a.action + '</div>' +
                    '<div>Temoins: ' + a.witnesses + '</div>' +
                    (myData.isKiller && a.truth ? '<div class="truth">REALITE: ' + a.truth + '</div>' : '') +
                    '</div>';
            }
        }
        html += '</div>';
    }
    
    html += '<button class="btn" onclick="confirmRole()">J\'ai compris mon role</button>';
    
    $('roleContent').innerHTML = html;
}

function confirmRole() {
    show('p4');
    updatePlayerTab();
}

// === PLAYER: TABS ===
function playerTab(tab) {
    curTab = tab;
    var btns = document.querySelectorAll('[data-pt]');
    for (var i = 0; i < btns.length; i++) btns[i].classList.remove('active');
    document.querySelector('[data-pt="' + tab + '"]').classList.add('active');
    updatePlayerTab();
}

function updatePlayerTab() {
    var html = '';
    
    if (curTab === 'mission') {
        html += '<div class="card" style="text-align:center">' +
            '<h3>Votre mission</h3>' +
            '<p style="font-size:1.1em;margin-top:8px">' + (myData && myData.isKiller ? 'Survivez sans vous faire demasquer!' : 'Trouvez le meurtrier!') + '</p>' +
            '</div>';
        
        if (isDead) {
            html += '<div class="warn"><h3>VOUS ETES MORT(E)</h3><p>Vous pouvez encore voter!</p></div>';
        }
        
        if (myData && myData.isKiller) {
            html += '<div class="warn"><h3>Vous etes le tueur</h3><p>Mentez, accusez les autres!</p></div>';
            if (canKill) {
                html += '<div class="card"><h3>ELIMINER UN JOUEUR</h3>';
                for (var i = 0; i < allPlayers.length; i++) {
                    var p = allPlayers[i];
                    if (p.id !== myId && !p.isDead) {
                        html += '<button class="btn kill-btn" onclick="killPlayer(\'' + p.id + '\')" style="margin:5px 0">' + p.name + '</button>';
                    }
                }
                html += '</div>';
            }
        }
        
    } else if (curTab === 'info') {
        html += '<div class="card"><h3>Fiche enquete</h3>';
        if (myData && myData.alibis) {
            var phases = ['phase1', 'phase2', 'phase3'];
            for (var i = 0; i < phases.length; i++) {
                var a = myData.alibis[phases[i]];
                if (a) {
                    html += '<div class="alibi">' +
                        '<h4>Phase ' + (i + 1) + '</h4>' +
                        '<div>' + a.location + ' - ' + a.action + '</div>' +
                        '<div>Temoins: ' + a.witnesses + '</div>' +
                        (myData.isKiller && a.truth ? '<div class="truth">' + a.truth + '</div>' : '') +
                        '</div>';
                }
            }
        }
        if (myData && myData.secret) {
            html += '<div class="secret-box"><h4>Mon secret</h4><p>' + myData.secret.text + '</p></div>';
        }
        html += '</div>';
        
        html += '<div class="card"><h3>Autres joueurs</h3>';
        for (var i = 0; i < allPlayers.length; i++) {
            var p = allPlayers[i];
            if (p.id !== myId) {
                html += '<div class="slot ' + (p.isDead ? 'dead' : 'on') + '">' +
                    '<div class="av">' + p.icon + '</div>' +
                    '<div class="name">' + p.name + (p.isDead ? ' [MORT]' : '') + '</div>' +
                    '</div>';
            }
        }
        html += '</div>';
        
    } else if (curTab === 'map') {
        html += '<div class="card"><h3>Plan des lieux</h3>' +
            '<p style="color:var(--txt2);font-size:0.85em;margin-bottom:10px">Cliquez pour vous deplacer</p>' +
            '<div class="map-box" id="playerMap" style="height:170px"></div></div>';
        
    } else if (curTab === 'notes') {
        html += '<div class="card"><h3>Mes notes</h3>' +
            '<div class="notes-area"><textarea id="notesArea" placeholder="Notez vos observations..." onchange="myNotes=this.value">' + myNotes + '</textarea></div>' +
            '</div>';
        
    } else if (curTab === 'chat') {
        html += '<div class="card"><h3>Messages</h3>';
        html += '<div class="messages">';
        if (messages.length === 0) {
            html += '<p style="color:var(--txt2);text-align:center;padding:20px">Aucun message</p>';
        } else {
            for (var i = 0; i < messages.length; i++) {
                var m = messages[i];
                html += '<div class="msg ' + (m.from === 'MJ' ? 'mj' : '') + '">' +
                    '<span class="from">' + m.from + '</span><span class="time">' + m.time + '</span>' +
                    '<div>' + m.text + '</div></div>';
            }
        }
        html += '</div>';
        html += '<div class="msg-input">' +
            '<select id="pMsgTo"><option value="all">Tous</option>';
        for (var i = 0; i < allPlayers.length; i++) {
            if (allPlayers[i].id !== myId) {
                html += '<option value="' + allPlayers[i].id + '">' + allPlayers[i].name + '</option>';
            }
        }
        html += '</select>' +
            '<input id="pMsgText" placeholder="Message...">' +
            '<button class="btn btn-sm" onclick="sendPlayerMessage()">OK</button></div></div>';
    }
    
    $('playerContent').innerHTML = html;
    
    if (curTab === 'map') {
        setTimeout(function() { renderMap('playerMap'); }, 10);
    }
}

function moveToRoom(roomId) {
    myRoom = roomId;
    send('move_room', {roomId: roomId});
    updatePlayerTab();
}

function sendPlayerMessage() {
    var to = $('pMsgTo').value;
    var text = $('pMsgText').value.trim();
    if (!text) return;
    send('send_message', {to: to, text: text});
    $('pMsgText').value = '';
}

function killPlayer(id) {
    if (confirm('Eliminer ce joueur?')) {
        send('kill_player', {victimId: id});
    }
}

// === VOTE ===
function showVoteScreen() {
    show('p5');
    var html = '';
    
    if (voted) {
        html = '<div class="victory win"><div class="big">✓</div><h2>Vote enregistre!</h2><p style="color:var(--txt2)">En attente des autres...</p></div>';
    } else {
        html += '<div class="card" style="text-align:center"><h3>Qui est le coupable?</h3><p style="color:var(--txt2)">Votez pour designer le meurtrier</p></div>';
        html += '<div class="card">';
        for (var i = 0; i < allPlayers.length; i++) {
            var p = allPlayers[i];
            if (!p.isDead && p.id !== myId) {
                html += '<div class="vote-card' + (selVote === p.id ? ' sel' : '') + '" onclick="selectVote(\'' + p.id + '\')">' +
                    '<div class="icon">' + p.icon + '</div>' +
                    '<div class="name">' + p.name + '</div>' +
                    '</div>';
            }
        }
        html += '</div>';
        html += '<button class="btn" onclick="confirmVote()"' + (selVote ? '' : ' disabled') + '>Confirmer mon vote</button>';
    }
    
    $('voteContent').innerHTML = html;
}

function selectVote(id) {
    selVote = id;
    showVoteScreen();
}

function confirmVote() {
    if (!selVote) return;
    send('vote', {target: selVote});
    voted = true;
    showVoteScreen();
}

// === END ===
function showEndScreen(m) {
    var win = m.win === 'investigators';
    
    if (role === 'host') {
        show('h5');
        $('hostEndTitle').textContent = win ? 'Victoire des enqueteurs!' : 'Le tueur gagne!';
        $('hostEndResult').innerHTML = '<div class="victory ' + (win ? 'win' : 'lose') + '">' +
            '<div class="big">' + (win ? '🎉' : '💀') + '</div>' +
            '<h2>' + (win ? 'Le meurtrier a ete demasque!' : 'Le meurtrier s\'est echappe...') + '</h2>' +
            '<p style="margin-top:10px">Coupable: <strong style="color:var(--gold)">' + m.killerName + '</strong></p>' +
            '</div>';
        
        var revHtml = '';
        for (var i = 0; i < m.reveals.length; i++) {
            var r = m.reveals[i];
            revHtml += '<div class="reveal">' +
                '<div class="av">' + r.icon + '</div>' +
                '<div><strong>' + r.name + '</strong>' +
                (r.isKiller ? ' <span class="killer-tag">[TUEUR]</span>' : '') +
                (r.isDead ? ' [MORT]' : '') +
                '<br><span style="color:var(--txt2);font-size:0.85em">' + (r.secret || '') + '</span></div>' +
                '</div>';
        }
        $('hostReveals').innerHTML = revHtml;
        
    } else {
        show('p6');
        var iWin = myData && myData.isKiller ? !win : win;
        $('playerEndTitle').textContent = iWin ? 'Victoire!' : 'Defaite...';
        $('playerEndResult').innerHTML = '<div class="victory ' + (iWin ? 'win' : 'lose') + '">' +
            '<div class="big">' + (iWin ? '🎉' : '💀') + '</div>' +
            '<h2>' + (myData && myData.isKiller ? (win ? 'Vous avez ete demasque...' : 'Vous vous etes echappe!') : (win ? 'Vous avez trouve le coupable!' : 'Le tueur s\'est echappe...')) + '</h2>' +
            '<p style="margin-top:10px">Le meurtrier etait: <strong style="color:var(--gold)">' + m.killerName + '</strong></p>' +
            '</div>';
    }
}

// === INIT ===
connect();
</script>
</body>
</html>`;

// === SERVER ===
const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(HTML);
});

const wss = new WebSocket.Server({ server });

// === DATA ===
const SCENARIOS = [
    {
        name: 'Le Poison au Bar',
        summary: 'Vous avez verse du poison dans son verre au bar.',
        details: '21h30 - Recupere le poison dans votre chambre\n21h45 - Descendu au bar, commande un whisky\n22h15 - Renverse votre verre = DIVERSION\n22h17 - VERSE LE POISON dans son verre\n22h25 - Il boit, grimace legerement\n22h30 - Il monte dans sa suite\n22h35 - Vous allez au salon (alibi)\n23h05 - Le cri, il est mort',
        alibis: {
            phase1: {location: 'Bar', action: 'Buvais un whisky', witnesses: 'Le barman', truth: 'Vous versiez le poison!'},
            phase2: {location: 'Salon', action: 'Discutais', witnesses: 'Plusieurs personnes', truth: 'Vous attendiez que ca agisse'},
            phase3: {location: 'Salon', action: 'Entendu le cri', witnesses: 'Tout le monde', truth: 'Vous saviez ce qui arrivait'}
        },
        tips: ['Ne niez JAMAIS etre alle au bar', 'Accusez quelqu\'un d\'autre', 'La fiole est dans votre chambre - DANGER']
    },
    {
        name: 'Le Dessert Empoisonne',
        summary: 'Vous avez empoisonne son fondant au chocolat en cuisine.',
        details: '21h00 - Reperage de la cuisine\n21h30 - Recupere le cyanure\n22h00 - Entre en cuisine "chercher du sel"\n22h05 - VERSE LE POISON sur son fondant\n22h20 - Il mange son dessert\n22h40 - Alle au fumoir\n23h05 - Le cri',
        alibis: {
            phase1: {location: 'Restaurant', action: 'Finissais de diner', witnesses: 'Le serveur', truth: 'Vous etiez en cuisine!'},
            phase2: {location: 'Fumoir', action: 'Fumais', witnesses: 'Personne?', truth: 'Alibi TRES fragile'},
            phase3: {location: 'Fumoir', action: 'Entendu le cri', witnesses: 'Personne', truth: 'Vous attendiez'}
        },
        tips: ['L\'assistant cuisine = DANGER', 'Niez etre alle en cuisine', 'Accusez le personnel']
    },
    {
        name: 'L\'Injection Mortelle',
        summary: 'Vous etes entre avec un passe vole et lui avez fait une injection.',
        details: '20h00 - Vole passe a la reception\n21h30 - Prepare la seringue\n22h00 - Au bar pour etre vu\n22h30 - Monte au 2e etage (escalier service)\n22h35 - INJECTION dans le cou\n22h40 - Sorti par le balcon\n22h50 - Retourne au salon',
        alibis: {
            phase1: {location: 'Bar', action: 'Au bar', witnesses: 'Le barman', truth: 'C\'etait AVANT le meurtre'},
            phase2: {location: 'Salon', action: 'Au salon', witnesses: '???', truth: 'MENSONGE - vous tuiez!'},
            phase3: {location: 'Salon', action: 'Lisais', witnesses: 'Quelques-uns', truth: 'Vous veniez de descendre'}
        },
        tips: ['Porte fermee de l\'interieur = mystere vous protege', 'Niez avoir un passe', 'Alibi phase 2 TRES FAIBLE']
    }
];

const INNOCENT_ALIBIS = {
    phase1: [
        {location: 'Bar', action: 'Buvait un verre', witnesses: 'Le barman'},
        {location: 'Salon', action: 'Lisait', witnesses: 'Personne'},
        {location: 'Restaurant', action: 'Finissait de diner', witnesses: 'Le serveur'},
        {location: 'Fumoir', action: 'Fumait', witnesses: 'Quelqu\'un peut-etre'}
    ],
    phase2: [
        {location: 'Bar', action: 'Autre verre', witnesses: 'Le barman'},
        {location: 'Couloir', action: 'Passait', witnesses: 'Quelqu\'un?'},
        {location: 'Salon', action: 'Discutait', witnesses: 'A verifier'}
    ],
    phase3: [
        {location: 'Bar', action: 'Toujours au bar', witnesses: 'Plusieurs personnes'},
        {location: 'Salon', action: 'Arrivait', witnesses: 'Les autres'},
        {location: 'Hall', action: 'Entendu le cri', witnesses: 'Receptionniste'}
    ]
};

const SECRETS = [
    {text: 'La victime vous faisait chanter', hasMotive: true},
    {text: 'Vous etes l\'amant(e) de sa femme', hasMotive: true},
    {text: 'Il a ruine votre pere', hasMotive: true},
    {text: 'Vous lui devez 100 000 euros', hasMotive: true},
    {text: 'Il avait des photos compromettantes', hasMotive: true},
    {text: 'Vous etes journaliste infiltre(e)', hasMotive: false},
    {text: 'Vous etes son enfant illegitime', hasMotive: true}
];

const STORIES = {
    scenario: [
        {text: 'La pluie tombe sur la cote...', delay: 2500},
        {text: 'Le Grand Hotel de l\'Aurore.', delay: 2500},
        {text: 'Ce soir, un diner reunit les proches.', delay: 2500},
        {text: 'Certains le detestent.', delay: 2000, hl: 'danger'},
        {text: 'A 22h30, il monte dans sa suite.', delay: 2000},
        {text: 'A 23h05, un cri.', delay: 2500},
        {text: 'Il est mort.', delay: 2500, hl: 'danger'},
        {text: 'L\'un de vous est le meurtrier.', delay: 2500, hl: 'gold'}
    ],
    cluedo: [
        {text: 'Le Manoir Tudor...', delay: 2500},
        {text: 'Les lumieres s\'eteignent!', delay: 2000},
        {text: 'Un corps git au sol.', delay: 2500, hl: 'danger'},
        {text: 'QUI? QUELLE ARME? OU?', delay: 2500, hl: 'gold'}
    ],
    survie: [
        {text: 'Le refuge isole...', delay: 2500},
        {text: 'Parmi vous, un traitre.', delay: 2500, hl: 'danger'},
        {text: 'Eliminez-le.', delay: 2500, hl: 'gold'}
    ]
};

const PHASES = {
    scenario: [
        {name: 'Decouverte', duration: 480, obj: 'Alibis 21h-22h'},
        {name: 'Interrogatoires', duration: 480, obj: 'Periode 22h-22h30'},
        {name: 'Revelations', duration: 480, obj: 'Secrets emergent...'},
        {name: 'Derniere chance', duration: 300, obj: 'LE TUEUR PEUT TUER!', canKill: true},
        {name: 'Deliberation', duration: 180, obj: 'Preparez votre vote'}
    ],
    cluedo: [
        {name: 'Investigation', duration: 480, obj: 'Explorez, cherchez'},
        {name: 'Accusations', duration: 480, obj: 'Faites vos hypotheses'},
        {name: 'Revelation', duration: 180, obj: 'Dernieres accusations'}
    ],
    survie: [
        {name: 'Jour 1', duration: 300, obj: 'Discussion'},
        {name: 'Vote 1', duration: 120, obj: 'Eliminez un suspect'},
        {name: 'Nuit', duration: 60, obj: 'Le tueur frappe...', canKill: true},
        {name: 'Jour 2', duration: 300, obj: 'Qui est mort?'},
        {name: 'Vote final', duration: 120, obj: 'Derniere chance'}
    ]
};

const games = new Map();

class Game {
    constructor(code, config, hostWs) {
        this.code = code;
        this.mode = config.mode || 'scenario';
        this.numPlayers = config.numPlayers || 5;
        this.rooms = config.rooms || [];
        this.connections = config.connections || [];
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
        if (this.hostWs && this.hostWs.readyState === 1) {
            this.hostWs.send(msg);
        }
        this.players.forEach(p => {
            if (p.ws && p.ws.readyState === 1) {
                p.ws.send(msg);
            }
        });
    }
    
    sendHost(type, data) {
        if (this.hostWs && this.hostWs.readyState === 1) {
            this.hostWs.send(JSON.stringify({type, ...data}));
        }
    }
    
    sendPlayer(id, type, data) {
        const p = this.players.get(id);
        if (p && p.ws && p.ws.readyState === 1) {
            p.ws.send(JSON.stringify({type, ...data}));
        }
    }
    
    sendMessage(fromId, toId, text) {
        const from = fromId === 'mj' ? {name: 'MJ', icon: '🎭'} : this.players.get(fromId);
        const msg = {
            from: from ? from.name : 'MJ',
            text: text,
            time: new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})
        };
        this.messages.push(msg);
        
        if (toId === 'all') {
            this.broadcast('message', {message: msg});
        } else {
            this.sendPlayer(toId, 'message', {message: msg});
            if (fromId !== 'mj') {
                this.sendPlayer(fromId, 'message', {message: msg});
            }
            this.sendHost('message', {message: msg});
        }
    }
    
    start() {
        if (this.started) return;
        this.started = true;
        
        // Choose scenario
        this.scenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
        
        // Choose killer
        const ids = Array.from(this.players.keys());
        this.killerId = ids[Math.floor(Math.random() * ids.length)];
        
        // Assign secrets
        const secrets = [...SECRETS].sort(() => Math.random() - 0.5);
        
        ids.forEach((id, i) => {
            const p = this.players.get(id);
            p.isKiller = (id === this.killerId);
            p.secret = secrets[i % secrets.length];
            p.room = this.rooms.length > 0 ? this.rooms[0].id : null;
            
            if (p.isKiller) {
                p.alibis = this.scenario.alibis;
            } else {
                p.alibis = {
                    phase1: INNOCENT_ALIBIS.phase1[Math.floor(Math.random() * INNOCENT_ALIBIS.phase1.length)],
                    phase2: INNOCENT_ALIBIS.phase2[Math.floor(Math.random() * INNOCENT_ALIBIS.phase2.length)],
                    phase3: INNOCENT_ALIBIS.phase3[Math.floor(Math.random() * INNOCENT_ALIBIS.phase3.length)]
                };
            }
        });
        
        console.log('[' + this.code + '] Started! Killer: ' + this.players.get(this.killerId).name);
        
        this.broadcast('game_starting', {mode: this.mode});
        setTimeout(() => this.playStory(), 1000);
    }
    
    playStory() {
        const story = STORIES[this.mode] || STORIES.scenario;
        let i = 0;
        
        const next = () => {
            if (i < story.length) {
                this.broadcast('story', {
                    text: story[i].text,
                    hl: story[i].hl,
                    i: i,
                    total: story.length
                });
                i++;
                setTimeout(next, story[i - 1].delay);
            } else {
                setTimeout(() => this.distributeRoles(), 2000);
            }
        };
        
        this.broadcast('story_start', {});
        next();
    }
    
    distributeRoles() {
        this.players.forEach((p, id) => {
            this.sendPlayer(id, 'role', {
                id: id,
                name: p.name,
                icon: p.icon,
                isKiller: p.isKiller,
                secret: p.secret,
                alibis: p.alibis,
                scenario: p.isKiller ? this.scenario : null,
                rooms: this.rooms,
                connections: this.connections,
                mode: this.mode
            });
        });
        
        this.sendHost('roles_distributed', {
            players: Array.from(this.players.entries()).map(([id, p]) => ({
                id: id,
                name: p.name,
                icon: p.icon,
                isKiller: p.isKiller,
                secret: p.secret
            })),
            scenario: this.scenario,
            rooms: this.rooms,
            connections: this.connections
        });
        
        setTimeout(() => this.startPhase(1), 15000);
    }
    
    startPhase(n) {
        const phases = PHASES[this.mode] || PHASES.scenario;
        if (n > phases.length) {
            this.startVoting();
            return;
        }
        
        this.phase = n;
        const ph = phases[n - 1];
        this.timeRemaining = ph.duration;
        this.canKill = !!ph.canKill;
        
        if (this.canKill) {
            this.sendPlayer(this.killerId, 'can_kill', {enabled: true});
        }
        
        // Send MJ message in phase 3
        if (this.mode === 'scenario' && n === 3) {
            setTimeout(() => {
                this.sendMessage('mj', 'all', 'INDICE: Quelqu\'un a ete vu pres du bar entre 22h15 et 22h20...');
            }, 30000);
        }
        
        this.broadcast('phase', {
            phase: n,
            name: ph.name,
            duration: ph.duration,
            obj: ph.obj,
            canKill: this.canKill
        });
        
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.timeRemaining--;
            if (this.timeRemaining <= 0) {
                clearInterval(this.timer);
                this.startPhase(n + 1);
            } else if (this.timeRemaining % 10 === 0 || this.timeRemaining <= 10) {
                this.broadcast('timer', {t: this.timeRemaining});
            }
        }, 1000);
    }
    
    killPlayer(victimId) {
        if (!this.canKill) return;
        if (this.deadPlayers.has(victimId)) return;
        if (victimId === this.killerId) return;
        
        this.deadPlayers.add(victimId);
        this.canKill = false;
        
        const victim = this.players.get(victimId);
        this.broadcast('player_killed', {victimId: victimId, victimName: victim ? victim.name : '?'});
        this.sendPlayer(victimId, 'you_died', {});
        this.sendPlayer(this.killerId, 'can_kill', {enabled: false});
        this.sendMessage('mj', 'all', (victim ? victim.name : 'Quelqu\'un') + ' a ete retrouve(e) mort(e)!');
    }
    
    startVoting() {
        if (this.timer) clearInterval(this.timer);
        this.phase = 99;
        this.votes.clear();
        this.canKill = false;
        
        const alivePlayers = Array.from(this.players.entries())
            .filter(([id]) => !this.deadPlayers.has(id))
            .map(([id, p]) => ({id: id, name: p.name, icon: p.icon}));
        
        this.broadcast('voting', {players: alivePlayers});
    }
    
    vote(oderId, targetId) {
        this.votes.set(oderId, targetId);
        
        if (this.votes.size >= this.players.size) {
            setTimeout(() => this.endGame(), 2000);
        }
    }
    
    endGame() {
        if (this.ended) return;
        this.ended = true;
        
        // Count votes
        const counts = new Map();
        this.votes.forEach(target => {
            counts.set(target, (counts.get(target) || 0) + 1);
        });
        
        let maxVotes = 0;
        let accusedId = null;
        counts.forEach((count, id) => {
            if (count > maxVotes) {
                maxVotes = count;
                accusedId = id;
            }
        });
        
        const killer = this.players.get(this.killerId);
        const win = accusedId === this.killerId;
        
        this.broadcast('end', {
            win: win ? 'investigators' : 'killer',
            killerId: this.killerId,
            killerName: killer ? killer.name : '?',
            accusedId: accusedId,
            scenario: this.scenario,
            reveals: Array.from(this.players.entries()).map(([id, p]) => ({
                id: id,
                name: p.name,
                icon: p.icon,
                isKiller: p.isKiller,
                secret: p.secret ? p.secret.text : null,
                isDead: this.deadPlayers.has(id)
            }))
        });
        
        console.log('[' + this.code + '] Ended! ' + (win ? 'Investigators win' : 'Killer wins'));
    }
}

function generateCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}

wss.on('connection', (ws) => {
    console.log('+ New connection');
    
    ws.on('message', (data) => {
        try {
            const m = JSON.parse(data);
            console.log('Received:', m.type);
            
            if (m.type === 'create') {
                const code = generateCode();
                const game = new Game(code, m, ws);
                games.set(code, game);
                ws.gameCode = code;
                ws.isHost = true;
                ws.send(JSON.stringify({
                    type: 'created',
                    code: code,
                    mode: m.mode,
                    numPlayers: m.numPlayers,
                    rooms: m.rooms,
                    connections: m.connections
                }));
                console.log('[' + code + '] Game created');
            }
            
            else if (m.type === 'join') {
                const code = m.code ? m.code.toUpperCase() : '';
                const game = games.get(code);
                
                if (!game) {
                    ws.send(JSON.stringify({type: 'error', msg: 'Code invalide'}));
                    return;
                }
                if (game.started) {
                    ws.send(JSON.stringify({type: 'error', msg: 'Partie deja commencee'}));
                    return;
                }
                if (game.players.size >= game.numPlayers) {
                    ws.send(JSON.stringify({type: 'error', msg: 'Partie complete'}));
                    return;
                }
                
                const id = 'p' + Date.now();
                game.players.set(id, {
                    ws: ws,
                    name: m.name,
                    icon: m.icon || '👤'
                });
                ws.gameCode = code;
                ws.oderId = id;
                
                ws.send(JSON.stringify({type: 'joined', id: id, mode: game.mode}));
                
                game.broadcast('player_joined', {
                    count: game.players.size,
                    total: game.numPlayers,
                    players: Array.from(game.players.values()).map(p => ({name: p.name, icon: p.icon}))
                });
                
                console.log('[' + code + '] ' + m.name + ' joined');
            }
            
            else if (m.type === 'start') {
                const game = games.get(ws.gameCode);
                if (game && ws.isHost && game.players.size >= 2) {
                    game.start();
                }
            }
            
            else if (m.type === 'vote') {
                const game = games.get(ws.gameCode);
                if (game && ws.oderId) {
                    game.vote(ws.oderId, m.target);
                }
            }
            
            else if (m.type === 'next_phase') {
                const game = games.get(ws.gameCode);
                if (game && ws.isHost && game.phase < 99) {
                    if (game.timer) clearInterval(game.timer);
                    game.startPhase(game.phase + 1);
                }
            }
            
            else if (m.type === 'start_vote') {
                const game = games.get(ws.gameCode);
                if (game && ws.isHost) {
                    game.startVoting();
                }
            }
            
            else if (m.type === 'send_message') {
                const game = games.get(ws.gameCode);
                if (game) {
                    game.sendMessage(ws.isHost ? 'mj' : ws.oderId, m.to, m.text);
                }
            }
            
            else if (m.type === 'kill_player') {
                const game = games.get(ws.gameCode);
                if (game && ws.oderId === game.killerId && game.canKill) {
                    game.killPlayer(m.victimId);
                }
            }
            
            else if (m.type === 'move_room') {
                const game = games.get(ws.gameCode);
                if (game && ws.oderId) {
                    const p = game.players.get(ws.oderId);
                    if (p) p.room = m.roomId;
                }
            }
            
        } catch (e) {
            console.error('Error:', e);
        }
    });
    
    ws.on('close', () => {
        console.log('- Connection closed');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log('Murder Party v6 running on port ' + PORT);
});
