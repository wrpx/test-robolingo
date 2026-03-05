# LINE OA Webchat

เว็บแชทสำหรับส่งข้อความไปยัง LINE Official Account พัฒนาด้วย **Next.js 16**, **TypeScript** และ **LINE Messaging API**

## ความสามารถ

- ส่งข้อความจากหน้าเว็บไปยัง LINE OA ได้โดยตรง
- แสดงสถานะการส่งแบบ real-time (กำลังส่ง / สำเร็จ / ผิดพลาด)
- รองรับทั้ง desktop และ mobile
- แยก server logic ออกจาก client ด้วย `server-only`

## เทคโนโลยีที่ใช้

| ส่วน | เทคโนโลยี |
|------|-----------|
| Framework | Next.js 16 (App Router) |
| ภาษา | TypeScript (strict mode) |
| Styling | Tailwind CSS 4 |
| LINE SDK | @line/bot-sdk v10 |
| Hosting | Vercel |

## โครงสร้างโปรเจกต์

```
src/
├── app/
│   ├── api/send/route.ts        # API endpoint สำหรับส่งข้อความไป LINE
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # หน้าแชทหลัก (client component)
├── components/chat/
│   ├── chat-header.tsx           # ส่วนหัว แสดงจำนวนข้อความ
│   ├── chat-messages.tsx         # แสดงรายการข้อความ
│   └── chat-composer.tsx         # ช่องพิมพ์ + ปุ่มส่ง
├── features/chat/
│   └── types.ts                  # type ที่ใช้ร่วมกัน
└── server/
    ├── line-config.ts            # อ่านค่า environment variables
    └── send-line-message.ts      # เรียก LINE pushMessage API
```

## เริ่มต้นใช้งาน

### สิ่งที่ต้องมี

- Node.js 18 ขึ้นไป
- LINE Official Account ที่เปิดใช้ Messaging API
- Channel Access Token และ Channel Secret จาก [LINE Developers Console](https://developers.line.biz/console/)

### ติดตั้ง

```bash
git clone https://github.com/wrpx/test-robolingo.git
cd test-robolingo
npm install
```

### ตั้งค่า Environment Variables

สร้างไฟล์ `.env.local` ที่ root ของโปรเจกต์:

```env
LINE_CHANNEL_ACCESS_TOKEN=your_channel_access_token
LINE_CHANNEL_SECRET=your_channel_secret
LINE_USER_ID=target_user_id
```

| ตัวแปร | คำอธิบาย |
|--------|----------|
| `LINE_CHANNEL_ACCESS_TOKEN` | Long-lived token จาก LINE Developers Console |
| `LINE_CHANNEL_SECRET` | Channel secret สำหรับยืนยันตัวตน |
| `LINE_USER_ID` | User ID หรือ Group ID ที่จะรับข้อความ |

### รันบนเครื่อง

```bash
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000) แล้วลองพิมพ์ข้อความกด **Send**
ข้อความจะถูกส่งไปยัง LINE user ที่กำหนดไว้ใน `LINE_USER_ID`

## วิธีทดสอบ

1. เปิดหน้าเว็บแชท
2. พิมพ์ข้อความอะไรก็ได้ แล้วกด **Send**
3. ข้อความจะแสดงในหน้าเว็บ พร้อมส่งไปยัง LINE OA ปลายทาง
4. เปิด LINE แล้วตรวจสอบว่าข้อความเข้ามาจริง

### ลิงก์สำหรับทดสอบ

| รายการ | URL |
|--------|-----|
| Webchat | `<vercel-url>` |
| LINE OA | `<line-oa-url>` |
| GitHub Repository | https://github.com/wrpx/test-robolingo |

## Deploy ขึ้น Vercel

1. Push โค้ดขึ้น GitHub
2. Import repo เข้า [Vercel](https://vercel.com)
3. เพิ่ม Environment Variables ทั้ง 3 ตัวในหน้า Settings ของ Vercel
4. กด Deploy

## วิธีการทำงาน

```
Browser  ──POST /api/send──>  Next.js Route Handler  ──pushMessage──>  LINE Messaging API  ──>  LINE OA
```

1. ผู้ใช้พิมพ์ข้อความในหน้าเว็บแชท
2. Client ส่ง `POST` request ไปที่ `/api/send` พร้อมข้อความ
3. Route handler ตรวจสอบข้อมูล แล้วเรียก `pushMessage` ผ่าน LINE SDK
4. LINE ส่งข้อความไปยัง user/group ปลายทาง
