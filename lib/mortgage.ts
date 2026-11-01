export type MortgageInputs = {
  homePrice: number
  downPayment: number
  years: number
  rate: number
  taxRate: number
  insurance: number
  pmiRate: number
  hoa: number
  extraMonthly: number
  extraYearly: number
  extraOnce: number
  extraOnceMonth: number
}

export type Schedule = { months: number; totalInterest: number; balances: number[]; pmiTotal: number }

export function monthlyPI(principal: number, annualRate: number, years: number) {
  const n = years * 12
  const r = annualRate / 100 / 12
  if (r === 0) return principal / n
  return (principal * r) / (1 - Math.pow(1 + r, -n))
}

export function amortize(inp: MortgageInputs, withExtras: boolean): Schedule {
  const principal = inp.homePrice - inp.downPayment
  const r = inp.rate / 100 / 12
  const pay = monthlyPI(principal, inp.rate, inp.years)
  let balance = principal
  let totalInterest = 0
  let pmiTotal = 0
  let month = 0
  const balances = [balance]
  while (balance > 0.005 && month < inp.years * 12 + 1) {
    month++
    const interest = balance * r
    let principalPaid = Math.min(pay - interest, balance)
    if (withExtras) {
      let extra = inp.extraMonthly
      if (month % 12 === 0) extra += inp.extraYearly
      if (month === inp.extraOnceMonth) extra += inp.extraOnce
      principalPaid = Math.min(principalPaid + extra, balance)
    }
    if (inp.pmiRate > 0 && balance > inp.homePrice * 0.8) pmiTotal += (principal * inp.pmiRate) / 100 / 12
    totalInterest += interest
    balance -= principalPaid
    balances.push(Math.max(0, balance))
  }
  return { months: month, totalInterest, balances, pmiTotal }
}
