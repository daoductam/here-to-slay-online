import { rooms } from '../rooms';
import { sendGameState } from '../server';

export const TURN_TIME_LIMIT = 60;
export const CHALLENGE_TIME_LIMIT = 30;
export const MODIFY_TIME_LIMIT = 30;
export const BUFFER_TIME_LIMIT = 20;

export const startRoomTimer = (
  roomId: string,
  type: 'turn' | 'challenge' | 'modify',
  duration: number,
  onTimeout: () => void
) => {
  clearRoomTimer(roomId);

  const room = rooms[roomId];
  if (!room) return;

  room.state.timer = {
    type,
    timeLeft: duration,
    maxTime: duration
  };

  sendGameState(roomId);

  room.timerId = setInterval(() => {
    const activeRoom = rooms[roomId];
    if (!activeRoom) {
      clearInterval(room.timerId);
      return;
    }

    // If game is paused (e.g. player disconnected), don't decrement timer
    if (activeRoom.state.match.paused) {
      return;
    }

    if (activeRoom.state.timer) {
      activeRoom.state.timer.timeLeft -= 1;
      if (activeRoom.state.timer.timeLeft <= 0) {
        clearRoomTimer(roomId);
        onTimeout();
      } else {
        sendGameState(roomId);
      }
    } else {
      clearInterval(activeRoom.timerId);
      activeRoom.timerId = undefined;
    }
  }, 1000);
};

export const clearRoomTimer = (roomId: string) => {
  const room = rooms[roomId];
  if (!room) return;

  if (room.timerId) {
    clearInterval(room.timerId);
    room.timerId = undefined;
  }
  room.state.timer = null;
};

export const pauseRoomTimer = (roomId: string) => {
  const room = rooms[roomId];
  if (!room) return;

  if (room.timerId) {
    clearInterval(room.timerId);
    room.timerId = undefined;
  }
  sendGameState(roomId);
};

export const resumeRoomTimer = (roomId: string, onTimeout: () => void) => {
  const room = rooms[roomId];
  if (!room || !room.state.timer) return;

  // Apply buffer time if remaining time is too low
  if (room.state.timer.timeLeft < BUFFER_TIME_LIMIT) {
    room.state.timer.timeLeft = BUFFER_TIME_LIMIT;
  }

  const type = room.state.timer.type;
  const timeLeft = room.state.timer.timeLeft;

  room.timerId = setInterval(() => {
    const activeRoom = rooms[roomId];
    if (!activeRoom) {
      clearInterval(room.timerId);
      return;
    }

    if (activeRoom.state.match.paused) {
      return;
    }

    if (activeRoom.state.timer) {
      activeRoom.state.timer.timeLeft -= 1;
      if (activeRoom.state.timer.timeLeft <= 0) {
        clearRoomTimer(roomId);
        onTimeout();
      } else {
        sendGameState(roomId);
      }
    } else {
      clearInterval(activeRoom.timerId);
      activeRoom.timerId = undefined;
    }
  }, 1000);

  sendGameState(roomId);
};

export const handlePhaseTimer = (roomId: string) => {
  const room = rooms[roomId];
  if (!room) return;

  const state = room.state;
  if (!state.match.gameStarted) {
    clearRoomTimer(roomId);
    return;
  }

  const activePlayer = state.turn.player;
  const activeUserId = state.secret.playerIds[activePlayer];

  if (state.turn.phase === 'end-game') {
    clearRoomTimer(roomId);
    return;
  }

  if (state.turn.phaseChanged) {
    const phase = state.turn.phase;

    if (phase === 'challenge') {
      pauseRoomTimer(roomId);
      startRoomTimer(roomId, 'challenge', CHALLENGE_TIME_LIMIT, () => {
        const currentRoom = rooms[roomId];
        if (!currentRoom) return;

        for (let i = 0; i < currentRoom.numPlayers; i++) {
          if (currentRoom.state.match.isReady[i] === null) {
            currentRoom.state.match.isReady[i] = false;
          }
        }
        const { challenge } = require('../controllers/socketio/game/challenge');
        challenge(roomId, activeUserId, false, undefined);
      });
    } else if (phase === 'modify') {
      pauseRoomTimer(roomId);
      startRoomTimer(roomId, 'modify', MODIFY_TIME_LIMIT, () => {
        const currentRoom = rooms[roomId];
        if (!currentRoom) return;

        for (let i = 0; i < currentRoom.numPlayers; i++) {
          if (currentRoom.state.match.isReady[i] === null) {
            currentRoom.state.match.isReady[i] = false;
          }
        }
        const { modifyRoll } = require('../controllers/socketio/game/modify');
        modifyRoll(roomId, activeUserId, null, false);
      });
    } else if (phase === 'end-turn-discard') {
      startRoomTimer(roomId, 'turn', TURN_TIME_LIMIT, () => {
        const currentRoom = rooms[roomId];
        if (!currentRoom) return;

        const playerHand = currentRoom.state.players[activePlayer].hand;
        const toDiscardCount = currentRoom.state.turn.toDiscard || (playerHand.length - 7);
        const { discardCard } = require('./game');
        for (let i = 0; i < toDiscardCount; i++) {
          if (playerHand.length > 7) {
            const cardToDiscard = playerHand[Math.floor(Math.random() * playerHand.length)];
            discardCard(roomId, activePlayer, cardToDiscard.id);
          }
        }
        currentRoom.state.turn.toDiscard = 0;
        const { nextPlayer } = require('./gameHelpers');
        nextPlayer(roomId);
      });
    } else if (
      ['play', 'choose-hero', 'draw', 'attack-roll', 'use-effect-roll', 'use-effect'].includes(phase)
    ) {
      const hasActiveTimer = state.timer && state.timer.type === 'turn';
      const { pass } = require('../controllers/socketio/game/useEffect');
      if (hasActiveTimer) {
        resumeRoomTimer(roomId, () => {
          pass(roomId, activeUserId);
        });
      } else {
        startRoomTimer(roomId, 'turn', TURN_TIME_LIMIT, () => {
          pass(roomId, activeUserId);
        });
      }
    }
  }
};

