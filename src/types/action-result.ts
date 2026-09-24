export type ActionResult<TData, TError = string> =
  | {
      success: true
      data: TData
      error?: never
    }
  | {
      success: false
      data?: never
      error: TError
      field?: string // Útil para apontar qual input falhou (ex: 'email')
    }
