"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Popover } from '@/components/ui/popover';
import { PopoverTrigger } from '@radix-ui/react-popover';
type Projects = {
   id : string,
   created_at : string,
   project_name : string,
   user_id : string
}



const UserHome = () => {




   const [loading, setLoading] = useState<string>("");
   const [projects, setProjects] = useState<Projects[]>([])

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

   return (
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
            <PopoverContent>
               
            </PopoverContent>

         </Popover>
      </div>
   )
}

export default UserHome







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
