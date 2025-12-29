// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error("Supabase URL and anonymous key are required.");
// }

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);


import { createClient } from '@supabase/supabase-js'

// TEMP FIX: Hardcode the keys to see if it works
const supabaseUrl = "https://jhbbadkrniujdizfyzez.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoYmJhZGtybml1amRpemZ5emV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5MTc5ODUsImV4cCI6MjA3MzQ5Mzk4NX0.G146vBMCVIQWRJoES3rNZjpb-q3e6gU_-YGyTd_sLgw"

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and anonymous key are required.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);