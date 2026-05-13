# 🎯 Lucky Spin

Vòng quay may mắn + chia tiền nhóm. Mobile-first React app.

## Features
- 🎮 Chọn 2–20 người chơi
- ✍️ Nhập tên tất cả một lần, validate bắt buộc
- 🎡 Vòng quay canvas với animation giảm tốc 3 giây
- 🏆 Hiệu ứng confetti khi có kết quả
- 💰 Bill splitter: nhập nhiều khoản, chọn người tham dự, theo dõi ai đã trả

## Deploy lên Vercel

### Cách 1 — Vercel CLI
```bash
npm install
npm run build
npx vercel --prod
```

### Cách 2 — GitHub + Vercel Dashboard
1. Push repo lên GitHub
2. Vào [vercel.com](https://vercel.com) → Import project
3. Framework: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`
6. Bấm Deploy ✅

## Local development
```bash
npm install
npm run dev
```

## Tech stack
- React 18
- Vite 5
- HTML5 Canvas (vòng quay)
- Pure CSS-in-JS (no external UI lib)
- Vercel (hosting)
