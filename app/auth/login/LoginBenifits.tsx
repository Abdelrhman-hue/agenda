import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Banknote, CalendarDays, Check, MessageCircle } from "lucide-react";


const LoginBenifits = () => {
   return (
      <div className="w-full hidden lg:flex flex-col space-y-3 p-8 h-full col-span-6 shadow-level2 border-border-subtle rounded-xl relative overflow-hiddenafter:absolute after:inset-0 after:pointer-events-none after:bg-[linear-gradient(135deg,transparent_35%,rgba(241,240,221,0.9)_100%)] bg-[#F2FCF8]">


         {/* HEADER OF SECTION LEFT SIDE */}
         <div className="w-full flex items-center justify-between">
            <Badge className="p-2 flex items-center gap-2 bg-surface">
               <span className="w-2 h-2 rounded-full bg-primary-dark" />
               <p className="text-primary-dark text-label-md">اشراف الحجز الألى الفوري</p>
            </Badge>

            <Badge className="p-2 flex items-center gap-2 bg-canvas">
               <p className="text-primary-dark text-label-md">مصر والعالم العربى</p>
            </Badge>
         </div>

         <Card className="w-full p-4 rounded-xl mt-8 px-4">
            {/* HEADER OF CARD */}
            <div className="flex items-center justify-between">
               <h3 className="flex items-center gap-x-2 text-label-lg text-primary-dark"><CalendarDays className="text-primary-dark font-semibold" /> مواعيد اليوم</h3>
               <Badge className="p-2 flex items-center gap-2 bg-primary-light">
                  <p className="text-primary-dark text-label-md">٤ مواعيد اليوم</p>
               </Badge>
            </div>

            {/* CONTENT OF CARD */}
            <div className="flex rounded-card flex-row items-center bg-[#ecf6f2] justify-between p-4">
               <div className="flex">
                  <div className="w-12 h-12 rounded-full bg-[#cae4de] flex items-center justify-center text-label-lg">م.ا</div>
                  <div className="mr-2">
                     <p className="text-label-lg text-[#3d4643]">م. احمد الشناوي</p>
                     <p className="text-label-md text-[#535e5a]">استشارة تصميم معماري (60 دقيقة)</p>
                  </div>
               </div>
               <div><p className="text-label-lg text-primary-dark">04:30 م</p></div>
            </div>

            <div className="flex rounded-card flex-row items-center bg-[#fff5e2] justify-between p-4">
               <div className="flex space-x-2">
                  <Banknote size={22} strokeWidth={2} />
                  <p className="text-label-md text[#b49d63]">تم تأكيد دفع العربون: 300 ج.م</p>
               </div>
               <div><Badge className="text-label-md text-primary-dark bg-surface">فودافون كاش</Badge></div>
            </div>


         </Card>

         <Card className="p-4 relative after:absolute after:w-2 after:right-0 after:top-0 after:bottom-0 after:h-full after:bg-primary-dark">

            <div className="flex justify-between items-center">
               <div className="flex items-center space-x-2">
                  <div className="text-label-lg text-surface flex items-center justify-center rounded-full bg-primary-dark size-10"><MessageCircle className="size-5" /></div>
                  <p className="text-label-lg text-primary-dark">مساعد اجندة الذكي ل WhatsApp</p>
               </div>
               <p className="text-label-md text-neutral-muted">منذ دقيقتين</p>
            </div>

            <div className="space-x-1 p-6 bg-[#cae4de] flex rounded-xl">
               <span className="flex items-center text-primary-dark text-label-md"><Check className="size-4 text-primary-dark" /> تأكيد تلقائي: </span>
               <p className="text-label-md text-[#5e6864]">تم تأكيد حجز د.احمد مع الاستاذ كريم بنجاح, وإرسال رابط الموقع الجغرافي وقسيمة السداد</p>
            </div>

         </Card>

         <Card className="p-4 flex items-center flex-row">
            <div className="flex items-center -space-x-2">
               <div className="size-9 rounded-full text-surface text-label-md flex items-center justify-center bg-[#016453]">أ.م</div>
               <div className="size-9 rounded-full text-surface text-label-md flex items-center justify-center bg-[#795900]">ع.س</div>
               <div className="size-9 rounded-full text-surface text-label-md flex items-center justify-center bg-[#006451]">ن.ش</div>
            </div>
            <p className="text-label-lg">انضم الى <span className="text-label-lg ml-1 text-primary-dark">1500+</span>مقدم خدمة محترف فى مصر</p>
         </Card>

         <div className="w-full flex items-center justify-around">
            <div className="flex items-center justify-center flex-col space-y-1">
               <h3 className="text-primary-dark text-title-lg">٠٪</h3>
               <h6 className="text-body-sm text-primary-dark">غياب بلا اشعار</h6>
            </div>
            <div className="flex items-center justify-center flex-col space-y-1">
               <h3 className="text-primary-dark text-title-lg">فوري</h3>
               <h6 className="text-body-sm text-primary-dark">إيداع انستا باي وكاش</h6>
            </div>
            <div className="flex items-center justify-center flex-col space-y-1">
               <h3 className="text-primary-dark text-title-lg">٢٤/٧</h3>
               <h6 className="text-body-sm text-primary-dark">حجز ألى عبر الواتساب</h6>
            </div>

         </div>



      </div>
   )
}

export default LoginBenifits