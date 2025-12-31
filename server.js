const http = require('http');
const WebSocket = require('ws');

const HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Murder Party</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Georgia,serif;background:#111;color:#eee;min-height:100vh;padding:20px}
h1,h2,h3{color:#c9a227}
.hide{display:none}
.btn{background:linear-gradient(#c9a227,#8b6914);color:#000;border:none;padding:15px 30px;font-size:1em;border-radius:8px;cursor:pointer;margin:10px 5px}
.btn:hover{opacity:0.9}
.btn:disabled{opacity:0.4}
.btn-s{background:#333;color:#eee}
input{padding:12px;font-size:1em;border:2px solid #333;border-radius:6px;background:#222;color:#eee;margin:5px 0;width:100%;max-width:300px}
.card{background:#1a1a1a;border:1px solid #333;border-radius:10px;padding:20px;margin:15px auto;max-width:500px}
.center{text-align:center}
.code{font-size:2.5em;color:#c9a227;letter-spacing:0.3em;font-family:monospace;margin:10px 0}
.slot{background:#222;padding:10px;margin:5px 0;border-radius:6px;border-left:3px solid #2ecc71}
.warn{background:rgba(139,0,0,0.3);border:2px solid #8b0000;padding:15px;border-radius:8px;margin:10px 0}
.secret{background:rgba(155,89,182,0.2);border:2px solid #9b59b6;padding:15px;border-radius:8px;margin:10px 0}
.alibi{background:rgba(52,152,219,0.1);border-left:3px solid #3498db;padding:10px;margin:10px 0}
.truth{background:rgba(231,76,60,0.2);color:#e74c3c;padding:8px;margin-top:8px;border-radius:4px}
.timer{font-size:2em;color:#c9a227;font-family:monospace}
.vote-btn{display:block;width:100%;padding:15px;margin:8px 0;background:#222;border:2px solid #333;border-radius:8px;color:#eee;cursor:pointer;text-align:left;font-size:1em}
.vote-btn:hover,.vote-btn.sel{border-color:#c9a227;background:#2a2a2a}
.result{padding:30px;border-radius:12px;margin:20px 0}
.result.win{background:rgba(46,204,113,0.2);border:2px solid #2ecc71}
.result.lose{background:rgba(231,76,60,0.2);border:2px solid #e74c3c}
.big{font-size:4em;margin:10px 0}
.conn{position:fixed;top:10px;right:10px;padding:5px 12px;border-radius:20px;font-size:0.8em}
.conn.on{background:#2ecc71;color:#000}
.conn.off{background:#e74c3c;color:#fff}
</style>
</head>
<body>
<div class="conn off" id="conn">Connexion...</div>

<div id="screen-home" class="center">
<h1 style="font-size:2.5em;margin-bottom:10px">🎭 MURDER PARTY</h1>
<p style="color:#888;margin-bottom:40px">Jeu d'enquete et de deduction</p>
<button class="btn" onclick="goHost()">🖥️ MAITRE DU JEU</button>
<button class="btn" onclick="goPlayer()">📱 JOUEUR</button>
</div>

<div id="screen-host-config" class="hide center">
<h1>Configuration</h1>
<div class="card">
<h3>Nombre de joueurs</h3>
<input type="number" id="numPlayers" value="5" min="3" max="10">
<br><br>
<button class="btn" onclick="createGame()">Creer la partie</button>
</div>
</div>

<div id="screen-host-lobby" class="hide center">
<h1>En attente des joueurs</h1>
<div class="code" id="gameCode">-----</div>
<div class="card">
<h3>Joueurs connectes: <span id="playerCount">0</span>/<span id="playerTotal">5</span></h3>
<div id="playerList"></div>
</div>
<button class="btn" id="btnStart" onclick="startGame()" disabled>Lancer la partie</button>
</div>

<div id="screen-host-game" class="hide center">
<h1 id="hostPhaseTitle">Phase 1</h1>
<div class="timer" id="hostTimer">08:00</div>
<div class="card">
<h3>Joueurs</h3>
<div id="hostPlayerList"></div>
</div>
<button class="btn btn-s" onclick="nextPhase()">Phase suivante</button>
<button class="btn" onclick="forceVote()">Lancer le vote</button>
</div>

<div id="screen-host-end" class="hide center">
<h1 id="hostEndTitle">Fin de partie</h1>
<div id="hostEndContent"></div>
<button class="btn" onclick="location.reload()">Nouvelle partie</button>
</div>

<div id="screen-player-join" class="hide center">
<h1>Rejoindre une partie</h1>
<div class="card">
<h3>Code de la partie</h3>
<input type="text" id="joinCode" placeholder="XXXXX" maxlength="5" style="text-transform:uppercase;text-align:center;font-size:1.5em;letter-spacing:0.2em">
<h3 style="margin-top:20px">Ton prenom</h3>
<input type="text" id="joinName" placeholder="Prenom">
<br><br>
<button class="btn" onclick="joinGame()">Rejoindre</button>
</div>
</div>

<div id="screen-player-wait" class="hide center">
<h1>En attente du lancement</h1>
<div class="card">
<p>Bienvenue <strong id="myName" style="color:#c9a227"></strong></p>
<p style="color:#888;margin-top:10px">La partie va bientot commencer...</p>
</div>
</div>

<div id="screen-player-role" class="hide">
<div class="center"><h1>🎭 Votre Role</h1></div>
<div class="card" id="roleContent"></div>
<div class="center"><button class="btn" onclick="confirmRole()">J'ai compris mon role</button></div>
</div>

<div id="screen-player-game" class="hide center">
<h1 id="playerPhaseTitle">Phase 1</h1>
<p id="playerPhaseObj" style="color:#888"></p>
<div class="card" id="playerGameContent"></div>
</div>

<div id="screen-player-vote" class="hide center">
<h1>🗳️ Vote Final</h1>
<p style="color:#888;margin-bottom:20px">Qui est le meurtrier?</p>
<div class="card" id="voteContent"></div>
</div>

<div id="screen-player-end" class="hide center">
<h1 id="playerEndTitle">Fin de partie</h1>
<div id="playerEndContent"></div>
<button class="btn" onclick="location.reload()">Rejouer</button>
</div>

<script>
var ws, role, myId, myName, myData, allPlayers = [], voted = false, selectedVote = null;

function $(id) { return document.getElementById(id); }
function show(id) { 
    document.querySelectorAll('[id^="screen-"]').forEach(function(el) { el.classList.add('hide'); });
    $(id).classList.remove('hide');
}
function fmt(s) { return Math.floor(s/60).toString().padStart(2,'0') + ':' + (s%60).toString().padStart(2,'0'); }

function connect() {
    var proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
    ws = new WebSocket(proto + '//' + location.host);
    ws.onopen = function() { $('conn').className = 'conn on'; $('conn').textContent = 'Connecte'; };
    ws.onclose = function() { $('conn').className = 'conn off'; $('conn').textContent = 'Deconnecte'; setTimeout(connect, 2000); };
    ws.onmessage = function(e) { handleMessage(JSON.parse(e.data)); };
}

function send(type, data) {
    if (ws && ws.readyState === 1) {
        ws.send(JSON.stringify(Object.assign({type: type}, data || {})));
    }
}

function handleMessage(m) {
    console.log('Recu:', m);
    
    if (m.type === 'created') {
        $('gameCode').textContent = m.code;
        $('playerTotal').textContent = m.numPlayers;
        show('screen-host-lobby');
    }
    else if (m.type === 'joined') {
        myId = m.id;
        $('myName').textContent = myName;
        show('screen-player-wait');
    }
    else if (m.type === 'error') {
        alert(m.msg);
    }
    else if (m.type === 'player_joined') {
        allPlayers = m.players;
        $('playerCount').textContent = m.count;
        $('playerList').innerHTML = m.players.map(function(p) { return '<div class="slot">' + p.name + '</div>'; }).join('');
        $('btnStart').disabled = m.count < 2;
    }
    else if (m.type === 'role') {
        myData = m;
        showRole();
    }
    else if (m.type === 'roles_distributed') {
        allPlayers = m.players;
        updateHostPlayers();
    }
    else if (m.type === 'phase') {
        if (role === 'host') {
            show('screen-host-game');
            $('hostPhaseTitle').textContent = 'Phase ' + m.phase + ': ' + m.name;
            $('hostTimer').textContent = fmt(m.duration);
        } else {
            show('screen-player-game');
            $('playerPhaseTitle').textContent = 'Phase ' + m.phase + ': ' + m.name;
            $('playerPhaseObj').textContent = m.obj;
            updatePlayerGame(m.canKill);
        }
    }
    else if (m.type === 'timer') {
        $('hostTimer').textContent = fmt(m.t);
    }
    else if (m.type === 'can_kill') {
        updatePlayerGame(m.enabled);
    }
    else if (m.type === 'player_killed') {
        allPlayers.forEach(function(p) { if (p.id === m.victimId) p.isDead = true; });
        updateHostPlayers();
        alert(m.victimName + ' a ete tue(e)!');
    }
    else if (m.type === 'you_died') {
        alert('Vous avez ete elimine(e)! Vous pouvez encore voter.');
    }
    else if (m.type === 'voting') {
        allPlayers = m.players;
        if (role === 'host') {
            $('hostPhaseTitle').textContent = 'VOTE EN COURS';
            $('hostTimer').textContent = '--:--';
        } else {
            showVote();
        }
    }
    else if (m.type === 'end') {
        showEnd(m);
    }
}

function goHost() {
    role = 'host';
    show('screen-host-config');
}

function goPlayer() {
    role = 'player';
    show('screen-player-join');
}

function createGame() {
    send('create', { numPlayers: parseInt($('numPlayers').value) || 5 });
}

function joinGame() {
    var code = $('joinCode').value.toUpperCase().trim();
    myName = $('joinName').value.trim();
    if (!code || code.length < 4) { alert('Entrez un code valide!'); return; }
    if (!myName) { alert('Entrez votre prenom!'); return; }
    send('join', { code: code, name: myName });
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

function updateHostPlayers() {
    $('hostPlayerList').innerHTML = allPlayers.map(function(p) {
        return '<div class="slot">' + p.name + (p.isKiller ? ' <span style="color:#e74c3c">[TUEUR]</span>' : '') + (p.isDead ? ' [MORT]' : '') + '</div>';
    }).join('');
}

function showRole() {
    show('screen-player-role');
    var h = '<div class="center"><h2>' + myData.name + '</h2></div>';
    
    if (myData.isKiller && myData.scenario) {
        h += '<div class="warn"><h3 style="color:#e74c3c">⚠️ VOUS ETES LE MEURTRIER!</h3>';
        h += '<p style="margin:10px 0"><strong>' + myData.scenario.name + '</strong></p>';
        h += '<p>' + myData.scenario.summary + '</p></div>';
        h += '<h3>Deroulement:</h3><pre style="white-space:pre-wrap;background:#222;padding:10px;border-radius:6px">' + myData.scenario.details + '</pre>';
    }
    
    if (myData.secret) {
        h += '<div class="secret"><h3 style="color:#9b59b6">🤫 Votre Secret</h3>';
        h += '<p>' + myData.secret.text + '</p>';
        if (myData.secret.hasMotive) h += '<p style="color:#e74c3c;font-weight:bold;margin-top:10px">⚠️ Vous avez un MOBILE!</p>';
        h += '</div>';
    }
    
    if (myData.alibis) {
        h += '<h3>Vos Alibis:</h3>';
        var phases = ['phase1', 'phase2', 'phase3'];
        var times = ['21h-22h', '22h-22h30', '22h30-23h'];
        for (var i = 0; i < 3; i++) {
            var a = myData.alibis[phases[i]];
            if (a) {
                h += '<div class="alibi"><strong>Phase ' + (i+1) + ' (' + times[i] + ')</strong>';
                h += '<div>📍 ' + a.location + '</div>';
                h += '<div>🎬 ' + a.action + '</div>';
                h += '<div>👁️ ' + a.witnesses + '</div>';
                if (myData.isKiller && a.truth) h += '<div class="truth">⚠️ REALITE: ' + a.truth + '</div>';
                h += '</div>';
            }
        }
    }
    
    $('roleContent').innerHTML = h;
}

function confirmRole() {
    show('screen-player-game');
    updatePlayerGame(false);
}

function updatePlayerGame(canKill) {
    var h = '';
    
    if (myData && myData.isKiller) {
        h += '<div class="warn"><h3>Vous etes le tueur!</h3><p>Mentez et survivez!</p></div>';
        if (canKill) {
            h += '<h3>🔪 Eliminer quelqu\'un:</h3>';
            allPlayers.forEach(function(p) {
                if (p.id !== myId && !p.isDead) {
                    h += '<button class="btn" style="display:block;width:100%;margin:5px 0" onclick="killPlayer(\'' + p.id + '\')">' + p.name + '</button>';
                }
            });
        }
    } else {
        h += '<p>Trouvez le meurtrier!</p>';
    }
    
    h += '<h3 style="margin-top:20px">Joueurs:</h3>';
    allPlayers.forEach(function(p) {
        h += '<div class="slot">' + p.name + (p.isDead ? ' [MORT]' : '') + '</div>';
    });
    
    $('playerGameContent').innerHTML = h;
}

function killPlayer(id) {
    if (confirm('Eliminer ce joueur?')) {
        send('kill_player', { victimId: id });
    }
}

function showVote() {
    show('screen-player-vote');
    renderVote();
}

function renderVote() {
    if (voted) {
        $('voteContent').innerHTML = '<div class="result win"><div class="big">✓</div><h2>Vote enregistre!</h2><p>En attente des autres...</p></div>';
        return;
    }
    
    var h = '';
    allPlayers.forEach(function(p) {
        if (!p.isDead && p.id !== myId) {
            h += '<button class="vote-btn' + (selectedVote === p.id ? ' sel' : '') + '" onclick="selectVote(\'' + p.id + '\')">' + p.name + '</button>';
        }
    });
    h += '<br><button class="btn" onclick="confirmVote()"' + (selectedVote ? '' : ' disabled') + '>Confirmer mon vote</button>';
    $('voteContent').innerHTML = h;
}

function selectVote(id) {
    selectedVote = id;
    renderVote();
}

function confirmVote() {
    if (!selectedVote) return;
    send('vote', { target: selectedVote });
    voted = true;
    renderVote();
}

function showEnd(m) {
    var win = m.win === 'investigators';
    
    if (role === 'host') {
        show('screen-host-end');
        $('hostEndTitle').textContent = win ? '🎉 Les enqueteurs gagnent!' : '💀 Le tueur gagne!';
        var h = '<div class="result ' + (win ? 'win' : 'lose') + '">';
        h += '<div class="big">' + (win ? '🎉' : '💀') + '</div>';
        h += '<h2>Le meurtrier etait: ' + m.killerName + '</h2></div>';
        h += '<h3>Revelations:</h3>';
        m.reveals.forEach(function(r) {
            h += '<div class="slot">' + r.name + (r.isKiller ? ' <span style="color:#e74c3c">[TUEUR]</span>' : '') + ' - ' + (r.secret || 'Pas de secret') + '</div>';
        });
        $('hostEndContent').innerHTML = h;
    } else {
        show('screen-player-end');
        var iWin = myData && myData.isKiller ? !win : win;
        $('playerEndTitle').textContent = iWin ? '🎉 Victoire!' : '💀 Defaite...';
        var h = '<div class="result ' + (iWin ? 'win' : 'lose') + '">';
        h += '<div class="big">' + (iWin ? '🎉' : '💀') + '</div>';
        h += '<h2>Le meurtrier etait: ' + m.killerName + '</h2></div>';
        $('playerEndContent').innerHTML = h;
    }
}

connect();
</script>
</body>
</html>`;

// === SERVEUR ===
const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(HTML);
});

const wss = new WebSocket.Server({ server });
const games = new Map();

const SCENARIOS = [
    {
        name: 'Le Poison au Bar',
        summary: 'Vous avez verse du poison dans son verre.',
        details: '21h30 - Recupere poison\n22h17 - Verse dans son verre\n22h35 - Au salon\n23h05 - Il meurt',
        alibis: {
            phase1: {location: 'Bar', action: 'Buvais', witnesses: 'Barman', truth: 'Vous versiez le poison!'},
            phase2: {location: 'Salon', action: 'Discutais', witnesses: 'Gens', truth: 'Attendiez'},
            phase3: {location: 'Salon', action: 'Entends cri', witnesses: 'Tous', truth: 'Vous saviez'}
        }
    }
];

const SECRETS = [
    {text: 'La victime vous faisait chanter', hasMotive: true},
    {text: 'Vous etes son amant(e)', hasMotive: true},
    {text: 'Il a ruine votre famille', hasMotive: true},
    {text: 'Vous etes journaliste', hasMotive: false}
];

const ALIBIS = {
    phase1: [{location: 'Bar', action: 'Buvait', witnesses: 'Barman'}, {location: 'Salon', action: 'Lisait', witnesses: 'Personne'}],
    phase2: [{location: 'Couloir', action: 'Marchait', witnesses: '?'}, {location: 'Bar', action: 'Commandait', witnesses: 'Barman'}],
    phase3: [{location: 'Salon', action: 'Arrivait', witnesses: 'Autres'}, {location: 'Hall', action: 'Entendait cri', witnesses: 'Reception'}]
};

class Game {
    constructor(code, numPlayers, hostWs) {
        this.code = code;
        this.numPlayers = numPlayers;
        this.hostWs = hostWs;
        this.players = new Map();
        this.started = false;
        this.ended = false;
        this.phase = 0;
        this.timer = null;
        this.killerId = null;
        this.votes = new Map();
        this.dead = new Set();
    }
    
    broadcast(type, data) {
        const msg = JSON.stringify(Object.assign({type: type}, data || {}));
        if (this.hostWs && this.hostWs.readyState === 1) this.hostWs.send(msg);
        this.players.forEach(p => { if (p.ws && p.ws.readyState === 1) p.ws.send(msg); });
    }
    
    sendTo(ws, type, data) {
        if (ws && ws.readyState === 1) ws.send(JSON.stringify(Object.assign({type: type}, data || {})));
    }
    
    start() {
        if (this.started) return;
        this.started = true;
        
        const scenario = SCENARIOS[0];
        const ids = Array.from(this.players.keys());
        this.killerId = ids[Math.floor(Math.random() * ids.length)];
        
        const shuffledSecrets = SECRETS.slice().sort(() => Math.random() - 0.5);
        
        ids.forEach((id, i) => {
            const p = this.players.get(id);
            p.isKiller = id === this.killerId;
            p.secret = shuffledSecrets[i % shuffledSecrets.length];
            p.alibis = p.isKiller ? scenario.alibis : {
                phase1: ALIBIS.phase1[Math.floor(Math.random() * ALIBIS.phase1.length)],
                phase2: ALIBIS.phase2[Math.floor(Math.random() * ALIBIS.phase2.length)],
                phase3: ALIBIS.phase3[Math.floor(Math.random() * ALIBIS.phase3.length)]
            };
            
            this.sendTo(p.ws, 'role', {
                id: id,
                name: p.name,
                isKiller: p.isKiller,
                secret: p.secret,
                alibis: p.alibis,
                scenario: p.isKiller ? scenario : null
            });
        });
        
        this.sendTo(this.hostWs, 'roles_distributed', {
            players: ids.map(id => {
                const p = this.players.get(id);
                return {id: id, name: p.name, isKiller: p.isKiller, secret: p.secret};
            })
        });
        
        console.log('Killer:', this.players.get(this.killerId).name);
        
        setTimeout(() => this.startPhase(1), 3000);
    }
    
    startPhase(n) {
        if (n > 5) { this.startVote(); return; }
        
        this.phase = n;
        const phases = [
            {name: 'Decouverte', duration: 300, obj: 'Alibis 21h-22h'},
            {name: 'Interrogatoires', duration: 300, obj: '22h-22h30'},
            {name: 'Revelations', duration: 300, obj: 'Secrets'},
            {name: 'Derniere chance', duration: 180, obj: 'TUEUR PEUT TUER!', canKill: true},
            {name: 'Deliberation', duration: 120, obj: 'Preparez vote'}
        ];
        const ph = phases[n-1];
        
        this.broadcast('phase', {phase: n, name: ph.name, duration: ph.duration, obj: ph.obj, canKill: !!ph.canKill});
        
        if (ph.canKill) {
            const killer = this.players.get(this.killerId);
            if (killer) this.sendTo(killer.ws, 'can_kill', {enabled: true});
        }
        
        if (this.timer) clearInterval(this.timer);
        let remaining = ph.duration;
        this.timer = setInterval(() => {
            remaining--;
            this.broadcast('timer', {t: remaining});
            if (remaining <= 0) {
                clearInterval(this.timer);
                this.startPhase(n + 1);
            }
        }, 1000);
    }
    
    kill(victimId) {
        if (this.dead.has(victimId)) return;
        this.dead.add(victimId);
        const victim = this.players.get(victimId);
        this.broadcast('player_killed', {victimId: victimId, victimName: victim ? victim.name : '?'});
        if (victim) this.sendTo(victim.ws, 'you_died', {});
    }
    
    startVote() {
        if (this.timer) clearInterval(this.timer);
        this.votes.clear();
        
        const alive = [];
        this.players.forEach((p, id) => {
            if (!this.dead.has(id)) alive.push({id: id, name: p.name});
        });
        
        this.broadcast('voting', {players: alive});
    }
    
    vote(oderId, targetId) {
        this.votes.set(oderId, targetId);
        if (this.votes.size >= this.players.size) {
            setTimeout(() => this.end(), 1000);
        }
    }
    
    end() {
        if (this.ended) return;
        this.ended = true;
        
        const counts = new Map();
        this.votes.forEach(t => counts.set(t, (counts.get(t) || 0) + 1));
        
        let maxVotes = 0, accused = null;
        counts.forEach((c, id) => { if (c > maxVotes) { maxVotes = c; accused = id; }});
        
        const killer = this.players.get(this.killerId);
        const win = accused === this.killerId;
        
        const reveals = [];
        this.players.forEach((p, id) => {
            reveals.push({name: p.name, isKiller: p.isKiller, secret: p.secret ? p.secret.text : null, isDead: this.dead.has(id)});
        });
        
        this.broadcast('end', {
            win: win ? 'investigators' : 'killer',
            killerName: killer ? killer.name : '?',
            reveals: reveals
        });
    }
}

function genCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
}

wss.on('connection', ws => {
    console.log('Nouvelle connexion');
    
    ws.on('message', data => {
        try {
            const m = JSON.parse(data);
            console.log('Message:', m.type);
            
            if (m.type === 'create') {
                const code = genCode();
                const game = new Game(code, m.numPlayers || 5, ws);
                games.set(code, game);
                ws.gameCode = code;
                ws.isHost = true;
                ws.send(JSON.stringify({type: 'created', code: code, numPlayers: game.numPlayers}));
                console.log('Partie creee:', code);
            }
            else if (m.type === 'join') {
                const game = games.get((m.code || '').toUpperCase());
                if (!game) { ws.send(JSON.stringify({type: 'error', msg: 'Code invalide'})); return; }
                if (game.started) { ws.send(JSON.stringify({type: 'error', msg: 'Partie deja commencee'})); return; }
                if (game.players.size >= game.numPlayers) { ws.send(JSON.stringify({type: 'error', msg: 'Partie complete'})); return; }
                
                const id = 'p' + Date.now();
                game.players.set(id, {ws: ws, name: m.name});
                ws.gameCode = m.code.toUpperCase();
                ws.oderId = id;
                
                ws.send(JSON.stringify({type: 'joined', id: id}));
                
                const players = [];
                game.players.forEach((p, pid) => players.push({id: pid, name: p.name}));
                game.broadcast('player_joined', {count: game.players.size, total: game.numPlayers, players: players});
                
                console.log(m.name, 'a rejoint', m.code);
            }
            else if (m.type === 'start') {
                const game = games.get(ws.gameCode);
                if (game && ws.isHost) game.start();
            }
            else if (m.type === 'next_phase') {
                const game = games.get(ws.gameCode);
                if (game && ws.isHost) {
                    if (game.timer) clearInterval(game.timer);
                    game.startPhase(game.phase + 1);
                }
            }
            else if (m.type === 'start_vote') {
                const game = games.get(ws.gameCode);
                if (game && ws.isHost) game.startVote();
            }
            else if (m.type === 'kill_player') {
                const game = games.get(ws.gameCode);
                if (game && ws.oderId === game.killerId) game.kill(m.victimId);
            }
            else if (m.type === 'vote') {
                const game = games.get(ws.gameCode);
                if (game && ws.oderId) game.vote(ws.oderId, m.target);
            }
        } catch(e) {
            console.error('Erreur:', e);
        }
    });
    
    ws.on('close', () => console.log('Deconnexion'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log('Murder Party sur port', PORT);
});
