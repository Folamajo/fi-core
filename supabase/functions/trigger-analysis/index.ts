// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs



import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'npm:@supabase/supabase-js@2';




Deno.serve(async (req) => {
   const { analysisId } = await req.json();
   if (!analysisId){
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
   const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
         global : {
            headers: { Authorization: authHeader }
         }
      }
   )

   
   const { data : { user } } = await supabase.auth.getUser(jwt)
   if(!user){
      return new Response(
         JSON.stringify({message: "User could not be found"}),
         {
            status: 404,
         }
      )
   }
   const userId = user.id;

   // Check if analysis exists 
   const { count, error} = await supabase 
      .from('analyses')
      .select ('id, projects(id, user_id)', {  count: 'exact', head: true})
      .eq('projects.user_id', userId)
      .eq('id', analysisId);

   if (error){
      return new Response(
         JSON.stringify({message: "Analysis does not exist for this user"}),
         {
            status: 404
         }
      )
   }

   if (count === 0){
      return new Response(
         JSON.stringify({message: "The user has no project with this analysis id"}),
         {
            status : 404,
         }
      )
   }
   // Query the database to get the status of the analysis 
   const currentStatus = await supabase
      .from("analyses")
      .select('status')
      .eq('id', analysisId)
      .single()

   //If there is an error fail fast
   if (currentStatus.error){
      return new Response(
         JSON.stringify({message: "Analysis does not exist."}),
         {
            status : 404
         }
      )
   }
   // the status is on 'pending'
   if (currentStatus.data.status === 'pending'){
      const { error } = await supabase
         .from('analyses')
         .update({ status : 'processing'})
         .eq('id', analysisId);

      if (error){
         return new Response(
            JSON.stringify({message: "Error processing analysis."}),
            {
               status : 404
            }
         )
      }
   }
   else if (currentStatus.data.status !== 'pending'){
      return new Response(
         JSON.stringify({message: "Analysis is not ready for available for processing."}),
         {
            status: 404
         }
      )
   }

   const maxCount = 200;
   //Get feedback count
   const feedbackCountResult = await supabase
      .from("feedback_items")
      .select('id', { count: 'exact', head: true })
      .eq('analysis_id', analysisId)

   if(feedbackCountResult.count === 0 ){
      const { error } = await supabase
         .from('analyses')
         .update({ status : 'terminal'})
         .eq('id', analysisId);
      if (error){
         return new Response(
            JSON.stringify({message: "Error processing analysis."}),
            {
               status : 404
            }
         )
      }
   }

   else if (feedbackCountResult.count! > maxCount){
      const { error } = await supabase
         .from('analyses')
         .update({status : 'error'})
         .eq('id', analysisId)
      if (error){
         return new Response (
            JSON.stringify({ message: "Error processing analysis. "}),
            {
               status : 404
            }
         )
      }
      return new Response(
         JSON.stringify({message: "Feedback count exceeded limit"}),
         {
            status : 404
         }
      )
   }
   

   const feedbackItems = await supabase
      .from("feedback_items")
      .select('id, feedback_text, created_at' )
      .eq('analysis_id', analysisId)
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
