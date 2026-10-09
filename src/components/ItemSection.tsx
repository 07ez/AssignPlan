import React from 'react'
import { Video, FileText, ChevronRight, Check } from 'lucide-react'

export interface ItemData {
  id: string
  title: string
  date: { year: number; month: number; day: number }
  completed: boolean
}

interface ItemSectionProps {
  title: '강의' | '과제'
  items: ItemData[]
  onToggleComplete: (id: string) => void
  onMoreClick: () => void
}

export const ItemSection: React.FC<ItemSectionProps> = ({
  title,
  items,
  onToggleComplete,
  onMoreClick,
}) => {
  const isLecture = title === '강의'
  const incompleteCount = items.filter((item) => !item.completed).length

  const now = new Date()
  const todayDate = {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  }

  return (
    <section className="w-full bg-white rounded-[24px] p-5 border border-[#E5E8EB] shadow-[0_2px_10px_rgba(25,31,40,0.04)] flex flex-col">
      {/* TDS Section Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#F2F4F6]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#E8F3FF] flex items-center justify-center text-[#3182F6] shrink-0">
            {isLecture ? (
              <Video className="w-[18px] h-[18px] stroke-[2.2]" />
            ) : (
              <FileText className="w-[18px] h-[18px] stroke-[2.2]" />
            )}
          </div>

          <div className="flex items-center gap-2">
            <h2 className="text-[18px] font-bold text-[#191F28] tracking-tight">
              {title}
            </h2>
            {items.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[12px] font-bold bg-[#E8F3FF] text-[#3182F6] tabular-nums">
                {incompleteCount}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={onMoreClick}
          className="text-[#8B95A1] hover:text-[#4E5968] flex items-center gap-0.5 text-[13px] font-medium transition-colors cursor-pointer py-1 px-1.5 rounded-lg active:bg-[#F2F4F6]"
          aria-label={`${title} 더보기`}
        >
          <span>더보기</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Rows or Empty State */}
      {items.length === 0 ? (
        <div className="py-9 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-[#F2F4F6] flex items-center justify-center text-[#B0B8C1] mb-2.5">
            {isLecture ? (
              <Video className="w-6 h-6 stroke-[1.8]" />
            ) : (
              <FileText className="w-6 h-6 stroke-[1.8]" />
            )}
          </div>
          <p className="text-[15px] font-semibold text-[#4E5968] mb-0.5">
            남은 {title}가 없어요
          </p>
          <p className="text-[13px] text-[#8B95A1]">
            새로운 {title}를 등록하고 관리해 보세요
          </p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-[#F2F4F6] mt-1">
          {items.map((item) => {
            const isToday =
              item.date.year === todayDate.year &&
              item.date.month === todayDate.month &&
              item.date.day === todayDate.day

            return (
              <div
                key={item.id}
                className="py-3.5 flex items-center justify-between gap-3 group transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* TDS Square Checkbox */}
                  <button
                    onClick={() => onToggleComplete(item.id)}
                    className={`w-[22px] h-[22px] rounded-[6px] flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                      item.completed
                        ? 'bg-[#3182F6] text-white shadow-sm'
                        : 'border-[1.5px] border-[#D1D6DB] bg-white hover:border-[#3182F6]'
                    }`}
                    aria-label="완료 여부 변경"
                  >
                    {item.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <span
                    className={`text-[15px] font-medium transition-all truncate ${
                      item.completed
                        ? 'line-through text-[#B0B8C1]'
                        : 'text-[#191F28]'
                    }`}
                  >
                    {item.title}
                  </span>
                </div>

                <span
                  className={`text-[13px] font-semibold tabular-nums shrink-0 px-2 py-0.5 rounded-md ${
                    item.completed
                      ? 'text-[#B0B8C1] bg-[#F2F4F6]'
                      : isToday
                      ? 'text-[#F04452] bg-[#FEE2E2] font-bold'
                      : 'text-[#8B95A1] bg-[#F2F4F6]'
                  }`}
                >
                  {item.date.month}월 {item.date.day}일
                </span>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}