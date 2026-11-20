# The Time Machine — User Flow & Wireframe spec (draft)

> UI copy เป็นภาษาอังกฤษ (นำเสนอเป็นภาษาอังกฤษ) · ตัวอย่างปลายทางใช้ Paris 1790 เป็นข้อมูลสมมติ

## 1. User flow

### Happy path
```
[1 Home] ──(Featured card)──────────────┐
   │                                     │ (prefill เวลา+สถานที่)
   ├──(Help me choose)──> [2 Assist] ────┤
   │                                     ▼
   └──(Plan my own trip)──────────> [3 Pick destination]
                                          │ Check destination
                                          ▼
                                   [4 Destination report]
                                          │ Safe → Continue
                                          ▼
                                   [5 Review & book] ──(Edit)──> [3]
                                          │ Hold to confirm
                                          ▼
                                   [6 Ticket] ── noti: "Your slot starts in 30 min"
                                          │ Check in at office (scan QR)
                                          ▼
                                   [7 In-trip] ── noti: return 30 / 10 / 2 min
                                          │ Auto-return when time is up
                                          ▼
                                   [8 Returned]
```

### ทางแยก (branches)
| จุด | เงื่อนไข | ผลลัพธ์ |
|---|---|---|
| 4 | **Caution** | แสดงความเสี่ยง + "Safer times nearby" → ผู้ใช้เลือกเวลาที่ปลอดภัยกว่า (กลับไป 4 ด้วยค่าใหม่) **หรือ** ติ๊ก "I understand the risk" แล้ว Continue |
| 4 | **Blocked** | ปุ่ม Continue ไม่มี · บอกเหตุผล + ทางเลือกใกล้เคียง 2–3 ทาง → เลือกแล้วกลับไป 4 / หรือ "Change destination" → 3 |
| 5 | อยากแก้ | "Edit" → 3 (ค่าเดิมยังอยู่) |
| 5 | Opt-in แชร์ข้อมูลกับ agency | ไม่บังคับ · ไม่ติ๊กก็จองได้ |
| 7 | **Danger alert** (เช่น พายุเข้าเร็วกว่าคาด) | Sheet: "Return now" (แนะนำ) / "Move to safe point" (แผนที่จุดปลอดภัย) |
| 7 | ผู้ใช้อยากกลับก่อนเวลา | "Return now" → ยืนยัน → 8 |
| 7 | Return reminder 30/10/2 นาที | แจ้งเตือน + ระบุจุดรับกลับ · 2 นาทีสุดท้าย: "Stay still — returning in 2:00" |

**นอก scope (ระบุในสไลด์):** ยกเลิก/เลื่อนการจอง, มาสายที่ออฟฟิศ, ชำระเงินละเอียด, login

## 2. Wireframe spec ต่อจอ (Mobile 393×852)

### 1 Home
- Greeting + การจองที่มีอยู่ (ถ้ามี → การ์ด ticket ย่อ)
- **Featured trips** (carousel การ์ด): ภาพ, ชื่อเหตุการณ์, ปี·สถานที่, Safety badge, ป้าย "Featured", perk เช่น "Free local guide"
- ปุ่ม: **Help me choose** (assist) · **Plan my own trip**

### 2 Assist
- คำถามสั้น 2 ข้อ (chips): "Past or future?" · "What do you enjoy?" (Art, Sport, Food, Nature, Science, Celebrations)
- ผลลัพธ์ 3–5 การ์ด: ชื่อ, ปี·สถานที่, "Why it's fun" 1 บรรทัด, Safety badge, Featured badge (ถ้าเป็น)
- แสดงเฉพาะที่ Safe/Caution ไม่แสดง Blocked
- กดการ์ด → 3 (กรอกค่าให้แล้ว)

### 3 Pick destination
- **When:** Era toggle (BC | AD) · Year · Date · Time (hh:mm) — ระบุ "Local time at destination"
- **Where:** แผนที่ + ช่องค้นหาชื่อเมือง · แสดงชื่อสถานที่ที่เลือก
- **How long:** stepper 1–6 h
- **Summary sticky ด้านล่าง:** "You'll arrive in Paris, France · 14 Jul 1790 · 10:00 local time · Stay 3 h"
- CTA: **Check destination** (disabled จนกรอกครบ)

### 4 Destination report
- Summary card (ประโยคเดียวกับจอ 3)
- **Safety:** badge + เหตุผล 1–2 บรรทัด
- **Weather:** อุณหภูมิ, สภาพ, ลม/ฝน
- **What to wear:** 3–4 รายการ (ตามอากาศ + ให้กลมกลืนกับยุค) + "Don't bring" (เช่น โทรศัพท์ที่มองเห็นได้)
- CTA: **Continue** · Secondary: Change destination
- **4b Caution:** banner เหลือง + "Safer times nearby" 2 ตัวเลือก + checkbox ยอมรับ
- **4b Blocked:** banner แดง "You can't travel to this time" + เหตุผล + ทางเลือก, ไม่มี Continue

### 5 Review & book
- Summary: ปลายทาง, ระยะอยู่, safety, อากาศ
- **Office slot:** เลือกวัน + chip เวลา · ที่อยู่ออฟฟิศ · "Arrive 15 min early"
- ราคา (ถ้ามี)
- Opt-in: "Share my trip with partner tour agencies to get offers" + "What we share" (ลิงก์)
- CTA: **Hold to confirm booking** · Edit

### 6 Ticket
- QR + booking ID · Countdown ถึงเวลานัด
- ปลายทางย่อ · ที่อยู่ออฟฟิศ + Directions
- Checklist: Wear ___, Arrive 15 min early, Bring ID
- Notification (frame แยก): "Your time slot starts in 30 min"

### 7 In-trip
- **Time left** ใหญ่ (02:14:30) · Progress bar
- Pick-up point (แผนที่เล็ก) · Safety status ปัจจุบัน
- ปุ่ม **Return now** (danger, ต้องยืนยัน)
- **7b Danger alert (sheet):** "Storm approaching in 40 min" → Return now / Move to safe point
- **7b Return reminder:** "10 min left — head to your pick-up point"

### 8 Returned
- "Welcome back" + เวลา/วันปัจจุบัน
- สรุปทริป: ปลายทาง, ระยะเวลา
- CTA: Back to home · Rate trip (optional)

## 3. Watch (ถ้ามีเวลา · 198×242)
1. **Return countdown:** เวลาคงเหลือ + ทิศไปจุดรับกลับ
2. **Danger alert:** ไอคอน + 1 บรรทัด + "Return now"

## 4. CMS (Desktop 1440×1024)
1. **Traveler monitor:** ตาราง — Traveler, Destination, Status (Booked/Checked-in/In-trip/Returned/Alert), Return at, Alerts · ตัวกรองตามสถานะ · แถบสรุปจำนวน
2. (ถ้ามีเวลา) Featured & danger zones

## 5. Components ที่ควรสร้างก่อน
| Component | Variants |
|---|---|
| Button | Primary / Secondary / Danger · Default / Disabled |
| Safety badge | Safe / Caution / Blocked (ไอคอน+ข้อความ+สี) |
| Summary card | – (ใช้ซ้ำจอ 3, 4, 5, 6) |
| Trip card | Default / Featured |
| Alert banner | Caution / Blocked / Info |
| Bottom CTA bar | 1 ปุ่ม / 2 ปุ่ม |
| Top bar | Back + title |
| Chip | Default / Selected |
