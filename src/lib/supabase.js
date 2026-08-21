import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://subjgvcghilddapmkb.supabase.co'
const supabaseAnonKey = 'sb_publishable_l1BEs19aVb57W5Bc1nePrA_j1GJ4jyz'
export const supabase = createClient(supabaseUrl, supabaseAnonKey)