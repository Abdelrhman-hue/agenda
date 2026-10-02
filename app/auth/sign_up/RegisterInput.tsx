import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LucideIcon } from "lucide-react";

interface RegisterInputProps {
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  icon?: LucideIcon;
  prefix?: string;
}

export function RegisterInput({
  label,
  placeholder,
  type = "text",
  required,
  icon: Icon,
  prefix,
}: RegisterInputProps) {
  return (
    <div className="space-y-1">
      <Label className="text-[14px] font-semibold leading-5.5 text-[#17201E]">
        {label}
        {required && (
          <span className="mr-1 text-red-500">*</span>
        )}
      </Label>

      <div className="relative">
        {Icon && (
          <Icon className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#6B7272]" />
        )}

        <Input
          type={type}
          placeholder={placeholder}
          className={`
            h-11
            rounded-[10px]
            bg-[#F4F8F6]
            text-[14px]
            shadow-none
            border-emerald-100
            placeholder:text-[#6B7272]
            focus-visible:border-emerald-200
            focus-visible:ring-0
            ${Icon ? "pr-10" : ""}
            ${prefix ? "pl-20" : ""}
          `}
        />

        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] font-medium text-[#6B7272]">
            {prefix}
          </span>
        )}
      </div>
    </div>
  );
}