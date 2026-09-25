'use client'

import { useState } from 'react'

type PendingIssue = {
  label: string
  fixer?: string
}

type Submission = {
  id: string
  date: string
  period: string
  score: number
}

interface SendLineButtonProps {
  rows: Submission[]
  filteredIssues: any[]
}

export default function SendLineButton({ rows, filteredIssues }: SendLineButtonProps) {
  const [sendingLine, setSendingLine] = useState(false)

  const handleSendLineSummary = async () => {
    setSendingLine(true)

    const todayDateStr = new Date().toISOString().split('T')[0]
    const mRow = rows.find((r) => r.date === todayDateStr && r.period === 'เช้า')
    const eRow = rows.find((r) => r.date === todayDateStr && r.period === 'เย็น')

    const pending: PendingIssue[] = filteredIssues
      .filter((i) => !i.item.resolved)
      .map((i) => ({
        label: i.item.label,
        fixer: i.item.fixer,
      }))

    try {
      const res = await fetch('/api/send-daily-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: todayDateStr,
          morningScore: mRow ? mRow.score : null,
          eveningScore: eRow ? eRow.score : null,
          pendingIssues: pending,
        }),
      })

      if (res.ok) {
        alert('📲 ส่งสรุปประจำวันเข้า LINE เรียบร้อยแล้ว!')
      } else {
        alert('❌ เกิดข้อผิดพลาดในการส่ง LINE')
      }
    } catch (error) {
      alert('❌ ไม่สามารถส่ง LINE ได้')
    } finally {
      setSendingLine(false)
    }
  }

  return (
    
      {sendingLine ? '⏳ กำลังส่งข้อมูล...' : '📲 ส่งสรุปประจำวันเข้า LINE'}
    
  )
}