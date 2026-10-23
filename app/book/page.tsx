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
} from "lucide-react";
import { TimelineSlotGrid } from "@/components/booking/TimelineSlotGrid";
import { DepositBreakdownWidget } from "@/components/booking/DepositBreakdownWidget";
import { IAvailabilitySlot } from "@/utils/dto/booking";

interface ServiceItem {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
  requiresAddress: boolean;
}

interface ProviderItem {
  id: string;
  slug: string;
  category: string;
  bio: string | null;
  depositType: "NONE" | "FIXED" | "FULL";
  depositAmount: number;
  bufferMinutes: number;
  user: {
    name: string | null;
    phone: string | null;
  };
  services: ServiceItem[];
}
// تاريخ بالتوقيت المحلي (مش UTC) بصيغة YYYY-MM-DD
const toYMD = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export default function BookingPage() {
  const [providers, setProviders] = useState<ProviderItem[]>([]);
  const [isLoadingProviders, setIsLoadingProviders] = useState(true);

  // Selection states
  const [selectedProvider, setSelectedProvider] = useState<ProviderItem | null>(
    null,
  );
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(
    null,
  );

  // Date selection state (YYYY-MM-DD)
  const [selectedDate, setSelectedDate] = useState<string>(() =>
    toYMD(new Date()),
  );

  // Slots availability state
  const [slots, setSlots] = useState<IAvailabilitySlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isAbsent, setIsAbsent] = useState(false);
  const [absenceReason, setAbsenceReason] = useState<string | null>(null);
  const [isWorkingDay, setIsWorkingDay] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<IAvailabilitySlot | null>(
    null,
  );

  // Client form inputs
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [address, setAddress] = useState("");
  const [clientNotes, setClientNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "INSTAPAY" | "VODAFONE_CASH" | "CARD" | "CASH"
  >("INSTAPAY");

  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successBooking, setSuccessBooking] = useState<any | null>(null);

  // Fetch Providers on mount
  useEffect(() => {
    setIsLoadingProviders(true);
    fetch("/api/providers")
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "success" && res.data && res.data.length > 0) {
          setProviders(res.data);
          const first = res.data[0];
          setSelectedProvider(first);
          if (first.services && first.services.length > 0) {
            setSelectedService(first.services[0]);
          }
        }
      })
      .catch((err) => console.error("Error loading providers:", err))
      .finally(() => setIsLoadingProviders(false));
  }, []);

  // Fetch Slots when provider, date, or service changes
  useEffect(() => {
    if (!selectedProvider || !selectedDate) return;

    setIsLoadingSlots(true);
    setSelectedSlot(null);
    setSubmitError(null);

    const serviceParam = selectedService
      ? `&serviceId=${selectedService.id}`
      : "";

    fetch(
      `/api/providers/availability?providerId=${selectedProvider.id}&date=${selectedDate}${serviceParam}`,
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "success" && res.data) {
          setIsAbsent(Boolean(res.data.isAbsent));
          setAbsenceReason(res.data.absenceReason || null);
          setIsWorkingDay(Boolean(res.data.isWorkingDay));
          setSlots(res.data.slots || []);
        } else {
          setSlots([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching slots:", err);
        setSlots([]);
      })
      .finally(() => setIsLoadingSlots(false));
  }, [selectedProvider, selectedDate, selectedService]);

  // Compute 7 days list for quick date strip
  const datesList = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = toYMD(d);
    const dayName = d.toLocaleDateString("ar-EG", { weekday: "short" });
    const dayNum = d.toLocaleDateString("ar-EG", { day: "numeric" });
    const monthName = d.toLocaleDateString("ar-EG", { month: "short" });
    return { dateStr, dayName, dayNum, monthName, rawDate: d };
  });

  // Calculate pricing
  const servicePrice = selectedService?.price || 0;
  const depositType = selectedProvider?.depositType || "FIXED";
  let depositAmount = 0;
  if (depositType === "FULL") {
    depositAmount = servicePrice;
  } else if (depositType === "FIXED") {
    depositAmount = Math.min(
      selectedProvider?.depositAmount || 0,
      servicePrice,
    );
  }
  const remainingAmount = Math.max(servicePrice - depositAmount, 0);

  // Submit Booking
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!selectedProvider) {
      setSubmitError("يرجى اختيار مقدم الخدمة");
      return;
    }
    if (!selectedService) {
      setSubmitError("يرجى اختيار الخدمة");
      return;
    }
    if (!selectedSlot) {
      setSubmitError("يرجى تحديد وقت الموعد من قائمة المواعيد المتاحة");
      return;
    }
    if (!clientName.trim()) {
      setSubmitError("يرجى إدخال اسم العميل");
      return;
    }
    if (!clientPhone.trim()) {
      setSubmitError("يرجى إدخال رقم الهاتف للتواصل");
      return;
    }
    if (selectedService.requiresAddress && !address.trim()) {
      setSubmitError("هذه الخدمة تتطلب إدخال عنوان الزيارة");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        providerId: selectedProvider.id,
        serviceId: selectedService.id,
        startsAt: selectedSlot.startsAt,
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        clientEmail: clientEmail.trim() || undefined,
        address: address.trim() || undefined,
        clientNotes: clientNotes.trim() || undefined,
        paymentMethod,
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "حدث خطأ أثناء إتمام الحجز");
      }

      setSuccessBooking(data.data);
    } catch (err: any) {
      setSubmitError(err.message || "فشل إرسال طلب الحجز، يرجى المحاولة ثانية");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingProviders) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-canvas">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-body-md text-neutral-muted">
            جاري تجهيز جدول المواعيد...
          </p>
        </div>
      </div>
    );
  }

  // Success view
  if (successBooking) {
    return (
      <div
        className="min-h-screen bg-canvas py-12 px-4 sm:px-6 lg:px-8"
        dir="rtl"
      >
        <div className="mx-auto max-w-2xl">
          <div className="rounded-[16px] border border-border-subtle bg-surface p-8 shadow-level3 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-status-success/15 text-status-success mb-4">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <h2 className="text-headline-lg font-bold text-neutral-primary">
              {successBooking.status === "CONFIRMED"
                ? "تم تأكيد موعدك بنجاح!"
                : "تم حجز الموعد بنجاح، وبانتظار تأكيد صاحب الخدمة"}
            </h2>
            <p className="mt-2 text-body-md text-neutral-muted max-w-md mx-auto">
              رقم الحجز المرجعي:{" "}
              <span className="font-bold text-neutral-primary font-mono tracking-wider">
                #{successBooking.bookingId.slice(-8).toUpperCase()}
              </span>
            </p>

            {/* Receipt Summary Card */}
            <div className="mt-6 rounded-2xl bg-canvas p-5 border border-border-subtle/80 text-right space-y-3">
              <div className="flex justify-between items-center border-b border-border-subtle/60 pb-3">
                <span className="text-body-sm text-neutral-muted">
                  مقدم الخدمة:
                </span>
                <span className="font-semibold text-neutral-primary text-body-md">
                  {successBooking.provider.name}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-border-subtle/60 pb-3">
                <span className="text-body-sm text-neutral-muted">الخدمة:</span>
                <span className="font-semibold text-neutral-primary text-body-md">
                  {successBooking.service.name}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-border-subtle/60 pb-3">
                <span className="text-body-sm text-neutral-muted">
                  الموعد المحدد:
                </span>
                <span className="font-semibold text-primary text-body-md tabular-nums">
                  {new Date(successBooking.startsAt).toLocaleString("ar-EG", {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-border-subtle/60 pb-3">
                <span className="text-body-sm text-neutral-muted">
                  مبلغ العربون المطلوب:
                </span>
                <span className="font-bold text-headline-md text-primary tabular-nums">
                  {successBooking.pricing.depositAmount.toLocaleString("ar-EG")}{" "}
                  ج.م
                </span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-body-sm text-neutral-muted">
                  طريقة السداد:
                </span>
                <span className="font-medium text-neutral-primary text-body-md">
                  {successBooking.payment.method === "INSTAPAY"
                    ? "انستاباي (InstaPay)"
                    : successBooking.payment.method === "VODAFONE_CASH"
                      ? "فودافون كاش"
                      : successBooking.payment.method}
                </span>
              </div>
            </div>

            {/* Deposit Payment Instructions */}
            {successBooking.pricing.depositAmount > 0 && (
              <div className="mt-6 rounded-xl border border-primary/20 bg-primary-light/40 p-4 text-right">
                <h4 className="font-bold text-primary text-body-md mb-1">
                  تعليمات تحويل العربون لتأكيد الحجز:
                </h4>
                <p className="text-body-sm text-neutral-primary leading-relaxed">
                  يرجى تحويل مبلغ{" "}
                  <strong>{successBooking.pricing.depositAmount} ج.م</strong>{" "}
                  عبر{" "}
                  {successBooking.payment.method === "INSTAPAY"
                    ? "InstaPay"
                    : "المحفظة"}{" "}
                  إلى الرقم:{" "}
                  <strong className="font-mono text-primary">
                    {successBooking.provider.phone || "01012345678"}
                  </strong>{" "}
                  وكتابة كود الحجز في الملاحظات.
                </p>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/dashboard/bookings"
                className="w-full sm:w-auto rounded-[10px] bg-primary px-6 py-2.5 text-label-lg font-semibold text-white hover:bg-primary-dark transition-colors shadow-level2"
              >
                عرض في لوحة التحكم
              </Link>
              <button
                type="button"
                onClick={() => {
                  setSuccessBooking(null);
                  setSelectedSlot(null);
                }}
                className="w-full sm:w-auto rounded-[10px] border border-border-subtle bg-surface px-6 py-2.5 text-label-lg font-medium text-neutral-primary hover:bg-neutral-50 transition-colors"
              >
                حجز موعد آخر
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas py-8 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="mx-auto max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-light px-3.5 py-1 text-label-md font-semibold text-primary mb-3">
            <Sparkles className="h-4 w-4" />
            حجز موعد مؤكد وفوري
          </div>
          <h1 className="text-headline-lg sm:text-display-lg-mobile font-bold text-neutral-primary">
            اختر موعدك وثبّت حجزك مع أجندة
          </h1>
          <p className="mt-2 text-body-md text-neutral-muted max-w-2xl">
            مواعيد دقيقة، بدون انتظار، مع تأكيد فوري عبر نظام تحصيل العربون
            الذكي.
          </p>
        </div>

        {/* Main Grid: Form Left / Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Booking Controls (Cols 1-7) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Provider & Service Selection */}
            <div className="rounded-[16px] border border-border-subtle bg-surface p-6 shadow-level1">
              <div className="flex items-center gap-2 border-b border-border-subtle pb-3 mb-4">
                <Building2 className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-neutral-primary text-title-lg">
                  1. اختيار الخدمة
                </h3>
              </div>

              {/* Provider Selection */}
              {providers.length > 1 && (
                <div className="mb-4">
                  <label className="block text-label-md text-neutral-primary mb-1.5">
                    مقدم الخدمة
                  </label>
                  <select
                    value={selectedProvider?.id || ""}
                    onChange={(e) => {
                      const p = providers.find(
                        (prov) => prov.id === e.target.value,
                      );
                      if (p) {
                        setSelectedProvider(p);
                        if (p.services.length > 0)
                          setSelectedService(p.services[0]);
                      }
                    }}
                    className="w-full rounded-input border border-border-subtle bg-surface p-2.5 text-body-md text-neutral-primary focus:border-primary focus:outline-none"
                  >
                    {providers.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.user.name} ({p.category})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Services Radio / Cards */}
              <div className="space-y-2.5">
                <label className="block text-label-md text-neutral-primary mb-1">
                  الخدمات المتاحة
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedProvider?.services.map((service) => {
                    const isSelected = selectedService?.id === service.id;
                    return (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => setSelectedService(service)}
                        className={`rounded-xl p-4 text-right transition-all border ${
                          isSelected
                            ? "border-2 border-primary bg-primary-light/20 shadow-level2"
                            : "border-border-subtle bg-surface hover:border-primary/50"
                        }`}
                      >
                        <div className="font-semibold text-neutral-primary text-title-md">
                          {service.name}
                        </div>
                        <div className="mt-2 flex items-center justify-between text-body-sm text-neutral-muted">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {service.durationMinutes} دقيقة
                          </span>
                          <span className="font-bold text-primary text-body-md tabular-nums">
                            {service.price} ج.م
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step 2: Date Selector (Horizontal Days Strip) */}
            <div className="rounded-[16px] border border-border-subtle bg-surface p-6 shadow-level1">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-neutral-primary text-title-lg">
                    2. اختيار التاريخ
                  </h3>
                </div>
                <input
                  type="date"
                  value={selectedDate}
                  min={toYMD(new Date())}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="rounded-lg border border-border-subtle bg-canvas px-3 py-1.5 text-body-sm text-neutral-primary focus:border-primary focus:outline-none"
                />
              </div>

              {/* Horizontal Scrollable Days */}
              <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                {datesList.map((item) => {
                  const isSelected = selectedDate === item.dateStr;
                  return (
                    <button
                      key={item.dateStr}
                      type="button"
                      onClick={() => setSelectedDate(item.dateStr)}
                      className={`flex flex-col items-center justify-center min-w-[70px] py-3 px-2 rounded-xl transition-all border text-center select-none ${
                        isSelected
                          ? "border-2 border-primary bg-primary text-white shadow-level2 transform scale-105"
                          : "border-border-subtle bg-surface text-neutral-primary hover:border-primary/40 hover:bg-canvas"
                      }`}
                    >
                      <span
                        className={`text-body-sm ${
                          isSelected
                            ? "text-white font-medium"
                            : "text-neutral-muted"
                        }`}
                      >
                        {item.dayName}
                      </span>
                      <span className="text-title-lg font-bold tabular-nums my-0.5">
                        {item.dayNum}
                      </span>
                      <span
                        className={`text-[11px] ${
                          isSelected ? "text-white/80" : "text-neutral-muted"
                        }`}
                      >
                        {item.monthName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Timeline Slot Grid */}
            <TimelineSlotGrid
              slots={slots}
              selectedSlotTime={selectedSlot?.time || null}
              onSelectSlot={(slot) => setSelectedSlot(slot)}
              isLoading={isLoadingSlots}
              isAbsent={isAbsent}
              absenceReason={absenceReason}
              isWorkingDay={isWorkingDay}
            />

            {/* Step 4: Client Information */}
            <div className="rounded-[16px] border border-border-subtle bg-surface p-6 shadow-level1">
              <div className="flex items-center gap-2 border-b border-border-subtle pb-3 mb-4">
                <User className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-neutral-primary text-title-lg">
                  3. بيانات الحجز والتواصل
                </h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-label-md text-neutral-primary mb-1">
                      الاسم بالكامل *
                    </label>
                    <div className="relative">
                      <User className="absolute right-3 top-3 h-4 w-4 text-neutral-muted" />
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="مثال: محمد علي"
                        className="w-full rounded-input border border-border-subtle bg-surface pr-9 pl-3 py-2 text-body-md text-neutral-primary focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-label-md text-neutral-primary mb-1">
                      رقم الهاتف (واتساب) *
                    </label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-3 h-4 w-4 text-neutral-muted" />
                      <input
                        type="tel"
                        required
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="010XXXXXXXX"
                        className="w-full rounded-input border border-border-subtle bg-surface pr-9 pl-3 py-2 text-body-md text-neutral-primary focus:border-primary focus:outline-none tabular-nums"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-label-md text-neutral-primary mb-1">
                    البريد الإلكتروني (اختياري لتأكيد الحجز)
                  </label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-3 h-4 w-4 text-neutral-muted" />
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full rounded-input border border-border-subtle bg-surface pr-9 pl-3 py-2 text-body-md text-neutral-primary focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                {selectedService?.requiresAddress && (
                  <div>
                    <label className="block text-label-md text-neutral-primary mb-1">
                      عنوان الزيارة *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute right-3 top-3 h-4 w-4 text-neutral-muted" />
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="المنطقة، الشارع، رقم العمارة والشقة"
                        className="w-full rounded-input border border-border-subtle bg-surface pr-9 pl-3 py-2 text-body-md text-neutral-primary focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-label-md text-neutral-primary mb-1">
                    ملاحظات إضافية لمقدم الخدمة (اختياري)
                  </label>
                  <div className="relative">
                    <FileText className="absolute right-3 top-3 h-4 w-4 text-neutral-muted" />
                    <textarea
                      value={clientNotes}
                      onChange={(e) => setClientNotes(e.target.value)}
                      placeholder="أي استفسار أو تفاصيل خاصة ترغب في توضيحها..."
                      rows={2}
                      className="w-full rounded-input border border-border-subtle bg-surface pr-9 pl-3 py-2 text-body-sm text-neutral-primary focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Checkout Column (Cols 8-12) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Deposit Breakdown Widget */}
            <DepositBreakdownWidget
              servicePrice={servicePrice}
              depositAmount={depositAmount}
              remainingAmount={remainingAmount}
              depositType={depositType}
              showCountdown={false}
            />

            {/* Payment Method Selector */}
            {depositAmount > 0 && (
              <div className="rounded-[16px] border border-border-subtle bg-surface p-5 shadow-level1">
                <h4 className="font-semibold text-neutral-primary text-title-md mb-3">
                  اختر طريقة سداد العربون
                </h4>

                <div className="space-y-2.5">
                  <label
                    className={`flex items-center justify-between rounded-xl p-3 border cursor-pointer transition-all ${
                      paymentMethod === "INSTAPAY"
                        ? "border-primary bg-primary-light/20"
                        : "border-border-subtle hover:bg-canvas"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "INSTAPAY"}
                        onChange={() => setPaymentMethod("INSTAPAY")}
                        className="accent-primary"
                      />
                      <div>
                        <div className="font-semibold text-neutral-primary text-body-md">
                          انستاباي (InstaPay)
                        </div>
                        <div className="text-body-sm text-neutral-muted">
                          تحويل لحظي مباشر برقم الهاتف أو IPA
                        </div>
                      </div>
                    </div>
                    <span className="rounded-full bg-status-success/10 px-2.5 py-0.5 text-label-md font-semibold text-status-success">
                      الأسرع
                    </span>
                  </label>

                  <label
                    className={`flex items-center justify-between rounded-xl p-3 border cursor-pointer transition-all ${
                      paymentMethod === "VODAFONE_CASH"
                        ? "border-primary bg-primary-light/20"
                        : "border-border-subtle hover:bg-canvas"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "VODAFONE_CASH"}
                        onChange={() => setPaymentMethod("VODAFONE_CASH")}
                        className="accent-primary"
                      />
                      <div>
                        <div className="font-semibold text-neutral-primary text-body-md">
                          فودافون كاش / محفظة إلكترونية
                        </div>
                        <div className="text-body-sm text-neutral-muted">
                          تحويل فوري عبر أي محفظة هاتف ذكي
                        </div>
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center justify-between rounded-xl p-3 border cursor-pointer transition-all ${
                      paymentMethod === "CARD"
                        ? "border-primary bg-primary-light/20"
                        : "border-border-subtle hover:bg-canvas"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "CARD"}
                        onChange={() => setPaymentMethod("CARD")}
                        className="accent-primary"
                      />
                      <div>
                        <div className="font-semibold text-neutral-primary text-body-md">
                          بطاقة بنكية (فيزا / ماستركارد)
                        </div>
                        <div className="text-body-sm text-neutral-muted">
                          دفع إلكتروني آمن ومشفر
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Error Message */}
            {submitError && (
              <div className="rounded-xl border border-status-error/30 bg-status-error/10 p-4 text-body-sm text-status-error flex items-start gap-2">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Final Confirmation Button */}
            <button
              type="button"
              onClick={handleBookingSubmit}
              disabled={isSubmitting || !selectedSlot}
              className="w-full flex items-center justify-center gap-2 rounded-[10px] bg-primary py-3.5 px-6 text-label-lg font-bold text-white shadow-level2 hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>جاري تسجيل الحجز...</span>
                </>
              ) : selectedSlot ? (
                <>
                  <span>تأكيد حجز الموعد ({selectedSlot.time})</span>
                  <ChevronLeft className="h-5 w-5" />
                </>
              ) : (
                <span>يرجى اختيار موعد متاح أولاً</span>
              )}
            </button>

            {/* Security Guarantee Badge */}
            <div className="flex items-center justify-center gap-2 text-body-sm text-neutral-muted">
              <ShieldCheck className="h-4 w-4 text-status-success" />
              <span>حجزك آمن ومحمي 100% بنظام حماية مواعيد أجندة</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
