# AGENTS.md

## Project Overview
Here to Slay Online là một phiên bản trực tuyến chơi qua mạng của trò chơi board game chiến thuật thẻ bài nổi tiếng **Here to Slay**. Dự án được xây dựng theo mô hình Client-Server thời gian thực, cho phép người chơi tạo phòng chờ (Lobby), tương tác và đấu trí thông qua các cơ chế đổ xúc xắc, rút bài, thách thức (Challenge), kích hoạt hiệu ứng anh hùng và tấn công quái vật.

## Tech Stack
- **Backend**: Node.js (TypeScript), Express.js, Socket.io (WebSocket để giao tiếp thời gian thực).
- **Frontend**: React (TypeScript), Socket.io-Client, CSS Custom / Vanilla Styling.
- **Tools**: Nodemon (quản lý live-reload server), TypeScript compiler.

## Project Structure
- `client/`: Thư mục mã nguồn Frontend (React app)
    - `src/components/`: Các component giao diện (Lobby, Board, Card, Modal, Player, v.v.)
    - `src/context/`: Quản lý state toàn cục (Socket context, Game context)
    - `src/pages/`: Các trang chính (Home, GameRoom)
    - `src/style/`: CSS styles cho toàn bộ ứng dụng
    - `src/types.ts`: Định nghĩa kiểu dữ liệu (Card, Player, GameState, v.v.)
- `server/`: Thư mục mã nguồn Backend (Express + Socket.io server)
    - `src/controllers/socketio/`: Xử lý các sự kiện socket (lobby, game, chat, v.v.)
    - `src/functions/`: Logic bổ trợ cho game (gameHelpers, cardActions, v.v.)
    - `src/cards.ts`: Danh sách và cấu trúc các lá bài trong game
    - `src/types.ts`: Định nghĩa kiểu dữ liệu phía server
- `.agent/`: Bộ não của AI hỗ trợ phát triển (workflows, rules, skills).

## Operational Resources (AI Context)
Mọi hành động của AI phải soi chiếu qua các tài nguyên này:
- **Workflows:** Tham khảo `.agent/workflows/` (`feature.md` cho tính năng mới, `debug.md` cho sửa lỗi, `improve.md` cho tối ưu hóa).
- **Coding Rules:** Tham khảo `.agent/rules/` (Tuân thủ nghiêm ngặt `code-quality.md` và `security.md`).
- **Special Skills:** Tham khảo `.agent/skills/` (Sử dụng các skill tương ứng khi cần).

## Conventions
- **Socket.io Events**: Tên sự kiện thống nhất giữa Client và Server (e.g., `lobby:join`, `game:draw`, `game:challenge`).
- **State Syncing**: Trạng thái game (GameState) được đồng bộ toàn bộ hoặc từng phần từ Server xuống các Client sau mỗi action hợp lệ.
- **Commit Message**: Tuân thủ Conventional Commits (feat, fix, docs, style, refactor, test, chore).

## Commands
### Backend Server (`server/`)
- `npm install` — Cài đặt các dependencies
- `npm run watch` — Biên dịch TypeScript sang JavaScript ở chế độ watch
- `npm start` — Khởi chạy ứng dụng với Nodemon (tự reload khi đổi code ở `dist/`)

### Frontend Client (`client/`)
- `npm install` — Cài đặt các dependencies
- `npm start` — Khởi chạy React App ở môi trường local development (mặc định port 3000)
- `npm run build` — Build sản phẩm để deploy