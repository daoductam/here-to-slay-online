import { Server } from 'socket.io';
import express from 'express';

import expressServer from './controllers/express/expressServer';
import { parseState, checkCredentials } from './functions/helpers';
import { rooms } from './rooms';

import {
  enterLobby,
  leaveLobby,
  playerNum,
  ready,
  startMatch
} from './controllers/socketio/lobby/lobby';
import { startRoll } from './controllers/socketio/game/startRoll';
import {
  challenge,
  challengeRoll,
  prepareCard
} from './controllers/socketio/game/challenge';
import { drawFive, drawOne, drawTwo } from './controllers/socketio/game/draw';
import { modifyRoll } from './controllers/socketio/game/modify';
import { attackRoll } from './controllers/socketio/game/attack';
import {
  endTurnDiscard,
  pass,
  useEffect,
  useEffectRoll
} from './controllers/socketio/game/useEffect';
import { useLeaderAbility } from './controllers/socketio/game/leaderAbility';
import { returnToLobby, playAgain } from './controllers/socketio/game/gameReset';
import { sendChatMessage } from './controllers/socketio/chat';
import { handlePhaseTimer, clearRoomTimer } from './functions/timerHelper';
import 'dotenv/config';

/* EXPRESS SERVER */
const app = express();

const port = process.env.PORT || 4000;

app.use(expressServer);
const httpServer = app.listen(port, () =>
  console.log(`server on port ${port}`)
);

/* SOCKET.IO  SERVER */
export const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || '*'
  }
});

io.on('connection', socket => {
  socket.emit('room-list:update', getRoomsList());
  /* LOBBY */
  socket.on('enter-lobby', enterLobby(socket));
  socket.on('leave-lobby', leaveLobby(socket));
  socket.on('ready', ready(socket));
  socket.on('start-match', startMatch(socket));
  socket.on('player-num', playerNum);
  socket.on('chat:send', sendChatMessage(socket));

  /* GAME */
  // pass
  socket.on('pass', pass);

  // start roll
  socket.on('start-roll', startRoll);

  // draw
  socket.on('draw-one', drawOne);
  socket.on('draw-two', drawTwo);
  socket.on('draw-five', drawFive);

  // challenge
  socket.on('prepare-card', prepareCard);
  socket.on('challenge', challenge);
  socket.on('challenge-roll', challengeRoll);

  // modify
  socket.on('modify-roll', modifyRoll);

  // attack
  socket.on('attack-roll', attackRoll);

  // use-effect
  socket.on('use-effect-roll', useEffectRoll);
  socket.on('use-effect', useEffect);

  // end-turn-discard
  socket.on('end-turn-discard', endTurnDiscard);

  // leader ability
  socket.on('use-leader-ability', useLeaderAbility);

  // game reset options
  socket.on('return-to-lobby', returnToLobby(socket));
  socket.on('play-again', playAgain(socket));

  /* DISCONNECT & EXIT MATCH */
  socket.on('exit-match', (roomId: string, playerId: string) => {
    const playerNum = checkCredentials(roomId, playerId);
    if (playerNum !== -1 && rooms[roomId]) {
      if (rooms[roomId].reconnectTimer) {
        clearInterval(rooms[roomId].reconnectTimer);
      }
      io.in(roomId).emit('match-aborted', rooms[roomId].state.match.players[playerNum]);
      setTimeout(() => {
        disconnectAll(roomId);
        clearRoomTimer(roomId);
        delete rooms[roomId];
        broadcastRoomList();
      }, 500);
    }
  });

  socket.on('disconnect', () => {
    // Find if this socket belongs to a player in an active match
    for (const roomId of Object.keys(rooms)) {
      const room = rooms[roomId];
      if (room && room.state && room.state.secret) {
        const idx = room.state.secret.playerSocketIds.indexOf(socket.id);
        if (idx !== -1) {
          // Found the player
          if (room.state.match.gameStarted) {
            // Already paused or timer active?
            if (room.reconnectTimer) return;

            room.state.match.paused = true;
            room.state.match.disconnectedPlayerNum = idx;
            room.state.match.disconnectTimeLeft = 120;
            sendGameState(roomId);

            room.reconnectTimer = setInterval(() => {
              if (rooms[roomId]) {
                const currentRoom = rooms[roomId];
                if (currentRoom.state.match.disconnectTimeLeft !== undefined) {
                  currentRoom.state.match.disconnectTimeLeft -= 1;
                  if (currentRoom.state.match.disconnectTimeLeft <= 0) {
                    clearInterval(currentRoom.reconnectTimer);
                    currentRoom.reconnectTimer = undefined;
                    
                    io.in(roomId).emit('match-aborted', currentRoom.state.match.players[idx]);
                    setTimeout(() => {
                      disconnectAll(roomId);
                      clearRoomTimer(roomId);
                      delete rooms[roomId];
                      broadcastRoomList();
                    }, 500);
                  } else {
                    sendGameState(roomId);
                  }
                }
              } else {
                // Room was deleted, clear interval
                clearInterval(room.reconnectTimer);
              }
            }, 1000);
          }
          break;
        }
      }
    }
  });
});

/* 
HELPER FUNCTIONS 
- sendState (lobby)
- sendGameState (in match)
- confirmNumPlayers
*/
export function disconnectAll(roomId: string) {
  io.in(roomId).disconnectSockets(true);
}

export function sendState(roomId: string) {
  if (rooms[roomId]) {
    io.in(roomId).emit('state', rooms[roomId].state.match);
  }
}

export function sendGameState(roomId: string) {
  if (rooms[roomId]) {
    const state = rooms[roomId].state;

    if (state.turn.phaseChanged) {
      state.turn.phaseChanged = false;
      handlePhaseTimer(roomId);
    }

    for (let i = 0; i < rooms[roomId].numPlayers; i++) {
      const privateState = parseState(state.secret.playerIds[i], state);
      io.to(state.secret.playerSocketIds[i]).emit('game-state', privateState);
    }

    if (state.turn.effect) {
      state.turn.effect.actionChanged = false;
    }
  }
}

export function emit(roomId: string, message: string): void {
  io.in(roomId).emit(message);
}

export function confirmNumPlayers(roomId: string): boolean {
  return (
    io.sockets.adapter.rooms.get(roomId)?.size === rooms[roomId].numPlayers
  );
}

export function getRoomsList() {
  let updatedRooms: { [key: string]: { joined: number; target: number } } = {};
  for (const key of Object.keys(rooms)) {
    if (!rooms[key].private && !rooms[key].state.match.gameStarted) {
      updatedRooms[key] = {
        joined: rooms[key].numPlayers,
        target: rooms[key].state.match.targetPlayers || 3
      };
    }
  }
  return updatedRooms;
}

export function broadcastRoomList() {
  io.emit('room-list:update', getRoomsList());
}
