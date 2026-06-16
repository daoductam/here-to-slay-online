import { Socket } from 'socket.io';
import { checkCredentials } from '../../functions/helpers';
import { rooms } from '../../rooms';
import { ChatMessage } from '../../types';
import { v4 as uuid } from 'uuid';
import { io } from '../../server';

export const sendChatMessage = (socket: Socket) => {
  return (roomId: string, userId: string, text: string) => {
    if (!text || text.trim() === '') return;

    const playerNum = checkCredentials(roomId, userId);
    if (playerNum === -1 || !rooms[roomId]) return;

    const sender = rooms[roomId].state.match.players[playerNum] || `Người chơi ${playerNum + 1}`;
    
    const message: ChatMessage = {
      id: uuid(),
      sender,
      text: text.trim(),
      timestamp: Date.now(),
      isSystem: false
    };

    // Store in history
    if (!rooms[roomId].chatHistory) {
      rooms[roomId].chatHistory = [];
    }
    rooms[roomId].chatHistory.push(message);

    // Limit history to 100 messages
    if (rooms[roomId].chatHistory.length > 100) {
      rooms[roomId].chatHistory.shift();
    }

    // Broadcast to room
    io.in(roomId).emit('chat:message', message);
  };
};
