"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Building2,
  Loader2,
  AlertCircle,
  FileText,
  ExternalLink,
  MessageSquare,
  Lock,
} from "lucide-react";
import { TimelineSlotGrid } from "@/components/booking/TimelineSlotGrid";
import { DepositBreakdownWidget } from "@/components/booking/DepositBreakdownWidget";
import { IAvailabilitySlot } from "@/utils/dto/booking";
import { SECTORS, MODE_LABELS, ServiceMode, Category } from "@/lib/constants";

interface ServiceItem {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
  depositAmount: number | null;
  mode: ServiceMode;
  meetingUrl: string | null;
  requiresAddress: boolean;
  isActive: boolean;
}

interface ProviderData {
  id: string;
  slug: string;
  category: Category;
  bio: string | null;
  address: string | null;
  locationUrl: string | null;
  whatsappNumber: string | null;
  depositType: "NONE" | "FIXED" | "FULL";
  depositAmount: number;
  bufferMinutes: number;
  timezone: string;
  user: {
    name: string | null;
    phone: string | null;
    image: string | null;
  };
  services: ServiceItem[];
}

interface Props {
  provider: ProviderData;
}

// Generate the next 14 days
function getNext14Days() {
  const days: { date: Date; dateStr: string; dayName: string; dayNum: number; monthName: string }[] = [];
  const dayNames = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  const monthNames = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
  ];

  const now = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    days.push({
      date: d,
      dateStr,
      dayName: i === 0 ? "اليوم" : i === 1 ? "غداً" : dayNames[d.getDay()],
      dayNum: d.getDate(),
      monthName: monthNames[d.getMonth()],
    });
  }
  return days;
}

export function PublicBookingExperience({ provider }: Props) {
  const days = getNext14Days();
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(
    provider.services[0] || null
  );
  const [selectedDate, setSelectedDate] = useState<string>(days[0].dateStr);

  // Slots availability state
  const [slots, setSlots] = useState<IAvailabilitySlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isAbsent, setIsAbsent] = useState(false);
  const [absenceReason, setAbsenceReason] = useState<string | null>(null);
  const [isWorkingDay, setIsWorkingDay] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<IAvailabilitySlot | null>(null);

  // Client form
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [address, setAddress] = useState("");
  const [clientNotes, setClientNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"INSTAPAY" | "VODAFONE_CASH" | "CARD">("INSTAPAY");

  // Step state: 'select' | 'pay' | 'confirmed'
  const [step, setStep] = useState<"select" | "pay" | "confirmed">("select");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdBooking, setCreatedBooking] = useState<any | null>(null);
  const [isPaying, setIsPaying] = useState(false);

  // Sector label
  const sectorInfo = SECTORS.find((s) => s.value === provider.category);

  // Fetch Slots when provider, service, or date changes
  useEffect(() => {
    if (!selectedService) return;

    setIsLoadingSlots(true);
    setSelectedSlot(null);
    setSubmitError(null);

    const url = `/api/providers/availability?providerId=${provider.id}&serviceId=${selectedService.id}&date=${selectedDate}`;

    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "success" && res.data) {
          setSlots(res.data.slots || []);
          setIsAbsent(res.data.isAbsent || false);
          setAbsenceReason(res.data.absenceReason || null);
          setIsWorkingDay(res.data.isWorkingDay !== false);
        } else {
          setSlots([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch slots:", err);
        setSlots([]);
      })
      .finally(() => {
        setIsLoadingSlots(false);
      });
  }, [provider.id, selectedService, selectedDate]);

  // Handle Initial Booking (creates HELD booking with 10 min countdown)
  const handleProceedToPayment = async () => {
    if (!selectedService || !selectedSlot) {
      setSubmitError("يرجى اختيار الخدمة والموعد المناسب أولاً");
      return;
    }

    if (!clientName.trim() || clientName.trim().length < 2) {
      setSubmitError("يرجى إدخال اسم العميل بشكل صحيح");
      return;
    }

    const cleanPhone = clientPhone.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      setSubmitError("يرجى إدخال رقم واتساب صحيح للتواصل وتأكيد الحجز");
      return;
    }

    if (selectedService.requiresAddress && !address.trim()) {
      setSubmitError("عنوان الحضور مطلوب لهذه الخدمة");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId: provider.id,
          serviceId: selectedService.id,
          startsAt: selectedSlot.startsAt,
          clientName: clientName.trim(),
          clientPhone: cleanPhone,
          address: address.trim() || undefined,
          clientNotes: clientNotes.trim() || undefined,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.status === "fail" || data.status === "error") {
        throw new Error(data.message || "حدث خطأ أثناء حجز الموعد");
      }

      setCreatedBooking(data.data);

      // If deposit is 0, booking is automatically CONFIRMED
      if (data.data.status === "CONFIRMED") {
        setStep("confirmed");
      } else {
        setStep("pay");
      }
    } catch (err: any) {
      setSubmitError(err.message || "حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mock Payment Confirmation (simulates payment gateway webhook)
  const handleConfirmMockPayment = async () => {
    if (!createdBooking) return;

    setIsPaying(true);
    try {
      // 1. Call checkout endpoint
      const checkoutRes = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: createdBooking.bookingId,
          method: paymentMethod,
        }),
      });
      const checkoutData = await checkoutRes.json();

      if (!checkoutRes.ok || checkoutData.status !== "success") {
        throw new Error(checkoutData.message || "فشل إنشاء طلب الدفع");
      }

      const ref = checkoutData.data.reference;

      // 2. Call mock webhook with action=PAY to transition booking from HELD to CONFIRMED
      const webhookRes = await fetch("/api/payments/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ref,
          bookingId: createdBooking.bookingId,
          action: "PAY",
        }),
      });
      const webhookData = await webhookRes.json();

      if (!webhookRes.ok || webhookData.status !== "success") {
        throw new Error(webhookData.message || "فشل تسجيل تأكيد الدفع");
      }

      setCreatedBooking((prev: any) => ({
        ...prev,
        status: "CONFIRMED",
      }));
      setStep("confirmed");
    } catch (err: any) {
      alert(err.message || "فشلت عملية الدفع التجريبية");
    } finally {
      setIsPaying(false);
    }
  };

  // ------------------ CONFIRMATION SCREEN ------------------
  if (step === "confirmed" && createdBooking) {
    return (
      <div className="min-h-screen bg-[#f7faf8] py-10 px-4 sm:px-6" dir="rtl">
        <div className="mx-auto max-w-xl">
          <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-sm text-center">
            {/* Green Badge */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-brand mb-4">
              <CheckCircle2 className="h-10 w-10 text-brand" />
            </div>

            <h2 className="text-2xl font-bold text-foreground">
              تم تأكيد موعدك بنجاح!
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              كود الحجز المرجعي:{" "}
              <span className="font-mono font-bold text-brand text-base">
                #{createdBooking.bookingId.slice(-8).toUpperCase()}
              </span>
            </p>

            {/* WhatsApp Notification Alert Banner */}
            <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 text-right flex items-start gap-3">
              <MessageSquare className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-emerald-900 text-sm">
                  تم إرسال تفاصيل الموعد عبر واتساب
                </h4>
                <p className="text-xs text-emerald-800/90 mt-0.5 leading-relaxed">
                  تم إرسال رسالة تأكيد رسمية لموعدك إلى رقم الواتساب{" "}
                  <strong className="font-mono font-bold text-emerald-950">
                    {clientPhone}
                  </strong>
                  . يمكنك تعديل أو إلغاء موعدك في أي وقت بمجرد مراسلة المساعد الذكي عبر الواتساب.
                </p>
              </div>
            </div>

            {/* Booking Details Summary */}
            <div className="mt-6 rounded-xl bg-canvas/60 p-4 text-right space-y-2.5 text-sm border border-border/60">
              <div className="flex justify-between items-center border-b border-border/50 pb-2.5">
                <span className="text-muted-foreground">النشاط:</span>
                <span className="font-semibold text-foreground">
                  {provider.user.name || provider.slug}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-border/50 pb-2.5">
                <span className="text-muted-foreground">الخدمة:</span>
                <span className="font-semibold text-foreground">
                  {selectedService?.name}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-border/50 pb-2.5">
                <span className="text-muted-foreground">تاريخ ووقت الموعد:</span>
                <span className="font-semibold text-brand">
                  {new Date(createdBooking.startsAt).toLocaleString("ar-EG", {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-border/50 pb-2.5">
                <span className="text-muted-foreground">الاسم:</span>
                <span className="font-medium text-foreground">{clientName}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-muted-foreground">حالة الحجز:</span>
                <span className="inline-flex items-center gap-1 font-bold text-xs text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  مؤكد رسميًا
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => {
                  setStep("select");
                  setSelectedSlot(null);
                  setCreatedBooking(null);
                }}
                className="w-full sm:w-auto rounded-lg border border-border bg-white px-5 py-2.5 text-xs font-semibold text-foreground hover:bg-neutral-50 transition-colors"
              >
                حجز موعد آخر
              </button>
              <Link
                href="/"
                className="w-full sm:w-auto rounded-lg bg-brand px-6 py-2.5 text-xs font-semibold text-white hover:bg-brand/90 transition-colors"
              >
                الصفحة الرئيسية لأجندة
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ------------------ PAYMENT SCREEN (DEPOSIT & HOLD COUNTDOWN) ------------------
  if (step === "pay" && createdBooking) {
    const depositAmount = selectedService?.depositAmount ?? provider.depositAmount ?? 0;
    const remainingAmount = (selectedService?.price || 0) - depositAmount;

    return (
      <div className="min-h-screen bg-[#f7faf8] py-8 px-4 sm:px-6" dir="rtl">
        <div className="mx-auto max-w-xl space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep("select")}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
              <span>الرجوع لتعديل البيانات</span>
            </button>
            <span className="text-xs font-semibold text-brand bg-brand/10 px-2.5 py-1 rounded-full">
              خطوة سداد العربون
            </span>
          </div>

          {/* Deposit Breakdown with Hold Countdown */}
          <DepositBreakdownWidget
            servicePrice={selectedService?.price || 0}
            depositAmount={depositAmount}
            remainingAmount={remainingAmount}
            depositType={provider.depositType}
            holdExpiresAt={createdBooking.holdExpiresAt}
            showCountdown={true}
            onTimeout={() => {
              alert("انتهت مهلة الـ 10 دقائق لحجز الموعد. يرجى اختيار الموعد مرة أخرى.");
              setStep("select");
            }}
          />

          {/* Payment Method Selector */}
          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm space-y-3">
            <h4 className="font-semibold text-foreground text-sm border-b border-border/80 pb-2.5">
              اختر وسيلة الدفع المناسبة
            </h4>

            <div className="space-y-2">
              <label
                className={`flex items-center justify-between rounded-xl p-3 border cursor-pointer transition-all ${
                  paymentMethod === "INSTAPAY"
                    ? "border-brand bg-brand/5 shadow-xs"
                    : "border-border hover:bg-neutral-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payMethod"
                    checked={paymentMethod === "INSTAPAY"}
                    onChange={() => setPaymentMethod("INSTAPAY")}
                    className="accent-brand"
                  />
                  <div>
                    <div className="font-semibold text-foreground text-xs">
                      انستاباي (InstaPay)
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      تحويل بنكي لحظي مجاني
                    </div>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                  الأسرع
                </span>
              </label>

              <label
                className={`flex items-center justify-between rounded-xl p-3 border cursor-pointer transition-all ${
                  paymentMethod === "VODAFONE_CASH"
                    ? "border-brand bg-brand/5 shadow-xs"
                    : "border-border hover:bg-neutral-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payMethod"
                    checked={paymentMethod === "VODAFONE_CASH"}
                    onChange={() => setPaymentMethod("VODAFONE_CASH")}
                    className="accent-brand"
                  />
                  <div>
                    <div className="font-semibold text-foreground text-xs">
                      فودافون كاش ومحافظ الهاتف
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      تحويل فوري عبر أي محفظة هاتف
                    </div>
                  </div>
                </div>
              </label>

              <label
                className={`flex items-center justify-between rounded-xl p-3 border cursor-pointer transition-all ${
                  paymentMethod === "CARD"
                    ? "border-brand bg-brand/5 shadow-xs"
                    : "border-border hover:bg-neutral-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payMethod"
                    checked={paymentMethod === "CARD"}
                    onChange={() => setPaymentMethod("CARD")}
                    className="accent-brand"
                  />
                  <div>
                    <div className="font-semibold text-foreground text-xs">
                      بطاقة بنكية (Visa / MasterCard)
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      دفع إلكتروني آمن ومشفر
                    </div>
                  </div>
                </div>
              </label>
            </div>

            {/* Simulated Payment Action */}
            <div className="pt-3">
              <button
                type="button"
                onClick={handleConfirmMockPayment}
                disabled={isPaying}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand py-3.5 px-6 text-sm font-bold text-white hover:bg-brand/90 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {isPaying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>جاري معالجة تأكيد الدفع...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>دفع وتأكيد الحجز الآن ({depositAmount} ج.م)</span>
                  </>
                )}
              </button>
              <p className="mt-2 text-center text-[11px] text-muted-foreground">
                بيئة اختبار محاكاة (Mock): بالضغط على الزر سيتم تأكيد الدفع ونقل الحجز للحالة المؤكدة.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ------------------ MAIN BOOKING STEP (PROVIDER CARD + SERVICES + DAYS + SLOTS + FORM) ------------------
  return (
    <div className="min-h-screen bg-[#f7faf8] py-6 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* 1. كارت النشاط (Provider Card) */}
        <div className="rounded-2xl border border-border bg-white p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-brand font-bold text-xl">
                {provider.user.name?.charAt(0) || "أ"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-foreground">
                    {provider.user.name || provider.slug}
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[11px] font-semibold">
                    <ShieldCheck className="h-3 w-3" />
                    نشاط موثق
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {sectorInfo?.label || "خدمات احترافية"} • @{provider.slug}
                </p>
              </div>
            </div>

            {provider.whatsappNumber && (
              <a
                href={`https://wa.me/${provider.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors"
              >
                <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
                <span>واتساب المساعد</span>
              </a>
            )}
          </div>

          {/* Bio & Location */}
          {(provider.bio || provider.address) && (
            <div className="mt-4 pt-4 border-t border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-muted-foreground">
              {provider.bio && <p className="leading-relaxed">{provider.bio}</p>}
              {provider.address && (
                <div className="flex items-center gap-1.5 shrink-0 text-foreground font-medium">
                  <MapPin className="h-3.5 w-3.5 text-brand" />
                  <span>{provider.address}</span>
                  {provider.locationUrl && (
                    <a
                      href={provider.locationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand hover:underline inline-flex items-center"
                    >
                      <ExternalLink className="h-3 w-3 mr-0.5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 2. الخدمات المتاحة (Services) */}
        <div className="rounded-2xl border border-border bg-white p-5 sm:p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-border/80 pb-3">
            <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand" />
              <span>1. اختر الخدمة</span>
            </h3>
            <span className="text-xs text-muted-foreground">
              {provider.services.length} خدمات متوفرة
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {provider.services.map((s) => {
              const isSelected = selectedService?.id === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedService(s)}
                  className={`text-right rounded-xl p-4 border transition-all cursor-pointer ${
                    isSelected
                      ? "border-2 border-brand bg-brand/5 shadow-xs"
                      : "border-border hover:border-brand/40 bg-white"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-foreground text-sm">{s.name}</h4>
                    <span className="font-bold text-brand text-sm shrink-0">
                      {s.price} ج.م
                    </span>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {s.durationMinutes} دقيقة
                    </span>
                    <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-700">
                      {MODE_LABELS[s.mode] || "في المكان"}
                    </span>
                  </div>
                  {s.depositAmount && s.depositAmount > 0 ? (
                    <div className="mt-2 text-[11px] font-semibold text-emerald-700">
                      عربون التأكيد: {s.depositAmount} ج.م
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. شريط الأيام الأفقي للموبايل (Horizontal Days Strip) */}
        <div className="rounded-2xl border border-border bg-white p-5 sm:p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-border/80 pb-3">
            <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-brand" />
              <span>2. اختر اليوم</span>
            </h3>
            <span className="text-xs text-muted-foreground">
              مواعيد الأسبوعين القادمين
            </span>
          </div>

          {/* Scrollable Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none">
            {days.map((d) => {
              const isSelected = selectedDate === d.dateStr;
              return (
                <button
                  key={d.dateStr}
                  type="button"
                  onClick={() => setSelectedDate(d.dateStr)}
                  className={`shrink-0 flex flex-col items-center justify-center rounded-xl p-3 w-18 transition-all cursor-pointer border ${
                    isSelected
                      ? "border-2 border-brand bg-brand text-white shadow-xs"
                      : "border-border bg-canvas/40 hover:border-brand/40 text-foreground"
                  }`}
                >
                  <span className={`text-[11px] ${isSelected ? "text-white/80" : "text-muted-foreground"}`}>
                    {d.dayName}
                  </span>
                  <span className="text-lg font-bold my-0.5">{d.dayNum}</span>
                  <span className={`text-[10px] ${isSelected ? "text-white/80" : "text-muted-foreground"}`}>
                    {d.monthName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. شبكة المواعيد (Slots Grid) */}
        <div className="rounded-2xl border border-border bg-white p-5 sm:p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-border/80 pb-3">
            <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
              <Clock className="h-4 w-4 text-brand" />
              <span>3. اختر الموعد المناسب</span>
            </h3>
            {selectedSlot && (
              <span className="text-xs font-semibold text-brand">
                الموعد المختار: {selectedSlot.time}
              </span>
            )}
          </div>

          <TimelineSlotGrid
            slots={slots}
            selectedSlotTime={selectedSlot?.time || null}
            onSelectSlot={(slot) => setSelectedSlot(slot)}
            isLoading={isLoadingSlots}
            isAbsent={isAbsent}
            absenceReason={absenceReason}
            isWorkingDay={isWorkingDay}
          />
        </div>

        {/* 5. نموذج بيانات العميل (Client Form) */}
        <div className="rounded-2xl border border-border bg-white p-5 sm:p-6 shadow-sm space-y-4">
          <div className="border-b border-border/80 pb-3">
            <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
              <User className="h-4 w-4 text-brand" />
              <span>4. بيانات العميل للتأكيد والمتابعة</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              سيتم إرسال تفاصيل وتذكيرات الموعد على رقم الواتساب المسجل
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                الاسم بالكامل *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="مثال: أحمد محمد"
                  className="w-full rounded-xl border border-border bg-white p-2.5 pr-9 text-xs text-foreground focus:border-brand focus:outline-hidden"
                />
                <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                رقم الواتساب * (لتأكيد وتذكير الموعد)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  dir="ltr"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="01012345678"
                  className="w-full rounded-xl border border-border bg-white p-2.5 pl-9 text-xs text-foreground focus:border-brand focus:outline-hidden text-right"
                />
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          {selectedService?.requiresAddress && (
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                عنوان الحضور للزيارة المنزلية *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="المنطقة، الشارع، رقم العمارة والشقة..."
                className="w-full rounded-xl border border-border bg-white p-2.5 text-xs text-foreground focus:border-brand focus:outline-hidden"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              ملاحظات إضافية (اختياري)
            </label>
            <textarea
              rows={2}
              value={clientNotes}
              onChange={(e) => setClientNotes(e.target.value)}
              placeholder="أي استفسار أو تفاصيل ترغب في إبلاغ مقدم الخدمة بها..."
              className="w-full rounded-xl border border-border bg-white p-2.5 text-xs text-foreground focus:border-brand focus:outline-hidden resize-none"
            />
          </div>

          {submitError && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Submit Action */}
          <button
            type="button"
            onClick={handleProceedToPayment}
            disabled={isSubmitting || !selectedSlot}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand py-3.5 px-6 text-sm font-bold text-white hover:bg-brand/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm active:scale-[0.99]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>جاري الحجز وتجهيز الموعد...</span>
              </>
            ) : selectedSlot ? (
              <>
                <span>تأكيد الموعد ({selectedSlot.time}) والمتابعة</span>
                <ChevronLeft className="h-4 w-4" />
              </>
            ) : (
              <span>اختر موعداً متاحاً أولاً للمتابعة</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
