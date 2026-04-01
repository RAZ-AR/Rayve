import { createClient } from '@/lib/supabase/server'
import type { Business, BusinessInsert, Json } from '@/lib/types/database'
import type { BusinessType, SegmentData } from '@/lib/segments/types'

interface UpsertBusinessParams {
  userId: string
  businessType: BusinessType
  name: string
  segmentData: SegmentData
  sourceDomain?: string
  brandTone?: string
}

export async function upsertBusiness(params: UpsertBusinessParams): Promise<Business> {
  const supabase = await createClient()

  const values: BusinessInsert = {
    user_id: params.userId,
    business_type: params.businessType,
    name: params.name,
    segment_data: params.segmentData as unknown as Json,
    source_domain: params.sourceDomain ?? null,
    brand_tone: params.brandTone ?? null,
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('businesses')
    .upsert(values, { onConflict: 'user_id' })
    .select()
    .single()

  if (error) throw error
  return data as Business
}

export async function getBusinessByUserId(userId: string): Promise<Business | null> {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('businesses')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return (data as Business) ?? null
}
