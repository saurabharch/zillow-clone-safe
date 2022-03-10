import { ReactElement } from 'react'

export type CounterStatus = 'idle' | 'loading' | 'failed'

export type User = {
  uid: string | null
  displayName: string | null
  email: string | null
}

export type SigninInfo = {
  email: string
  password: string
}
export type SignupInfo = SigninInfo & {
  displayName?: string
}

export type AsyncData<T> = {
  data: T
  fulfilled?: boolean
  loading?: boolean
  error?: boolean
}

export type AsyncUser = AsyncData<User>

export type Children = ReactElement | ReactElement[] | string

export type NotificationType = {
  id: string
  message: Children
  type?: 'success' | 'error' | 'info' | 'warning'
  position?:
    | 'top-right'
    | 'top-left'
    | 'top-center'
    | 'bottom-right'
    | 'bottom-left'
    | 'bottom-center'
}
