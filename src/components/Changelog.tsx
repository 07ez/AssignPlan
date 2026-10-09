import React from 'react'
import { ChevronLeft } from 'lucide-react'
import changelogData from '../data/changelog.json'

interface ChangelogDrawerProps {
  show: boolean
  isClosing: boolean
  onClose: () => void
}

export const ChangelogDrawer: React.FC<ChangelogDrawerProps> = ({
  show,
  isClosing,
  onClose,
}) => {
  if (!show) return null

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`fixed inset-0 z-[70] bg-[#F2F4F6] text-[#191F28] flex flex-col w-full max-w-[480px] mx-auto ${
        isClosing ? 'animate-slide-out-right' : 'animate-slide-in-right'
      }`}
    >
      {/* TDS TopBar */}
      <header className="h-14 px-4 bg-white border-b border-[#F2F4F6] flex items-center gap-3 shrink-0">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full hover:bg-[#F2F4F6] active:scale-95 flex items-center justify-center text-[#191F28] transition-all cursor-pointer"
          aria-label="뒤로가기"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2]" />
        </button>
        <h2 className="text-[18px] font-bold text-[#191F28] tracking-tight">
          업데이트 내역
        </h2>
      </header>

      {/* Changelog Card List */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
        {changelogData.map((item, index) => (
          <div
            key={item.version}
            className="bg-white rounded-[22px] p-5 border border-[#E5E8EB] shadow-[0_2px_8px_rgba(25,31,40,0.04)] flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[17px] font-bold text-[#191F28] tracking-tight">
                  {item.version}
                </span>
                {index === 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#E8F3FF] text-[#3182F6]">
                    최신
                  </span>
                )}
              </div>
              <span className="text-[13px] text-[#8B95A1] font-medium tabular-nums">
                {item.date}
              </span>
            </div>

            <div className="h-[1px] bg-[#F2F4F6]" />

            <ul className="flex flex-col gap-2">
              {item.changes.map((change, i) => (
                <li
                  key={i}
                  className="text-[14px] text-[#4E5968] flex items-start gap-2 leading-relaxed"
                >
                  <span className="text-[#3182F6] font-bold mt-0.5">•</span>
                  <span>{change}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}