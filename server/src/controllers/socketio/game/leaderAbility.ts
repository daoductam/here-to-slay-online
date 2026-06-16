import { validSender } from '../../../functions/helpers';
import { rooms } from '../../../rooms';
import { sendGameState } from '../../../server';
import { hasLeader } from '../../../functions/leaderEffects';
import { HeroClass, AnyCard } from '../../../types';
import { endTurnDiscard } from './useEffect';

export const useLeaderAbility = (roomId: string, userId: string, targetPlayerNum: number) => {
  const playerNum = validSender(roomId, userId);
  const gameState = rooms[roomId].state;
  if (playerNum === -1) return;

  // Validate phase and moves
  if (gameState.turn.phase !== 'play' || gameState.turn.movesLeft < 1) {
    return;
  }

  // Validate Leader is Thief (Shadow Claw)
  if (!hasLeader(gameState, playerNum, HeroClass.thief)) {
    return;
  }

  // Validate not already used this turn
  if (gameState.players[playerNum].leaderAbilityUsed) {
    return;
  }

  // Validate target player range
  if (targetPlayerNum === playerNum || targetPlayerNum < 0 || targetPlayerNum >= rooms[roomId].numPlayers) {
    return;
  }

  const targetPlayer = gameState.players[targetPlayerNum];
  if (!targetPlayer || targetPlayer.hand.length === 0) {
    return;
  }

  // Pull a card randomly
  const randomIndex = Math.floor(Math.random() * targetPlayer.hand.length);
  const [stolenCard] = targetPlayer.hand.splice(randomIndex, 1);
  targetPlayer.numCards--;

  // Give to active player
  stolenCard.player = playerNum;
  gameState.players[playerNum].hand.push(stolenCard);
  gameState.players[playerNum].numCards++;

  // Consume 1 action point (movesLeft)
  gameState.turn.movesLeft--;

  // Set ability used
  gameState.players[playerNum].leaderAbilityUsed = true;

  // Check if turn ends due to 0 moves left
  if (gameState.turn.movesLeft <= 0) {
    endTurnDiscard(roomId, userId);
  }

  sendGameState(roomId);
};
