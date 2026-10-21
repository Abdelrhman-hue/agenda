import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Banknote, CalendarDays, Check, MessageCircle, ShieldCheck } from "lucide-react";

export default function LoginBenifits() {
  return (
    <div className="w-full hidden lg:flex flex-col space-y-5 p-8 h-full shadow-level2 border border-border-subtle rounded-[16px] relative overflow-hidden bg-[#EAF6F3]">
      {/* Header Badges */}
      <div className="w-full flex items-center justify-between">
        <Badge className="px-3 py-1.5 flex items-center gap-2 bg-surface border-0 shadow-level1">
          <span className="size-2 rounded-full bg-primary" />
          <span className="text-primary-dark text-label-md font-semibold">إشراف الحجز الآلي الفوري</span>
        </Badge>

        <Badge className="px-3 py-1.5 flex items-center gap-2 bg-canvas border-0 shadow-level1">
          <span className="text-primary-dark text-label-md font-medium">مصر والعالم العربي</span>
        </Badge>
      </div>

      {/* Booking Preview Card */}
      <Card className="w-full p-5 rounded-[16px] bg-surface border border-border-subtle shadow-level1 space-y-3.5 mt-4">
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-label-lg font-bold text-primary-dark">
            <CalendarDays className="size-5 text-primary" /> مواعيد اليوم
          </h3>
          <Badge className="px-2.5 py-1 bg-primary-light border-0">
            <span className="text-primary-dark text-label-md font-bold tabular-numbers">٤ مواعيد اليوم</span>
          </Badge>
        </div>

        {/* Customer Slot Item */}
        <div className="flex rounded-[10px] items-center bg-[#F4F8F6] justify-between p-3.5 border border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-primary-light flex items-center justify-center text-label-lg font-bold text-primary-dark">
              م.ش
            </div>
            <div>
              <p className="text-body-md font-bold text-neutral-primary">م. أحمد الشناوي</p>
              <p className="text-body-sm text-neutral-muted">استشارة تصميم معماري (60 دقيقة)</p>
            </div>
          </div>
          <span className="text-label-lg font-bold text-primary-dark tabular-numbers">04:30 م</span>
        </div>

        {/* Deposit Confirmed Banner */}
        <div className="flex rounded-[10px] items-center bg-[#FEF6E7] justify-between p-3.5 border border-[#E7B84B]/30">
          <div className="flex items-center gap-2.5 text-neutral-primary">
            <Banknote className="size-5 text-accent-gold shrink-0" />
            <p className="text-body-sm font-semibold text-neutral-primary">
              تم تأكيد دفع العربون: <span className="tabular-numbers font-bold text-primary-dark">300 ج.م</span>
            </p>
          </div>
          <Badge className="text-label-md font-semibold text-primary-dark bg-surface border-0 px-2.5 py-0.5 shadow-level1">
            فودافون كاش
          </Badge>
        </div>
      </Card>

      {/* WhatsApp Assistant Card */}
      <Card className="p-4 rounded-[16px] bg-surface border border-border-subtle shadow-level1 space-y-2.5 relative overflow-hidden">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-full bg-primary flex items-center justify-center text-surface shadow-level1">
              <MessageCircle className="size-5" />
            </div>
            <p className="text-label-lg font-bold text-primary-dark">مساعد أجندة الذكي لـ WhatsApp</p>
          </div>
          <span className="text-body-sm text-neutral-muted tabular-numbers">منذ دقيقتين</span>
        </div>

        <div className="p-3 bg-[#EAF6F3] rounded-[10px] flex items-start gap-2 border border-primary-light text-body-sm">
          <Check className="size-4.5 text-primary shrink-0 mt-0.5" />
          <p className="text-neutral-primary">
            <strong className="text-primary-dark font-bold">تأكيد تلقائي:</strong> تم تأكيد حجز د. أحمد مع الأستاذ كريم بنجاح، وإرسال الموقع الجغرافي وقسيمة السداد.
          </p>
        </div>
      </Card>

      {/* Social Proof */}
      <Card className="p-4 rounded-[16px] bg-surface border border-border-subtle shadow-level1 flex items-center gap-3">
        <div className="flex items-center -space-x-2 space-x-reverse">
          <div className="size-8 rounded-full text-surface text-body-sm font-bold flex items-center justify-center bg-[#056653] ring-2 ring-surface">
            أ.م
          </div>
          <div className="size-8 rounded-full text-surface text-body-sm font-bold flex items-center justify-center bg-accent-gold ring-2 ring-surface">
            ع.س
          </div>
          <div className="size-8 rounded-full text-surface text-body-sm font-bold flex items-center justify-center bg-primary ring-2 ring-surface">
            ن.ش
          </div>
        </div>
        <p className="text-body-md text-neutral-primary font-medium">
          انضم إلى <span className="font-bold text-primary-dark tabular-numbers">+1,500</span> مقدم خدمة محترف في مصر
        </p>
      </Card>

      {/* Metrics Footer */}
      <div className="w-full pt-2 grid grid-cols-3 gap-2 text-center">
        <div className="p-2.5 rounded-[10px] bg-surface/80 border border-border-subtle">
          <h3 className="text-title-lg font-bold text-primary-dark tabular-numbers">٠٪</h3>
          <p className="text-body-sm text-neutral-muted">غياب بلا إشعار</p>
        </div>
        <div className="p-2.5 rounded-[10px] bg-surface/80 border border-border-subtle">
          <h3 className="text-title-lg font-bold text-primary-dark">فوري</h3>
          <p className="text-body-sm text-neutral-muted">إيداع انستا باي وكاش</p>
        </div>
        <div className="p-2.5 rounded-[10px] bg-surface/80 border border-border-subtle">
          <h3 className="text-title-lg font-bold text-primary-dark tabular-numbers">٢٤/٧</h3>
          <p className="text-body-sm text-neutral-muted">حجز آلي عبر الواتساب</p>
        </div>
      </div>
    </div>
  );
}