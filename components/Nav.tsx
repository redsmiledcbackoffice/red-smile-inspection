'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/', label: 'ฟอร์มตรวจ' },
  { href: '/tasks', label: 'งานที่ต้องแก้ไข' },
  { href: '/calendar', label: 'ปฏิทิน' },
  { href: '/dashboard', label: 'แดชบอร์ด' },
  { href: '/staff', label: 'รายชื่อพนักงาน' },
]

export default function Nav() {
  const pathname = usePathname()

  return (
    <nav className="flex gap-2 overflow-x-auto px-4 pb-3 pt-1">
      {LINKS.map((l) => {
        const active = pathname === l.href
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`flex-none rounded-full border px-3 py-1.5 text-xs whitespace-nowrap ${
              active
                ? 'bg-white text-[#7f1f2f] font-bold border-white'
                : 'bg-white/15 text-white border-white/30'
            }`}
          >
            {l.label}
          </Link>
        )
      })}
    </nav>
  )
}