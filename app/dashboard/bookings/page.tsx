"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Plus,
  RefreshCw,
  Eye,
  Loader2,
  CalendarDays,
  CreditCard,
  MapPin,
  FileText,
} from "lucide-react";
import { CancelModal } from "@/components/booking/CancelModal";
import { RescheduleModal } from "@/components/booking/RescheduleModal";
import { BookingStatus, PaymentStatus } from "@/generated/prisma/enums";

interface BookingItem {
  id: string;
  providerId: string;
  serviceId: string;
  clientId: string;
  startsAt: string;
  endsAt: string;
  status: BookingStatus;
  holdExpiresAt: string | null;
  address: string | null;
  clientNotes: string | null;
  cancellationReason: string | null;
  createdAt: string;
  client: {
    id: string;
    name: string | null;
    phone: string | null;
    email: string | null;
  };
  service: {
    id: string;
    name: string;
    price: number;
    durationMinutes: number;
    requiresAddress: boolean;
  };
  provider: {
    id: string;
    slug: string;
    category: string;
    depositType: string;
    depositAmount: number;
    user: {
      name: string | null;
      phone: string | null;
    };
  };
  payment: {
    id: string;
    amount: number;
    method: string;
    status: PaymentStatus;
  } | null;
}

interface DashboardMetrics {
  total: number;
  confirmed: number;
  held: number;
  cancelled: number;
  completed: number;
  noShow: number;
}

export default function BookingsDashboardPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    total: 0,
    confirmed: 0,
    held: 0,
    cancelled: 0,
    completed: 0,
    noShow: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // Modals state
  const [rescheduleTarget, setRescheduleTarget] = useState<BookingItem | null>(null);
  const [cancelTarget, setCancelTarget] = useState<BookingItem | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Fetch bookings from GET /api/bookings
  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedStatus !== "ALL") params.set("status", selectedStatus);
      if (filterDate) params.set("date", filterDate);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());

      const res = await fetch(`/api/bookings?${params.toString()}`);
      const data = await res.json();

      if (data.status === "success") {
        setBookings(data.data || []);
        if (data.metrics) setMetrics(data.metrics);
      }
    } catch (err) {
      console.error("Failed to load bookings:", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedStatus, filterDate, searchQuery]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Handle direct status updates (CONFIRM, COMPLETE)
  const handleQuickStatusUpdate = async (id: string, action: "CONFIRM" | "COMPLETE") => {
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        await fetchBookings();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Status Badge Helper using Agendah Design System tokens
  const renderStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-status-success/15 px-3 py-1 text-label-md font-semibold text-status-success">
            <CheckCircle className="h-3.5 w-3.5" />
            مؤكد
          </span>
        );
      case "HELD":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-status-warning/15 px-3 py-1 text-label-md font-semibold text-status-warning">
            <Clock className="h-3.5 w-3.5" />
            قفل مؤقت (عربون)
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-status-error/15 px-3 py-1 text-label-md font-semibold text-status-error">
            <XCircle className="h-3.5 w-3.5" />
            ملغي
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-label-md font-semibold text-primary">
            <CheckCircle className="h-3.5 w-3.5" />
            مكتمل
          </span>
        );
      case "NO_SHOW":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-neutral-200 px-3 py-1 text-label-md font-medium text-neutral-muted">
            لم يحضر
          </span>
        );
      case "EXPIRED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-neutral-200/80 px-3 py-1 text-label-md font-medium text-neutral-muted">
            انتهت مهلة العربون
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-canvas py-8 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="mx-auto max-w-7xl">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-light px-3 py-0.5 text-label-md font-semibold text-primary mb-2">
              <Calendar className="h-4 w-4" />
              لوحة التحكم
            </div>
            <h1 className="text-headline-lg font-bold text-neutral-primary">
              إدارة الحجوزات والمواعيد
            </h1>
            <p className="mt-1 text-body-md text-neutral-muted">
              متابعة مواعيد العملاء، تحصيل العربون، وتعديل أو إلغاء الحجوزات لحظياً
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchBookings}
              className="inline-flex items-center gap-2 rounded-[10px] border border-border-subtle bg-surface px-4 py-2.5 text-label-lg font-medium text-neutral-primary hover:bg-neutral-50 shadow-level1 transition-all"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              تحديث
            </button>
            <Link
              href="/book"
              className="inline-flex items-center gap-2 rounded-[10px] bg-primary px-5 py-2.5 text-label-lg font-semibold text-white shadow-level2 hover:bg-primary-dark transition-all"
            >
              <Plus className="h-5 w-5" />
              حجز موعد جديد
            </Link>
          </div>
        </div>

        {/* Metrics Cards Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {/* Total */}
          <div className="rounded-[16px] border border-border-subtle bg-surface p-5 shadow-level1">
            <div className="text-body-sm text-neutral-muted">إجمالي الحجوزات</div>
            <div className="mt-2 text-headline-lg font-bold text-neutral-primary tabular-nums">
              {metrics.total}
            </div>
          </div>

          {/* Confirmed */}
          <div className="rounded-[16px] border border-status-success/20 bg-status-success/5 p-5 shadow-level1">
            <div className="text-body-sm font-medium text-status-success">
              المواعيد المؤكدة
            </div>
            <div className="mt-2 text-headline-lg font-bold text-status-success tabular-nums">
              {metrics.confirmed}
            </div>
          </div>

          {/* Held / Deposit Pending */}
          <div className="rounded-[16px] border border-status-warning/20 bg-status-warning/5 p-5 shadow-level1">
            <div className="text-body-sm font-medium text-status-warning">
              بانتظار العربون (قفل مؤقت)
            </div>
            <div className="mt-2 text-headline-lg font-bold text-status-warning tabular-nums">
              {metrics.held}
            </div>
          </div>

          {/* Completed */}
          <div className="rounded-[16px] border border-primary/20 bg-primary/5 p-5 shadow-level1">
            <div className="text-body-sm font-medium text-primary">المكتملة</div>
            <div className="mt-2 text-headline-lg font-bold text-primary tabular-nums">
              {metrics.completed}
            </div>
          </div>

          {/* Cancelled */}
          <div className="rounded-[16px] border border-status-error/20 bg-status-error/5 p-5 shadow-level1">
            <div className="text-body-sm font-medium text-status-error">الملغية</div>
            <div className="mt-2 text-headline-lg font-bold text-status-error tabular-nums">
              {metrics.cancelled}
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="rounded-[16px] border border-border-subtle bg-surface p-4 shadow-level1 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Status Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: "ALL", label: "الكل" },
                { id: "CONFIRMED", label: "مؤكد" },
                { id: "HELD", label: "قفل مؤقت (عربون)" },
                { id: "COMPLETED", label: "مكتمل" },
                { id: "CANCELLED", label: "ملغي" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedStatus(tab.id)}
                  className={`rounded-full px-4 py-1.5 text-label-md transition-all ${
                    selectedStatus === tab.id
                      ? "bg-primary text-white font-semibold shadow-level1"
                      : "bg-canvas text-neutral-muted hover:text-neutral-primary hover:bg-neutral-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search & Date Filter */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Date Filter */}
              <div className="relative">
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="rounded-input border border-border-subtle bg-canvas px-3 py-1.5 text-body-sm text-neutral-primary focus:border-primary focus:outline-none"
                />
                {filterDate && (
                  <button
                    onClick={() => setFilterDate("")}
                    className="absolute left-2 top-2 text-[11px] text-neutral-muted hover:text-neutral-primary"
                  >
                    مسح
                  </button>
                )}
              </div>

              {/* Search Field */}
              <div className="relative min-w-[220px]">
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-neutral-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="بحث باسم العميل أو الهاتف..."
                  className="w-full rounded-input border border-border-subtle bg-canvas pr-9 pl-3 py-1.5 text-body-sm text-neutral-primary focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bookings List / Table */}
        <div className="rounded-[16px] border border-border-subtle bg-surface shadow-level1 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-neutral-muted">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="mr-3 text-body-md">جاري تحميل الحجوزات...</span>
            </div>
          ) : bookings.length === 0 ? (
            <div className="py-20 text-center">
              <CalendarDays className="mx-auto h-12 w-12 text-neutral-300 mb-3" />
              <h3 className="text-title-lg font-semibold text-neutral-primary">
                لا توجد حجوزات مطابقة
              </h3>
              <p className="mt-1 text-body-md text-neutral-muted">
                لم يتم العثور على أي مواعيد وفقاً لخيارات البحث أو الفلترة المحددة.
              </p>
              <button
                onClick={() => {
                  setSelectedStatus("ALL");
                  setFilterDate("");
                  setSearchQuery("");
                }}
                className="mt-4 rounded-[10px] border border-border-subtle px-4 py-2 text-label-md font-semibold text-primary hover:bg-canvas"
              >
                إعادة ضبط الفلاتر
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="border-b border-border-subtle bg-canvas text-body-sm font-semibold text-neutral-muted">
                    <th className="py-3.5 px-4">العميل</th>
                    <th className="py-3.5 px-4">الخدمة ومقدم الخدمة</th>
                    <th className="py-3.5 px-4">توقيت الموعد</th>
                    <th className="py-3.5 px-4">العربون والدفع</th>
                    <th className="py-3.5 px-4">الحالة</th>
                    <th className="py-3.5 px-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle/70 text-body-sm text-neutral-primary">
                  {bookings.map((booking) => {
                    const startsAtDate = new Date(booking.startsAt);
                    const isHeld = booking.status === "HELD";
                    const isConfirmed = booking.status === "CONFIRMED";
                    const isActionBusy = actionLoadingId === booking.id;

                    return (
                      <tr
                        key={booking.id}
                        className="hover:bg-canvas/60 transition-colors"
                      >
                        {/* Client Info */}
                        <td className="py-4 px-4">
                          <div className="font-semibold text-neutral-primary text-body-md">
                            {booking.client.name || "عميل"}
                          </div>
                          <div className="flex items-center gap-1.5 text-neutral-muted text-body-sm mt-0.5 tabular-nums">
                            <Phone className="h-3.5 w-3.5" />
                            <span>{booking.client.phone || "—"}</span>
                          </div>
                          {booking.address && (
                            <div className="flex items-center gap-1.5 text-neutral-muted text-[11px] mt-1">
                              <MapPin className="h-3 w-3 text-primary" />
                              <span className="truncate max-w-[180px]">
                                {booking.address}
                              </span>
                            </div>
                          )}
                        </td>

                        {/* Service & Provider */}
                        <td className="py-4 px-4">
                          <div className="font-medium text-neutral-primary">
                            {booking.service.name}
                          </div>
                          <div className="text-body-sm text-neutral-muted flex items-center gap-2 mt-0.5">
                            <span className="tabular-nums">
                              {booking.service.durationMinutes} دقيقة
                            </span>
                            <span>•</span>
                            <span className="font-medium text-primary tabular-nums">
                              {booking.service.price} ج.م
                            </span>
                          </div>
                        </td>

                        {/* Appointment Time */}
                        <td className="py-4 px-4">
                          <div className="font-semibold text-neutral-primary tabular-nums">
                            {startsAtDate.toLocaleDateString("ar-EG", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                          <div className="text-neutral-muted text-body-sm flex items-center gap-1 mt-0.5 tabular-nums">
                            <Clock className="h-3.5 w-3.5 text-primary" />
                            <span>
                              {startsAtDate.toLocaleTimeString("ar-EG", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </td>

                        {/* Deposit & Payment */}
                        <td className="py-4 px-4">
                          {booking.payment ? (
                            <div>
                              <div className="font-bold text-neutral-primary tabular-nums">
                                {booking.payment.amount > 0 ? (
                                  <span>{booking.payment.amount} ج.م عربون</span>
                                ) : (
                                  <span className="text-neutral-muted">بدون عربون</span>
                                )}
                              </div>
                              <div className="text-[11px] text-neutral-muted mt-0.5">
                                {booking.payment.method === "INSTAPAY"
                                  ? "انستاباي"
                                  : booking.payment.method === "VODAFONE_CASH"
                                  ? "فودافون كاش"
                                  : booking.payment.method}{" "}
                                ({booking.payment.status === "PAID" ? "تم السداد" : "قيد السداد"})
                              </div>
                            </div>
                          ) : (
                            <span className="text-neutral-muted">—</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          {renderStatusBadge(booking.status)}
                          {booking.cancellationReason && (
                            <div className="text-[11px] text-status-error mt-1 truncate max-w-[140px]" title={booking.cancellationReason}>
                              السبب: {booking.cancellationReason}
                            </div>
                          )}
                        </td>

                        {/* Action Buttons */}
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5 flex-wrap">
                            {/* Reschedule Button */}
                            {booking.status !== "CANCELLED" && booking.status !== "COMPLETED" && (
                              <button
                                type="button"
                                onClick={() => setRescheduleTarget(booking)}
                                className="rounded-lg border border-border-subtle bg-surface px-2.5 py-1.5 text-body-sm font-medium text-neutral-primary hover:border-primary hover:text-primary transition-all flex items-center gap-1"
                                title="نقل الموعد"
                              >
                                <RotateCcw className="h-3.5 w-3.5" />
                                <span>نقل</span>
                              </button>
                            )}

                            {/* Confirm Quick Button for HELD status */}
                            {isHeld && (
                              <button
                                type="button"
                                disabled={isActionBusy}
                                onClick={() => handleQuickStatusUpdate(booking.id, "CONFIRM")}
                                className="rounded-lg bg-status-success/15 px-2.5 py-1.5 text-body-sm font-semibold text-status-success hover:bg-status-success/25 transition-all flex items-center gap-1"
                                title="تأكيد الحجز واستلام العربون"
                              >
                                <CheckCircle className="h-3.5 w-3.5" />
                                <span>تأكيد</span>
                              </button>
                            )}

                            {/* Complete Quick Button for CONFIRMED status */}
                            {isConfirmed && (
                              <button
                                type="button"
                                disabled={isActionBusy}
                                onClick={() => handleQuickStatusUpdate(booking.id, "COMPLETE")}
                                className="rounded-lg bg-primary/10 px-2.5 py-1.5 text-body-sm font-semibold text-primary hover:bg-primary/20 transition-all flex items-center gap-1"
                                title="اكتمال الزيارة"
                              >
                                <CheckCircle className="h-3.5 w-3.5" />
                                <span>اكتمال</span>
                              </button>
                            )}

                            {/* Cancel Button */}
                            {booking.status !== "CANCELLED" && booking.status !== "COMPLETED" && (
                              <button
                                type="button"
                                onClick={() => setCancelTarget(booking)}
                                className="rounded-lg border border-border-subtle bg-surface px-2.5 py-1.5 text-body-sm font-medium text-status-error hover:bg-status-error/10 transition-all flex items-center gap-1"
                                title="إلغاء الحجز"
                              >
                                <XCircle className="h-3.5 w-3.5" />
                                <span>إلغاء</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Reschedule Modal */}
      {rescheduleTarget && (
        <RescheduleModal
          isOpen={Boolean(rescheduleTarget)}
          bookingId={rescheduleTarget.id}
          providerId={rescheduleTarget.providerId}
          serviceId={rescheduleTarget.serviceId}
          clientName={rescheduleTarget.client.name || "العميل"}
          currentStartsAt={rescheduleTarget.startsAt}
          onClose={() => setRescheduleTarget(null)}
          onSuccess={() => {
            setRescheduleTarget(null);
            fetchBookings();
          }}
        />
      )}

      {/* Cancel Modal */}
      {cancelTarget && (
        <CancelModal
          isOpen={Boolean(cancelTarget)}
          bookingId={cancelTarget.id}
          clientName={cancelTarget.client.name || "العميل"}
          serviceName={cancelTarget.service.name}
          appointmentTime={new Date(cancelTarget.startsAt).toLocaleString("ar-EG", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
          onClose={() => setCancelTarget(null)}
          onSuccess={() => {
            setCancelTarget(null);
            fetchBookings();
          }}
        />
      )}
    </div>
  );
}
