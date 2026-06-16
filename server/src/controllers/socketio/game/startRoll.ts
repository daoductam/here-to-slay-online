import random from 'lodash.random';
import { rollDice } from '../../../functions/gameHelpers';
import { validSender } from '../../../functions/helpers';
import { rooms } from '../../../rooms';
import { sendGameState } from '../../../server';

export const startRoll = (roomId: string, userId: string) => {
  const playerNum = validSender(roomId, userId);
  if (
    playerNum === -1 ||
    !rooms[roomId].state.turn.isRolling ||
    rooms[roomId].state.turn.phase !== 'start-roll'
  )
    return;

  rooms[roomId].state.turn.movesLeft--;
  const startRolls = rooms[roomId].state.match.startRolls;

  let roll: [number, number] = [random(1, 6), random(1, 6)];
  let val = roll[0] + roll[1];

  rooms[roomId].state.dice.main.roll = roll;
  rooms[roomId].state.dice.main.total = val;
  startRolls.rolls[playerNum] = val;
  startRolls.maxVal = Math.max(startRolls.maxVal, val);

  sendGameState(roomId);

  // Check if all players in the current rolling list (inList) have rolled
  const allInListRolled = startRolls.inList.every(idx => startRolls.rolls[idx] !== 0);

  // REMOVE LOSING VALUES & SETUP NEXT ROUND / WINNER
  if (allInListRolled) {
    for (let i = 0; i < startRolls.inList.length; i++) {
      if (startRolls.rolls[startRolls.inList[i]] < startRolls.maxVal) {
        startRolls.inList.splice(i--, 1);
      }
    }

    // IF PLAYER WON
    if (startRolls.inList.length === 1) {
      // SETUP MATCH
      rooms[roomId].state.turn.player = startRolls.inList[0];
      rooms[roomId].state.turn.phaseChanged = true;
      // rooms[roomId].state.turn.phase = 'draw'; // Bypassed drawing at start of turn
      rooms[roomId].state.turn.phase = 'play';
      rooms[roomId].state.turn.isRolling = false;
      rooms[roomId].state.dice.main.roll[0] = 1;
      rooms[roomId].state.dice.main.roll[1] = 1;
      rooms[roomId].state.dice.main.total = 0;
      rooms[roomId].state.turn.movesLeft = 3;

      setTimeout(() => {
        sendGameState(roomId);
      }, 3000);

      return;
    } else {
      // IF TIED (SETUP NEXT ROUND)
      startRolls.rolls = [];
      for (let i = 0; i < rooms[roomId].numPlayers; i++) {
        startRolls.rolls.push(0);
      }
      startRolls.maxVal = 0;
    }
  }

  // RESET PLAYER & ROLL FOR NEXT PLAYER IN INLIST
  const next =
    (startRolls.inList.indexOf(playerNum) + 1) % startRolls.inList.length;
  rooms[roomId].state.turn.player = startRolls.inList[next];
  rooms[roomId].state.turn.movesLeft = 1;
  rooms[roomId].state.dice.main.roll[0] = 1;
  rooms[roomId].state.dice.main.roll[1] = 1;
  rooms[roomId].state.dice.main.total = 0;

  setTimeout(() => sendGameState(roomId), 3000);
};
