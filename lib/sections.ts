export type Section = { key: string; title: string; items: string[]; doctor?: boolean; caretaker?: boolean }

const roomItems = [
  'ยูนิตและความสะอาด (เบาะที่นั่ง, ที่บ้วนปาก, โคมไฟ, เช็ดความสะอาดไม่มีคราบ/ฝุ่น, โต๊ะทำงานหมอ, ด้ามกรอ, เครื่องอัลตร้าโซนิค, เครื่องโรตารี่)',
  'ผ้าและวัสดุสิ้นเปลือง (ต้องเติมให้เต็ม) เช่น ผ้าดรอป แก้วน้ำ สำลี ถุงมือ แมสหมอ เฟสชิว เสื้อกาวน์ ผ้าก๊อซพับ น้ำยาแช่อุปกรณ์',
  'เครื่องมือพื้นฐาน (Diagnostic set) และน้ำยาวัสดุคอมโพสิตครบทุกสี, หัวกรอ, หัวขูดหินปูน, ระบบคอม, x-ray, สแกน, ฟอกสีฟัน',
  'อุปกรณ์เฉพาะทางของคุณหมอประจำวัน และอุปกรณ์สำหรับผ่าฟันคุด รักษาราก ปักเดือย ทำครอบ วีเนียร์ ฟันปลอมรากเทียม',
  'ระบบน้ำ ลม ถังขยะ (เปลี่ยนถุงขยะติดเชื้อใหม่, ระบบดูดน้ำลายสะอาด, ปั๊มลม, น้ำจากหัวกรอ, เติมขวดน้ำ)',
]
const xrayItems = [
  'เปิดคอมพิวเตอร์โปรแกรม เครื่อง x-ray เปิดสวิตช์พร้อมใช้งาน',
  'แผ่นฟิล์ม x-ray แรปให้เรียบร้อย',
  'เสื้อตะกั่วแขวนให้เรียบร้อย',
  'ห้องสะอาดไม่มีเศษขยะหรือฝุ่น',
  'ถังขยะใส่ถุงขยะเรียบร้อย',
]
const supplyItems = [
  'โซนฆ่าเชื้อ (Autoclave) ระบบน้ำไฟ เปิดเครื่องใช้งาน นึ่งของ',
  'เตรียมน้ำยาแช่เครื่องมือ/น้ำยาล้าง (เตรียมพร้อมใช้งานระหว่างวัน)',
  'เครื่องซิล ซองซิล เก็บและเช็ดทำความสะอาดให้เรียบร้อย',
  'จานชามเก็บคว่ำเรียบร้อย',
  'ผ้าเสื้อกาวน์ซัก รีดเก็บเรียบร้อย',
  'ต้องมีเครื่องมือแช่ไว้ข้ามคืน / ปิดน้ำและเครื่องใช้ไฟฟ้าทั้งหมด (เน้นช่วงเย็น)',
]
const frontItems = ['หน้าร้านสะอาด มีการกวาด/ถูเรียบร้อย และรองเท้าวางเป็นระเบียบเรียบร้อย']

export const SECTIONS: Section[] = [
  { key: 'room1', title: 'ห้องตรวจทันตกรรม 1 (ROOM 1)', items: roomItems, doctor: true, caretaker: true },
  { key: 'room2', title: 'ห้องตรวจทันตกรรม 2 (ROOM 2)', items: roomItems, doctor: true, caretaker: true },
  { key: 'room3', title: 'ห้องตรวจทันตกรรม 3 (ROOM 3)', items: roomItems, doctor: true, caretaker: true },
  { key: 'room4', title: 'ห้องตรวจทันตกรรม 4 (ROOM 4)', items: roomItems, doctor: true, caretaker: true },
  { key: 'xray', title: 'ห้องเอกซเรย์ (X-RAY ROOM)', items: xrayItems, caretaker: true },
  { key: 'supply', title: 'ห้องซัพพลาย (SUPPLY ROOM)', items: supplyItems, caretaker: true },
  { key: 'front', title: 'พื้นที่บริเวณหน้าร้าน', items: frontItems },
]

export function sectionTitle(key: string) {
  return SECTIONS.find((s) => s.key === key)?.title || key
}