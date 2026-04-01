export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type Database = {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: string
          user_id: string
          business_type: 'retail' | 'influencer' | 'horeca' | 'info'
          name: string
          segment_data: Json
          brand_tone: string | null
          source_domain: string | null
          meta_access_token: string | null
          meta_user_id: string | null
          meta_business_id: string | null
          meta_ad_account_id: string | null
          meta_page_id: string | null
          meta_instagram_id: string | null
          meta_connected_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_type: 'retail' | 'influencer' | 'horeca' | 'info'
          name?: string
          segment_data?: Json
          brand_tone?: string | null
          source_domain?: string | null
          meta_access_token?: string | null
          meta_user_id?: string | null
          meta_business_id?: string | null
          meta_ad_account_id?: string | null
          meta_page_id?: string | null
          meta_instagram_id?: string | null
          meta_connected_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_type?: 'retail' | 'influencer' | 'horeca' | 'info'
          name?: string
          segment_data?: Json
          brand_tone?: string | null
          source_domain?: string | null
          meta_access_token?: string | null
          meta_user_id?: string | null
          meta_business_id?: string | null
          meta_ad_account_id?: string | null
          meta_page_id?: string | null
          meta_instagram_id?: string | null
          meta_connected_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          id: string
          business_id: string
          title: string
          raw_prompt: string
          goal_type: string | null
          meta_objective: string | null
          status: 'draft' | 'active' | 'completed'
          created_at: string
        }
        Insert: {
          id?: string
          business_id: string
          title?: string
          raw_prompt?: string
          goal_type?: string | null
          meta_objective?: string | null
          status?: 'draft' | 'active' | 'completed'
          created_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          title?: string
          raw_prompt?: string
          goal_type?: string | null
          meta_objective?: string | null
          status?: 'draft' | 'active' | 'completed'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'goals_business_id_fkey'
            columns: ['business_id']
            isOneToOne: false
            referencedRelation: 'businesses'
            referencedColumns: ['id']
          }
        ]
      }
      campaigns: {
        Row: {
          id: string
          business_id: string
          goal_id: string | null
          name: string
          objective: string | null
          audience_summary: string | null
          targeting_spec: Json
          budget_type: string | null
          daily_budget: number | null
          status: 'draft' | 'pending_review' | 'active' | 'paused' | 'completed'
          meta_campaign_id: string | null
          meta_adset_id: string | null
          meta_ad_id: string | null
          launched_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          goal_id?: string | null
          name?: string
          objective?: string | null
          audience_summary?: string | null
          targeting_spec?: Json
          budget_type?: string | null
          daily_budget?: number | null
          status?: 'draft' | 'pending_review' | 'active' | 'paused' | 'completed'
          meta_campaign_id?: string | null
          meta_adset_id?: string | null
          meta_ad_id?: string | null
          launched_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          goal_id?: string | null
          name?: string
          objective?: string | null
          audience_summary?: string | null
          targeting_spec?: Json
          budget_type?: string | null
          daily_budget?: number | null
          status?: 'draft' | 'pending_review' | 'active' | 'paused' | 'completed'
          meta_campaign_id?: string | null
          meta_adset_id?: string | null
          meta_ad_id?: string | null
          launched_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          id: string
          business_id: string
          goal_id: string | null
          role: 'user' | 'assistant'
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          business_id: string
          goal_id?: string | null
          role: 'user' | 'assistant'
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          goal_id?: string | null
          role?: 'user' | 'assistant'
          content?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience type aliases
export type Business = Database['public']['Tables']['businesses']['Row']
export type BusinessInsert = Database['public']['Tables']['businesses']['Insert']
