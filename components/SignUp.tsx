import React, { useState } from 'react'
import { Card, CardTitle, CardHeader, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

const SignUpForm = () => {

   const [email, setEmail] = useState<string>("");
   const [password, setPassword] = useState<string>("");
   const router = useRouter()
   const handleSignUp = async ():Promise<void>=>{
      const {data, error} = await supabase.auth.signUp({
         email: email,
         password: password,
      })

      if(error){
         throw new Error("There was an error signing up this account!")
         
      }
      router.push('/protected')
      

   }

   return (
    
       <div>
         <Card className="w-[25em] mx-auto ">
            <CardHeader>
               <CardTitle className="text-2xl">SignUp</CardTitle>

            </CardHeader>
            <CardContent className="flex flex-col gap-2">
               <Input value = {email} type = "email" placeholder='Email' onChange={(event:React.ChangeEvent<HTMLInputElement>)=>setEmail(event.target.value)}/>
               <Input value = {password} type = "password" placeholder='Password' onChange={(event:React.ChangeEvent<HTMLInputElement>)=>setPassword(event.target.value)} />
               <Button onClick={handleSignUp}>Signup</Button>
            </CardContent>
         </Card>
        
         
      </div>
   )
}

export default SignUpForm












// "use client";

// import { cn } from "@/lib/utils";
// import { createClient } from "@/lib/supabase/client";
// import { Button } from "@/components/ui/button";
// import { Card,
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

// export function SignUpForm({
//   className,
//   ...props
// }: React.ComponentPropsWithoutRef<"div">) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [repeatPassword, setRepeatPassword] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const router = useRouter();

//   const handleSignUp = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const supabase = createClient();
//     setIsLoading(true);
//     setError(null);

//     if (password !== repeatPassword) {
//       setError("Passwords do not match");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const { error } = await supabase.auth.signUp({
//         email,
//         password,
//         options: {
//           emailRedirectTo: `${window.location.origin}/protected`,
//         },
//       });
//       if (error) throw error;
//       router.push("/auth/sign-up-success");
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
//           <CardTitle className="text-2xl">Sign up</CardTitle>
//           <CardDescription>Create a new account</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSignUp}>
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
//                 </div>
//                 <Input
//                   id="password"
//                   type="password"
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//               </div>
//               <div className="grid gap-2">
//                 <div className="flex items-center">
//                   <Label htmlFor="repeat-password">Repeat Password</Label>
//                 </div>
//                 <Input
//                   id="repeat-password"
//                   type="password"
//                   required
//                   value={repeatPassword}
//                   onChange={(e) => setRepeatPassword(e.target.value)}
//                 />
//               </div>
//               {error && <p className="text-sm text-red-500">{error}</p>}
//               <Button type="submit" className="w-full" disabled={isLoading}>
//                 {isLoading ? "Creating an account..." : "Sign up"}
//               </Button>
//             </div>
//             <div className="mt-4 text-center text-sm">
//               Already have an account?{" "}
//               <Link href="/auth/login" className="underline underline-offset-4">
//                 Login
//               </Link>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
