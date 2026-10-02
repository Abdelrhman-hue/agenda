import {
   BadgeDollarSign,
   CreditCardX,
   LockKeyhole,
   MessageSquareText,
   Star,
   TrendingUp,
   Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
   Card,
   CardContent,
   CardFooter,
} from "@/components/ui/card";
import BenefitCard from "./BenefitCard";

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


            <BenefitCard
               title="عربون مسبق فوري"
               description="تحصيل العربون آليًا لتأكيد الحجز فور وصول الإشعار دون تدخل يدوي."
               icon={BadgeDollarSign}
               bgIcon="bg-[#ffdf9e]"
               iconColor="bg-[#413313]"
               badgeText="انستا باي وفودافون"
               badgeBg="bg-[#bde3ff]"
               badgeTextColor="text-[#398779]"
            />

            {/* Benefit 2 */}
            <BenefitCard
               title="مساعد واتساب ذكي بالعامية"
               description="ارسال التنبيهات وتأكيد الحجز وموقع العيادة او المركز لعميلك على الواتساب بشكل آلي وذكي."
               icon={MessageSquareText}
               bgIcon="bg-[#94F4DA]"
               iconColor="bg-[#002019]"
               badgeText="تأكيد تلقائي"
               badgeBg="bg-[#c9efe5]"
               badgeTextColor="text-[#71aa9e]"
            />

            {/* Benefit 3 */}
            <BenefitCard
               title="تقليل الالغاء المفاجئ"
               description="الالتزام بدفع العربون المسبق يضمن حضور العميل في موعده ويحفظ وقت فريقك."
               icon={TrendingUp}
               bgIcon="bg-[#DFF4EE]"
               iconColor="bg-[#087F6A]"
               badgeText="نسبة +80%"
               badgeBg="bg-[#DFF4EE]"
               badgeTextColor="text-[#087F6A]"
            />

            {/* Stats */}
            <Card className="rounded-[16px] border-0 shadow-[0_1px_3px_rgba(23,32,30,0.04)]">
               <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex flex-1 items-center gap-3">
                     <div className="flex -space-x-2 space-x-reverse">

                        <div className="flex size-13 shrink-0 items-center justify-center rounded-[10px] bg-[#EEF3F1] text-[#087F6A]">
                           <Users className="size-6 text-[#087F6A]" />
                        </div>
                     </div>


                     <div>
                        <p className="text-[16px] font-semibold leading-6 text-[#17201E]">
                           +1,500 نشاط ومهني نشط
                        </p>

                        <p className="text-[12px] leading-5 text-[#6B7272]">
                           في القاهرة، الإسكندرية والدلتا
                        </p>
                     </div>
                  </div>

                  <div className="flex items-center gap-1" >
                     <Star className="text-[#F59E0B] overflow-hidden" fill="currentColor" />
                     <Star className="text-[#F59E0B] overflow-hidden" fill="currentColor" />
                     <Star className="text-[#F59E0B] overflow-hidden" fill="currentColor" />
                     <Star className="text-[#F59E0B] overflow-hidden" fill="currentColor" />
                     <Star className="text-[#F59E0B] overflow-hidden" fill="currentColor" />
                  </div>

               </CardContent>

            </Card>



            <div className="w-full mt-4 justify-around items-center flex gap-3">
               <div className="flex items-center gap-1">
                  <LockKeyhole size={20} className="text-[#087F6A]" />
                  <p className="text-[12px] leading-5 text-[#6B7272]">تشفير تام للبيانات  </p>
               </div>
               <div className="flex items-center gap-1">
                  <MessageSquareText size={20} className="text-[#087F6A]" />
                  <p className="text-[12px] leading-5 text-[#6B7272]">دعم فنى ٢٤/٧ </p>
               </div>
               <div className="flex items-center gap-1">
                  <CreditCardX size={20} className="text-[#c04600]" />
                  <p className="text-[12px] leading-5 text-[#6B7272]">بدون بطاقة ائتمان</p>
               </div>
            </div>
         </div>
      </aside>
   );
}