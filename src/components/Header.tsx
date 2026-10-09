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
    <header className="relative z-40">
      {/* Global Nav — Apple pure black bar */}
      <div
        style={{ backgroundColor: '#000000', height: '44px' }}
        className="flex items-center justify-between px-4"
      >
        <button
          onClick={onSearchClick}
          className="flex items-center justify-center w-8 h-8 active:scale-95 transition-transform cursor-pointer"
          aria-label="검색"
        >
          <Search
            className="w-[17px] h-[17px]"
            style={{ color: '#f5f5f7', strokeWidth: 2 }}
          />
        </button>

        <span
          className="type-nav-link tracking-wide font-medium"
          style={{ color: '#f5f5f7', fontSize: '14px', fontWeight: 600, letterSpacing: '0.01em' }}
        >
          Assign Plan
        </span>

        <div className="flex items-center gap-3">
          <button
            onClick={onSettingsClick}
            className="flex items-center justify-center w-8 h-8 active:scale-95 transition-transform cursor-pointer"
            aria-label="설정"
          >
            <Settings
              className="w-[17px] h-[17px]"
              style={{ color: '#f5f5f7', strokeWidth: 2 }}
            />
          </button>

          <button
            onClick={onToggleMenu}
            className="flex items-center justify-center w-8 h-8 active:scale-95 transition-transform cursor-pointer"
            aria-label="추가"
          >
            <Plus
              className={`w-[19px] h-[19px] transition-transform duration-200 ${
                showMenu ? 'rotate-45' : ''
              }`}
              style={{ color: '#f5f5f7', strokeWidth: 2.2 }}
            />
          </button>
        </div>
      </div>

      {/* Sub Nav — Frosted parchment strip */}
      <div
        style={{
          backgroundColor: 'rgba(245, 245, 247, 0.88)',
          backdropFilter: 'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          height: '44px',
        }}
        className="flex items-center justify-between px-4"
      >
        <span
          style={{
            color: '#1d1d1f',
            fontSize: '17px',
            fontWeight: 600,
            letterSpacing: '-0.374px',
            fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif',
          }}
        >
          학습
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenModal('강의')}
            style={{
              backgroundColor: 'transparent',
              color: '#0066cc',
              fontSize: '14px',
              fontWeight: 400,
              letterSpacing: '-0.224px',
            }}
            className="cursor-pointer active:opacity-60 transition-opacity"
          >
            강의 추가
          </button>
          <span style={{ color: '#e0e0e0', fontSize: '12px' }}>|</span>
          <button
            onClick={() => onOpenModal('과제')}
            style={{
              backgroundColor: '#0066cc',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 400,
              letterSpacing: '-0.224px',
              padding: '6px 14px',
              borderRadius: '9999px',
            }}
            className="cursor-pointer active:scale-95 transition-transform"
          >
            과제 추가
          </button>
        </div>
      </div>

      {/* Add menu dropdown */}
      {showMenu && (
        <div
          style={{
            position: 'absolute',
            right: '16px',
            top: '96px',
            width: '180px',
            backgroundColor: 'rgba(250, 250, 252, 0.96)',
            backdropFilter: 'saturate(180%) blur(20px)',
            WebkitBackdropFilter: 'saturate(180%) blur(20px)',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: '18px',
            padding: '6px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
            zIndex: 50,
          }}
          className="flex flex-col gap-0.5 animate-popover-in"
        >
          <button
            onClick={() => onOpenModal('강의')}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl cursor-pointer active:bg-black/5 transition-colors"
            style={{ color: '#1d1d1f' }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'rgba(0, 102, 204, 0.1)' }}
            >
              <Video className="w-3.5 h-3.5" style={{ color: '#0066cc', strokeWidth: 2 }} />
            </div>
            <span style={{ fontSize: '14px', fontWeight: 400, letterSpacing: '-0.224px' }}>
              강의
            </span>
          </button>

          <button
            onClick={() => onOpenModal('과제')}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl cursor-pointer active:bg-black/5 transition-colors"
            style={{ color: '#1d1d1f' }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'rgba(0, 102, 204, 0.1)' }}
            >
              <FileText className="w-3.5 h-3.5" style={{ color: '#0066cc', strokeWidth: 2 }} />
            </div>
            <span style={{ fontSize: '14px', fontWeight: 400, letterSpacing: '-0.224px' }}>
              과제
            </span>
          </button>

          <div style={{ height: '1px', backgroundColor: '#e0e0e0', margin: '2px 8px' }} />

          <button
            onClick={onToggleMenu}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl cursor-pointer active:bg-black/5 transition-colors"
            style={{ color: '#7a7a7a' }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'rgba(0,0,0,0.04)' }}
            >
              <Repeat className="w-3.5 h-3.5" style={{ color: '#7a7a7a', strokeWidth: 2 }} />
            </div>
            <span style={{ fontSize: '14px', fontWeight: 400, letterSpacing: '-0.224px' }}>
              반복
            </span>
          </button>
        </div>
      )}
    </header>
  )
}