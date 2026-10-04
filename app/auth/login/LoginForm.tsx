"use client";

import { useState } from "react";
import Link from "next/link";
import LoginInput from "./LoginInput";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AtSign, Lock, Loader2, AlertCircle, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) {
      newErrors.email = "يرجى إدخال البريد الإلكتروني.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "صيغة البريد الإلكتروني غير صحيحة.";
    }

    if (!password) {
      newErrors.password = "يرجى إدخال كلمة المرور.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setServerSuccess(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      })

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.message || "خطأ في البريد الإلكتروني أو كلمة المرور.");
      } else {
        setServerSuccess("تم تسجيل الدخول بنجاح! جاري التوجيه إلى لوحة التحكم...");
        setTimeout(() => {
          router.push("/home");
        }, 2000);
      }



    } catch (err) {
      console.log(err)
      setServerError("تعذر الاتصال بالخادم. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4" dir="rtl">
      {serverError && (
        <div className="p-3.5 rounded-[10px] bg-[#FFDAD6] border border-[#D94B4B]/30 flex items-start gap-2.5 text-body-md text-[#D94B4B]">
          <AlertCircle className="size-5 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      {serverSuccess && (
        <div className="p-3.5 rounded-[10px] bg-[#DDF4EE] border border-[#16855B]/30 flex items-start gap-2.5 text-body-md text-[#16855B]">
          <Check className="size-5 shrink-0 mt-0.5" />
          <span>{serverSuccess}</span>
        </div>
      )}

      <LoginInput
        label="البريد الإلكتروني"
        placeholder="name@company.com"
        name="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        icon={<AtSign className="size-4.5 text-neutral-muted" />}
      />

      <LoginInput
        label="كلمة المرور"
        placeholder="••••••••"
        name="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        icon={<Lock className="size-4.5 text-neutral-muted" />}
      />

      <div className="w-full flex items-center justify-between text-body-sm pt-1">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <Checkbox
            checked={rememberMe}
            onCheckedChange={(val) => setRememberMe(!!val)}
            className="size-4 rounded-xs border-border-subtle data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <span className="text-body-sm font-medium text-neutral-primary">تذكرني على هذا الجهاز</span>
        </label>

        <Link
          href="/auth/forgot-password"
          className="text-body-sm font-semibold text-primary hover:underline"
        >
          نسيت كلمة المرور؟
        </Link>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="
          w-full h-11 rounded-[10px] bg-primary text-surface text-label-lg font-semibold
          hover:bg-primary-dark transition-all duration-200 cursor-pointer shadow-level2
          disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2
        "
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            <span>جاري التحقق والتشفير...</span>
          </>
        ) : (
          <>
            <span>تسجيل الدخول</span>
            <ArrowLeft className="size-5" />
          </>
        )}
      </Button>
    </form>
  );
}