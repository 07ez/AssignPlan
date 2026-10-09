import React from 'react'
import { Video, FileText, ChevronRight, Circle, CheckCircle } from 'lucide-react'

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
  const accentColor = '#0066cc'

  return (
    /* store-utility-card: white, 1px hairline border, 18px radius, 24px padding */
    <section
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e0e0e0',
        borderRadius: '18px',
        padding: '20px 20px 16px',
      }}
      className="w-full flex flex-col"
    >
      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(0, 102, 204, 0.08)',
            }}
          >
            {isLecture ? (
              <Video className="w-4 h-4" style={{ color: accentColor, strokeWidth: 2 }} />
            ) : (
              <FileText className="w-4 h-4" style={{ color: accentColor, strokeWidth: 2 }} />
            )}
          </div>

          <span
            style={{
              color: '#1d1d1f',
              fontSize: '17px',
              fontWeight: 600,
              letterSpacing: '-0.374px',
              fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif',
            }}
          >
            {title}
          </span>

          {items.length > 0 && (
            <span
              style={{
                backgroundColor: accentColor,
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 600,
                borderRadius: '9999px',
                padding: '1px 7px',
                letterSpacing: '0',
              }}
            >
              {items.filter((i) => !i.completed).length}
            </span>
          )}
        </div>

        <button
          onClick={onMoreClick}
          className="flex items-center gap-0.5 cursor-pointer active:opacity-60 transition-opacity"
          aria-label={`${title} 더보기`}
          style={{ color: accentColor }}
        >
          <span style={{ fontSize: '12px', fontWeight: 400, letterSpacing: '-0.12px' }}>
            전체보기
          </span>
          <ChevronRight className="w-3.5 h-3.5" style={{ strokeWidth: 2 }} />
        </button>
      </div>

      {/* Hairline divider */}
      <div style={{ height: '1px', backgroundColor: '#f0f0f0', marginBottom: '4px' }} />

      {/* Items */}
      {items.length === 0 ? (
        <div className="py-8 flex flex-col items-center gap-2">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#f5f5f7' }}
          >
            {isLecture ? (
              <Video className="w-5 h-5" style={{ color: '#7a7a7a', strokeWidth: 1.5 }} />
            ) : (
              <FileText className="w-5 h-5" style={{ color: '#7a7a7a', strokeWidth: 1.5 }} />
            )}
          </div>
          <span
            style={{
              fontSize: '14px',
              fontWeight: 400,
              color: '#7a7a7a',
              letterSpacing: '-0.224px',
            }}
          >
            남은 {title} 없음
          </span>
        </div>
      ) : (
        <div className="flex flex-col">
          {items.map((item, index) => (
            <div key={item.id}>
              <div className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => onToggleComplete(item.id)}
                    className="cursor-pointer active:scale-90 transition-transform shrink-0"
                    aria-label="완료 여부 변경"
                  >
                    {item.completed ? (
                      <CheckCircle
                        className="w-[22px] h-[22px]"
                        style={{ color: accentColor, strokeWidth: 1.8 }}
                      />
                    ) : (
                      <Circle
                        className="w-[22px] h-[22px]"
                        style={{ color: '#cccccc', strokeWidth: 1.8 }}
                      />
                    )}
                  </button>

                  <span
                    className="truncate"
                    style={{
                      fontSize: '17px',
                      fontWeight: 400,
                      letterSpacing: '-0.374px',
                      color: item.completed ? '#7a7a7a' : '#1d1d1f',
                      textDecoration: item.completed ? 'line-through' : 'none',
                      textDecorationColor: '#cccccc',
                    }}
                  >
                    {item.title}
                  </span>
                </div>

                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 400,
                    color: '#7a7a7a',
                    letterSpacing: '-0.12px',
                    flexShrink: 0,
                  }}
                >
                  {item.date.month}/{item.date.day}
                </span>
              </div>

              {/* row divider */}
              {index < items.length - 1 && (
                <div style={{ height: '1px', backgroundColor: '#f0f0f0' }} />
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}