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

type IssueItem = {
  item?: {
    label?: string
    fixer?: string
    resolved?: boolean
  }
}

interface SendLineButtonProps {
  rows: Submission[]
  filteredIssues: IssueItem[]
}

// คืนวันที่ปัจจุบันตามเวลาไทย (Asia/Bangkok, UTC+7) รูปแบบ YYYY-MM-DD
function getTodayDateStrTH(): string {
  const now = new Date()
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now)

  const year = parts.find((p) => p.type === 'year')?.value
  const month = parts.find((p) => p.type === 'month')?.value
  const day = parts.find((p) => p.type === 'day')?.value

  return `${year}-${month}-${day}`
}

export default function SendLineButton({ rows, filteredIssues }: SendLineButtonProps) {
  const [sendingLine, setSendingLine] = useState(false)

  const handleSendLineSummary = async () => {
    setSendingLine(true)

    const todayDateStr = getTodayDateStrTH()
    const mRow = rows.find((r) => r.date === todayDateStr && r.period === 'เช้า')
    const eRow = rows.find((r) => r.date === todayDateStr && r.period === 'เย็น')

    const pending: PendingIssue[] = filteredIssues
      .filter((i) => !i.item?.resolved)
      .map((i) => ({
        label: i.item?.label || '',
        fixer: i.item?.fixer || '',
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
    } catch {
      alert('❌ ไม่สามารถส่ง LINE ได้')
    } finally {
      setSendingLine(false)
    }
  }

  return (
    <button
      onClick={handleSendLineSummary}
      disabled={sendingLine}
      className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {sendingLine ? '⏳ กำลังส่งข้อมูล...' : '📲 ส่งสรุปประจำวันเข้า LINE'}
    </button>
  )
}