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
```

| ตัวแปร | คำอธิบาย |
|--------|----------|
| `LINE_CHANNEL_ACCESS_TOKEN` | Channel access token จาก LINE Developers Console |
| `LINE_USER_ID` | User ID หรือ Group ID ที่จะรับข้อความ |

## การทำงานของแอป

1. ผู้ใช้พิมพ์ข้อความจากหน้า webchat
2. หน้าเว็บส่ง `POST` request ไปที่ `/api/send`
3. ฝั่งเซิร์ฟเวอร์ตรวจสอบข้อความก่อนส่ง
4. เซิร์ฟเวอร์เรียก LINE Messaging API เพื่อส่งข้อความไปยังปลายทางที่กำหนดใน `LINE_USER_ID`
5. ถ้าส่งสำเร็จ ข้อความที่ส่งจะถูกแสดงบนหน้าเว็บ หากส่งไม่สำเร็จจะแสดงข้อความแจ้งเตือน

## ลิงก์ทดสอบ

- LINE OA: https://line.me/R/ti/p/@451giitk
- Webchat: https://test-robolingo.vercel.app
- GitHub Repository: https://github.com/wrpx/test-robolingo
