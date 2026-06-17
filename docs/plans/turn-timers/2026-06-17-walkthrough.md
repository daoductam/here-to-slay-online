# Walkthrough: Turn Timers & Auto-Actions

Hoàn tất thiết lập cơ chế thời gian thực đếm ngược và tự động hóa quyết định (auto-actions) cho ba pha chính của trận đấu.

## Tóm tắt thay đổi (Execution Summary)

* **Thiết kế chi tiết:** [spec.md](file:///C:/Users/tamda/.gemini/antigravity-ide/brain/29f4a847-610a-4f54-9d30-72876e25d45f/spec.md)
* **Kế hoạch triển khai:** [implementation_plan.md](file:///C:/Users/tamda/.gemini/antigravity-ide/brain/29f4a847-610a-4f54-9d30-72876e25d45f/implementation_plan.md)
* **Phương thức thực hiện:** Standard (Viết code chạy ổn định -> kiểm nghiệm biên dịch).

---

## Chi tiết các File thay đổi (Task Execution Log)

### 1. Backend

* **[types.ts](file:///d:/here-to-slay-online/server/src/types.ts)**:
  * Thêm thuộc tính `timerId` vào cấu trúc `Room` để lưu vết interval đếm ngược phía server.
  * Thêm thuộc tính `timer` dạng `{ type, timeLeft, maxTime }` vào `State` để đồng bộ dữ liệu thời gian tới client.
* **[timerHelper.ts](file:///d:/here-to-slay-online/server/src/functions/timerHelper.ts)**:
  * Viết các hàm core quản lý server-side timer: `startRoomTimer`, `clearRoomTimer`, `pauseRoomTimer`, `resumeRoomTimer`.
  * Viết hàm `handlePhaseTimer(roomId)` để tự động điều hướng timer khi chuyển pha và tự động hóa các hành động `pass`, `discard` ngẫu nhiên, hoặc auto-pass challenge/modifier khi hết giờ.
* **[server.ts](file:///d:/here-to-slay-online/server/src/server.ts)**:
  * Đăng ký import và chèn hàm `handlePhaseTimer(roomId)` vào ngay trong `sendGameState(roomId)` khi có sự kiện `state.turn.phaseChanged = true` để tự động hóa toàn cục.
* **[modify.ts](file:///d:/here-to-slay-online/server/src/controllers/socketio/game/modify.ts)**:
  * Tự động khởi chạy/reset lại Modifier Timer khi có bất kỳ ai ném thêm lá bài Modifier trong pha `modify`.

### 2. Frontend React Client

* **[types.ts](file:///d:/here-to-slay-online/client/src/types.ts)**:
  * Thêm cấu trúc `timer` vào giao diện `GameState` để đồng bộ hoàn toàn với server.
* **[TimerBar.tsx](file:///d:/here-to-slay-online/client/src/components/TimerBar.tsx)**:
  * Tạo component đếm ngược thanh tiến trình trực quan cao cấp, hỗ trợ tự động đổi màu sắc khi sắp hết giờ.
  * Tích hợp Web Audio API phát ra âm thanh tích tắc nhấp nháy chân thực khi thời gian đếm ngược còn dưới 5 giây.
* **[CenterBoard.tsx](file:///d:/here-to-slay-online/client/src/components/CenterBoard.tsx)**:
  * Nhúng `<TimerBar timer={state.timer} />` lên khu vực bàn cờ trung tâm.

---

## Kết quả kiểm tra biên dịch (Verification Results)

Cả Backend Node.js/TypeScript và React Frontend Client đều biên dịch thành công, không gặp bất cứ lỗi cú pháp hay kiểu dữ liệu nào.
* **Server Build:** Thành công (tsc compilation clean).
* **Client Build:** Thành công (optimized production bundle generated with zero errors).
