import { Socket } from 'socket.io';
import { distributeCards } from '../../../functions/gameHelpers';
import { checkCredentials, removePlayer } from '../../../functions/helpers';
import { rooms } from '../../../rooms';
import {
  sendState,
  emit,
  sendGameState,
  confirmNumPlayers
} from '../../../server';

export const enterLobby = (socket: Socket) => {
  return (
    roomId: string,
    userId: string,
    username: string,
    cb: (successful: boolean) => void
  ) => {
    // check credentials
    const playerNum = checkCredentials(roomId, userId);
    if (playerNum === -1) {
      cb(false);
      sendState(roomId);
      socket.disconnect();
      return;
    }

    if (
      rooms[roomId].state.match.players[playerNum] === '' &&
      !rooms[roomId].state.match.gameStarted
    ) {
      // fill username
      rooms[roomId].state.match.players[playerNum] = `Anonymous ${
        playerNum + 1
      }`;
    }

    // join
    if (
      // valid credentials check
      rooms[roomId].state.secret.playerIds[playerNum] === userId &&
      (rooms[roomId].state.match.players[playerNum] === username ||
        rooms[roomId].state.match.players[playerNum] ===
          `Anonymous ${playerNum + 1}`)
    ) {
      socket.join(roomId);

      sendState(roomId);
      cb(true);
    } else {
      removePlayer(rooms[roomId], playerNum);
      cb(false);
      sendState(roomId);
      socket.disconnect();
    }
  };
};

export const leaveLobby = (socket: Socket) => {
  return (roomId: string, userId: string, cb: () => void) => {
    const playerNum = checkCredentials(roomId, userId);
    if (playerNum === -1) {
      sendState(roomId);
      socket.disconnect();
      return;
    }

    if (rooms[roomId].numPlayers === 1) {
      delete rooms[roomId];
      cb();
      socket.disconnect();
      return;
    }

    removePlayer(rooms[roomId], playerNum);
    sendState(roomId);
    cb();
    socket.disconnect();
  };
};

export const ready = (socket: Socket) => {
  return (
    roomId: string,
    userId: string,
    ready: boolean,
    cb: (successful: boolean) => void
  ) => {
    const playerNum = checkCredentials(roomId, userId);
    if (playerNum === -1) {
      cb(false);
      sendState(roomId);
      socket.disconnect();
      return;
    }

    rooms[roomId].state.match.isReady[playerNum] = ready;

    sendState(roomId);
    cb(true);

    const target = rooms[roomId].state.match.targetPlayers || 3;
    if (
      rooms[roomId].state.match.isReady.every(val => val === true) &&
      rooms[roomId].numPlayers === target
    ) {
      setTimeout(() => {
        emit(roomId, 'start-match');
      }, 1200);
    }
  };
};

export const startMatch = (socket: Socket) => {
  return (roomId: string, playerId: string) => {
    const playerNum = checkCredentials(roomId, playerId);
    if (playerNum === -1) {
      sendState(roomId);
      socket.disconnect();
      return;
    }

    const state = rooms[roomId].state;
    const numPlayers = rooms[roomId].numPlayers;
    state.secret.playerSocketIds[playerNum] = socket.id;

    if (rooms[roomId].reconnectTimer) {
      clearInterval(rooms[roomId].reconnectTimer);
      rooms[roomId].reconnectTimer = undefined;
      state.match.paused = false;
      state.match.disconnectedPlayerNum = null;
      state.match.disconnectTimeLeft = undefined;
    }

    if (state.match.gameStarted) {
      sendGameState(roomId);
      return;
    }

    const target = rooms[roomId].state.match.targetPlayers || 3;
    if (
      numPlayers === target &&
      confirmNumPlayers(roomId) &&
      state.secret.playerSocketIds.every(val => Boolean(val)) &&
      state.match.isReady.every(val => val === true) &&
      state.turn.phase === 'start-roll'
    ) {
      distributeCards(rooms[roomId].state, rooms[roomId].numPlayers);

      state.match.gameStarted = true;
      state.turn.phaseChanged = true;
      state.turn.isRolling = true;

      for (let i = 0; i < numPlayers; i++) {
        // starting roll
        state.match.startRolls.inList.push(i);
        state.match.startRolls.rolls.push(0);
      }

      sendGameState(roomId);
    }
  };
};

export const playerNum = (
  roomId: string,
  userId: string,
  cb: (playerNum: number) => void
) => {
  cb(checkCredentials(roomId, userId));
};
