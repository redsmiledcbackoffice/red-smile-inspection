'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { sectionTitle } from '@/lib/sections'
import Nav from '@/components/Nav'

type Submission = {
  id: string
  date: string
  period: string
  inspector: string
  score: number
  sections: Record<string, { items: any[] }>
  created_at: string
}

const WEEKDAYS_TH = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']
const MONTHS_TH = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม']

function pad2(n: number) { return n < 10 ? '0' + n : '' + n }

export default function CalendarPage() {
  const supabase = createClient()
  const [cursor, setCursor] = useState(() => { const d = new Date(); d.setDate(1); return d })
  const [rows, setRows] = useState<Submission[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  useEffect(() => {
    const year = cursor.getFullYear(), month = cursor.getMonth()
    const start = `${year}-${pad2(month + 1)}-01`
    const end = `${year}-${pad2(month + 1)}-${pad2(new Date(year, month + 1, 0).getDate())}`
    supabase.from('submissions').select('*').gte('date', start).lte('date', end).then(({ data }) => {
      if (data) setRows(data as Submission[])
    })
  }, [cursor])

  const byDate: Record<string, Record<string, Submission>> = {}
  rows.forEach((sub) => {
    if (!byDate[sub.date]) byDate[sub.date] = {}
    const existing = byDate[sub.date][sub.period]
    if (!existing || new Date(sub.created_at) > new Date(existing.created_at)) byDate[sub.date][sub.period] = sub
  })

  const year = cursor.getFullYear(), month = cursor.getMonth()
  const firstDow = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const todayKey = new Date().toISOString().slice(0, 10)
  const cells: (number | null)[] = [...Array(firstDow).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  const dayData = selectedDate ? byDate[selectedDate] || {} : {}
  const dayIssues: { period: string; sectionKey: string; item: any }[] = []
  ;(['เช้า', 'เย็น'] as const).forEach((p) => {
    const sub = dayData[p]
    if (!sub) return
    Object.entries(sub.sections || {}).forEach(([key, secData]) => {
      ;(secData.items || []).forEach((it: any) => { if (it.status === 'ไม่เรียบร้อย') dayIssues.push({ period: p, sectionKey: key, item: it }) })
    })
  })

  return (
    <div className="min-h-screen bg-[#f6f3f2] pb-16">
      <header className="bg-gradient-to-br from-[#a5293c] to-[#7f1f2f] text-white px-4 pt-4 pb-1">
        <h1 className="text-lg font-bold">📅 ปฏิทินการตรวจ</h1>
        <p className="text-xs opacity-90 mb-2">คลินิกทันตกรรมเรดสไมล์ สาขาราชบุรี</p>
        <Nav />
      </header>

      <main className="max-w-2xl mx-auto p-4">
        <div className="bg-white border border-[#e7dedc] rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => setCursor(new Date(year, month - 1, 1))} className="text-sm rounded border border-[#e7dedc] px-2 py-1">‹ ก่อนหน้า</button>
            <h2 className="font-semibold text-sm">{MONTHS_TH[month]} {year + 543}</h2>
            <button onClick={() => setCursor(new Date(year, month + 1, 1))} className="text-sm rounded border border-[#e7dedc] px-2 py-1">ถัดไป ›</button>
          </div>

          <div className="flex flex-wrap gap-3 text-[11px] text-gray-500 mb-2">
            <span><i className="inline-block w-2 h-2 rounded-full bg-green-600 mr-1" />เรียบร้อย 100%</span>
            <span><i className="inline-block w-2 h-2 rounded-full bg-red-600 mr-1" />มีไม่เรียบร้อย</span>
            <span><i className="inline-block w-2 h-2 rounded-full bg-gray-300 mr-1" />ยังไม่ตรวจ</span>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {WEEKDAYS_TH.map((w) => <div key={w} className="text-center text-[11px] text-gray-500 font-semibold">{w}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) => {
              if (d === null) return <div key={i} />
              const dateKey = `${year}-${pad2(month + 1)}-${pad2(d)}`
              const data = byDate[dateKey] || {}
              const am = data['เช้า'], pm = data['เย็น']
              const pillClass = (sub?: Submission) => !sub ? 'bg-white text-gray-400 border-[#e7dedc]' : sub.score === 100 ? 'bg-green-50 text-green-700 border-green-600' : 'bg-red-50 text-red-600 border-red-600'
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(dateKey)}
                  className={`border rounded-lg p-1 text-left ${dateKey === todayKey ? 'border-[#a5293c] border-2' : 'border-[#e7dedc]'}`}
                >
                  <div className="text-[11px] text-gray-500">{d}</div>
                  <div className="flex gap-0.5 mt-1">
                    <div className={`flex-1 text-center rounded text-[9px] font-bold border py-0.5 ${pillClass(am)}`}>ช{am ? ' ' + am.score + '%' : ''}</div>
                    <div className={`flex-1 text-center rounded text-[9px] font-bold border py-0.5 ${pillClass(pm)}`}>ย{pm ? ' ' + pm.score + '%' : ''}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {selectedDate && (
          <div className="bg-white border border-[#e7dedc] rounded-2xl p-4">
            <h2 className="font-semibold text-sm mb-2">รายละเอียดวันที่ {selectedDate}</h2>
            <div className="flex gap-4 text-xs mb-3">
              {(['เช้า', 'เย็น'] as const).map((p) => {
                const sub = dayData[p]
                return <span key={p} className={sub ? (sub.score === 100 ? 'text-green-700' : 'text-red-600') : 'text-gray-400'}>{p}: {sub ? `${sub.inspector} — ${sub.score}%` : 'ยังไม่ตรวจ'}</span>
              })}
            </div>
            {dayIssues.length === 0 ? (
              <p className="text-center text-sm text-gray-500 py-4">ไม่มีรายการไม่เรียบร้อยในวันนี้ 🎉</p>
            ) : (
              <table className="w-full text-xs">
                <thead><tr className="text-gray-500 text-left"><th className="py-1">ช่วง</th><th>โซน</th><th>รายการ</th><th>ผู้แก้ไข</th><th>สถานะ</th></tr></thead>
                <tbody>
                  {dayIssues.map((i, idx) => (
                    <tr key={idx} className="border-t border-[#e7dedc]">
                      <td className="py-1.5">{i.period}</td>
                      <td>{sectionTitle(i.sectionKey)}</td>
                      <td>{i.item.label.length > 30 ? i.item.label.slice(0, 30) + '…' : i.item.label}</td>
                      <td>{i.item.fixer || '-'}</td>
                      <td className={i.item.resolved ? 'text-green-700' : 'text-red-600'}>{i.item.resolved ? 'แก้ไขแล้ว' : 'รอแก้ไข'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
