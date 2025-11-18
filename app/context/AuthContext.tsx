"use client";

import { createContext, useContext, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";
import { SetStateAction } from "react";


type AuthContextType = {
   session: any,
   setSession: React.Dispatch<SetStateAction<any>>
   currentUser : object | null
}


const AuthContext = createContext<AuthContextType | null>(null);
 
export const AuthProvider = ({children} : { children: React.ReactNode }) => {
   const [session, setSession] = useState<any >(null)

   useEffect(()=> {
      async function getCurrentSession(){
         let currentSession = await supabase.auth.getSession();
         return currentSession
      } 
      
      getCurrentSession().then(sessionResult => {
         if(sessionResult.data.session){
            setSession(sessionResult.data.session)
         }
      })

      const {  data }  = supabase.auth.onAuthStateChange((event, session) => {
         setSession(session)
      })

      return ()=> {
         data.subscription.unsubscribe(); //Removes listener
      }
   }, [])
   let currentUser;
   if (session){
      currentUser = session.user;
   }

   return (
      <AuthContext.Provider value = {{ session, setSession, currentUser }}>
         {children}
      </AuthContext.Provider>
   )
}

export const useAuth = () => {
   const auth = useContext(AuthContext)
   if (auth){
      return auth 
   }
   else {
      throw new Error("Component has no access to auth context")
   }
   
}