import { createClient } from "@supabase/supabase-js";

const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const projectAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if(!projectUrl || !projectAnonKey){
   throw new Error("Supabase environmental variables are missing!")
}
export const supabase = createClient(projectUrl, projectAnonKey)


