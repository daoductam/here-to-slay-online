import React, { useEffect, useState, useRef } from 'react';
import { isEmpty } from 'lodash';
import '../style/game.css';
import '../style/index.css';
import { useNavigate } from 'react-router-dom';
import { Socket, io } from 'socket.io-client';
import { CardType, GameState, allCards, ChatMessage } from '../types';
import ChatSidebar from '../components/ChatSidebar';
import StartRoll from '../components/StartRoll';
import MainBoard from '../components/MainBoard';
import Hand from '../components/Hand';
import ShownCard from '../components/ShownCard';
import ChallengePopup from '../components/ChallengePopup';
import useClientContext from '../hooks/useClientContext';
import HelperText from '../components/HelperText';
import ShownCardTop from '../components/ShownCardTop';
import TopMenu from '../components/TopMenu';
import { showText } from '../helpers/showText';
import DiscardPile from '../components/DiscardPile';
import EffectPopup from '../components/EffectPopup';
import MenuButtons from '../components/MenuButtons';
import HelpCards from '../components/HelpCards';
import { isCard } from '../helpers/isCard';
import DiscardPopup from '../components/DiscardPopup';
import ConfirmPopup from '../components/ConfirmPopup';
import RollPopup from '../components/RollPopup';
import { meetsRollRequirements } from '../helpers/meetsRequirements';
import EndPage from '../components/EndPage';
import { everyCard, criticalAssets, deferredAssets } from '../cards';
import { getImage } from '../helpers/getImage';
import useAudio from '../hooks/useAudio';

const Game: React.FC = () => {
  const navigate = useNavigate();
  const {
    credentials,
    state: { val: state, set: setState },
    allowedCards,
    showRoll,
    hasRolled,
    showPopup,
    showHand,
    shownCard,
    showHelperText,
    mode
  } = useClientContext();

  // variables
  const [socket, setSocket] = useState<Socket | null>(null);
  
  const { playBGM, playSFX, stopBGM } = useAudio();
  const prevStateRef = useRef<GameState | null>(null);

  const [showHelp, setShowHelp] = useState(false);
  const [rollSummary, setRollSummary] = useState<number[]>([]);
  const [activeDice, setActiveDice] = useState<0 | 1>(0);
  const [showBoard, setShowBoard] = useState(false);

  const [showDiscardPile, setShowDiscardPile] = useState(false);
  const [showEffectPopup, setShowEffectPopup] = useState(false);
  const [showDiscardPopup, setShowDiscardPopup] = useState(false);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [unreadChatCount, setUnreadChatCount] = useState(0);

  const isChatOpenRef = useRef(isChatOpen);
  useEffect(() => {
    isChatOpenRef.current = isChatOpen;
  }, [isChatOpen]);

  const [loadedCritical, setLoadedCritical] = useState(0);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = e => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };
  const onTouchMove: React.TouchEventHandler<HTMLDivElement> = e =>
    setTouchEnd(e.targetTouches[0].clientY);
  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = e => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isTopSwipe = distance > 80;
    const isBottomSwipe = distance < -80;
    if (isTopSwipe) {
      if (!showHand.locked) {
        showHand.set(true);
      }
    } else if (isBottomSwipe) {
      if (!showHand.locked) {
        showHand.set(false);
      }
    }
  };

  useEffect(() => {
    if (!credentials) {
      navigate('/');
      return;
    } else {
      // create socket connection
      const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:4000';
      let socket = io(serverUrl);
      
      socket.on('connect', () => {
        socket.emit(
          'enter-lobby',
          credentials.roomId,
          credentials.userId,
          localStorage.getItem('username'),
          (successful: boolean) => {
            if (!successful) {
              localStorage.removeItem('credentials');
              navigate('/');
            } else {
              socket.emit('start-match', credentials.roomId, credentials.userId);
            }
          }
        );
      });

      socket.on('match-aborted', (playerName: string) => {
        alert(`${playerName} đã rời khỏi trận đấu. Đang quay về trang chủ.`);
        localStorage.removeItem('credentials');
        navigate('/');
      });
      socket.on('return-to-lobby', () => {
        navigate('/lobby');
      });

      socket.on('chat:message', (msg: ChatMessage) => {
        setChatMessages(prev => [...prev, msg]);
        if (!isChatOpenRef.current && msg.sender !== localStorage.getItem('username')) {
          setUnreadChatCount(prev => prev + 1);
          playSFX('chat');
        }
      });

      socket.on('chat:history', (history: ChatMessage[]) => {
        setChatMessages(history);
      });

      setSocket(socket);

      socket.on('game-state', (newState: GameState) => {
        console.log(newState);

        const prevState = prevStateRef.current;
        prevStateRef.current = newState;

        // Dynamic BGM Transitions
        if (newState.turn.phase === 'end-game') {
          playBGM('victory');
        } else if (
          newState.turn.phase === 'challenge' ||
          newState.turn.phase === 'challenge-roll' ||
          newState.turn.phase === 'attack-roll' ||
          newState.turn.phase === 'use-effect-roll'
        ) {
          playBGM('battle');
        } else {
          playBGM('gameplay');
        }

        // SFX triggers
        if (prevState) {
          // Dice roll SFX
          if (
            (newState.turn.isRolling && !prevState.turn.isRolling) ||
            (newState.dice.main.total > 0 && prevState.dice.main.total === 0) ||
            (newState.dice.defend?.total && !prevState.dice.defend?.total)
          ) {
            playSFX('dice');
          }

          // Challenge trigger SFX
          if (newState.turn.phase === 'challenge' && prevState.turn.phase !== 'challenge') {
            playSFX('challenge');
          }

          // Card play SFX
          if (newState.mainDeck.preparedCard && !prevState.mainDeck.preparedCard) {
            playSFX('play');
          }

          // Monster Slay SFX
          const getLargeCardCount = (s: GameState) =>
            s.board.reduce((acc, b) => acc + (b.largeCards ? b.largeCards.length : 0), 0);
          if (getLargeCardCount(newState) > getLargeCardCount(prevState)) {
            playSFX('slay');
          }

          // Card draw SFX
          if (newState.playerNum !== -1) {
            const newHand = newState.players[newState.playerNum]?.hand?.length || 0;
            const oldHand = prevState.players[newState.playerNum]?.hand?.length || 0;
            if (newHand > oldHand) {
              playSFX('draw');
            }
          }
        }

        setState(newState);
        if (newState.turn.phase !== 'end-game') setShowBoard(_ => false);

        /* PHASES */
        switch (newState.turn.phase) {
          case 'start-roll':
            if (newState.match.startRolls.rolls[newState.turn.player] !== 0) {
              // new roll
              setTimeout(() => {
                setRollSummary([]);
                for (
                  let i = 0;
                  i < newState.match.startRolls.inList.length;
                  i++
                ) {
                  let num = newState.match.startRolls.inList[i];
                  if (newState.match.startRolls.rolls[num] !== 0) {
                    setRollSummary(e => [...e, num]);
                  }
                }
                showRoll.set(true);
              }, 1000);
              setTimeout(() => {
                showRoll.set(false);
                hasRolled.set(false);
              }, 3000);
            } else {
              // new round
              setRollSummary([]);
              for (
                let i = 0;
                i < newState.match.startRolls.inList.length;
                i++
              ) {
                let num = newState.match.startRolls.inList[i];
                if (newState.match.startRolls.rolls[num] !== 0) {
                  setRollSummary(e => [...e, num]);
                }
              }
              hasRolled.set(false);
              showRoll.set(false);
            }
            break;

          case 'draw':
            showPopup.set(false);
            setShowEffectPopup(false);
            setShowDiscardPopup(false);
            showHand.setLocked(false);
            shownCard.setLocked(false);
            allowedCards.set([]);

            if (newState.turn.phaseChanged) {
              showText(showHelperText, 'Draw');
              showHand.set(false);
              shownCard.set(null);
              shownCard.setPos(null);
            }
            break;

          case 'challenge':
            setShowDiscardPopup(false);
            setShowEffectPopup(false);
            setActiveDice(0);
            showPopup.set(true);
            showHand.setLocked(false);

            if (!showBoard) {
              shownCard.setLocked(true);
            }

            if (newState.turn.phaseChanged) {
              shownCard.setPos(null);
              shownCard.set(null);
              showHand.set(false);
            }
            break;

          case 'challenge-roll':
            setShowDiscardPopup(false);
            setShowEffectPopup(false);
            setActiveDice(0);
            showPopup.set(true);
            showRoll.set(false);
            showHand.setLocked(false);
            if (!showBoard) {
              shownCard.setLocked(true);
            }
            if (newState.dice.defend && newState.dice.defend.total > 0) {
              setActiveDice(1);
            }

            if (newState.dice.main.total > 0) {
              setTimeout(() => {
                showRoll.set(true);
              }, 1000);
              setTimeout(() => {
                if (newState.dice.defend?.total) {
                  showRoll.set(false);
                }
                hasRolled.set(false);

                if (
                  newState.dice.main.total > 0 &&
                  newState.dice.defend?.total === 0
                ) {
                  setActiveDice(1);
                }
              }, 3000);
            }

            if (newState.turn.phaseChanged) {
              shownCard.setPos(null);
              shownCard.set(null);
              showHand.set(false);
            }
            break;

          case 'attack-roll':
            setShowEffectPopup(false);
            setShowDiscardPopup(false);
            showRoll.set(false);
            showHand.setLocked(false);
            if (!showBoard) {
              shownCard.setLocked(true);
            }

            if (newState.dice.main.total > 0) {
              setTimeout(() => {
                showRoll.set(true);
              }, 1000);
              setTimeout(() => {
                hasRolled.set(false);
              }, 3000);
            }

            if (newState.turn.phaseChanged) {
              shownCard.setPos(null);
              shownCard.set(null);
              showHand.set(false);
            }
            break;

          case 'use-effect-roll':
            setShowDiscardPopup(false);
            setShowEffectPopup(false);
            showRoll.set(false);
            showHand.setLocked(false);
            if (!showBoard) {
              shownCard.setLocked(true);
            }

            if (newState.dice.main.total > 0) {
              setTimeout(() => {
                showRoll.set(true);
              }, 1000);
              setTimeout(() => {
                hasRolled.set(false);
              }, 3000);
            }

            if (newState.turn.phaseChanged) {
              shownCard.setPos(null);
              shownCard.set(null);
              showHand.set(false);
            }
            break;

          case 'modify':
            showPopup.set(true);
            showHand.setLocked(false);
            if (!showBoard) {
              shownCard.setLocked(true);
            }

            if (!newState.mainDeck.preparedCard) return;

            if (newState.match.isReady.every(val => val === true)) {
              allowedCards.set([CardType.modifier]);
              setActiveDice(0);
            } else if (newState.match.isReady.every(val => val === null)) {
              allowedCards.set([CardType.modifier]);
              setActiveDice(1);
            } else if (newState.match.isReady[newState.playerNum] === false) {
              allowedCards.set([]);
            } else {
              allowedCards.set([CardType.modifier]);
            }

            if (newState.dice.defend) {
              if (newState.mainDeck.preparedCard.successful) {
                showText(showHelperText, 'Card Success');
              } else if (newState.mainDeck.preparedCard.successful === false) {
                showText(showHelperText, 'Card Failed');
              }
            } else {
              if (newState.mainDeck.preparedCard.card.type === CardType.hero) {
                if (newState.mainDeck.preparedCard.successful === false) {
                  showText(showHelperText, 'Ability Failed');
                }
              } else if (
                newState.mainDeck.preparedCard.card.type === CardType.large
              ) {
                if (newState.mainDeck.preparedCard.successful) {
                  showText(showHelperText, 'Monster Slain');
                } else if (
                  !meetsRollRequirements(
                    'fail',
                    newState.mainDeck.preparedCard.card,
                    newState.dice.main.total
                  ) &&
                  newState.mainDeck.preparedCard.successful === false
                ) {
                  showText(showHelperText, 'Attack Failed');
                }
              }
            }

            if (newState.turn.phaseChanged) {
              shownCard.setPos(null);
              shownCard.set(null);
              showHand.set(false);
            }
            break;

          case 'play':
            showPopup.set(false);
            setShowDiscardPopup(false);
            setShowEffectPopup(false);
            showHand.setLocked(false);
            shownCard.setLocked(false);

            allowedCards.set([]);

            if (
              newState.turn.player === newState.playerNum &&
              !newState.turn.pause &&
              newState.turn.movesLeft
            ) {
              allowedCards.set([CardType.hero, CardType.magic]);
              if (
                newState.board.some(val =>
                  val.heroCards.some(val => val && !val.item)
                )
              ) {
                allowedCards.set(val => [...val, CardType.item]);
              }
            }

            if (
              newState.turn.pause &&
              newState.mainDeck.preparedCard &&
              (newState.mainDeck.preparedCard.card.type === CardType.magic ||
                newState.mainDeck.preparedCard.card.type === CardType.item)
            ) {
              shownCard.setLocked(true);
              shownCard.setPos('center');
              shownCard.set(newState.mainDeck.preparedCard.card);
            }
            if (newState.turn.pause) {
              showHand.set(false);
              showHand.setLocked(true);
            }

            if (newState.turn.phaseChanged) {
              showText(showHelperText, 'Play');
              showHand.set(false);
              shownCard.set(null);
              shownCard.setPos(null);
            }
            break;

          case 'choose-hero':
            setShowDiscardPopup(false);
            showHand.setLocked(false);
            showPopup.set(false);
            shownCard.setLocked(false);
            allowedCards.set([]);
            if (newState.turn.phaseChanged) {
              showText(showHelperText, 'Place Item');
              shownCard.set(null);
              shownCard.setPos(null);
              showHand.set(false);
            }
            break;

          case 'use-effect':
            setShowDiscardPopup(false);
            showPopup.set(false);
            if (!newState.turn.effect) return;
            showHand.setLocked(false);
            if (!showBoard) {
              shownCard.setLocked(true);
              shownCard.setPos(null);
              shownCard.set(null);
            }
            if (
              newState.turn.effect.allowedCards &&
              newState.turn.effect.players.some(
                val => val === newState.playerNum
              )
            ) {
              allowedCards.set(newState.turn.effect.allowedCards);
            } else {
              allowedCards.set([]);
            }

            if (newState.turn.phaseChanged) {
              if (newState.turn.effect.card.type === CardType.hero) {
                showText(showHelperText, 'Hero Ability');
              } else if (newState.turn.effect.card.type === CardType.magic) {
                showText(showHelperText, 'Magic Card');
              } else {
                showText(showHelperText, 'Punishment');
              }
            }

            if (newState.turn.effect) {
              switch (newState.turn.effect.action) {
                case 'choose-discard':
                  setShowEffectPopup(true);
                  if (!showBoard) {
                    showHand.set(false);
                    showHand.setLocked(true);
                  }
                  break;
                case 'choose-hand':
                  if (!showBoard) {
                    showHand.set(true);
                    showHand.setLocked(true);
                  }
                  shownCard.setLocked(false);

                  if (
                    newState.turn.effect &&
                    !newState.turn.effect.purpose.includes('Discard')
                  ) {
                    setShowEffectPopup(true);
                    if (
                      newState.turn.effect.choice &&
                      newState.turn.effect.choice[0] === 0
                    ) {
                      showText(showHelperText, 'No Card Picked');
                    } else if (
                      newState.turn.effect.choice &&
                      isCard(newState.turn.effect.choice[0])
                    ) {
                      setShowEffectPopup(false);
                      shownCard.set(newState.turn.effect.choice[0]);
                      shownCard.setPos('center');
                      shownCard.setLocked(true);
                      showHand.set(false);
                    }
                  } else if (newState.turn.effect) {
                    setShowDiscardPopup(true);
                  }
                  break;
                case 'choose-cards':
                  setShowEffectPopup(true);
                  if (!showBoard) {
                    showHand.setLocked(true);
                    showHand.set(false);
                  }
                  shownCard.setLocked(false);
                  break;
                case 'choose-other-hand-hide':
                  setShowEffectPopup(true);
                  if (!showBoard) {
                    showHand.setLocked(true);
                    showHand.set(false);
                  }
                  break;
                case 'choose-other-hand-show':
                  setShowEffectPopup(true);
                  if (!showBoard) {
                    showHand.setLocked(true);
                    showHand.set(false);
                  }
                  shownCard.setLocked(false);
                  break;
                case 'draw':
                  setShowEffectPopup(false);
                  showHand.setLocked(false);
                  showHand.set(false);
                  shownCard.setLocked(false);
                  if (
                    newState.turn.effect &&
                    newState.turn.effect.actionChanged
                  ) {
                    showText(showHelperText, newState.turn.effect.purpose);
                  }
                  break;
                case 'choose-two':
                  setShowEffectPopup(true);
                  if (!showBoard) {
                    showHand.set(false);
                    showHand.setLocked(true);
                  }
                  break;
                case 'reveal':
                  setShowEffectPopup(true);
                  if (!showBoard) {
                    showHand.set(false);
                    showHand.setLocked(true);
                  }
                  break;
                default:
                  setShowEffectPopup(false);
                  if (!showBoard) {
                    showHand.set(false);
                  }
                  shownCard.setLocked(false);
              }
            }
            break;

          case 'end-turn-discard':
            setShowEffectPopup(false);
            setShowDiscardPopup(true);
            allowedCards.set([]);

            if (newState.turn.phaseChanged) {
              showText(showHelperText, 'Discard');
            }

            if (!showBoard) {
              showHand.set(true);
              showHand.setLocked(true);
            }
            if (
              newState.turn.player === newState.playerNum &&
              newState.players[newState.playerNum].numCards > 7
            ) {
              allowedCards.set(allCards);
              if (!newState.turn.phaseChanged) {
                shownCard.set(null);
              }
            }
            break;

          case 'end-game':
            showPopup.set(false);
            setShowEffectPopup(false);
            showHand.setLocked(false);
            shownCard.setLocked(false);
            if (showBoard) {
              setShowBoard(true);
            }
            allowedCards.set([]);

            if (180 - newState.match.startRolls.maxVal <= 0) {
              localStorage.removeItem('credentials');
              navigate('/');
            }
        }
      });

      mode.set(
        !window.matchMedia('(pointer: none)').matches ? 'touch' : 'cursor'
      );

      // Phase 1: load critical assets — unblocks game UI when complete
      for (let i = 0; i < criticalAssets.length; i++) {
        let img = new Image();
        img.onload = () => {
          img.onload = null;
          setLoadedCritical(val => ++val);
        };
        let card = criticalAssets[i];
        img.src = typeof card === 'string' ? card : (getImage(card) as string);
      }

      // Phase 2: load deferred assets in background — fire-and-forget
      for (let i = 0; i < deferredAssets.length; i++) {
        let img = new Image();
        let card = deferredAssets[i];
        img.src = typeof card === 'string' ? card : (getImage(card) as string);
      }

      const handleViewportReset = () => {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
      };
      window.addEventListener('resize', handleViewportReset);
      window.addEventListener('orientationchange', handleViewportReset);

      return () => {
        if (socket) {
          socket.disconnect();
        }
        stopBGM();
        window.removeEventListener('resize', handleViewportReset);
        window.removeEventListener('orientationchange', handleViewportReset);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="orientation-lock-overlay">
        <div className="orientation-lock-content">
          <span className="material-symbols-outlined screen-rotate-icon">screen_rotation</span>
          <h2>Xoay ngang màn hình</h2>
          <p>Vui lòng xoay ngang điện thoại để trải nghiệm trận đấu tốt nhất.</p>
        </div>
      </div>
      {credentials && !isEmpty(state) && socket && (
        <div
          onClick={
            state.turn.isRolling && state.turn.phase === 'start-roll'
              ? () => {
                  if (
                    !state ||
                    !socket ||
                    hasRolled.val ||
                    state.turn.player !== state.playerNum
                  )
                    return;

                  hasRolled.set(true);
                  socket.emit(
                    'start-roll',
                    credentials.roomId,
                    credentials.userId
                  );
                }
              : () => {}
          }
        >
          <div
            className='game'
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onTouchMove={onTouchMove}
          >
            {state.match.paused ? (
              <div className="paused-overlay" style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.95)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 99999,
                color: '#fff'
              }}>
                <span className="material-symbols-outlined rotate" style={{
                  animation: 'rotation 2s infinite linear',
                  fontSize: '10vh',
                  color: '#fc7c37',
                  marginBottom: '4vh'
                }}>sync</span>
                <h2 style={{ fontSize: '4vh', margin: '1vh 0' }}>Trận đấu tạm dừng</h2>
                <p style={{ fontSize: '2.5vh', color: '#ccc', maxWidth: '600px', textAlign: 'center' }}>
                  Người chơi <strong>{state.match.players[state.match.disconnectedPlayerNum ?? 0]}</strong> đã mất kết nối.
                </p>
                <p style={{ fontSize: '3vh', color: '#fc7c37', marginTop: '2vh' }}>
                  Đang chờ kết nối lại: <strong>{state.match.disconnectTimeLeft}s</strong>
                </p>
                <button
                  onClick={() => {
                    socket?.emit('exit-match', credentials?.roomId, credentials?.userId);
                  }}
                  style={{
                    marginTop: '4vh',
                    padding: '1.2vh 2.4vh',
                    fontSize: '2.2vh',
                    backgroundColor: '#DC143C',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px #a00d0d',
                    cursor: 'pointer',
                    color: 'white'
                  }}
                >
                  Thoát trận đấu
                </button>
              </div>
            ) : state.turn.phase === 'start-roll' ? (
              <StartRoll rollSummary={rollSummary} />
            ) : loadedCritical === criticalAssets.length ? (
              <>
                <TopMenu />

                <MainBoard
                  socket={socket}
                  setShowDiscardPile={setShowDiscardPile}
                />

                <DiscardPile
                  showDiscardPile={showDiscardPile}
                  setShowDiscardPile={setShowDiscardPile}
                />
                <EffectPopup
                  socket={socket}
                  show={showEffectPopup}
                  showBoard={showBoard}
                />
                <DiscardPopup show={showDiscardPopup} showBoard={showBoard} />
                <ChallengePopup
                  socket={socket}
                  activeDice={activeDice}
                  setActiveDice={setActiveDice}
                  showBoard={showBoard}
                />
                <RollPopup socket={socket} showBoard={showBoard} />

                <ShownCard />
                <ShownCardTop />

                <Hand setShowBoard={setShowBoard} />

                <HelperText />

                <MenuButtons
                  showBoard={showBoard}
                  setShowBoard={setShowBoard}
                  setShowHelp={setShowHelp}
                  unreadCount={unreadChatCount}
                  onClickChat={() => {
                    setIsChatOpen(true);
                    setUnreadChatCount(0);
                  }}
                />

                <EndPage showBoard={showBoard} socket={socket} />

                <HelpCards showHelp={showHelp} />

                <ConfirmPopup socket={socket} />

                <ChatSidebar
                  isOpen={isChatOpen}
                  onClose={() => setIsChatOpen(false)}
                  messages={chatMessages}
                  onSendMessage={(text) => {
                    socket?.emit('chat:send', credentials?.roomId, credentials?.userId, text);
                  }}
                  username={localStorage.getItem('username') || ''}
                />
              </>
            ) : (
              <div className='load'>
                <div className='content'>
                  <span className='material-symbols-outlined rotate'>
                    progress_activity
                  </span>
                  <h6>
                    Loading Assets
                    {'.'.repeat((loadedCritical % 3) + 1)}
                  </h6>
                  <div className='loading'>
                    <div
                      className='inner'
                      style={{
                        width: `${(loadedCritical / criticalAssets.length) * 25}vw`,
                        transition: 'ease-in-out 0.15s'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Game;
