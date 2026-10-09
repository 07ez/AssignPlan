import React from 'react'
import { Video, FileText } from 'lucide-react'

interface LoginScreenProps {
  onLogin: () => void
  isLoading?: boolean
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, isLoading }) => {
  return (
    <div className="w-full max-w-[480px] min-h-screen bg-[#F2F4F6] text-[#191F28] flex flex-col justify-between p-6 mx-auto shadow-xl select-none">
      {/* Top Brand Area */}
      <div className="pt-12 flex flex-col items-start gap-4">
        {/* App Logo */}
        <img
          src="/icon.png"
          alt="Assign Plan"
          className="w-14 h-14 rounded-2xl shadow-md object-cover shadow-black/10"
        />

        <div className="flex flex-col gap-1.5 mt-2">
          <h1 className="text-[28px] font-bold tracking-tight text-[#191F28] leading-tight">
            대학 생활의 모든 일정,<br />
            깔끔하게 한곳에서
          </h1>
          <p className="text-[15px] font-medium text-[#4E5968] leading-relaxed">
            강의와 과제 마감일을 놓치지 않도록 도와드려요.
          </p>
        </div>
      </div>

      {/* Feature Preview Cards */}
      <div className="my-auto py-6 flex flex-col gap-3">
        <div className="bg-white rounded-2xl p-4.5 border border-[#E5E8EB] shadow-[0_2px_8px_rgba(25,31,40,0.04)] flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#E8F3FF] flex items-center justify-center text-[#3182F6] shrink-0">
            <Video className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-bold text-[#191F28]">강의 수강 관리</span>
            <span className="text-[13px] text-[#8B95A1]">주차별 강의 수강 기한을 직관적으로 확인해요</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4.5 border border-[#E5E8EB] shadow-[0_2px_8px_rgba(25,31,40,0.04)] flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#E8F3FF] flex items-center justify-center text-[#3182F6] shrink-0">
            <FileText className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-bold text-[#191F28]">과제 마감 체크</span>
            <span className="text-[13px] text-[#8B95A1]">오늘 마감인 과제를 빨간 배지로 바로 발견해요</span>
          </div>
        </div>
      </div>

      {/* Bottom Action Area */}
      <div className="pb-6 flex flex-col gap-3">
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
