# Implementation Walkthrough: Player Count Selection (2 to 5 players)

We have successfully implemented the customizable lobby player count (2 to 5 players) for Here to Slay lobbies.

## Changes Made

### 1. Types & Models
- Modified [server/src/types.ts](file:///d:/here-to-slay-online/server/src/types.ts) and [client/src/types.ts](file:///d:/here-to-slay-online/client/src/types.ts) to support the `targetPlayers?: number` property under `match`.

### 2. Backend & Express Endpoints
- Modified [server/src/cards.ts](file:///d:/here-to-slay-online/server/src/cards.ts) to assign `targetPlayers: 3` by default in `initialState`.
- Modified [server/src/controllers/express/homeController.ts](file:///d:/here-to-slay-online/server/src/controllers/express/homeController.ts):
  - Updated `/get-rooms` response to return `{ [roomId]: { joined: numPlayers, target: targetPlayers } }` for frontend rendering.
  - Updated `/create-room` body parsing to validate and save `targetPlayers` (2 to 5).
  - Updated `/join-room` body parsing to reject requests with `400` "Room is full" if the target player count has been reached.

### 3. Socket.io Lobby Actions
- Modified [server/src/controllers/socketio/lobby/lobby.ts](file:///d:/here-to-slay-online/server/src/controllers/socketio/lobby/lobby.ts) to replace hardcoded `>= 3` player count checks with `=== target` player checks for both `ready` and `startMatch` actions.

### 4. Client-side UI
- Modified [client/src/App.tsx](file:///d:/here-to-slay-online/client/src/App.tsx):
  - Updated `rooms` structure state.
  - Added a `<select>` dropdown in the room creation form to pick the target number of players.
  - Displayed player counts as `X/Y` in the "Find Rooms" panel.
- Modified [client/src/pages/Lobby.tsx](file:///d:/here-to-slay-online/client/src/pages/Lobby.tsx) to dynamically render empty slots based on `matchState.targetPlayers` instead of a hardcoded 3 players.

## Verification & Build Results
- Compiled the backend using `tsc` -> **Success** (exit code 0).
- Built the React frontend using `react-scripts build` -> **Success** (exit code 0).
