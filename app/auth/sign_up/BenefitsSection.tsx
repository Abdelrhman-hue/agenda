import {
  BadgeDollarSign,
  MessageSquareText,
  TrendingUp,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

export default function Benefits() {
  return (
    <aside
      dir="rtl"
      className="
        rounded-[16px]
        bg-[#E8F3F0]
        p-5
        sm:p-6
      "
    >
      <div className="mb-5">
        <Badge
          className="
            rounded-full
            border-0
            bg-white
            text-[12px]
            font-medium
            text-[#087F6A]
          "
        >
          ● مصمم لبيئة الأعمال المصرية
        </Badge>

        <h2 className="mt-4 text-[20px] font-semibold leading-[30px] text-[#17201E]">
          لماذا يفضل أصحاب الخدمات في مصر منصة أجندة؟
        </h2>

        <p className="mt-1 text-[14px] leading-6 text-[#6B7272]">
          حلول تقنية تلغي معضلة عدم الحضور، وتدير مواعيدك
          وتحصيل العربون باحترافية تامة.
        </p>
      </div>

      <div className="space-y-3">
        {/* Benefit 1 */}
        <Card className="rounded-[16px] border-0 shadow-[0_1px_3px_rgba(23,32,30,0.04)]">
          <CardContent className="flex gap-3 p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-[#FFF3D6] text-[#B84B7E]">
              <BadgeDollarSign className="size-5" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-[16px] font-medium leading-[26px]">
                  عربون مسبق فوري
                </h3>

                <Badge className="rounded-full border-0 bg-[#FFF5DD] text-[12px] text-[#B84B7E]">
                  إسباق وفلوس
                </Badge>
              </div>

              <p className="text-[12px] leading-5 text-[#6B7272]">
                تحصيل العربون آليًا لتأكيد الحجز فور وصول الإشعار دون تدخل يدوي.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Benefit 2 */}
        <Card className="rounded-[16px] border-0 shadow-[0_1px_3px_rgba(23,32,30,0.04)]">
          <CardContent className="flex gap-3 p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-[#DFF4EE] text-[#087F6A]">
              <MessageSquareText className="size-5" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-[16px] font-medium leading-[26px]">
                  مساعد واتساب ذكي بالعامية
                </h3>

                <Badge className="rounded-full border-0 bg-[#DFF4EE] text-[12px] text-[#087F6A]">
                  تأكيد تلقائي
                </Badge>
              </div>

              <p className="text-[12px] leading-5 text-[#6B7272]">
                إرسال التنبيهات وتأكيدات الحجز وموقع العيادة أو المركز لعملائك.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Benefit 3 */}
        <Card className="rounded-[16px] border-0 shadow-[0_1px_3px_rgba(23,32,30,0.04)]">
          <CardContent className="flex gap-3 p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-[#EEF3F1] text-[#087F6A]">
              <TrendingUp className="size-5" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-[16px] font-medium leading-[26px]">
                  تقليل الإلغاء المفاجئ
                </h3>

                <Badge className="rounded-full border-0 bg-[#DFF4EE] text-[12px] text-[#087F6A]">
                  نسبة +80%
                </Badge>
              </div>

              <p className="text-[12px] leading-5 text-[#6B7272]">
                الالتزام بدفع العربون المسبق يضمن حضور العميل في موعده ويحفظ وقت فريقك.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="rounded-[16px] border-0 shadow-[0_1px_3px_rgba(23,32,30,0.04)]">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex -space-x-2 space-x-reverse">
              <div className="flex size-9 items-center justify-center rounded-full border-2 border-white bg-[#D9E5E1]">
                <Users className="size-4 text-[#087F6A]" />
              </div>

              <div className="size-9 rounded-full border-2 border-white bg-[#C8D8D3]" />

              <div className="size-9 rounded-full border-2 border-white bg-[#B8CBC5]" />
            </div>

            <div>
              <p className="text-[16px] font-semibold leading-6 text-[#17201E]">
                +1,500 نشاط ومهني نشط
              </p>

              <p className="text-[12px] leading-5 text-[#6B7272]">
                في القاهرة، الإسكندرية والدلتا
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}