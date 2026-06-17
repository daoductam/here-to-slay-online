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
          <div className='end-game-container'>
            <div className='end-game-banner'>
              <h3 className='end-game-status'>
                {state.match.isReady.filter(val => val === true).length === 1
                  ? 'Victory!'
                  : 'Draw'}
              </h3>
            </div>
            
            <span className='end-game-winner-title'>Winner</span>
            <div className='end-game-winners'>
              {state.match.players.map((val, i) =>
                state.match.isReady[i] ? (
                  <div key={i} className='winner-name'>
                    {val}
                  </div>
                ) : null
              )}
            </div>

            <div className='end-game-buttons'>
              <button 
                onClick={handlePlayAgain}
                className='end-game-btn play-again-btn'
              >
                Chơi tiếp ván mới
              </button>
              <button 
                onClick={handleReturnToLobby}
                className='end-game-btn return-lobby-btn'
              >
                Quay lại phòng chờ
              </button>
            </div>

            <div className='end-game-timer'>
              <h1>{180 - state.match.startRolls.maxVal}s</h1>
              <h5>Lobby Closes</h5>
            </div>
          </div>
        )}
    </div>
  );
};

export default EndPage;
