import React from 'react'
import { Search, Settings, Plus, Video, FileText, Repeat } from 'lucide-react'

interface HeaderProps {
  showMenu: boolean
  onToggleMenu: () => void
  onOpenModal: (type: '강의' | '과제') => void
  onSearchClick: () => void
  onSettingsClick?: () => void
}

export const Header: React.FC<HeaderProps> = ({
  showMenu,
  onToggleMenu,
  onOpenModal,
  onSearchClick,
  onSettingsClick,
}) => {
  return (
    <header className="relative z-40 px-5 pt-6 pb-2 flex items-center justify-between">
      {/* Title */}
      <h1 className="text-[24px] font-bold text-[#191F28] tracking-tight">
        Assgin Plan
      </h1>

      {/* Right Icon Actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={onSearchClick}
          className="w-10 h-10 rounded-full flex items-center justify-center text-[#4E5968] hover:bg-black/5 active:scale-95 transition-all cursor-pointer"
          aria-label="검색"
        >
          <Search className="w-5 h-5 stroke-[2]" />
        </button>

        <button
          onClick={onSettingsClick}
          className="w-10 h-10 rounded-full flex items-center justify-center text-[#4E5968] hover:bg-black/5 active:scale-95 transition-all cursor-pointer"
          aria-label="설정"
        >
          <Settings className="w-5 h-5 stroke-[2]" />
        </button>

        {/* Toss Blue Add Button */}
        <button
          onClick={onToggleMenu}
          className="ml-1 h-9 px-3.5 bg-[#3182F6] hover:bg-[#1b64da] text-white rounded-full flex items-center gap-1.5 text-[14px] font-semibold active:scale-95 transition-all cursor-pointer shadow-sm"
          aria-label="추가"
        >
          <Plus
            className={`w-4 h-4 stroke-[2.5] transition-transform duration-200 ${
              showMenu ? 'rotate-45' : ''
            }`}
          />
          <span>추가</span>
        </button>
      </div>

      {/* TDS Dropdown Menu */}
      {showMenu && (
        <div
          className="absolute right-5 top-18 w-52 bg-white rounded-2xl p-2 z-50 flex flex-col gap-1 border border-[#E5E8EB] animate-popover-in"
          style={{ boxShadow: '0 8px 24px rgba(25, 31, 40, 0.12)' }}
        >
          <button
            onClick={() => onOpenModal('강의')}
            className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-left hover:bg-[#F2F4F6] active:bg-[#E5E8EB] transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#E8F3FF] flex items-center justify-center text-[#3182F6] shrink-0">
              <Video className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-semibold text-[#191F28]">
                강의 추가하기
              </span>
              <span className="text-[12px] text-[#8B95A1]">
                수강할 강의 일정
              </span>
            </div>
          </button>

          <button
            onClick={() => onOpenModal('과제')}
            className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-left hover:bg-[#F2F4F6] active:bg-[#E5E8EB] transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#E8F3FF] flex items-center justify-center text-[#3182F6] shrink-0">
              <FileText className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-semibold text-[#191F28]">
                과제 추가하기
              </span>
              <span className="text-[12px] text-[#8B95A1]">
                제출할 과제 일정
              </span>
            </div>
          </button>

          <div className="h-[1px] bg-[#F2F4F6] my-1" />

          <button
            onClick={onToggleMenu}
            className="flex items-center gap-3 w-full px-3.5 py-2 rounded-xl text-left hover:bg-[#F2F4F6] active:bg-[#E5E8EB] transition-colors cursor-pointer text-[#8B95A1]"
          >
            <Repeat className="w-4 h-4 stroke-[2] ml-2" />
            <span className="text-[13px] font-medium">반복 일정 설정</span>
          </button>
        </div>
      )}
    </header>
  )
}