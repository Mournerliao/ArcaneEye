/* ─── Supabase Database Types ─── */
/* Auto-generated from migration 001_initial_schema.sql */

export interface Champion {
  id: number
  name: string
  title: string | null
  alias: string | null
  roles: string[]
  icon_url: string | null
  tier: number | null
  wins: number
  games: number
  win_rate: number
  pick_rate: number
  game_patch: string | null
  data_date: string | null
  synced_at: string
}

export interface Augment {
  id: number
  name: string
  display_name: string
  rarity: number | null
  rarity_name: string | null
  icon_url: string | null
  description: string | null
  tooltip: string | null
  tier: number | null
  wins: number
  games: number
  win_rate: number
  pick_rate: number
  game_patch: string | null
  data_date: string | null
  synced_at: string
}

export interface ChampionAugment {
  champion_id: number
  augment_id: number
  tier: number | null
  wins: number
  games: number
  win_rate: number
  pick_rate: number
  game_patch: string | null
  data_date: string | null
  synced_at: string
}

export interface SyncLog {
  id: string
  resource: string
  status: 'pending' | 'running' | 'success' | 'failed'
  data_version: string | null
  records_synced: number
  error_message: string | null
  started_at: string
  completed_at: string | null
}

/* ─── Database schema type for Supabase client ─── */

export interface Database {
  public: {
    Tables: {
      champions: {
        Row: Champion
        Insert: Omit<Champion, 'synced_at'> & { synced_at?: string }
        Update: Partial<Omit<Champion, 'id'>>
      }
      augments: {
        Row: Augment
        Insert: Omit<Augment, 'synced_at'> & { synced_at?: string }
        Update: Partial<Omit<Augment, 'id'>>
      }
      champion_augments: {
        Row: ChampionAugment
        Insert: Omit<ChampionAugment, 'synced_at'> & { synced_at?: string }
        Update: Partial<Omit<ChampionAugment, 'champion_id' | 'augment_id'>>
      }
      sync_log: {
        Row: SyncLog
        Insert: Omit<SyncLog, 'id' | 'started_at'> & { id?: string; started_at?: string }
        Update: Partial<Omit<SyncLog, 'id'>>
      }
    }
  }
}
