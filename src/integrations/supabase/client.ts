
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://imxzndntorrsgkdnmvef.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlteHpuZG50b3Jyc2drZG5tdmVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyNDIzOTcsImV4cCI6MjA1NzgxODM5N30.N-gE3ArjOwI52oiuE_WTNHWGxvexpR0-WlogIoB-rAs";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
