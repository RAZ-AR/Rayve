'use client'

import { useState } from 'react'
import { inputCls } from './FormField'

interface Props {
  name: string
  placeholder?: string
  defaultValue?: string
}

export function UrlInput({ name, placeholder = 'https://yoursite.com', defaultValue = '' }: Props) {
  const [value, setValue] = useState(defaultValue)

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
