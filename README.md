# LINE OA Webchat

เว็บแชทสำหรับส่งข้อความผ่าน LINE Official Account

## วิธีรัน

```bash
git clone https://github.com/wrpx/test-robolingo.git
cd test-robolingo
npm install
npm run dev
```

เปิด `http://localhost:3000`

## Environment Variables

สร้างไฟล์ `.env.local` ที่โฟลเดอร์หลักของโปรเจกต์

```env
LINE_CHANNEL_ACCESS_TOKEN=your_channel_access_token
LINE_USER_ID=target_user_id
LINE_CHANNEL_SECRET=your_channel_secret
```

| ตัวแปร | คำอธิบาย |
|--------|----------|
| `LINE_CHANNEL_ACCESS_TOKEN` | Channel access token จาก LINE Developers Console |
| `LINE_USER_ID` | User ID หรือ Group ID ที่จะรับข้อความ |
| `LINE_CHANNEL_SECRET` | ใช้ตรวจสอบ webhook signature สำหรับการรับข้อความกลับจาก LINE |

## การทำงานของแอป

1. ผู้ใช้พิมพ์ข้อความจากหน้า webchat
2. หน้าเว็บส่ง `POST` request ไปที่ `/api/send`
3. ฝั่งเซิร์ฟเวอร์ตรวจสอบข้อความก่อนส่ง
4. เซิร์ฟเวอร์เรียก LINE Messaging API เพื่อส่งข้อความไปยังปลายทางที่กำหนดใน `LINE_USER_ID`
5. ถ้าส่งสำเร็จ ข้อความที่ส่งจะถูกแสดงบนหน้าเว็บ หากส่งไม่สำเร็จจะแสดงข้อความแจ้งเตือน

## การรับข้อความกลับจาก LINE

1. เปิดใช้งาน webhook ใน LINE Developers Console
2. ตั้ง Webhook URL เป็น `https://test-robolingo.vercel.app/api/line/webhook`
3. เมื่อมีข้อความใหม่จาก LINE ระบบจะส่งเข้ามาที่ webhook แล้วหน้าเว็บจะดึงข้อความล่าสุดมาแสดงอัตโนมัติ

หมายเหตุ: การรับข้อความกลับในโปรเจกต์นี้ใช้ in-memory storage สำหรับเดโม ข้อมูลอาจหายได้เมื่อ instance ถูกรีสตาร์ทหรือ redeploy

## ลิงก์ทดสอบ

- LINE OA: https://line.me/R/ti/p/@451giitk
- Webchat: https://test-robolingo.vercel.app
- GitHub Repository: https://github.com/wrpx/test-robolingo
