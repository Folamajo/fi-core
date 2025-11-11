"use client";


import React, { ReactHTMLElement, useState } from 'react'
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


// "use client";

// import { cn } from "@/lib/utils";
// import { createClient } from "@/lib/supabase/client";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// export function LoginForm({
//   className,
//   ...props
// }: React.ComponentPropsWithoutRef<"div">) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const router = useRouter();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const supabase = createClient();
//     setIsLoading(true);
//     setError(null);

//     try {
//       const { error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });
//       if (error) throw error;
//       // Update this route to redirect to an authenticated route. The user already has an active session.
//       router.push("/protected");
//     } catch (error: unknown) {
//       setError(error instanceof Error ? error.message : "An error occurred");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className={cn("flex flex-col gap-6", className)} {...props}>
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-2xl">Login</CardTitle>
//           <CardDescription>
//             Enter your email below to login to your account
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleLogin}>
//             <div className="flex flex-col gap-6">
//               <div className="grid gap-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="m@example.com"
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//               </div>
//               <div className="grid gap-2">
//                 <div className="flex items-center">
//                   <Label htmlFor="password">Password</Label>
//                   <Link
//                     href="/auth/forgot-password"
//                     className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
//                   >
//                     Forgot your password?
//                   </Link>
//                 </div>
//                 <Input
//                   id="password"
//                   type="password"
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//               </div>
//               {error && <p className="text-sm text-red-500">{error}</p>}
//               <Button type="submit" className="w-full" disabled={isLoading}>
//                 {isLoading ? "Logging in..." : "Login"}
//               </Button>
//             </div>
//             <div className="mt-4 text-center text-sm">
//               Don&apos;t have an account?{" "}
//               <Link
//                 href="/auth/sign-up"
//                 className="underline underline-offset-4"
//               >
//                 Sign up
//               </Link>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
