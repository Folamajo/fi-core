"use client"
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export default function ProtectedLayout({children}: {children: React.ReactNode}){
   const [checkSession, setCheckSession] = useState<string>("")
   const router = useRouter()
   const { session } = useAuth()

   useEffect(()=> {
      setCheckSession("loading")

      if (session === null ){
      // redirect
         setCheckSession("no session")
         // router.push('/auth/login') 
      }
      else{
         setCheckSession("confirmed")
      }
   }, [session])

   if(checkSession === "no session"){
      // router.push('/auth/login') //uncomment here 
   }
   

   

   return (
      <div className="flex"> 
         <div className="border w-[20em] h-screen">
            <div className="flex justify-between p-4  border-b">
               <p>LOGO</p> 
               <button>|-</button>
            </div>               

            <section className="p-4">
               <h1 className="mb-4">GENERAL</h1>
               <ul className="flex flex-col gap-2">
                  <li>Dashboard</li>
                  <li>Projects</li>
                  <li>Settings</li>
               </ul>

            </section>


         </div>
         <div className="border w-full">
            <nav className="border p-4">
               navigation or search 
            </nav>
            <div>
               {children}
            </div>
            {/* Add new component tomorrow  */}
         </div>
         
         
         
      </div>
   )
}

















// import { DeployButton } from "@/components/deploy-button";
// import { EnvVarWarning } from "@/components/env-var-warning";
// import { AuthButton } from "@/components/auth-button";
// import { ThemeSwitcher } from "@/components/theme-switcher";
// import { hasEnvVars } from "@/lib/utils";
// import Link from "next/link";

// export default function ProtectedLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <main className="min-h-screen flex flex-col items-center">
//       <div className="flex-1 w-full flex flex-col gap-20 items-center">
//         <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
//           <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
//             <div className="flex gap-5 items-center font-semibold">
//               <Link href={"/"}>Next.js Supabase Starter</Link>
//               <div className="flex items-center gap-2">
//                 <DeployButton />
//               </div>
//             </div>
//             {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
//           </div>
//         </nav>
//         <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
//           {children}
//         </div>

//         <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
//           <p>
//             Powered by{" "}
//             <a
//               href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
//               target="_blank"
//               className="font-bold hover:underline"
//               rel="noreferrer"
//             >
//               Supabase
//             </a>
//           </p>
//           <ThemeSwitcher />
//         </footer>
//       </div>
//     </main>
//   );
// }
