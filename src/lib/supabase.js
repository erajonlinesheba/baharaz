import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://subjgvcghilddapmkb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1YmpndnpjaGdnaWhsZGRhbWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczMzE1MTYsImV4cCI6MjEwMjkwNzUxNn0.RHCz85yMZKwZxEEBtDPR_iB1P7pKqHCAUQT5XGZYNCI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)