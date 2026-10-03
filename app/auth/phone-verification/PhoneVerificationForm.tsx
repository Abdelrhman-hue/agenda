import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  ArrowLeft,
  Clock3,
  MessageCircle,
  MessageSquareText,
  RefreshCw,
} from "lucide-react";

const PhoneVerificationForm = () => {
  return (
    <form action="" className="w-full">
      {/* OTP */}
      <InputOTP
        maxLength={4}
        dir="ltr"
        className="mb-2 w-full"
      >
        <InputOTPGroup
          dir="ltr"
          className="flex w-full items-center justify-center gap-2 sm:gap-3"
        >
          <InputOTPSlot
            index={0}
            className="
              size-12
              bg-primary-light
              text-lg
              !rounded-card
              border-border-subtle
              shadow-level2
              sm:size-14
            "
          />

          <InputOTPSlot
            index={1}
            className="
              size-12
              bg-primary-light
              text-lg
              !rounded-card
              border-border-subtle
              shadow-level2
              sm:size-14
            "
          />

          <InputOTPSlot
            index={2}
            className="
              size-12
              bg-primary-light
              text-lg
              !rounded-card
              border-border-subtle
              shadow-level2
              sm:size-14
            "
          />

          <InputOTPSlot
            index={3}
            className="
              size-12
              bg-primary-light
              text-lg
              !rounded-card
              border-border-subtle
              shadow-level2
              sm:size-14
            "
          />
        </InputOTPGroup>
      </InputOTP>

      {/* Verification methods */}
      <div className="mx-auto mt-5 mb-2 w-full max-w-md">
        <div
          dir="rtl"
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-primary-light
            px-3
            py-2
            shadow-level1
            sm:gap-4
          "
        >
          {/* WhatsApp */}
          <div className="flex shrink-0 items-center gap-1">
            <MessageCircle
              size={16}
              className="text-primary-dark sm:size-[17px]"
              strokeWidth={2}
            />

            <p className="text-primary-dark text-label-md">
              واتساب
            </p>
          </div>

          <span className="size-1 shrink-0 rounded-full bg-neutral-muted" />

          {/* SMS */}
          <div className="flex shrink-0 items-center gap-1">
            <MessageSquareText
              size={16}
              className="text-text-muted sm:size-[17px]"
              strokeWidth={2}
            />

            <p className="text-text-muted text-label-md">
              إرسال SMS
            </p>
          </div>

          <span className="size-1 shrink-0 rounded-full bg-neutral-muted" />

          {/* Auto sync */}
          <div className="flex shrink-0 items-center gap-1">
            <RefreshCw
              size={16}
              className="text-primary-dark sm:size-[17px]"
              strokeWidth={2}
            />

            <p className="text-primary-dark text-label-md">
              تزامن آلي
            </p>
          </div>
        </div>
      </div>

      {/* Countdown + resend */}
      <div className="mt-2 flex flex-col items-center gap-2 text-label-sm">
        {/* Countdown */}
        <div className="flex items-center gap-1 text-center text-neutral-muted">
          <Clock3
            size={13}
            className="shrink-0 text-neutral-muted"
            strokeWidth={1.8}
          />

          <span>إعادة إرسال الرمز خلال</span>

          <span
            dir="ltr"
            className="font-medium text-neutral-dark"
          >
            00:43
          </span>

          <span>ثانية</span>
        </div>

        {/* Resend options */}
        <div
          dir="rtl"
          className="
            flex
            flex-wrap
            items-center
            justify-center
            gap-x-3
            gap-y-1
            text-center
          "
        >
          {/* WhatsApp */}
          <button
            type="button"
            className="
              flex
              items-center
              gap-1
              text-primary-dark
              cursor-pointer
            "
          >
            <MessageCircle
              size={14}
              strokeWidth={1.8}
            />

            <span>إعادة الإرسال عبر واتساب</span>
          </button>

          <span className="hidden h-4 w-px bg-border-subtle sm:block" />

          {/* SMS */}
          <button
            type="button"
            className="
              flex
              items-center
              gap-1
              text-neutral-muted
              cursor-pointer
            "
          >
            <MessageSquareText
              size={14}
              strokeWidth={1.8}
            />

            <span>إرسال عبر SMS</span>
          </button>
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="
          mx-auto
          mt-4
          flex
          w-full
          cursor-pointer
          items-center
          justify-center
          gap-2
          rounded-card
          bg-primary-dark
          py-6
          text-body-md
          text-surface
          shadow-level2
          hover:bg-primary-light
          hover:text-primary-dark
        "
      >
        <span>تأكيد ومتابعة</span>
        <ArrowLeft size={14} />
      </Button>
    </form>
  );
};

export default PhoneVerificationForm;