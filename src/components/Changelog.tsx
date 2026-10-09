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
      style={{ backgroundColor: '#ffffff', color: '#1d1d1f' }}
      className={`fixed inset-0 z-[70] flex flex-col w-full max-w-[480px] mx-auto ${
        isClosing ? 'animate-slide-out-right' : 'animate-slide-in-right'
      }`}
    >
      {/* Header — matches sub-nav-frosted style */}
      <div
        style={{
          backgroundColor: 'rgba(245, 245, 247, 0.88)',
          backdropFilter: 'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          height: '52px',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexShrink: 0,
        }}
      >
        <button
          onClick={onClose}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: '#1d1d1f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
            flexShrink: 0,
          }}
          className="active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-4 h-4" style={{ color: '#ffffff', strokeWidth: 2.5 }} />
        </button>

        <h2
          style={{
            fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif',
            fontSize: '17px',
            fontWeight: 600,
            letterSpacing: '-0.374px',
            color: '#1d1d1f',
          }}
        >
          업데이트 내역
        </h2>
      </div>

      {/* Content */}
      <div
        style={{ backgroundColor: '#f5f5f7', flex: 1, overflowY: 'auto', padding: '24px 20px' }}
        className="flex flex-col gap-4"
      >
        {changelogData.map((item, index) => (
          <div
            key={item.version}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e0e0e0',
              borderRadius: '18px',
              padding: '20px',
            }}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <span
                style={{
                  fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif',
                  fontSize: '17px',
                  fontWeight: 600,
                  letterSpacing: '-0.374px',
                  color: '#1d1d1f',
                }}
              >
                {item.version}
              </span>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 400,
                  color: '#7a7a7a',
                  letterSpacing: '-0.12px',
                }}
              >
                {item.date}
              </span>
            </div>

            <div style={{ height: '1px', backgroundColor: '#f0f0f0' }} />

            <ul className="flex flex-col gap-2">
              {item.changes.map((change, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2"
                  style={{
                    fontSize: '14px',
                    fontWeight: 400,
                    letterSpacing: '-0.224px',
                    color: '#1d1d1f',
                    lineHeight: '1.43',
                  }}
                >
                  <span style={{ color: '#0066cc', flexShrink: 0, marginTop: '1px' }}>•</span>
                  <span>{change}</span>
                </li>
              ))}
            </ul>

            {index === 0 && (
              <div
                style={{
                  backgroundColor: 'rgba(0, 102, 204, 0.08)',
                  borderRadius: '9999px',
                  padding: '4px 12px',
                  display: 'inline-flex',
                  alignSelf: 'flex-start',
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#0066cc',
                    letterSpacing: '0',
                  }}
                >
                  최신
                </span>
              </div>
            )}
          </div>
        ))}

        {/* Footer note */}
        <p
          style={{
            fontSize: '12px',
            fontWeight: 400,
            color: '#7a7a7a',
            letterSpacing: '-0.12px',
            textAlign: 'center',
            paddingBottom: '8px',
          }}
        >
          Assign Plan — 모든 버전 기록
        </p>
      </div>
    </div>
  )
}