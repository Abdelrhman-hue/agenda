"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { ReactNode, useState } from "react";

interface LoginInputProps {
   label: string;
   placeholder?: string;
   type?: string;
   name?: string;
   icon?: ReactNode;
}

export default function LoginInput({
   label,
   placeholder,
   type = "text",
   name,
   icon,
}: LoginInputProps) {
   const [isShowPassword, setIsShowPassword] = useState(false);
   return (
      <div className="w-full space-y-3" dir="rtl">
         <Label
            htmlFor={name}
            className="text-title-md text-[#141d1b]"
         >
            {label}
         </Label>

         <div className="relative">
            <Input
               id={name}
               name={name}
               type={type}
               placeholder={placeholder}
               className="
            py-6
            w-full
            border-border-subtle
            bg-surface
            px-12
            text-right
            text-body-md
            shadow-level2
            placeholder:text-body-md
            focus-visible:ring-0
            focus-visible:ring-offset-0
            focus:ring-0
            
          "
            />

            {icon && (
               <div
                  className="
              pointer-events-none
              absolute
              top-1/2
              right-2
              flex
              size-10
              -translate-y-1/2
              items-center
              justify-center
              text-[#727A78]
            "
               >
                  {icon}
               </div>
            )}
            {type === "password" && (
               <Button
                  variant="ghost"
                  className="
                  cursor-pointer!
                  z-20
              absolute
              top-1/2
              left-2
              flex
              size-10
              -translate-y-1/2
              items-center
              justify-center
              text-[#727A78]
            "
            onClick={() => setIsShowPassword(!isShowPassword)}
               >
                  {isShowPassword ? <Eye className="size-6" /> : <EyeOff className="size-6" />}
               </Button>
            )}
         </div>
      </div>
   );
}