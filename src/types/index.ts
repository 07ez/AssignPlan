export interface ItemData {
  id: string
  title: string
  date: { year: number; month: number; day: number }
  memo?: string
  completed: boolean
  createdAt?: string | number
}

export type ModalType = '강의' | '과제'