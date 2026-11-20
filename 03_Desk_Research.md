# The Time Machine — Desk Research (20 Nov 2026)

> Desk research จากแหล่งข้อมูลออนไลน์ ไม่ใช่ user research · Claude สรุปจากผลค้นหา ยังไม่ได้เปิดอ่านต้นฉบับทุกหน้า ควรตรวจก่อนอ้างอิงตรงตัว

## 1. ระดับความเสี่ยงการเดินทาง → Safety levels
**พบ:** US State Department ใช้ travel advisory 4 ระดับ: 1 Exercise Normal Precautions · 2 Exercise Increased Caution · 3 Reconsider Travel · 4 Do Not Travel. พิจารณาจากอาชญากรรม ความไม่สงบ สุขภาพ ภัยธรรมชาติ ฯลฯ และ**แต่ละพื้นที่ในประเทศเดียวกันมีระดับต่างกันได้**
**ใช้กับงาน:**
- ใช้ระดับความปลอดภัยแบบมาตรฐานที่คนคุ้นเคย ย่อเหลือ 3 ระดับ (Safe / Caution / Blocked) ให้ผู้ใช้ที่ไม่รู้ประวัติศาสตร์เข้าใจง่าย
- ประเมินตาม **เวลา + สถานที่** ไม่ใช่แค่ปี (เมืองเดียวกันคนละวันอาจต่างระดับ)
- แสดง "เหตุผล" ของระดับ (ภัยธรรมชาติ / ความไม่สงบ / อากาศ)

แหล่ง: [Santa Clara University – Understanding DOS Travel Advisories](https://www.scu.edu/globalengagement/for-faculty-and-staff/departmentprogram-international-travel/understanding-dos-travel-advisories/), [National Geographic – travel advisory system explained](https://www.nationalgeographic.com/travel/article/travel-advisories-state-department-safety)

## 2. การป้องกันความผิดพลาด → Pick destination & confirm
**พบ (NN/g):** Error prevention = ตัดเงื่อนไขที่ทำให้ผิด หรือเช็กแล้วให้ยืนยัน · slips ป้องกันด้วย constraints และ validation · **ใช้ confirmation เฉพาะการกระทำที่อันตราย/ย้อนกลับไม่ได้** ถ้าใช้บ่อยคนจะกดผ่านโดยไม่อ่าน · ไม่ควรตั้ง default เป็น "Yes" · ข้อความต้องบอกชัดว่ากำลังยืนยันอะไร
**ใช้กับงาน:**
- ใช้ตัวเลือกแบบมีโครงสร้าง (era/year/date/time/map) แทนเสียงและข้อความอิสระ = constraints
- ตรวจความปลอดภัยอัตโนมัติ = validation
- ยืนยันแบบตั้งใจ **แค่ 2 จุด:** ยืนยันการจอง และ "Return now" — ไม่ใส่ทุกขั้น
- ข้อความยืนยันระบุปลายทางเต็ม (ประโยคสรุป)

แหล่ง: [NN/g – Error Prevention](https://www.nngroup.com/videos/usability-heuristic-error-prevention/), [NN/g – Preventing User Errors](https://www.nngroup.com/articles/user-mistakes/), [NN/g – Confirmation Dialogs](https://www.nngroup.com/articles/confirmation-dialog/)

## 3. การแชร์ข้อมูลกับ agency → Consent (PDPA)
**พบ:** ตาม PDPA ของไทย ต้องขอความยินยอมก่อนหรือขณะเก็บ/ใช้/เปิดเผยข้อมูล และถ้าเปิดเผยนอกวัตถุประสงค์เดิม ต้องขอความยินยอม**แยกเฉพาะวัตถุประสงค์นั้น** · ต้องแจ้งรายละเอียดการเก็บ/ใช้/เปิดเผยให้เจ้าของข้อมูลทราบ
**พบ (dark patterns):** กล่องที่ติ๊กไว้ล่วงหน้าเป็น dark pattern ที่รู้จักกันดี · GDPR Recital 32 ระบุว่าการนิ่งเฉยหรือกล่องที่ติ๊กไว้ก่อนไม่ถือเป็นความยินยอม · FTC (2022) จัด dark patterns เป็นการกระทำที่ไม่เป็นธรรม/หลอกลวง
**ใช้กับงาน:**
- checkbox แชร์ข้อมูล **แยกจากการจอง และไม่ติ๊กไว้ก่อน** จองได้แม้ไม่ยินยอม
- บอกชัดว่าแชร์อะไร ให้ใคร เพื่ออะไร + ถอนความยินยอมได้
- ยังตอบโจทย์ธุรกิจด้วยแรงจูงใจที่โปร่งใส (ส่วนลด/ไกด์) แทนการซ่อน
- หมายเหตุ: ไม่ใช่คำแนะนำทางกฎหมาย ใช้เป็นหลักการออกแบบ

แหล่ง: [Tilleke & Gibbins – PDPA consent and notification guidelines](https://www.tilleke.com/insights/thailand-issues-guidelines-on-pdpa-consent-and-notification-requirements), [FPF – Limits of consent in Thailand's data protection law](https://fpf.org/blog/new-report-on-limits-of-consent-in-thailands-data-protection-law), [EFF – Deceptive checkboxes](https://www.eff.org/deeplinks/2021/04/deceptive-checkboxes-should-not-open-our-checkbooks), [Usercentrics – Dark patterns and consent](https://usercentrics.com/knowledge-hub/dark-patterns-and-how-they-affect-consent/)

## 4. Smartwatch → Watch screens
**พบ (Apple HIG / WWDC):** notification บน watch ควรส่งข้อมูลที่ทันเวลาและมีคุณค่าสูง ให้ทำ action สำคัญได้โดยไม่ต้องเปิดแอป · เน้นการใช้งานแบบดูแวบเดียว จอเดียว · การสั่นที่ข้อมือทำให้ notification เด่นมาก **จึงควรจำกัดจำนวน** · ซ่อนข้อมูลส่วนตัวเมื่อจอหรี่
**ใช้กับงาน:**
- watch แจ้งเฉพาะเรื่องสำคัญ: เตือนอันตราย + เวลากลับ (10 นาที, 2 นาที) ไม่ส่งทุกอย่าง
- 1 จอ = 1 ข้อมูลหลัก + 1 action ("Return now")
- ระหว่างทริป watch เหมาะกว่ามือถือ: ดูแวบเดียวและไม่สะดุดตาคนในยุคนั้น (เป็นสมมติฐานของเรา ยังไม่ได้ทดสอบ)

แหล่ง: [Apple HIG – Designing for watchOS](https://developer.apple.com/design/human-interface-guidelines/designing-for-watchos), [Apple HIG – Always On](https://developer.apple.com/design/human-interface-guidelines/always-on), [WWDC24 – Design Live Activities for Apple Watch](https://developer.apple.com/videos/play/wwdc2024/10098/)

## 5. ข้อสรุปสำหรับสไลด์ (Key decisions ที่มีเหตุผลรองรับ)
1. **Visual constraints แทนเสียง** → ลดความผิดพลาด (NN/g)
2. **Safety check อัตโนมัติ 3 ระดับ ตามเวลา+สถานที่** → ยืมโมเดลจาก travel advisory
3. **ยืนยันเฉพาะจุดเสี่ยงสูง** → ไม่ให้ผู้ใช้ชินกับการกดผ่าน
4. **Opt-in แชร์ข้อมูลแบบโปร่งใส** → ธุรกิจได้ประโยชน์โดยไม่ใช้ dark pattern
5. **Watch สำหรับช่วงระหว่างทริป** → แจ้งเฉพาะเรื่องสำคัญ

## สิ่งที่ยังไม่ได้ทดสอบ (ใส่ใน Next steps)
- ไม่มี user research จริง · persona และพฤติกรรมเป็นสมมติฐาน
- ควรทดสอบ: ผู้ใช้เข้าใจประโยคสรุปและ safety level หรือไม่ · เลือกเวลาได้ถูกโดยไม่พลาดยุค/เขตเวลาหรือไม่ · ผู้ใช้รู้สึกอย่างไรกับข้อเสนอแชร์ข้อมูล
