import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tnzpycbkgjrshvtpbfca.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuenB5Y2JrZ2pyc2h2dHBiZmNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2MDAwMTksImV4cCI6MjA5MzE3NjAxOX0.ZNpk8pGJfktF4fet2Z2Zu4Yg2rs3q8Vr9MrE00x_Sn8";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Faltan las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
