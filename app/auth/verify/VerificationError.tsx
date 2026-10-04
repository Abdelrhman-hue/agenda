import Link from "next/link";
import { XCircle, ArrowRight } from "lucide-react";

interface VerificationErrorProps {
  message: string;
}

export default function VerificationError({
  message,
}: VerificationErrorProps) {
  return (
    <div
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 py-10"
    >
      <div className="w-full max-w-120">
        <div className="overflow-hidden rounded-[24px] border border-[#E2E8F0] bg-white px-6 py-10 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:px-10">
          <div className="flex flex-col items-center text-center">
            {/* Logo */}
            <Link
              href="/"
              className="mb-10 text-[28px] font-extrabold tracking-[-1px] text-[#172554]"
            >
              Agendah
            </Link>

            {/* Error Icon */}
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#FEF2F2]">
              <XCircle
                className="h-11 w-11 text-[#EF4444]"
                strokeWidth={1.8}
              />
            </div>

            {/* Title */}
            <h1 className="text-[26px] font-bold leading-[1.4] tracking-[-0.5px] text-[#0F172A]">
              تعذر تأكيد حسابك
            </h1>

            {/* Message */}
            <p className="mt-3 max-w-90 text-[15px] leading-[1.9] text-[#64748B]">
              {message}
            </p>

            {/* Register Button */}
            <Link
              href="/auth/sign_up"
              className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-[12px] border border-[#E2E8F0] bg-white text-[15px] font-semibold text-[#334155] transition-colors hover:bg-[#F8FAFC]"
            >
              العودة إلى التسجيل
              <ArrowRight className="h-4 w-4" />
            </Link>

            {/* Footer */}
            <p className="mt-7 text-[12px] text-[#94A3B8]">
              © {new Date().getFullYear()} Agendah. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

