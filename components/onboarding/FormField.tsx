import { cn } from '@/lib/utils'

export const inputCls =
  'h-9 w-full rounded-xl border px-3 text-sm outline-none transition-all' +
  ' border-[var(--border)] bg-white text-[var(--text)] placeholder:text-[var(--text-muted)]' +
  ' focus:border-[var(--accent)] focus:ring-2 focus:ring-[rgba(124,58,237,0.08)]'

export const selectCls = cn(inputCls, 'appearance-none cursor-pointer')

export const textareaCls = cn(inputCls, 'h-auto resize-none py-2.5')

interface FieldProps {
  label: string
  required?: boolean
  hint?: string
  children: React.ReactNode
  className?: string
}

export function Field({ label, required, hint, children, className }: FieldProps) {
  return (
    <div className={className}>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
          {label}
          {required && <span className="ml-0.5" style={{ color: '#EF4444' }}>*</span>}
        </label>
        {hint && <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{hint}</span>}
      </div>
      {children}
    </div>
  )
}

interface ChipGroupProps {
  options: { id: string; label: string }[]
  selected: string[]
  onChange: (selected: string[]) => void
  color?: 'violet' | 'pink'
}

export function ChipGroup({ options, selected, onChange, color = 'violet' }: ChipGroupProps) {
  function toggle(id: string) {
    onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id])
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(({ id, label }) => {
        const isActive = selected.includes(id)
        const activeStyle =
          color === 'pink'
            ? { border: '1px solid rgba(236,72,153,0.4)', background: 'rgba(236,72,153,0.08)', color: '#DB2777' }
            : { border: '1px solid rgba(124,58,237,0.4)', background: 'rgba(124,58,237,0.08)', color: '#7C3AED' }
        const inactiveStyle = {
          border: '1px solid var(--border)',
          background: 'white',
          color: 'var(--text-secondary)',
        }

        return (
          <button
            key={id}
            type="button"
            onClick={() => toggle(id)}
            className="rounded-xl px-3 py-1.5 text-xs font-medium transition-all hover:border-violet-300"
            style={isActive ? activeStyle : inactiveStyle}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
