Phase(g.phase + 1); } break; }
                case 'start_vote': { const g = games.get(ws.gameCode); if (g && ws.isHost) g.startVoting(); break; }
                case 'send_message': { const g = games.get(ws.gameCode); if (g) g.sendMessage(ws.isHost ? 'mj' : ws.oderId, m.to, m.text); break; }
                case 'kill_player': { const g = games.get(ws.gameCode); if (g && ws.oderId === g.killerId && g.canKill) g.killPlayer(m.victimId); break; }
                case 'move_room': { const g = games.get(ws.gameCode); if (g && ws.oderId) { const p = g.players.get(ws.oderId); if (p) { p.room = m.roomId; g.broadcast('player_moved', {oderId: ws.oderId, roomId: m.roomId}); } } break; }
                case 'guess': { const g = games.get(ws.gameCode); if (g && ws.oderId) g.handleGuess(ws.oderId, m); break; }
            }
        } catch(e) { console.error(e); }
    });
    ws.on('close', () => console.log('- Disconnected'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => console.log(`🎭 Murder Party v5 - Port ${PORT}`));
