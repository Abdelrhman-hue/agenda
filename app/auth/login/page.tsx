import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import LoginForm from "./LoginForm";
import LoginBenifits from "./LoginBenifits";
import GoogleProvider from "../GoogleProvider";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string }>;
}) {
  const params = await searchParams;
  const isRegistered = params.registered === "true";

  return (
    <main className="min-h-screen w-full bg-canvas py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center" dir="rtl">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* LOGIN FORM (6 columns) */}
        <div className="lg:col-span-6 w-full bg-surface p-6 sm:p-8 rounded-[16px] border border-border-subtle shadow-level1 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            {/* Top Navigation & Portal Badge */}
            <div className="flex items-center justify-between">
              <Link
                className="flex items-center gap-2 text-neutral-muted hover:text-neutral-primary text-body-md font-semibold transition-colors"
                href="/"
              >
                <ArrowRight className="size-4.5" />
                العودة للرئيسية
              </Link>

              <Badge className="bg-primary-light border-0 px-3 py-1 text-label-md text-primary-dark font-medium flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-primary-dark" />
                <span>بوابة الشركاء والعملاء</span>
              </Badge>
            </div>

            {/* Registration Success Banner */}
            {isRegistered && (
              <div className="p-3.5 rounded-[10px] bg-[#DDF4EE] border border-[#16855B]/30 flex items-center gap-2.5 text-body-md text-[#16855B]">
                <CheckCircle2 className="size-5 shrink-0" />
                <span>تم إنشاء حسابك بنجاح! يمكنك الآن تسجيل الدخول إلى حسابك.</span>
              </div>
            )}

            {/* Heading */}
            <div>
              <h1 className="text-headline-lg font-bold text-neutral-primary mb-1">
                أهلاً بك في أجندة
              </h1>
              <p className="text-body-md text-neutral-muted">
                سجل دخولك لإدارة مواعيدك، حجوزاتك، وتدفقاتك النقدية باحترافية.
              </p>
            </div>

            {/* Login Form */}
            <LoginForm />

            {/* Separator */}
            <div className="my-4 flex items-center gap-3">
              <Separator className="flex-1 bg-border-subtle" />
              <span className="text-body-sm text-neutral-muted">أو</span>
              <Separator className="flex-1 bg-border-subtle" />
            </div>

            {/* Google Provider */}
            <GoogleProvider />
          </div>

          {/* Footer Signup Link */}
          <p className="text-center text-body-sm text-neutral-muted pt-4 border-t border-border-subtle">
            ليس لديك حساب بعد على أجندة؟{" "}
            <Link href="/auth/sign_up" className="font-semibold text-primary hover:underline">
              أنشئ حسابك مجانًا الآن
            </Link>
          </p>
        </div>

        {/* LEFT SIDE BENEFITS PREVIEW (6 columns) */}
        <div className="hidden lg:block lg:col-span-6 w-full">
          <LoginBenifits />
        </div>
      </div>
    </main>
  );
}
