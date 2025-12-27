"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
type Projects = {
   id : string,
   created_at : string,
   project_name : string,
   user_id : string
}



const UserHome = () => {
   



   const [loading, setLoading] = useState<string>("");
   const [projects, setProjects] = useState<Projects[]>([])
   const [displayInputBox, setDisplayInputBox] = useState<boolean>(false)
   const [selectedFile, setSelectedFile] = useState<File | null> (null)
   const [preview, setPreview] = useState<Record<string, string> []>([])
   const [previewMode, setPreviewMode] = useState<boolean>(false)

   useEffect(()=> {
      setLoading("Fetching projects")
      async function getUserProjects(){
          const {data, error} = await supabase
          .from('projects')
          .select()

         if (error){
            throw new Error ("There was an issue fetching user's projects")
         }

         setProjects(data)
      }

     getUserProjects();
   }, [])


   const parseFile = async () => {
      if(!selectedFile){
         //By pass this by disabling the button possible 
         console.log("No file to parse")
         return
      }
      const file = selectedFile[0]
      if (file.name.endsWith("csv")){
         const text = await file.text()
         const splitText = text.split("\n")
         const header = splitText[0].split(",").map((item:string) => item.toLowerCase())
        
         const feedbackArray = []
         splitText.map((row, index)=> {
            if(index > 0){
               const splitRow = row.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);

               if (splitRow[1]){
                  const feedback = splitRow[1].replace(/\\"/g, '')
                  feedbackArray.push(feedback)
               }

              
            }
            
         })
         
         const normalisedObject = []
         for (let feedback of feedbackArray){
            if(feedback){
               normalisedObject.push({feedback: feedback})
            }
         }

         setPreview(normalisedObject)
         setPreviewMode(true)
      }
      
   }

   // parseFile()
    
   return (
      <div className="flex gap-5">
         <div>
            <h1>Welcome UserName...</h1>
      

            {
               projects.length === 0 && (
                  <>
                     <p>No projects yet.</p>
                  </>
               )
            }  
            <p>Create a project</p>         
            <Popover>
               <PopoverTrigger>
                  New Analysis
               </PopoverTrigger>
               <PopoverContent className="">
                  <div>
                     <Input onChange={(event:React.ChangeEvent<HTMLInputElement>)=>setSelectedFile(event.target.files)} accept=".csv" className="border-0" type="file" /> 
                     <Button onClick={parseFile}>Parse</Button>
                  </div>
                  
                  <Button className="mt-2" onClick={()=>setDisplayInputBox(true)}>Paste feedback</Button>
               </PopoverContent>
            </Popover>
         </div>
         
         <div className=" mt-4">
            {
               displayInputBox && (
                  <>
                     <Button onClick = {()=>setDisplayInputBox(false)}>X</Button>
                     <Input className="w-[600px]"/> 
                  </>
                 
               )

            }
            {
               previewMode && (
                  <>
                  <div className="w-[800px] flex flex-col gap-2 ml-4">
                     <h1 className="font-bold text-lg">Preview mode</h1>
                     <div className='border flex flex-col gap-2'>
                        {
                           preview.map((item) => {
                              return (

                                 <div className=' '>{item.feedback}</div>

                              )
                           })
                        }
                     </div>
                     <div className=' mt-2 flex gap-2'>
                        <Button onClick={()=>setPreviewMode(false)}>Cancel</Button>
                        <Button>Confirm</Button>

                     </div>
                     
                  </div>
                  </>
               )
            }
            
         </div>
      </div>
   )
}

export default UserHome












// onChange={(event:React.ChangeEvent<HTMLInputElement>)=>setSelectedFile()}
// import { redirect } from "next/navigation";

// import { createClient } from "@/lib/supabase/server";
// import { InfoIcon } from "lucide-react";
// import { FetchDataSteps } from "@/components/tutorial/fetch-data-steps";

// export default async function ProtectedPage() {
//   const supabase = await createClient();

//   const { data, error } = await supabase.auth.getClaims();
//   if (error || !data?.claims) {
//     redirect("/auth/login");
//   }

//   return (
//     <div className="flex-1 w-full flex flex-col gap-12">
//       <div className="w-full">
//         <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
//             <InfoIcon size="16" strokeWidth={2} />
//                This is a protected page that you can only see as an authenticated user
//         </div>
//       </div>
//       <div className="flex flex-col gap-2 items-start">
//         <h2 className="font-bold text-2xl mb-4">Your user details</h2>
//         <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
//           {JSON.stringify(data.claims, null, 2)}
//         </pre>
//       </div>
//       <div>
//         <h2 className="font-bold text-2xl mb-4">Next steps</h2>
//         <FetchDataSteps />
//       </div>
//     </div>
//   );
// }
