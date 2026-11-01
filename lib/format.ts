export function formatNumber(n: number, maxDigits = 4) {
  if (!Number.isFinite(n)) return '—'
  return n.toLocaleString('en-US', { maximumFractionDigits: maxDigits })
}

export function formatCurrency(n: number, digits = 2) {
  if (!Number.isFinite(n)) return '—'
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}

export function toNum(v: string) {
  if (v.trim() === '') return NaN
  return Number(v)
}

export function formatDuration(months: number) {
  const y = Math.floor(months / 12)
  const m = Math.round(months % 12)
  const parts = []
  if (y) parts.push(`${y} yr${y === 1 ? '' : 's'}`)
  if (m) parts.push(`${m} mo`)
  return parts.join(' ') || '0 mo'
}
