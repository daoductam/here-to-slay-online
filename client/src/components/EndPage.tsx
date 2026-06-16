import React from 'react';
import { Socket } from 'socket.io-client';
import useClientContext from '../hooks/useClientContext';

const EndPage: React.FC<{ showBoard: boolean; socket: Socket | null }> = ({ showBoard, socket }) => {
  const {
    credentials,
    state: { val: state }
  } = useClientContext();

  const handlePlayAgain = () => {
    if (socket && credentials) {
      socket.emit('play-again', credentials.roomId, credentials.userId);
    }
  };

  const handleReturnToLobby = () => {
    if (socket && credentials) {
      socket.emit('return-to-lobby', credentials.roomId, credentials.userId);
    }
  };

  return (
    <div
      className={`end-page ${
        state.turn.phase === 'end-game' && !showBoard ? 'show' : 'hide'
      }`}
    >
      {state.turn.phase === 'end-game' &&
        state.match.isReady.filter(val => val === true).length > 0 && (
          <>
            <div className='helper-text-container show' style={{ top: '10vh' }}>
              <h3 style={{ fontSize: '15vh', marginTop: '29vh' }}>
                {state.match.isReady.filter(val => val === true).length === 1
                  ? 'Victory!'
                  : 'Draw'}
              </h3>
            </div>
            <h1 style={{ marginTop: '50vh' }}>
              {state.match.players.map((val, i) =>
                state.match.isReady[i] ? (
                  <div key={i} style={{ color: '#fc7c37', fontSize: '8vh' }}>
                    {val}
                  </div>
                ) : (
                  <></>
                )
              )}
            </h1>

            <div style={{
              display: 'flex',
              gap: '20px',
              marginTop: '5vh',
              zIndex: 1001,
              position: 'relative'
            }}>
              <button 
                onClick={handlePlayAgain}
                style={{
                  padding: '12px 24px',
                  fontSize: '2.5vh',
                  minWidth: '22vh',
                  cursor: 'pointer',
                  backgroundColor: '#fc7c37',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 6px #ca500f',
                  transition: 'transform 0.1s, box-shadow 0.1s',
                  height: 'auto'
                }}
              >
                Chơi tiếp ván mới
              </button>
              <button 
                onClick={handleReturnToLobby}
                style={{
                  padding: '12px 24px',
                  fontSize: '2.5vh',
                  minWidth: '22vh',
                  cursor: 'pointer',
                  backgroundColor: '#444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 6px #222',
                  transition: 'transform 0.1s, box-shadow 0.1s',
                  height: 'auto'
                }}
              >
                Quay lại phòng chờ
              </button>
            </div>

            <div className='timer'>
              <h1>{180 - state.match.startRolls.maxVal}s</h1>
              <h5>Lobby Closes</h5>
            </div>
          </>
        )}
    </div>
  );
};

export default EndPage;
