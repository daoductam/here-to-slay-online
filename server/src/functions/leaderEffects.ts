import { GameState, LeaderCard, HeroClass, CardType } from '../types';

export function getLeader(state: GameState, playerIndex: number): LeaderCard | null {
  const board = state.board[playerIndex];
  if (!board) return null;
  const leader = board.largeCards.find(card => 'class' in card) as LeaderCard | undefined;
  return leader || null;
}

export function hasLeader(state: GameState, playerIndex: number, heroClass: HeroClass): boolean {
  const leader = getLeader(state, playerIndex);
  return leader ? leader.class === heroClass : false;
}

export function hasMonster(state: GameState, playerIndex: number, monsterName: string): boolean {
  const board = state.board[playerIndex];
  if (!board) return false;
  return board.largeCards.some(
    card => card.type === CardType.large && !('class' in card) && card.name === monsterName
  );
}

