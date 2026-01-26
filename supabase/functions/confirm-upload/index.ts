// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
// import "jsr:@supabase/functions-js/edge-runtime.d.ts"
// import { supabase } from '@/lib/supabaseClient';

import { createClient } from "npm:@supabase/supabase-js@2";

// console.log("Hello from Functions!")
const corsHeaders = {
   "Access-Control-Allow-Origin" : "http://localhost:3000",
   "Access-Control-Allow-Methods" : "POST, OPTIONS",
   "Access-Control-Allow-Headers" : "*"
}

Deno.serve(async (req: Request) => {

   if(req.method ==="OPTIONS"){
      return new Response(null, {
         status:204,
         headers: corsHeaders
      })
   }
   if(req.method !== "POST"){
      return new Response(
         JSON.stringify({message: "Only post requests accepted"}), 
         {
            status: 405,
            headers: {
               ...corsHeaders, 
               "Content-Type": "application/json"
            }
         }
      )
   } 


   try {
      //Get the user details 
      const authHeader = req.headers.get('authorization');
      if(!authHeader){
         return new Response(
            JSON.stringify({message: "Unauthorised user"}),
            {
               status: 401,
               headers : {
                  ...corsHeaders,
                  "Content-Type": 'application/json'
               }
            }
         )
      }

      //Supabase client is a connection that our code uses to talk to our Supabase project we use this connection to validate our user
      const supabaseUserVerification = createClient(
         Deno.env.get('SUPABASE_URL') ?? '',
         Deno.env.get('SUPABASE_ANON_KEY') ?? '',
         {
            global : {
               headers: { Authorization: authHeader }
            }
         }
      )
      console.log(authHeader)
   
      
      // Getting the JWT token from the authorization header
      
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabaseUserVerification.auth.getUser(token);

      if(!user){
         return new Response('User not authenticated',{
            headers: {
               ...corsHeaders
            },
            status: 401
         })
      }

      // Create client that gives us access to DATABASE LEVEL OPERATIONS
      const supabase = createClient(
         
         // Deno.env.get('SUPABASE_URL') ?? '',
         // Deno.env.get('SUPABASE_ANON_KEY') ?? '',
         Deno.env.get('SUPABASE_URL') ?? '',
         Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
         {
            global : {
               
               headers: { Authorization: authHeader}
            }
         }
      )

      // console.log(Deno.env.get('PROJECT_URL'))

      // PARSING AND VALIDATING REQUEST BODY 
      const feedbackData = await req.json();
      const { feedbackItems } = feedbackData;
      if (!feedbackItems){
         return new Response(
            JSON.stringify({message: 'No feedback items'}),
            {
               headers: {
                  ...corsHeaders,
                  "Content-Type": "Application/json"},
               status: 400 
            }
         )
      }
      const feedbackItemsArray = feedbackItems.map(item => item.feedback)

      if (feedbackItemsArray.length === 0 ){
         return new Response(
            JSON.stringify({message: 'No items imported'}), 
            {
               headers: {
                  ...corsHeaders,
                  "Content-Type": "Application/json"},
               status: 400
            }
         )
      }

      const {data, error} = await supabase.rpc('create_project', 
         { 
            project_name: 'project-',
            feedback_items:  feedbackItemsArray
         }
      )
      if (error){
         console.log(error)
      }


   
      
      return new Response(JSON.stringify({success: true, data: {user_id: user.id}, feedback_count: feedbackItemsArray.length}), {
         headers: { 
            ...corsHeaders,
            "Content-Type": "application/json"
         },
         status:200
      })

   }  catch (error) {
      return new Response (
         JSON.stringify({error: error.message}),
         { 
            headers: { 
               ...corsHeaders,
               "Content-Type": "application/json" },
            status: 400,
         },
      )
   }
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

      // DATABASE WRITE
      // const { data, error } = await supabase
      //    .from('projects')
      //    .insert({ project_name:"Add random user project name", user_id : user.id })
      //    .select()