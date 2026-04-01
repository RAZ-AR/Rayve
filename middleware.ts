import { NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const DOMAIN_SEGMENT_MAP: Record<string, string> = {
  'shops.rayve.io': 'retail',
  'creators.rayve.io': 'influencer',
  'restaurants.rayve.io': 'horeca',
  'courses.rayve.io': 'info',
  'rayve.io': 'generic',
  'www.rayve.io': 'generic',
  // Local dev
  'shops.localhost': 'retail',
  'creators.localhost': 'influencer',
  'restaurants.localhost': 'horeca',
  'courses.localhost': 'info',
}

function resolveSegment(host: string): string {
  // Strip port for local dev (shops.localhost:3000 → shops.localhost)
  const hostname = host.split(':')[0]

  if (DOMAIN_SEGMENT_MAP[hostname]) {
    return DOMAIN_SEGMENT_MAP[hostname]
  }

  // Subdomain prefix match (e.g. shops.anything.rayve.io)
  for (const [domain, segment] of Object.entries(DOMAIN_SEGMENT_MAP)) {
    if (hostname.endsWith('.' + domain) || hostname === domain) {
      return segment
    }
  }

  return 'generic'
}

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? ''
  const segment = resolveSegment(host)

  // Inject segment hint into request headers so Server Components can read it
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-segment-hint', segment)

  // Build a new request with modified headers to pass into updateSession
  const modifiedRequest = new NextRequest(request.url, {
    headers: requestHeaders,
    method: request.method,
    body: request.body,
  })

  // Refresh Supabase session and get response
  const response = await updateSession(modifiedRequest)

  // Also forward hint on response headers (optional, for debugging)
  response.headers.set('x-segment-hint', segment)

  return response
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - Static file extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)',
  ],
}
