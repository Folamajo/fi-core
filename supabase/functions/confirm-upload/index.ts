// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
// import "jsr:@supabase/functions-js/edge-runtime.d.ts"
// import { supabase } from '@/lib/supabaseClient';

import { createClient } from "npm:@supabase/supabase-js@2"

console.log("Hello from Functions!")

Deno.serve(async (req) => {

   //Verifying the request method is a POST request
   if(req.method !== "POST"){
      return new Response(
         JSON.stringify({message: "Only post requests accepted"}), 
         {
            status: 405,
            headers: {"Content-Type": "application/json"}
         }
      )
   } 

   try {
      const supabaseClient = createClient(
         Deno.env.get('SUPABASE_URL') ?? '',
         Deno.env.get('SUPABASE_ANON_KEY') ?? '',
         {
            global : {
               headers: { Authorization: req.headers.get('Authurization')!}
            }
         }

      )
   }
   
   // Getting the JWT token from the authorization header
   const authHeader = req.headers.get('Authorization');
   if(!authHeader){
      return new Response(
         JSON.stringify({message: "Unauthorised user"}),
         {
            status: 401,
            headers : {
               "Content-Type": 'application/json'
            }
         }
      )
   }

   const token = authHeader.replace('Bearer ', '');
   // const { data } = await supabaseClient.auth.getUser(token)

   
   return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
   )
})


   // const { name } = await req.json()   
//   const data = {
//     message: `Hello ${name}!`,
//   }



/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/confirm-upload' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
