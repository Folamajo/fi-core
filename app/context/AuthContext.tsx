import { createContext, useEffect } from "react";

import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";
import { SetStateAction } from "react";


type AuthContextType = {
   session: any,
   setSession: (s: React.Dispatch<SetStateAction<any>>) => void
}


const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({children} : { children: React.ReactNode }) => {
   const [session, setSession] = useState<any>("")

   useEffect(()=> {
      async function getCurrentSession(){
         let currentSession = await supabase.auth.getSession();
         return currentSession
        
      } 
      
      getCurrentSession().then(sessionResult => {
         if(sessionResult){
            setSession(sessionResult.data.session)
         }
      })
      
   }, [])

   return (
      <AuthContext.Provider value = {{session, setSession}}>
         {children}
      </AuthContext.Provider>
   )
}