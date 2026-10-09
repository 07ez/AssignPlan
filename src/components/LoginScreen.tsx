import React, { useState } from 'react'
import {
  Video,
  FileText,
  Smartphone,
  Share,
  PlusSquare,
  MoreVertical,
  Download,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react'
import appIcon from '../assets/icon.png'

interface LoginScreenProps {
  onLogin: () => void
  isLoading?: boolean
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, isLoading }) => {
  // 사용자의 기기(iOS 여부) 자동 감지
  const isIOSDevice =
    typeof window !== 'undefined' && /iPhone|iPad|iPod/i.test(navigator.userAgent)

  const [activeTab, setActiveTab] = useState<'ios' | 'android'>(isIOSDevice ? 'ios' : 'android')
  const [isGuideOpen, setIsGuideOpen] = useState(true)

  return (
    <div className="w-full max-w-[480px] min-h-screen bg-[#F2F4F6] text-[#191F28] flex flex-col justify-between p-5 sm:p-6 mx-auto shadow-xl select-none overflow-y-auto">
      {/* Top Brand Area */}
      <div className="pt-8 sm:pt-10 flex flex-col items-start gap-3.5">
        <img
          src={appIcon}
          alt="Assign Plan"
          className="w-14 h-14 rounded-2xl shadow-md object-cover shadow-black/10"
        />

        <div className="flex flex-col gap-1.5 mt-1">
          <h1 className="text-[26px] sm:text-[28px] font-bold tracking-tight text-[#191F28] leading-tight">
            대학 생활의 모든 일정,<br />
            깔끔하게 한곳에서
          </h1>
          <p className="text-[14px] sm:text-[15px] font-medium text-[#4E5968] leading-relaxed">
            강의와 과제 마감일을 놓치지 않도록 푸시 알림으로 알려드려요.
          </p>
        </div>
      </div>

      {/* Feature Preview Cards */}
      <div className="my-5 flex flex-col gap-2.5">
        <div className="bg-white rounded-2xl p-4 border border-[#E5E8EB] shadow-[0_2px_8px_rgba(25,31,40,0.04)] flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#E8F3FF] flex items-center justify-center text-[#3182F6] shrink-0">
            <Video className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-bold text-[#191F28]">강의 수강 관리</span>
            <span className="text-[13px] text-[#8B95A1]">주차별 강의 수강 기한을 직관적으로 확인해요</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E5E8EB] shadow-[0_2px_8px_rgba(25,31,40,0.04)] flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#E8F3FF] flex items-center justify-center text-[#3182F6] shrink-0">
            <FileText className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-bold text-[#191F28]">과제 마감 체크</span>
            <span className="text-[13px] text-[#8B95A1]">오늘 마감인 과제를 빨간 배지로 바로 발견해요</span>
          </div>
        </div>

        {/* PWA Home Screen Installation Guide Card */}
        <div className="bg-white rounded-2xl border border-[#E5E8EB] shadow-[0_2px_8px_rgba(25,31,40,0.04)] overflow-hidden transition-all mt-1">
          {/* Guide Header Toggle Button */}
          <button
            onClick={() => setIsGuideOpen(!isGuideOpen)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-[#F9FAFB] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#E8F3FF] flex items-center justify-center text-[#3182F6] shrink-0">
                <Smartphone className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-[14px] font-bold text-[#191F28]">홈 화면에 앱으로 추가하기</span>
                  <span className="text-[10px] font-bold bg-[#E8F3FF] text-[#3182F6] px-1.5 py-0.5 rounded-full">
                    알림 필수
                  </span>
                </div>
                <span className="text-[11px] text-[#8B95A1]">앱으로 추가해야 마감 푸시 알림을 받을 수 있어요</span>
              </div>
            </div>
            {isGuideOpen ? (
              <ChevronUp className="w-4 h-4 text-[#8B95A1] shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#8B95A1] shrink-0" />
            )}
          </button>

          {/* Guide Body */}
          {isGuideOpen && (
            <div className="px-4 pb-4 pt-1 flex flex-col gap-3 border-t border-[#F2F4F6]">
              {/* Segmented OS Tab */}
              <div className="bg-[#F2F4F6] p-1 rounded-xl flex gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('ios')}
                  className={`flex-1 py-1.5 text-[13px] font-bold rounded-lg transition-all cursor-pointer text-center ${
                    activeTab === 'ios'
                      ? 'bg-white text-[#191F28] shadow-sm'
                      : 'text-[#6B7684] hover:text-[#191F28]'
                  }`}
                >
                  아이폰 (iOS)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('android')}
                  className={`flex-1 py-1.5 text-[13px] font-bold rounded-lg transition-all cursor-pointer text-center ${
                    activeTab === 'android'
                      ? 'bg-white text-[#191F28] shadow-sm'
                      : 'text-[#6B7684] hover:text-[#191F28]'
                  }`}
                >
                  갤럭시 (Android)
                </button>
              </div>

              {/* iOS Guide Steps */}
              {activeTab === 'ios' && (
                <div className="flex flex-col gap-2.5 text-[13px]">
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#E8F3FF] text-[#3182F6] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </div>
                    <div className="flex-1 text-[#333D4B] leading-snug">
                      <strong>Safari</strong> 하단 중앙의 <strong>공유 버튼</strong>
                      <span className="inline-flex items-center align-middle mx-1 px-1 py-0.5 bg-[#F2F4F6] rounded text-[#4E5968]">
                        <Share className="w-3.5 h-3.5 inline mr-0.5" /> 공유
                      </span>
                      을 터치하세요.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#E8F3FF] text-[#3182F6] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </div>
                    <div className="flex-1 text-[#333D4B] leading-snug">
                      메뉴를 내려 <strong>[홈 화면에 추가]</strong>
                      <span className="inline-flex items-center align-middle mx-1 px-1 py-0.5 bg-[#F2F4F6] rounded text-[#4E5968]">
                        <PlusSquare className="w-3.5 h-3.5 inline mr-0.5" />
                      </span>
                      항목을 선택하세요.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#E8F3FF] text-[#3182F6] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </div>
                    <div className="flex-1 text-[#333D4B] leading-snug">
                      우측 상단 <strong>[추가]</strong> 후 홈 화면의 <strong>앱 아이콘</strong>으로 실행해 로그인하세요!
                    </div>
                  </div>

                  {/* iOS Callout */}
                  <div className="bg-[#F8F9FA] rounded-xl p-2.5 border border-[#E5E8EB] flex items-start gap-2 text-[11px] text-[#6B7684] mt-0.5">
                    <Info className="w-3.5 h-3.5 text-[#3182F6] shrink-0 mt-0.5" />
                    <span>
                      아이폰 정책상 Chrome/카카오톡 인앱 브라우저가 아닌 <strong>기본 Safari</strong>에서 추가해야 푸시 알림이 정상 작동해요.
                    </span>
                  </div>
                </div>
              )}

              {/* Android Guide Steps */}
              {activeTab === 'android' && (
                <div className="flex flex-col gap-2.5 text-[13px]">
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#E8F3FF] text-[#3182F6] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </div>
                    <div className="flex-1 text-[#333D4B] leading-snug">
                      <strong>Chrome</strong> 브라우저 우측 상단 <strong>더보기(⋮)</strong>
                      <span className="inline-flex items-center align-middle mx-1 px-1 py-0.5 bg-[#F2F4F6] rounded text-[#4E5968]">
                        <MoreVertical className="w-3.5 h-3.5 inline mr-0.5" /> 메뉴
                      </span>
                      를 터치하세요.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#E8F3FF] text-[#3182F6] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </div>
                    <div className="flex-1 text-[#333D4B] leading-snug">
                      <strong>[홈 화면에 추가]</strong> 또는 <strong>[앱 설치]</strong>
                      <span className="inline-flex items-center align-middle mx-1 px-1 py-0.5 bg-[#F2F4F6] rounded text-[#4E5968]">
                        <Download className="w-3.5 h-3.5 inline mr-0.5" /> 설치
                      </span>
                      버튼을 누르세요.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#E8F3FF] text-[#3182F6] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </div>
                    <div className="flex-1 text-[#333D4B] leading-snug">
                      바탕화면에 생성된 <strong>AssignPlan 앱</strong>을 실행하고 로그인 후 알림을 허용하세요!
                    </div>
                  </div>

                  {/* Android Callout */}
                  <div className="bg-[#F8F9FA] rounded-xl p-2.5 border border-[#E5E8EB] flex items-start gap-2 text-[11px] text-[#6B7684] mt-0.5">
                    <Info className="w-3.5 h-3.5 text-[#3182F6] shrink-0 mt-0.5" />
                    <span>
                      삼성 인터넷 브라우저는 하단 <strong>☰ 메뉴</strong> ➜ <strong>[현재 페이지 추가]</strong> ➜ <strong>[홈 화면]</strong>을 누르시면 됩니다.
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Area */}
      <div className="pb-6 pt-2 flex flex-col gap-3">
        <button
          onClick={onLogin}
          disabled={isLoading}
          className="w-full h-14 bg-white hover:bg-[#F9FAFB] active:scale-[0.98] rounded-2xl border border-[#D1D6DB] shadow-sm flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-50"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span className="text-[16px] font-bold text-[#191F28]">
            Google 계정으로 시작하기
          </span>
        </button>

        <p className="text-[12px] text-[#8B95A1] text-center font-medium">
          로그인 후 클라우드에 일정이 안전하게 동기화돼요
        </p>
      </div>
    </div>
  )
}
