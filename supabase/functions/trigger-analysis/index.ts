// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs



import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'npm:@supabase/supabase-js@2';




Deno.serve(async (req) => {
   const { analysis_id } = await req.json();
   if (!analysis_id){
      return new Response (
         JSON.stringify({ message: "missing analysis_id "}),
         {
            status: 400,
         }
      )
   }

  // Check for valid authorization in header 
   const authHeader = req.headers.get('Authorization');
   if(!authHeader){
   return new Response(
      JSON.stringify({message: "No authorization token in request header."}),
      {
         status : 401,
      }
   )
   }
   
   // Get JWT token
   const jwt = authHeader.replace("Bearer ", "")

   //Create client and verify user 
   const supabaseVerification = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
         global : {
            headers: { Authorization: authHeader }
         }
      }
   )

   
   const { data } = await supabaseVerification.auth.getUser(jwt)
   if(!data.user){
      return new Response(
         JSON.stringify({message: "User could not be found"}),
         {
            status: 404,
         }
      )
   }

   const userId = data.user.id;
})





  
  //GET USER 

//   return new Response(
//     JSON.stringify(analysis_id),
//     { headers: { "Content-Type": "application/json" } },
//   )





// console.log("Hello from Functions!")
/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/trigger-analysis' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
