'use client'

import { useEffect, useRef } from 'react'

interface Props {
  botUsername: string
  authUrl: string
  buttonSize?: 'large' | 'medium' | 'small'
}

/**
 * Renders the official Telegram Login Widget as a server-redirect flow.
 * data-auth-url → Telegram redirects browser to /api/auth/telegram?... after login.
 */
export function TelegramLoginButton({
  botUsername,
  authUrl,
  buttonSize = 'medium',
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Remove any existing script to avoid duplicates on hot-reload
    container.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.setAttribute('data-telegram-login', botUsername)
    script.setAttribute('data-size', buttonSize)
    script.setAttribute('data-auth-url', authUrl)
    script.setAttribute('data-request-access', 'write')
    script.async = true

    container.appendChild(script)

    return () => {
      container.innerHTML = ''
    }
  }, [botUsername, authUrl, buttonSize])

  return <div ref={containerRef} className="flex justify-center" />
}
