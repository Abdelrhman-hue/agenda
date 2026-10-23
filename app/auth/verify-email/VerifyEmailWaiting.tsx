"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Clock3, Loader2, Mail, RefreshCw } from "lucide-react";

const RESEND_COOLDOWN_SECONDS = 60;

export default function VerifyEmailWaiting({ email, token }: { email: string; token: string }) {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_SECONDS);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const validRequest = email.length > 0 && token.length > 0;

  useEffect(() => {
    if (!validRequest) return;

    let active = true;
    let checking = false;
    const checkVerification = async () => {
      if (checking) return;
      checking = true;
      try {
        const response = await fetch("/api/auth/verification-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
          body: JSON.stringify({ email, token, action: "status" }),
        });
        const data = await response.json();
        if (active && response.ok && data.verified) {
          router.replace("/auth/login?verified=true");
        }
      } catch {
        // Keep polling; a temporary network error should not interrupt verification.
      } finally {
        checking = false;
      }
    };

    void checkVerification();
    const poll = window.setInterval(() => void checkVerification(), 3000);
    const countdown = window.setInterval(() => {
      setSecondsLeft((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => {
      active = false;
      window.clearInterval(poll);
      window.clearInterval(countdown);
    };
  }, [email, router, token, validRequest]);

  const resendEmail = async () => {
    setError(null);
    setNotice(null);
    setResending(true);
    try {
      const response = await fetch("/api/auth/verification-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ email, token, action: "resend" }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "تعذر إرسال رابط جديد.");
      if (data.verified) {
        router.replace("/auth/login?verified=true");
        return;
      }
      setNotice(data.message || "أرسلنا رابط تحقق جديدًا إلى بريدك الإلكتروني.");
      setSecondsLeft(RESEND_COOLDOWN_SECONDS);
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "تعذر إرسال رابط جديد.");
    } finally {
      setResending(false);
    }
  };

  return (
    <main dir="rtl" className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 py-10">
      <section className="w-full max-w-lg rounded-3xl border border-[#E2E8F0] bg-white px-6 py-10 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:px-10">
        <Link href="/" className="mb-9 inline-block text-[28px] font-extrabold tracking-[-1px] text-[#172554]">
          Agendah
        </Link>

        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-[#EAF6F3] text-primary">
          <Mail className="size-10" strokeWidth={1.8} />
        </div>

        <h1 className="text-2xl font-bold text-[#0F172A]">أكد بريدك الإلكتروني</h1>
        <p className="mt-3 leading-7 text-[#64748B]">
          أرسلنا رابط التأكيد إلى <span dir="ltr" className="font-semibold text-[#334155]">{email || "بريدك الإلكتروني"}</span>.
          افتح الرسالة واضغط على الرابط، وسنحدّث الحالة تلقائيًا.
        </p>

        <div className="mt-7 flex items-center justify-center gap-2 rounded-xl bg-[#F8FAFC] px-4 py-3 text-sm text-[#475569]">
          <Loader2 className="size-4 animate-spin text-primary" />
          <span>بانتظار تأكيد البريد...</span>
        </div>

        {notice && (
          <p role="status" className="mt-4 flex items-center justify-center gap-2 text-sm text-[#16855B]">
            <CheckCircle2 className="size-4 shrink-0" />{notice}
          </p>
        )}
        {error && (
          <p role="alert" className="mt-4 flex items-center justify-center gap-2 text-sm text-[#D94B4B]">
            <AlertCircle className="size-4 shrink-0" />{error}
          </p>
        )}

        <div className="mt-6 flex flex-col items-center gap-3">
          {secondsLeft > 0 ? (
            <p className="flex items-center gap-2 text-sm text-[#64748B]">
              <Clock3 className="size-4" /> يمكنك طلب رابط جديد بعد {secondsLeft} ثانية
            </p>
          ) : (
            <button
              type="button"
              onClick={resendEmail}
              disabled={!validRequest || resending}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {resending ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
              إعادة إرسال رابط التأكيد
            </button>
          )}

          <Link href="/auth/login" className="mt-2 text-sm font-semibold text-primary hover:underline">
            العودة لتسجيل الدخول
          </Link>
        </div>
      </section>
    </main>
  );
}
