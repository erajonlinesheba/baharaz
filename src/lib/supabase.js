import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://subjgvcghhilddamkb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3Mio1JzdXBhYmFzZSI5InI1JzI1'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)