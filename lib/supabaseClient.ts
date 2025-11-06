import { createClient } from "@supabase/supabase-js";
import { Database } from "@/database.types";

const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const projectAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if(!projectUrl || !projectAnonKey){
   throw new Error("Supabase environmental variables are missing!")
}

const supabase = createClient<Database>( projectUrl, projectAnonKey)

