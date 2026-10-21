import {
  BadgeDollarSign,
  CreditCard,
  LockKeyhole,
  MessageSquareText,
  Star,
  TrendingUp,
  Users,
  CheckCircle2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import BenefitCard from "./BenefitCard";

export default function Benefits() {
  return (
    <aside
      dir="rtl"
      className="
        rounded-[16px]
        bg-[#EAF6F3]
        border
        border-border-subtle
        p-6
        space-y-5
        shadow-level1
      "
    >
      <div>
        <Badge
          className="
            rounded-full
            border-0
            bg-surface
            text-label-md
            font-medium
            text-primary-dark
            px-3
            py-1
            shadow-level1
          "
        >
          ● مصمم لبيئة الأعمال المصرية
        </Badge>

        <h2 className="mt-3.5 text-headline-md font-bold leading-tight text-neutral-primary">
          لماذا يفضل أصحاب الخدمات في مصر منصة أجندة؟
        </h2>

        <p className="mt-2 text-body-md leading-relaxed text-neutral-muted">
          حلول تقنية تلغي معضلة عدم الحضور، وتدير مواعيدك وتحصيل العربون باحترافية تامة.
        </p>
      </div>

      <div className="space-y-3.5">
        {/* Benefit 1 */}
        <BenefitCard
          title="عربون مسبق فوري"
          description="تحصيل العربون آليًا لتأكيد الحجز فور وصول الإشعار دون تدخل يدوي."
          icon={BadgeDollarSign}
          bgIcon="bg-[#FEF6E7]"
          iconColor="text-accent-gold"
          badgeText="انستا باي وفودافون كاش"
          badgeBg="bg-[#FEF6E7]"
          badgeTextColor="text-accent-gold"
        />

        {/* Benefit 2 */}
        <BenefitCard
          title="مساعد واتساب ذكي بالعامية"
          description="إرسال التنبيهات وتأكيد الحجز وموقع العيادة أو المركز لعميلك على الواتساب آليًا."
          icon={MessageSquareText}
          bgIcon="bg-primary-light"
          iconColor="text-primary-dark"
          badgeText="تأكيد تلقائي"
          badgeBg="bg-primary-light"
          badgeTextColor="text-primary-dark"
        />

        {/* Benefit 3 */}
        <BenefitCard
          title="تقليل الإلغاء المفاجئ"
          description="الالتزام بدفع العربون المسبق يضمن حضور العميل في موعده ويحفظ وقت فريقك."
          icon={TrendingUp}
          bgIcon="bg-primary-light"
          iconColor="text-primary"
          badgeText="نسبة حسم +80%"
          badgeBg="bg-primary-light"
          badgeTextColor="text-primary-dark"
        />

        {/* Stats Card */}
        <Card className="rounded-[16px] border border-border-subtle bg-surface shadow-level1">
          <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-[10px] bg-primary-light text-primary-dark">
                <Users className="size-5" />
              </div>

              <div>
                <p className="text-body-md font-bold text-neutral-primary tabular-numbers">
                  +1,500 نشاط ومهني نشط
                </p>
                <p className="text-body-sm text-neutral-muted">
                  في القاهرة، الإسكندرية والدلتا
                </p>
              </div>
            </div>

            <div className="flex items-center gap-0.5 text-[#E7B84B]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="size-4 fill-current" />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security & Guarantees */}
        <div className="pt-2 grid grid-cols-3 gap-2 text-center">
          <div className="flex flex-col items-center gap-1 p-2 rounded-[10px] bg-surface/60 border border-border-subtle">
            <LockKeyhole size={18} className="text-primary" />
            <span className="text-body-sm text-neutral-muted">تشفير تام</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2 rounded-[10px] bg-surface/60 border border-border-subtle">
            <MessageSquareText size={18} className="text-primary" />
            <span className="text-body-sm text-neutral-muted">دعم ٢٤/٧</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2 rounded-[10px] bg-surface/60 border border-border-subtle">
            <CreditCard size={18} className="text-[#D94B4B]" />
            <span className="text-body-sm text-neutral-muted">بدون فيزا</span>
          </div>
        </div>
      </div>
    </aside>
  );
}