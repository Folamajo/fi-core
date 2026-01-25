// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs



import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { create } from "node:domain";
import { createClient } from 'npm:@supabase/supabase-js@2';
import OpenAI from "npm:openai@^4.52.5";


Deno.serve(async (req) => {

   const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
   const client = new OpenAI({
      apiKey: OPENAI_API_KEY
   });


   const feedback_text = "Purchased this for my device, it worked as advertised. You can never have too much phone memory."
   const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input : `Sentiment prompt Task : Analyse and classify the following text ${feedback_text}.
      Sentiment categories: 
         - Positive 
         - Negative 
         - Neutral 
      Rules: 
      - Focus on the sentiment towards the service(this is subject to change but ok for now ) 
      - If sentiment is mixed choose the dominant one. 
      - If no clear emotion is present, return Neutral 
      - Don't add explanations or extra text. 
   
      Output should be strictly returned in JSON format allowing us to see sentiment and confidence should be between 0 - 1 with 1 being the highest score here is an example { "sentiment_label": "negative", "confidence" : 0.87 }`
   })
  
   if(response){
      console.log(response)
      return new Response(
         JSON.stringify({message: "got a return"}),
         {
            status: response.status
         }
      )
      // return new Response (
      // JSON.stringify({message: response}),
      //    {
      //       status: response.status
      //    }
      // )
   }
   
   console.log(response)
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
   
   //Get all feedback items 
   const feedbackItems = await supabase
      .from("feedback_items")
      .select('id, feedback_text, created_at' )
      .eq('analysis_id', analysisId)

   
   let feedbackCharCount: number= 0;
   for (const feedbackItem of feedbackItems){
      feedbackCharCount += feedbackItem.feedback_text.length
   }

   if (feedbackCharCount > 100000){
      const { error } = await supabase
         .from('analyses')
         .update({status: 'error'})
         .eq('id', analysisId)
      if(error){
         return new Response (
            JSON.stringify({message : "Error processing analysis"}),
            {
               status: 404
            }
         )
      }
      return new Response (
         JSON.stringify({ message: "Feedback token limit exceeded"}),
         {
            status : 404
         }
      )
   }
   

   

   // ADDING SENTIMENT ANALYSIS NEXT 

   
})



const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const client = new OpenAI({
   apiKey: OPENAI_API_KEY
});


const feedback_text = "Purchased this for my device, it worked as advertised. You can never have too much phone memory."
const response = await client.responses.create({
   model: "gpt-4.1-mini",
   input : `Sentiment prompt Task : Analyse and classify the following text ${feedback_text}.
   Sentiment categories: 
      - Positive 
      - Negative 
      - Neutral 
   Rules: 
   - Focus on the sentiment towards the service(this is subject to change but ok for now ) 
   - If sentiment is mixed choose the dominant one. 
   - If no clear emotion is present, return Neutral 
   - Don't add explanations or extra text. 
   
   Output should be strictly returned in JSON format allowing us to see sentiment and confidence should be between 0 - 1 with 1 being the highest score here is an example { "sentiment_label": "negative", "confidence" : 0.87 }`

})
  

console.log(response)


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
