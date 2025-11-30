"use client";


import React, { useState } from 'react'
import { Input } from './ui/input';
import { Card, CardTitle, CardHeader, CardContent } from './ui/card';
import { Button } from './ui/button';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { FcGoogle } from "react-icons/fc";


const LoginForm = () => {
   const [email, setEmail] = useState<string>("");
   const [password, setPassword] = useState<string>("");
   const [error, setError] = useState<string>("")

   const router = useRouter();

   async function handleLogin():Promise<void>{
      const response = await supabase.auth.signInWithPassword({
         email : email,
         password : password
      })

      if (response.error){
         // throw new Error("Login failed")
         setError("Login failed")
         return 
      }
      router.push("/")
      return 
   }

   async function continueWithGoogle(){
      const response = await supabase.auth.signInWithOAuth({
         provider: 'google',
      })
   }
   
   return (
      <div className="border flex ">
         <Card className="w-[25em] mx-auto ">
            <CardHeader>
               <CardTitle className="text-2xl">Login</CardTitle>

            </CardHeader>
            <CardContent className="flex flex-col gap-2">
               <Input value = {email} type = "email" placeholder='Email' onChange={(event:React.ChangeEvent<HTMLInputElement>)=> setEmail(event.target.value)}/>
               <Input value = {password} type = "password" placeholder='Password' onChange= {(event:React.ChangeEvent<HTMLInputElement>)=> setPassword(event.target.value)}/>
               {
                 error &&  <p>{error}</p>
               }
               <Button onClick={handleLogin}>Login</Button>
               <Button onClick = {continueWithGoogle}>
                  <FcGoogle />
                  Continue with Google 
               </Button>
            </CardContent>
            

         </Card>
        
      </div>
   )
}

export default LoginForm





