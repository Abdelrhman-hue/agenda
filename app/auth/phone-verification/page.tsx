import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  MessageSquareText,
  Pencil,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import PhoneVerificationForm from "./PhoneVerificationForm";
import { Separator } from "@/components/ui/separator";

const PhoneVerification = () => {
  const phone = "01142994026";
  const maskedPhone = phone.slice(0, 3) + "****" + phone.slice(7);

  return (
    <section
      dir="rtl"
      className="flex min-h-screen w-full items-center justify-center bg-[#D4E7E2] px-3 py-6 sm:px-6 sm:py-8 lg:px-8"
    >
      <Card
        className="
          relative
          flex
          w-full
          max-w-xl
          flex-col
          items-center
          overflow-hidden
          rounded-card
          border-border-subtle
          px-4
          py-6
          shadow-card
          sm:px-6
          sm:py-8
          lg:px-8
          after:absolute
          after:inset-x-0
          after:top-0
          after:h-2
          after:content-['']
          after:bg-[linear-gradient(90deg,#006554_0%,#4A9568_50%,#F5CB5E_100%)]
        "
      >
        <div className="flex w-full flex-col items-center gap-y-3">
          {/* Icon */}
          <div className="relative mb-2 flex size-12 items-center justify-center rounded-full bg-primary-light sm:size-14">
            <div className="flex size-9 items-center justify-center rounded-full bg-[#D4E7E2] sm:size-11">
              <ShieldCheck
                className="size-7 text-surface sm:size-9"
                fill="darkGreen"
                strokeWidth={2}
              />
            </div>

            <div className="absolute -bottom-1 -left-1 flex size-6 items-center justify-center rounded-full bg-surface shadow-level2 sm:-bottom-1 sm:-left-2 sm:size-7">
              <MessageSquareText
                size={14}
                className="text-primary-dark sm:size-4"
                strokeWidth={2}
              />
            </div>
          </div>

          {/* Logo */}
          <div className="mb-1 flex items-center gap-1">
            <h3 className="text-primary-dark text-headline-lg">
              أجندة
            </h3>

            <span className="size-1 rounded-full bg-accent-gold" />

            <h6 className="text-neutral-muted text-label-md">
              Agendah
            </h6>
          </div>

          {/* Phone information */}
          <div className="mb-2 flex w-full flex-col items-center gap-y-2">
            <h3 className="text-center">
              تأكيد رقم الهاتف
            </h3>

            <p className="text-center text-[10px] text-text-muted sm:text-label-sm">
              تم ارسال رمز مكون من 4 ارقام الى الرقم
            </p>

            <div
              dir="ltr"
              className="
                flex
                gap-4
                max-w-sm
                items-center
                justify-between
        
                rounded-full
                bg-primary-light
                px-3
                py-1.5
                shadow-level1
              "
            >
              <Link
                href="#"
                className="flex shrink-0 items-center gap-1 text-label-md text-primary-dark hover:underline"
              >
                <Pencil
                  size={10}
                  strokeWidth={2}
                />

                <span>(تعديل الرقم)</span>
              </Link>

              <p
                dir="ltr"
                className="whitespace-nowrap text-label-md text-primary"
              >
                +2{maskedPhone}
              </p>

              <Smartphone
                size={14}
                className="shrink-0 text-primary-dark"
                strokeWidth={2}
              />
            </div>
          </div>

          {/* OTP */}
          <div className="w-full">
            <PhoneVerificationForm />
          </div>

          {/* Separator */}
          <Separator className="mb-2  w-full max-w-md bg-gray-200" />

          {/* Back to login */}
          <Link
            href="/"
            className="
              flex
              w-full
              items-center
              gap-2
              px-1
              text-body-md
              text-primary-dark
              hover:underline
              sm:w-auto
              sm:self-start
            "
          >
            <ArrowRight size={18} />
            <span>العودة لتسجيل الدخول</span>
          </Link>
        </div>
      </Card>
    </section>
  );
};

export default PhoneVerification;