import React, { useState } from 'react';
import useClientContext from '../hooks/useClientContext';
import AudioSettings from './AudioSettings';

interface MenuButtonsProps {
  showBoard: boolean;
  setShowBoard: React.Dispatch<React.SetStateAction<boolean>>;
  setShowHelp: React.Dispatch<React.SetStateAction<boolean>>;
  unreadCount: number;
  onClickChat: () => void;
}

const MenuButtons: React.FC<MenuButtonsProps> = ({
  showBoard,
  setShowBoard,
  setShowHelp,
  unreadCount,
  onClickChat
}) => {
  const {
    state: { val: state },
    chosenCard,
    showHand,
    shownCard
  } = useClientContext();

  const [isAudioOpen, setIsAudioOpen] = useState(false);

  return (
    <>
      <button
        className={`circular pass ${
          state.turn.player === state.playerNum &&
          (state.turn.phase === 'draw' || state.turn.phase === 'play') &&
          !state.turn.pause
            ? 'show'
            : 'hide'
        }`}
        onClick={() => {
          if (
            state.turn.player === state.playerNum &&
            (state.turn.phase === 'draw' || state.turn.phase === 'play') &&
            !state.turn.pause
          ) {
            chosenCard.setShow(true);
            chosenCard.setCustomText('Pass');
            chosenCard.setCustomCenter('forward');
          }
        }}
      >
        <span className='material-symbols-outlined icon'>forward</span>
      </button>
      <div
        className={`help-trigger show`}
        onMouseEnter={() => {
          setShowHelp(true);
        }}
        onMouseLeave={() => {
          setShowHelp(false);
        }}
      >
        <span className='material-symbols-outlined icon'>help</span>
      </div>
      <button
        className={`circular show-board-trigger ${
          !showHand.animation &&
          (state.turn.phase === 'attack-roll' ||
            state.turn.phase === 'challenge' ||
            state.turn.phase === 'challenge-roll' ||
            state.turn.phase === 'modify' ||
            (state.turn.phase === 'use-effect' &&
              state.turn.effect &&
              (state.turn.effect.action === 'choose-player' ||
                state.turn.effect.action === 'choose-hand' ||
                state.turn.effect.action === 'choose-other-hand-hide' ||
                state.turn.effect.action === 'choose-other-hand-show' ||
                state.turn.effect.action === 'choose-discard' ||
                state.turn.effect.action === 'choose-two' ||
                state.turn.effect.action === 'reveal')) ||
            state.turn.phase === 'use-effect-roll' ||
            state.turn.phase === 'end-turn-discard' ||
            state.turn.phase === 'end-game')
            ? 'show'
            : 'hide'
        }`}
        onClick={() => {
          if (
            !showHand.animation &&
            (state.turn.phase === 'attack-roll' ||
              state.turn.phase === 'challenge' ||
              state.turn.phase === 'challenge-roll' ||
              state.turn.phase === 'modify' ||
              (state.turn.phase === 'use-effect' &&
                state.turn.effect &&
                (state.turn.effect.action === 'choose-hand' ||
                  state.turn.effect.action === 'choose-other-hand-hide' ||
                  state.turn.effect.action === 'choose-other-hand-show' ||
                  state.turn.effect.action === 'choose-discard' ||
                  state.turn.effect.action === 'choose-two' ||
                  state.turn.effect.action === 'choose-cards' ||
                  state.turn.effect.action === 'reveal')) ||
              state.turn.phase === 'use-effect-roll' ||
              state.turn.phase === 'end-turn-discard' ||
              state.turn.phase === 'end-game')
          ) {
            setShowBoard(val => !val);

            if (state.turn.phase !== 'end-turn-discard') {
              shownCard.setLocked(val => !val);
            }

            if (
              (state.turn.effect &&
                (state.turn.effect.action === 'choose-hand' ||
                  state.turn.effect.action === 'choose-other-hand-hide' ||
                  state.turn.effect.action === 'choose-other-hand-show' ||
                  state.turn.effect.action === 'choose-two' ||
                  state.turn.effect.action === 'choose-cards' ||
                  state.turn.effect.action === 'reveal' ||
                  state.turn.effect.action === 'choose-discard')) ||
              state.turn.phase === 'end-turn-discard'
            ) {
              if (showBoard) {
                if (
                  !state.turn.effect ||
                  (state.turn.effect.action !== 'choose-other-hand-hide' &&
                    state.turn.effect.action !== 'choose-other-hand-show' &&
                    state.turn.effect.action !== 'choose-two' &&
                    state.turn.effect.action !== 'choose-cards' &&
                    state.turn.effect.action !== 'reveal' &&
                    state.turn.effect.action !== 'choose-discard')
                ) {
                  // show hand when popup active
                  showHand.set(true);
                }
                showHand.setLocked(true);
              } else {
                if (
                  !state.turn.effect ||
                  (state.turn.effect.action !== 'choose-other-hand-hide' &&
                    state.turn.effect.action !== 'choose-other-hand-show' &&
                    state.turn.effect.action !== 'choose-two' &&
                    state.turn.effect.action !== 'choose-cards' &&
                    state.turn.effect.action !== 'reveal' &&
                    state.turn.effect.action !== 'choose-discard')
                ) {
                  showHand.set(false);
                }
                showHand.setLocked(false);
              }
            }
          }
        }}
      >
        <span className='material-symbols-outlined icon'>flip</span>
      </button>

      {/* SKIP (USE EFFECT) */}
      {state.turn.phase === 'use-effect' &&
        state.turn.effect &&
        state.turn.effect.players.some(val => val === state.playerNum) &&
        state.turn.effect.val.curr >= state.turn.effect.val.min && (
          <button
            className='circular skip'
            onClick={() => {
              chosenCard.setShow(true);
              chosenCard.setCustomText('Skip');
              chosenCard.setCustomCenter('start');
            }}
            style={{
              right:
                state.turn.phase === 'use-effect' &&
                state.turn.effect &&
                (state.turn.effect.action === 'choose-player' ||
                  state.turn.effect.action === 'choose-hand' ||
                  state.turn.effect.action === 'choose-other-hand-hide' ||
                  state.turn.effect.action === 'choose-other-hand-show' ||
                  state.turn.effect.action === 'choose-discard' ||
                  state.turn.effect.action === 'choose-two' ||
                  state.turn.effect.action === 'reveal')
                  ? '9.4vh'
                  : '1.5vh'
            }}
          >
            <span className='material-symbols-outlined'>start</span>
          </button>
        )}
      {/* EXIT MATCH */}
      <button
        className="circular show"
        onClick={() => {
          chosenCard.setShow(true);
          chosenCard.setCustomText('Exit Match');
          chosenCard.setCustomCenter('logout');
        }}
        style={{
          position: 'absolute',
          top: '1vh',
          left: '9vh',
          backgroundColor: '#DC143C'
        }}
      >
        <span className="material-symbols-outlined icon">logout</span>
      </button>
      {/* AUDIO SETTINGS */}
      <button
        className="circular show"
        onClick={() => setIsAudioOpen(true)}
        style={{
          position: 'absolute',
          top: '1vh',
          left: '1vh',
          backgroundColor: '#fc7c37'
        }}
      >
        <span className="material-symbols-outlined icon">volume_up</span>
      </button>

      {/* CHAT TOGGLE */}
      <button
        className="circular show"
        onClick={onClickChat}
        style={{
          position: 'absolute',
          top: '1vh',
          left: '17vh',
          backgroundColor: '#4a3b32',
          border: '1px solid #fc7c37',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <span className="material-symbols-outlined icon">forum</span>
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            backgroundColor: '#DC143C',
            color: 'white',
            borderRadius: '50%',
            padding: '2px 6px',
            fontSize: '1.2vh',
            fontWeight: 'bold',
            boxShadow: '0 2px 5px rgba(0,0,0,0.5)',
            lineHeight: 1
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      <AudioSettings isOpen={isAudioOpen} onClose={() => setIsAudioOpen(false)} />
    </>
  );
};

export default MenuButtons;
