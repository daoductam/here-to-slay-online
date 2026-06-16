import { rollRequirements } from '../../../functions/abilities';
import {
  discardCard,
  destroyCard,
  destroyItem,
  drawCards
} from '../../../functions/game';
import { checkCredentials } from '../../../functions/helpers';
import { rooms } from '../../../rooms';
import { disconnectAll, sendGameState } from '../../../server';
import {
  CardType,
  HeroCard,
  HeroClass,
  ModifierCard,
  MonsterCard
} from '../../../types';
import { getLeader, hasLeader, hasMonster } from '../../../functions/leaderEffects';
import { endTurnDiscard, useEffect } from './useEffect';

export const meetsRollRequirements = (
  type: 'fail' | 'pass',
  card: HeroCard | MonsterCard,
  roll: number
) => {
  let req;
  req = rollRequirements[card.name.replaceAll(' ', '-').toLowerCase()][type];
  if (!req) return false;

  if (req < 0) {
    if (roll <= Math.abs(req)) {
      return true;
    } else {
      return false;
    }
  } else {
    if (roll >= req) {
      return true;
    } else {
      return false;
    }
  }
};

export const modifyRoll = (
  roomId: string,
  userId: string,
  info: {
    modifier: ModifierCard;
    effect: 0 | 1;
    dice: 0 | 1;
    guardianChoice?: 'plus' | 'minus' | 'none';
  } | null,
  modify: boolean
) => {
  const playerNum = checkCredentials(roomId, userId);
  const state = rooms[roomId].state;

  if (!modify) {
    state.match.isReady[playerNum] = false;
    sendGameState(roomId);

    // EFFECT AFTERWARDS
    if (state.match.isReady.every(val => val === false)) {
      const cardUserId = state.secret.playerIds[state.turn.player];

      // use card
      if (state.mainDeck.preparedCard) {
        // challenge
        if (
          state.dice.defend &&
          state.mainDeck.preparedCard.card &&
          state.mainDeck.preparedCard.card.player !== undefined
        ) {
          if (state.dice.main.total >= state.dice.defend.total) {
            // fail
            state.mainDeck.preparedCard.successful = false;
            if (state.mainDeck.preparedCard.card.type === CardType.hero) {
              const player = state.mainDeck.preparedCard.card.player;
              if (player === undefined) return;
              destroyCard(
                roomId,
                state.mainDeck.preparedCard.card.player,
                state.mainDeck.preparedCard.card
              );
            } else if (
              state.mainDeck.preparedCard.card.type === CardType.item
            ) {
              const itemCard = state.mainDeck.preparedCard.card;
              if (!itemCard.heroPlayer) return;
              state.board[itemCard.heroPlayer].classes[
                itemCard.name.split(' ')[0].toLowerCase() as HeroClass
              ]--;
              state.board[itemCard.heroPlayer].classes[
                (
                  state.board[itemCard.heroPlayer].heroCards.find(
                    val => val && val.id === itemCard.heroId
                  ) as HeroCard
                ).class
              ]++;
              destroyItem(roomId, state.mainDeck.preparedCard.card);
            }
            sendGameState(roomId);

            state.dice.main.roll = [1, 1];
            state.dice.main.total = 0;
            state.dice.main.modifier = [];
            state.dice.main.modValues = [];
            state.dice.defend = null;
            delete state.turn.challenger;
            state.mainDeck.preparedCard = null;

            if (state.turn.movesLeft === 0) {
              endTurnDiscard(roomId, cardUserId);
            } else {
              if (
                state.turn.cachedEvent &&
                state.turn.cachedEvent.length >= 1
              ) {
                const cached = state.turn.cachedEvent.pop();
                if (!cached) return;
                state.turn.phase = cached.phase;
                state.turn.effect = cached.effect;
                state.turn.cachedEvent = [];
              } else {
                state.turn.phase = 'play';
                state.turn.phaseChanged = true;
              }

              setTimeout(() => {
                sendGameState(roomId);
              }, 1200);
            }
          } else {
            // success
            state.mainDeck.preparedCard.successful = true;
            sendGameState(roomId);

            const preppedCard = state.mainDeck.preparedCard.card;

            state.mainDeck.preparedCard = null;
            state.dice.defend = null;

            if (preppedCard.type === 'hero' || preppedCard.type === 'item') {
              if (preppedCard.type === 'hero') {
                preppedCard.freeUse = true;
              }
              if (
                state.turn.cachedEvent &&
                state.turn.cachedEvent.length >= 1
              ) {
                const cached = state.turn.cachedEvent.pop();
                if (!cached) return;
                state.turn.phase = cached.phase;
                state.turn.effect = cached.effect;
                state.turn.cachedEvent = [];
              } else {
                state.turn.phase = 'play';
                state.turn.phaseChanged = true;
              }

              state.dice.main.roll = [1, 1];
              state.dice.main.total = 0;
              state.dice.main.modifier = [];
              state.dice.main.modValues = [];
              delete state.turn.challenger;
              state.match.isReady.fill(null);

              setTimeout(() => {
                sendGameState(roomId);
              }, 1200);
            } else if (preppedCard.type === 'magic') {
              state.dice.main.roll = [1, 1];
              state.dice.main.total = 0;
              state.dice.main.modifier = [];
              state.dice.main.modValues = [];
              delete state.turn.challenger;
              state.match.isReady.fill(null);
              state.mainDeck.discardPile.push(preppedCard);
              useEffect(roomId, cardUserId, preppedCard);
            }
          }
        }

        // attack monster
        else if (
          state.mainDeck.preparedCard.card.type === CardType.large &&
          state.mainDeck.preparedCard.card.player === undefined
        ) {
          const preppedCard = state.mainDeck.preparedCard.card;

          if (
            meetsRollRequirements('pass', preppedCard, state.dice.main.total)
          ) {
            // monster slain
            state.mainDeck.preparedCard.successful = true;
            preppedCard.player = state.turn.player;
            state.board[state.turn.player].largeCards.push(preppedCard);
            state.mainDeck.monsters.map((val, i) => {
              if (val.id === preppedCard.id) {
                state.mainDeck.monsters[i] =
                  state.secret.monsterPile.pop() as MonsterCard;
              }
            });
            if (preppedCard.name === 'Mega Slime') {
              drawCards(roomId, playerNum, 2);
            } else if (preppedCard.name === 'Corrupted Sabretooth') {
              drawCards(roomId, playerNum, 1);
            }
            sendGameState(roomId);
            state.mainDeck.preparedCard = null;
            setTimeout(() => {
              state.dice.main.roll = [1, 1];
              state.dice.main.total = 0;
              state.dice.main.modifier = [];
              state.dice.main.modValues = [];

              if (state.board[state.turn.player].largeCards.length === 4) {
                state.match.isReady = state.board.map(
                  val => val.largeCards.length === 4
                );
                state.turn.phase = 'end-game';
                state.turn.phaseChanged = true;
                sendGameState(roomId);

                let start = Date.now();
                const timer = setInterval(() => {
                  let delta = Date.now() - start;
                  // random variable cos i don't need one specifically for game end timer
                  state.match.startRolls.maxVal = Math.floor(delta / 1000);
                  sendGameState(roomId);

                  if (delta / 1000 >= 180) {
                    disconnectAll(roomId);
                    delete rooms[roomId];
                    clearInterval(timer);
                  }
                }, 1000);
                return;
              } else if (state.turn.movesLeft === 0) {
                state.match.isReady.fill(null);
                endTurnDiscard(roomId, cardUserId);
              } else {
                state.match.isReady.fill(null);
                if (
                  state.turn.cachedEvent &&
                  state.turn.cachedEvent.length >= 1
                ) {
                  const cached = state.turn.cachedEvent.pop();
                  if (!cached) return;
                  state.turn.phase = cached.phase;
                  state.turn.effect = cached.effect;
                  state.turn.cachedEvent = [];
                } else {
                  state.turn.phase = 'play';
                  state.turn.phaseChanged = true;
                }
                sendGameState(roomId);
              }
            }, 1200);
          } else if (
            meetsRollRequirements('fail', preppedCard, state.dice.main.total)
          ) {
            // punishment
            state.dice.main.roll = [1, 1];
            state.dice.main.total = 0;
            state.dice.main.modifier = [];
            state.dice.main.modValues = [];
            state.mainDeck.preparedCard.successful = false;
            state.match.isReady.fill(null);
            useEffect(roomId, cardUserId, preppedCard);
          } else {
            // neutral
            state.mainDeck.preparedCard.successful = false;
            sendGameState(roomId);
            state.mainDeck.preparedCard = null;
            setTimeout(() => {
              state.dice.main.roll = [1, 1];
              state.dice.main.total = 0;
              state.dice.main.modifier = [];
              state.dice.main.modValues = [];

              if (state.turn.movesLeft === 0) {
                state.match.isReady.fill(null);
                endTurnDiscard(roomId, cardUserId);
              } else {
                state.match.isReady.fill(null);
                if (
                  state.turn.cachedEvent &&
                  state.turn.cachedEvent.length >= 1
                ) {
                  const cached = state.turn.cachedEvent.pop();
                  if (!cached) return;
                  state.turn.phase = cached.phase;
                  state.turn.effect = cached.effect;
                  state.turn.cachedEvent = [];
                } else {
                  state.turn.phase = 'play';
                  state.turn.phaseChanged = true;
                }
                sendGameState(roomId);
              }
            }, 1200);
          }
        }

        // hero ability
        else if (
          state.mainDeck.preparedCard &&
          state.mainDeck.preparedCard.card.type === CardType.hero &&
          state.mainDeck.preparedCard.card.player !== undefined
        ) {
          const preppedCard = state.mainDeck.preparedCard.card;

          if (
            meetsRollRequirements('pass', preppedCard, state.dice.main.total)
          ) {
            // pass
            state.dice.main.roll = [1, 1];
            state.dice.main.total = 0;
            state.dice.main.modifier = [];
            state.dice.main.modValues = [];
            state.mainDeck.preparedCard.successful = true;
            state.match.isReady.fill(null);

            if (
              preppedCard.item &&
              preppedCard.item.name === 'Suspiciously Shiny Coin'
            ) {
              useEffect(roomId, cardUserId, preppedCard.item);
            } else {
              useEffect(roomId, cardUserId, preppedCard);
            }

            // Arctic Aries passive: draw 1 card when successfully activating a Hero ability
            if (hasMonster(state, state.turn.player, 'Arctic Aries')) {
              drawCards(roomId, state.turn.player, 1);
            }
          } else {
            // fail
            state.mainDeck.preparedCard.successful = false;

            if (
              preppedCard.item &&
              preppedCard.item.name === 'Particularly Rusty Coin'
            ) {
              drawCards(roomId, state.turn.player, 1);
            }

            sendGameState(roomId);
            state.mainDeck.preparedCard = null;
            setTimeout(() => {
              state.dice.main.roll = [1, 1];
              state.dice.main.total = 0;
              state.dice.main.modifier = [];
              state.dice.main.modValues = [];

              if (state.turn.movesLeft === 0) {
                state.match.isReady.fill(null);
                endTurnDiscard(roomId, cardUserId);
              } else {
                state.match.isReady.fill(null);
                if (
                  state.turn.cachedEvent &&
                  state.turn.cachedEvent.length >= 1
                ) {
                  const cached = state.turn.cachedEvent.pop();
                  if (!cached) return;
                  state.turn.phase = cached.phase;
                  state.turn.effect = cached.effect;
                  state.turn.cachedEvent = [];
                } else {
                  state.turn.phase = 'play';
                  state.turn.phaseChanged = true;
                }
                sendGameState(roomId);
              }
            }, 1200);
          }
        }
      }
    } else return;
  }

  if (
    playerNum === -1 ||
    state.turn.phase !== 'modify' ||
    !info ||
    (info.dice === 1 && !state.dice.defend) ||
    (info.modifier.modifier.length === 1 && info.effect === 1) ||
    !discardCard(roomId, playerNum, info.modifier.id)
  ) {
    return;
  }

  const { dice, effect, modifier, guardianChoice } = info;

  // Crowned Serpent passive: Draw 1 card when any player plays a Modifier card
  for (let i = 0; i < rooms[roomId].numPlayers; i++) {
    if (hasMonster(state, i, 'Crowned Serpent')) {
      drawCards(roomId, i, 1);
    }
  }

  const rollOwner = dice === 0
    ? (state.turn.challenger !== undefined ? state.turn.challenger : state.turn.player)
    : state.turn.player;

  if (dice === 0) {
    const mod = modifier.modifier[effect] as number;
    state.dice.main.modifier.push(modifier);
    state.dice.main.modValues.push(mod);
    state.dice.main.total += mod;

    // Apply Abyss Queen passive: +1 to roll when another player plays a Modifier on your roll
    if (playerNum !== rollOwner && hasMonster(state, rollOwner, 'Abyss Queen')) {
      const aq = state.board[rollOwner].largeCards.find(card => card.type === CardType.large && !('class' in card) && card.name === 'Abyss Queen');
      if (aq) {
        state.dice.main.modifier.push(aq);
        state.dice.main.modValues.push(1);
        state.dice.main.total += 1;
      }
    }

    // Apply Guardian leader effect
    if (hasLeader(state, playerNum, HeroClass.guardian) && guardianChoice && guardianChoice !== 'none') {
      const leaderVal = guardianChoice === 'plus' ? 1 : -1;
      const leader = getLeader(state, playerNum);
      if (leader) {
        state.dice.main.modifier.push(leader);
        state.dice.main.modValues.push(leaderVal);
        state.dice.main.total += leaderVal;
      }
    }
  } else {
    const mod = modifier.modifier[effect] as number;
    if (!state.dice.defend) return;
    state.dice.defend.modifier.push(modifier);
    state.dice.defend.modValues.push(mod);
    state.dice.defend.total += mod;

    // Apply Abyss Queen passive: +1 to roll when another player plays a Modifier on your roll
    if (playerNum !== rollOwner && hasMonster(state, rollOwner, 'Abyss Queen')) {
      const aq = state.board[rollOwner].largeCards.find(card => card.type === CardType.large && !('class' in card) && card.name === 'Abyss Queen');
      if (aq) {
        state.dice.defend.modifier.push(aq);
        state.dice.defend.modValues.push(1);
        state.dice.defend.total += 1;
      }
    }

    // Apply Guardian leader effect
    if (hasLeader(state, playerNum, HeroClass.guardian) && guardianChoice && guardianChoice !== 'none') {
      const leaderVal = guardianChoice === 'plus' ? 1 : -1;
      const leader = getLeader(state, playerNum);
      if (leader) {
        state.dice.defend.modifier.push(leader);
        state.dice.defend.modValues.push(leaderVal);
        state.dice.defend.total += leaderVal;
      }
    }
  }

  state.match.isReady.fill(dice === 0 ? true : null);
  sendGameState(roomId);
};
