import React from 'react';
import { Socket } from 'socket.io-client';
import { ModifierCard, LeaderCard } from '../types';
import { getImage } from '../helpers/getImage';
import useClientContext from '../hooks/useClientContext';

interface ChooseModifyProps {
  socket: Socket;
  dice: 0 | 1;
  card: ModifierCard;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChooseModify: React.FC<ChooseModifyProps> = ({
  socket,
  dice,
  card,
  show,
  setShow
}) => {
  const {
    showHand,
    credentials: { roomId, userId },
    chosenCard,
    state: { val: state }
  } = useClientContext();

  const [selectedEffect, setSelectedEffect] = React.useState<0 | 1 | null>(null);
  const [showGuardian, setShowGuardian] = React.useState(false);

  const playerBoard = state.board[state.playerNum];
  const leaderCard = playerBoard?.largeCards.find(c => 'class' in c) as LeaderCard | undefined;
  const isGuardian = leaderCard?.class === 'guardian';

  function modify(effect: 0 | 1, guardianChoice: 'plus' | 'minus' | 'none' = 'none') {
    socket.emit(
      'modify-roll',
      roomId,
      userId,
      {
        modifier: card,
        effect,
        dice,
        guardianChoice
      },
      true
    );
  }

  function handleSelectEffect(effect: 0 | 1) {
    if (isGuardian) {
      setSelectedEffect(effect);
      setShowGuardian(true);
    } else {
      setShow(false);
      showHand.setLocked(false);
      modify(effect, 'none');
      setTimeout(() => {
        chosenCard.set(null);
      }, 200);
    }
  }

  function handleGuardianChoice(choice: 'plus' | 'minus' | 'none') {
    if (selectedEffect === null) return;
    setShow(false);
    showHand.setLocked(false);
    modify(selectedEffect, choice);
    setSelectedEffect(null);
    setShowGuardian(false);
    setTimeout(() => {
      chosenCard.set(null);
    }, 200);
  }

  return (
    <div className={`choose-modifier${show ? ' show' : ' hide'}`}>
      {showGuardian ? (
        <div className="guardian-choice-container" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(30, 30, 30, 0.85)',
          backdropFilter: 'blur(10px)',
          padding: '4vh 6vh',
          borderRadius: '2vh',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
        }}>
          <h2 style={{ fontSize: '3.5vh', margin: '0 0 1vh 0', color: '#ffb830' }}>Tù Và Bảo Hộ</h2>
          <h4 style={{ fontSize: '2vh', margin: '0 0 3vh 0', color: '#eee', fontWeight: 400 }}>Chọn căn chỉnh cho thẻ Sửa Đổi (+1 / -1):</h4>
          <div style={{ display: 'flex', gap: '2vw' }}>
            <button 
              className="button-modify plus" 
              onClick={() => handleGuardianChoice('plus')}
              style={{
                fontSize: '2.5vh',
                padding: '1.5vh 3vh',
                background: '#2eee9b',
                color: '#000',
                border: 'none',
                borderRadius: '1vh',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: '0.2s'
              }}
            >
              +1
            </button>
            <button 
              className="button-modify minus" 
              onClick={() => handleGuardianChoice('minus')}
              style={{
                fontSize: '2.5vh',
                padding: '1.5vh 3vh',
                background: '#f95151',
                color: '#fff',
                border: 'none',
                borderRadius: '1vh',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: '0.2s'
              }}
            >
              -1
            </button>
            <button 
              className="button-modify none" 
              onClick={() => handleGuardianChoice('none')}
              style={{
                fontSize: '2.5vh',
                padding: '1.5vh 3vh',
                background: '#555',
                color: '#fff',
                border: 'none',
                borderRadius: '1vh',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: '0.2s'
              }}
            >
              Không đổi
            </button>
          </div>
          <button 
            onClick={() => {
              setShowGuardian(false);
              setSelectedEffect(null);
            }}
            style={{
              marginTop: '3vh',
              background: 'transparent',
              color: '#999',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.8vh'
            }}
          >
            Quay lại
          </button>
        </div>
      ) : (
        card && card.type === 'modifier' && (
          <>
            <div
              className='left'
              onClick={() => {
                if (
                  (!card.modifier[1] && card.modifier[0] > 0) ||
                  card.modifier[1]
                ) {
                  handleSelectEffect(0);
                }
              }}
              style={{
                opacity:
                  (!card.modifier[1] && card.modifier[0] > 0) || card.modifier[1]
                    ? 1
                    : 0
              }}
            >
              +{card.modifier[0]}
            </div>
            <div className='center'>
              <img
                className='logo'
                src={
                  dice === 0
                    ? `${process.env.PUBLIC_URL}/assets/sword.webp`
                    : `${process.env.PUBLIC_URL}/assets/shield.webp`
                }
                alt={''}
                style={{ opacity: state.turn.challenger ? 1 : 0 }}
              />
              <div className='img-container'>
                <img
                  src={getImage(card)}
                  alt={card.name}
                  className='small-lg'
                  draggable='false'
                />
              </div>
              <div className='cancel-container'>
                <button
                  className='circular danger cancel'
                  onClick={() => {
                    setShow(false);
                    showHand.setLocked(false);
                    setTimeout(() => {
                      chosenCard.set(null);
                    }, 200);
                  }}
                >
                  <span className='material-symbols-outlined'>close</span>
                </button>
                <h5>Cancel</h5>
              </div>
            </div>
            <div
              className='right'
              onClick={() => {
                if (
                  (!card.modifier[1] && card.modifier[0] < 0) ||
                  card.modifier[1]
                ) {
                  handleSelectEffect(card.modifier[1] ? 1 : 0);
                }
              }}
              style={{
                opacity:
                  (!card.modifier[1] && card.modifier[0] < 0) || card.modifier[1]
                    ? 1
                    : 0
              }}
            >
              {card.modifier[1] ? card.modifier[1] : card.modifier[0]}
            </div>
          </>
        )
      )}
    </div>
  );
};

export default ChooseModify;
