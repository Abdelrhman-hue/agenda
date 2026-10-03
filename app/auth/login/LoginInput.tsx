"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { ReactNode, useState } from "react";

interface LoginInputProps {
  label: string;
  placeholder?: string;
  type?: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: ReactNode;
  error?: string;
  required?: boolean;
}

export default function LoginInput({
  label,
  placeholder,
  type = "text",
  name,
  value,
  onChange,
  icon,
  error,
  required,
}: LoginInputProps) {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const inputType = type === "password" ? (isShowPassword ? "text" : "password") : type;

  return (
    <div className="w-full space-y-1.5 text-right" dir="rtl">
      <Label htmlFor={name} className="text-body-md font-semibold text-neutral-primary flex items-center gap-1">
        {label}
        {required && <span className="text-[#D94B4B]">*</span>}
      </Label>

      <div className="relative">
        <Input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            h-11
            w-full
            rounded-[10px]
            bg-[#F4F8F6]
            px-10
            text-right
            text-body-md
            text-neutral-primary
            border
            ${error ? "border-[#D94B4B] focus-visible:ring-[#D94B4B]" : "border-border-subtle focus-visible:border-primary"}
            shadow-none
            placeholder:text-neutral-muted
            focus-visible:ring-1
            focus-visible:ring-primary
            transition-all
          `}
        />

        {icon && (
          <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 flex items-center justify-center text-neutral-muted">
            {icon}
          </div>
        )}

        {type === "password" && (
          <button
            type="button"
            onClick={() => setIsShowPassword((prev) => !prev)}
            className="absolute top-1/2 left-3 -translate-y-1/2 flex items-center justify-center text-neutral-muted hover:text-neutral-primary cursor-pointer p-1 transition-colors"
          >
            {isShowPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </div>

      {error && (
        <p className="text-body-sm text-[#D94B4B] font-medium">{error}</p>
      )}
    </div>
  );
}