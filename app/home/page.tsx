import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, CalendarDays, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen w-full bg-canvas py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center" dir="rtl">
      <div className="w-full max-w-2xl bg-surface p-8 rounded-[16px] border border-border-subtle shadow-level2 text-center space-y-6">
        <div className="inline-flex size-16 items-center justify-center rounded-full bg-primary-light text-primary-dark">
          <CheckCircle2 className="size-8 text-primary" />
        </div>

        <div>
          <Badge className="bg-primary-light border-0 text-primary-dark text-label-md px-3 py-1 mb-2">
            مرحبًا بك في منصة أجندة
          </Badge>
          <h1 className="text-headline-lg font-bold text-neutral-primary">
            تم تسجيل الدخول بنجاح!
          </h1>
          <p className="mt-2 text-body-md text-neutral-muted">
            حسابك جاهز الآن لإدارة المواعيد وتحصيل العربون التلقائي فورًا.
          </p>
        </div>

        <Card className="rounded-[10px] bg-[#EAF6F3] border border-primary-light p-4 text-right">
          <CardContent className="p-0 flex items-center gap-3">
            <ShieldCheck className="size-6 text-primary shrink-0" />
            <div className="text-body-sm text-neutral-primary">
              <strong className="text-primary-dark font-semibold">حماية كاملة للبيانات:</strong> كلمة المرور محفوظة بأعلى درجات التشفير لحماية خصوصية نشاطك التجاري وعملائك.
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button asChild className="w-full sm:w-auto h-11 px-6 rounded-[10px] bg-primary text-surface hover:bg-primary-dark cursor-pointer font-semibold shadow-level1">
            <Link href="/auth/sign_up" className="flex items-center justify-center gap-2">
              <span>الانتقال لصفحة التسجيل</span>
              <ArrowLeft className="size-4" />
            </Link>
          </Button>

          <Button asChild variant="outline" className="w-full sm:w-auto h-11 px-6 rounded-[10px] border border-border-subtle hover:bg-[#F4F8F6] text-neutral-primary font-semibold">
            <Link href="/auth/login">
              صفحة الدخول
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
