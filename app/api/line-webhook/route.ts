import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const events = body.events || []

    for (const event of events) {
      // ตรวจสอบว่าข้อความถูกส่งมาจาก "กลุ่ม LINE"
      if (event.type === 'message' && event.source.type === 'group') {
        const groupId = event.source.groupId
        const userText = event.message.text

        // ถ้ามีคนพิมพ์คำว่า !getid ในกลุ่ม
        if (userText === '!getid') {
          await fetch('https://api.line.me/v2/bot/message/reply', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
            },
            body: JSON.stringify({
              replyToken: event.replyToken,
              messages: [
                {
                  type: 'text',
                  text: `📌 Group ID ของกลุ่มนี้คือ:\n${groupId}`
                }
              ]
            })
          })
        }
      }
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    return NextResponse.json({ status: 'error' }, { status: 500 })
  }
}