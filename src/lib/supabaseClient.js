import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ixolzbheenuzgqlzdzpd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4b2x6YmhlZW51emdxbHpkenBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MjQ0MTcsImV4cCI6MjA2NDUwMDQxN30.8ITZJ9SEHgorIib_BPCf8n_W1p-ydPhCIYNMWylV-jY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 