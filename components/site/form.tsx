import type { ComponentProps, ReactNode } from 'react'
import { useId } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const controlClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3.5 text-[15px] text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-navy-2 focus-visible:ring-3 focus-visible:ring-navy-2/15 disabled:bg-muted'

type InputFieldProps = Omit<ComponentProps<'input'>, 'id'> & {
  label: string
  hint?: string
  prefix?: string
  suffix?: string
  id?: string
}

export function InputField({ label, hint, prefix, suffix, className, id, ...props }: InputFieldProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={inputId} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm text-muted-foreground">
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          className={cn(controlClass, prefix && 'pl-8', suffix && 'pr-14')}
          {...props}
        />
        {suffix && (
          <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-sm text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

type SelectFieldProps = Omit<ComponentProps<'select'>, 'id'> & {
  label: string
  options: { value: string; label: string }[]
  hideLabel?: boolean
  id?: string
}

export function SelectField({ label, options, hideLabel, className, id, ...props }: SelectFieldProps) {
  const autoId = useId()
  const selectId = id ?? autoId
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={selectId} className={cn('text-sm font-medium text-foreground', hideLabel && 'sr-only')}>
        {label}
      </label>
      <div className="relative">
        <select id={selectId} className={cn(controlClass, 'appearance-none pr-10')} {...props}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}

type ButtonProps = ComponentProps<'button'> & { variant?: 'primary' | 'secondary' | 'ghost' }

export function PrimaryButton({ variant = 'primary', className, type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold transition-colors outline-none focus-visible:ring-3 focus-visible:ring-navy-2/25 disabled:pointer-events-none disabled:opacity-50',
        variant === 'primary' && 'bg-navy text-white hover:bg-navy-2',
        variant === 'secondary' && 'border border-border bg-white text-navy hover:bg-sky',
        variant === 'ghost' && 'text-navy hover:bg-sky',
        className,
      )}
      {...props}
    />
  )
}

export function Card({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('rounded-2xl border border-border bg-white shadow-xs', className)} {...props} />
}

export function ResultCard({
  label,
  value,
  sub,
  emphasis,
  className,
}: {
  label: string
  value: ReactNode
  sub?: ReactNode
  emphasis?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-xl border p-4',
        emphasis ? 'border-navy bg-navy text-white' : 'border-[#D6E6FB] bg-sky text-navy',
        className,
      )}
    >
      <p className={cn('text-xs font-medium uppercase tracking-wider', emphasis ? 'text-white/70' : 'text-navy-2/70')}>
        {label}
      </p>
      <p className={cn('mt-1.5 font-semibold tabular-nums tracking-tight', emphasis ? 'text-3xl' : 'text-xl')}>
        {value}
      </p>
      {sub && <p className={cn('mt-1 text-sm', emphasis ? 'text-white/70' : 'text-muted-foreground')}>{sub}</p>}
    </div>
  )
}

export function SegmentedControl<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string }[]
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1 rounded-xl bg-muted p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            'flex-1 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors',
            value === o.value ? 'bg-white text-navy shadow-xs' : 'text-muted-foreground hover:text-navy',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
