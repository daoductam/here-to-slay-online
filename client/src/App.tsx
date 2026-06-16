import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { criticalAssets, deferredAssets } from './cards';
import { getImage } from './helpers/getImage';
import GameGuide from './components/GameGuide';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:4000';

function App() {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState<{ [key: string]: { joined: number; target: number } }>({});
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [targetPlayers, setTargetPlayers] = useState(3);

  useEffect(() => {
    const uname = localStorage.getItem('username');
    if (uname) {
      setUsername(uname);
    }
    const credentials = localStorage.getItem('credentials');
    if (credentials) {
      navigate('/lobby');
    }

    // Phase 1: preload critical assets first
    for (let i = 0; i < criticalAssets.length; i++) {
      let img = new Image();
      let card = criticalAssets[i];
      img.src = typeof card === 'string' ? card : (getImage(card) as string);
    }

    // Phase 2: preload deferred assets in background
    for (let i = 0; i < deferredAssets.length; i++) {
      let img = new Image();
      let card = deferredAssets[i];
      img.src = typeof card === 'string' ? card : (getImage(card) as string);
    }

    loadRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  function changeUsername(name: string) {
    if (name.length > 15) {
      alert('Username max 15 characters');
      return;
    }
    setUsername(name);
    localStorage.setItem('username', name);
  }

  async function loadRooms() {
    const response = await fetch(`${SERVER_URL}/get-rooms`);
    const json = await response.json();
    setRooms(json);
  }

  async function joinRoom(id?: string) {
    const res = await fetch(`${SERVER_URL}/join-room`, {
      method: 'POST',
      body: JSON.stringify({ roomId: id ? id : roomId, username: username }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const json = await res.json();

    if (json.successful) {
      localStorage.setItem(
        'credentials',
        JSON.stringify({
          roomId: id ? id : roomId,
          userId: json.res
        })
      );
      navigate('/lobby');
    } else {
      alert(json.res || 'Could not join room');
    }
  }

  async function createRoom() {
    if (
      (roomId.length !== 6 && roomId.length !== 0) ||
      Number.isNaN(Number(roomId))
    ) {
      alert('Invalid Room ID');
    } else {
      const res = await fetch(`${SERVER_URL}/create-room`, {
        method: 'POST',
        body: JSON.stringify({
          roomId: roomId,
          isPrivate: isPrivate,
          username: username,
          targetPlayers: targetPlayers
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const json = await res.json();

      if (json.successful) {
        localStorage.setItem(
          'credentials',
          JSON.stringify({ roomId: roomId, userId: json.res })
        );
        navigate('/lobby');
      } else {
        alert(json.res);
      }
    }
  }


  return (
    <div className="game-layout-container">
      <div className='App' style={{ margin: '25px' }}>
        <img
          src={`${process.env.PUBLIC_URL}/HTS_title.png`}
          rel='preload'
          alt='Here to Slay'
          id='hts-logo'
          width='300px'
        />
        <br />
        <form>
          <label>Username</label>
          <br />
          <input
            type='text'
            value={username}
            onChange={e => changeUsername(e.target.value)}
          />
          <br />
          <br />
          <label>Room</label>
          <br />
          <input
            type='text'
            value={roomId}
            onChange={e => setRoomId(e.target.value)}
          />
          <br />
          <br />
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', justifyContent: 'center' }}>
            <div>
              <label>Private: </label>
              <input
                type='checkbox'
                checked={isPrivate}
                onChange={_ => setIsPrivate(!isPrivate)}
                className='checkbox'
              />
            </div>
            <div>
              <label>Players: </label>
              <select
                value={targetPlayers}
                onChange={e => setTargetPlayers(Number(e.target.value))}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  backgroundColor: '#222',
                  color: '#fff',
                  border: '1px solid #444',
                  fontSize: '14px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value={2}>2 Players</option>
                <option value={3}>3 Players</option>
                <option value={4}>4 Players</option>
                <option value={5}>5 Players</option>
              </select>
            </div>
          </div>
          <br />
          <br />
          <button
            onClick={e => {
              e.preventDefault();
              joinRoom();
            }}
          >
            Join
          </button>
          <button
            onClick={e => {
              e.preventDefault();
              createRoom();
            }}
          >
            Create
          </button>
        </form>

        <br />
        <h2>Find Rooms: </h2>
        {Object.keys(rooms).length ? (
          <div className='rooms'>
            {Object.keys(rooms).map(id => (
              <div className='room' key={id} onClick={() => joinRoom(id)}>
                <div>{id}</div>
                <div>Players: {rooms[id]?.joined || 0}/{rooms[id]?.target || 3}</div>
              </div>
            ))}
          </div>
        ) : (
          <h3>No rooms found :(</h3>
        )}
      </div>
      <GameGuide />
    </div>
  );
}

export default App;
