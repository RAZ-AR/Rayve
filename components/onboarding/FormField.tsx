import { cn } from '@/lib/utils'

export const inputCls =
  'h-9 w-full rounded-md border border-white/[0.08] bg-white/[0.03] px-3 text-sm text-white placeholder:text-[#505050] outline-none transition-all focus:border-violet-500/60 focus:bg-white/[0.05] focus:ring-1 focus:ring-violet-500/30'

export const selectCls = cn(
  inputCls,
  'appearance-none cursor-pointer'
)

export const textareaCls = cn(
  inputCls,
  'h-auto resize-none py-2.5'
)

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
        <label className="text-xs font-medium text-[#888]">
          {label}
          {required && <span className="ml-0.5 text-red-400">*</span>}
        </label>
        {hint && <span className="text-[11px] text-[#505050]">{hint}</span>}
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

  const activeClass =
    color === 'pink'
      ? 'border-pink-500/40 bg-pink-500/[0.10] text-pink-300'
      : 'border-violet-500/40 bg-violet-500/[0.10] text-violet-300'

  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => toggle(id)}
          className={`rounded-md border px-2.5 py-1 text-xs transition-all ${
            selected.includes(id)
              ? activeClass
              : 'border-white/[0.08] bg-white/[0.02] text-[#888] hover:border-white/[0.14] hover:text-white'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
