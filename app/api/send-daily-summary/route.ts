import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { date, morningScore, eveningScore, pendingIssues } = await req.json()

    // จัดรูปแบบรายการค้างแก้ไข
    let issueContents: any[] = []
    if (pendingIssues && pendingIssues.length > 0) {
      issueContents = pendingIssues.map((item: any) => ({
        type: 'text',
        text: `• \({item.label}\n  └ 👤 รอแก้ไขโดย:\){item.fixer || 'ยังไม่ระบุ'}`,
        size: 'xs',
        color: '#dc2626',
        wrap: true,
        margin: 'sm'
      }))
    } else {
      issueContents = [{
        type: 'text',
        text: '✨ ไม่มีรายการค้างแก้ไข เรียบร้อยดีมาก!',
        size: 'xs',
        color: '#15803d',
        margin: 'sm'
      }]
    }

    const flexPayload = {
      to: process.env.LINE_TARGET_ID,
      messages: [
        {
          type: 'flex',
          altText: `สรุปการตรวจความเรียบร้อย ประจำวันที่ ${date}`,
          contents: {
            type: 'bubble',
            header: {
              type: 'box',
              layout: 'vertical',
              backgroundColor: '#a5293c',
              contents: [
                { type: 'text', text: '🏥 สรุปตรวจความเรียบร้อย', color: '#FFFFFF', weight: 'bold', size: 'md' },
                { type: 'text', text: `สาขาราชบุรี — 🗓️ วันที่ ${date}`, color: '#FFFFFF', size: 'xs', margin: 'xs' }
              ]
            },
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'box',
                  layout: 'horizontal',
                  contents: [
                    { type: 'text', text: '☀️ รอบเช้า:', size: 'xs', color: '#4b5563' },
                    { type: 'text', text: morningScore ? `${morningScore}%` : 'ยังไม่ตรวจ', size: 'xs', weight: 'bold', align: 'end', color: morningScore >= 90 ? '#15803d' : '#dc2626' }
                  ]
                },
                {
                  type: 'box',
                  layout: 'horizontal',
                  margin: 'xs',
                  contents: [
                    { type: 'text', text: '🌙 รอบเย็น:', size: 'xs', color: '#4b5563' },
                    { type: 'text', text: eveningScore ? `${eveningScore}%` : 'ยังไม่ตรวจ', size: 'xs', weight: 'bold', align: 'end', color: eveningScore >= 90 ? '#15803d' : '#dc2626' }
                  ]
                },
                { type: 'separator', margin: 'md' },
                { type: 'text', text: '⚠️ รายการค้างแก้ไข ณ เย็นนี้:', weight: 'bold', size: 'xs', margin: 'md', color: '#1f2937' },
                ...issueContents
              ]
            },
            footer: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'button',
                  action: {
                    type: 'uri',
                    label: '🔍 ดูรายละเอียดบนเว็บ',
                    uri: 'https://red-smile-inspection.vercel.app/dashboard'
                  },
                  style: 'primary',
                  color: '#a5293c',
                  height: 'sm'
                }
              ]
            }
          }
        }
      ]
    }

    const response = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
      },
      body: JSON.stringify(flexPayload)
    })

    if (!response.ok) {
      throw new Error('LINE API Error')
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}