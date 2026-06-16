import { Socket } from 'socket.io';
import cloneDeep from 'lodash.clonedeep';
import { rooms } from '../../../rooms';
import { initialState } from '../../../cards';
import { checkCredentials } from '../../../functions/helpers';
import { distributeCards } from '../../../functions/gameHelpers';
import { sendGameState, sendState, emit } from '../../../server';
import { AnyCard, HeroCard, LargeCard, MagicCard } from '../../../types';

export const returnToLobby = (socket: Socket) => {
  return (roomId: string, userId: string) => {
    const playerNum = checkCredentials(roomId, userId);
    if (playerNum === -1 || !rooms[roomId]) return;

    const room = rooms[roomId];

    if (room.endGameTimer) {
      clearInterval(room.endGameTimer);
      room.endGameTimer = undefined;
    }

    const playerIds = [...room.state.secret.playerIds];
    const playerSocketIds = [...room.state.secret.playerSocketIds];
    const players = [...room.state.match.players];
    const targetPlayers = room.state.match.targetPlayers || 3;

    // Reset game state to initial structure but preserve players & configuration
    room.state = cloneDeep(initialState);
    room.state.secret.playerIds = playerIds;
    room.state.secret.playerSocketIds = playerSocketIds;
    room.state.match.players = players;
    room.state.match.targetPlayers = targetPlayers;

    // Initialize player and board arrays for the existing players
    room.state.players = players.map(() => ({
      hand: [] as AnyCard[],
      numCards: 0,
      protection: [] as {
        type: 'destroy' | 'steal' | 'challenge';
        turns: number;
        card: HeroCard | LargeCard;
      }[],
      passives: [] as {
        type: 'roll';
        mod: number;
        turns: number;
        card: HeroCard | LargeCard | MagicCard;
      }[],
      leaderAbilityUsed: false
    }));
    room.state.board = players.map(() => ({
      classes: {
        fighter: 0,
        bard: 0,
        guardian: 0,
        ranger: 0,
        thief: 0,
        wizard: 0
      },
      heroCards: [null, null, null, null, null] as [
        HeroCard | null,
        HeroCard | null,
        HeroCard | null,
        HeroCard | null,
        HeroCard | null
      ],
      largeCards: [] as LargeCard[]
    }));
    room.state.match.isReady = players.map(() => false);
    room.state.match.gameStarted = false;

    // Notify all clients in the room to navigate back to the lobby
    emit(roomId, 'return-to-lobby');
    
    // Send state to updated lobby
    sendState(roomId);
  };
};

export const playAgain = (socket: Socket) => {
  return (roomId: string, userId: string) => {
    const playerNum = checkCredentials(roomId, userId);
    if (playerNum === -1 || !rooms[roomId]) return;

    const room = rooms[roomId];

    if (room.endGameTimer) {
      clearInterval(room.endGameTimer);
      room.endGameTimer = undefined;
    }

    const playerIds = [...room.state.secret.playerIds];
    const playerSocketIds = [...room.state.secret.playerSocketIds];
    const players = [...room.state.match.players];
    const targetPlayers = room.state.match.targetPlayers || 3;

    // Reset game state to initial structure
    room.state = cloneDeep(initialState);
    room.state.secret.playerIds = playerIds;
    room.state.secret.playerSocketIds = playerSocketIds;
    room.state.match.players = players;
    room.state.match.targetPlayers = targetPlayers;

    // Initialize player and board arrays for the existing players
    room.state.players = players.map(() => ({
      hand: [] as AnyCard[],
      numCards: 0,
      protection: [] as {
        type: 'destroy' | 'steal' | 'challenge';
        turns: number;
        card: HeroCard | LargeCard;
      }[],
      passives: [] as {
        type: 'roll';
        mod: number;
        turns: number;
        card: HeroCard | LargeCard | MagicCard;
      }[],
      leaderAbilityUsed: false
    }));
    room.state.board = players.map(() => ({
      classes: {
        fighter: 0,
        bard: 0,
        guardian: 0,
        ranger: 0,
        thief: 0,
        wizard: 0
      },
      heroCards: [null, null, null, null, null] as [
        HeroCard | null,
        HeroCard | null,
        HeroCard | null,
        HeroCard | null,
        HeroCard | null
      ],
      largeCards: [] as LargeCard[]
    }));

    // Distribute cards and set everyone to ready
    distributeCards(room.state, room.numPlayers);
    room.state.match.isReady = players.map(() => true);
    room.state.match.gameStarted = true;
    room.state.turn.phaseChanged = true;
    room.state.turn.isRolling = true;

    for (let i = 0; i < room.numPlayers; i++) {
      room.state.match.startRolls.inList.push(i);
      room.state.match.startRolls.rolls.push(0);
    }

    // Send the new game state to clients
    sendGameState(roomId);
  };
};
