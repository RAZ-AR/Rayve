'use client'

import { useState } from 'react'
import { inputCls } from './FormField'

interface Props {
  name: string
  placeholder?: string
}

export function UrlInput({ name, placeholder = 'https://yoursite.com' }: Props) {
  const [value, setValue] = useState('')

  function handleBlur() {
    const v = value.trim()
    if (v && !v.startsWith('http://') && !v.startsWith('https://')) {
      setValue('https://' + v)
    }
  }

  return (
    <input
      name={name}
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={inputCls}
    />
  )
}
