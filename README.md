# Here to Slay Online 🐉🎲

Chào mừng bạn đến với **Here to Slay Online** – phiên bản trực tuyến chơi qua mạng của trò chơi board game chiến thuật thẻ bài nổi tiếng **Here to Slay**. Dự án này được xây dựng trên mô hình Client-Server thời gian thực, cho phép người chơi tham gia phòng chờ (Lobby), tương tác và đấu trí cùng bạn bè thông qua các cơ chế đổ xúc xắc, rút bài, thách thức (Challenge) và tấn công quái vật đầy hấp dẫn.

---

## 🚀 Tính Năng Nổi Bật

- **Phòng chờ thời gian thực (Lobby):** Tạo phòng, mời bạn bè tham gia và chuẩn bị trận đấu.
- **Hệ thống Socket.io đồng bộ:** Mọi thao tác đổ xúc xắc, rút bài, thách thức, chỉnh sửa điểm (modify) hay kết thúc lượt đều được truyền tải tức thời đến tất cả người chơi.
- **Hệ thống Gameplay đầy đủ:**
  - Rút bài (Draw One, Two, Five).
  - Thách thức (Challenge) & Đổ xúc xắc Thách thức.
  - Tấn công Quái vật (Attack Monster) & Đổ xúc xắc Tấn công.
  - Sử dụng Thẻ bài & Kích hoạt Hiệu ứng (Effects & Modifiers).
  - Quản lý lượt chơi và Cơ chế Bỏ bài cuối lượt (End Turn Discard).
- **Giao diện hiện đại:** Được viết bằng React, tối ưu trải nghiệm người dùng với các thông báo và popup tương tác trực quan.

---

## 🛠️ Công Nghệ Sử Dụng

### Frontend (Client)
- **React (TypeScript):** Xây dựng giao diện thành phần linh hoạt, quản lý trạng thái trò chơi trực quan.
- **Socket.io-Client:** Kết nối WebSocket hai chiều đến Server.
- **CSS Custom / Vanilla Styling:** Giao diện tối ưu hóa và sinh động.

### Backend (Server)
- **Node.js (TypeScript):** Đảm bảo an toàn kiểu dữ liệu và cấu trúc dự án rõ ràng.
- **Express.js:** Server HTTP quản lý các API cơ bản.
- **Socket.io:** Xử lý logic phòng game và đồng bộ hóa trạng thái bàn chơi thời gian thực.
- **Nodemon:** Tự động khởi động lại Server khi có thay đổi mã nguồn trong quá trình phát triển.

---

## ⚙️ Hướng Dẫn Cài Đặt & Khởi Chạy

### Yêu cầu hệ thống
- Đã cài đặt **Node.js** (Khuyến nghị phiên bản 16 trở lên)
- Trình quản lý gói **npm**

### Các bước cài đặt & chạy dự án

#### Bước 1: Clone dự án và truy cập thư mục gốc
```bash
cd here-to-slay-online
```

#### Bước 2: Thiết lập & Khởi chạy Backend Server
1. Di chuyển vào thư mục `server`:
   ```bash
   cd server
   ```
2. Cài đặt các thư viện phụ thuộc:
   ```bash
   npm install
   ```
3. Biên dịch TypeScript & Khởi chạy server:
   ```bash
   npm start
   ```
   *Mặc định Server sẽ chạy tại: **`http://localhost:4000`***

#### Bước 3: Thiết lập & Khởi chạy Frontend Client
1. Mở một terminal mới và di chuyển vào thư mục `client`:
   ```bash
   cd client
   ```
2. Cài đặt các thư viện phụ thuộc:
   ```bash
   npm install
   ```
3. Khởi chạy React Client:
   ```bash
   npm start
   ```
   *Trình duyệt sẽ tự động mở trang: **`http://localhost:3000`***

---

## 🎮 Cách Chơi

1. **Vào sảnh game:** Người chơi truy cập vào giao diện web trên trình duyệt, nhập Tên và Mã phòng để tham gia sảnh chờ.
2. **Sẵn sàng:** Khi tất cả người chơi trong sảnh đã ấn **Ready**, chủ phòng có thể bắt đầu trận đấu.
3. **Trong trận đấu:**
   - Mỗi người chơi thực hiện các hành động trong lượt của mình (Rút bài, Đánh thẻ bài, Tấn công Quái vật).
   - Khi bạn đánh một thẻ bài Hero/Item, người chơi khác có quyền ném thẻ **Challenge** để ngăn chặn hành động đó.
   - Thắng trò chơi bằng cách tiêu diệt đủ **3 Quái vật** hoặc thu thập đủ **6 Lớp Anh Hùng (Hero Classes)** khác nhau trong Tổ đội (Party) của mình.
