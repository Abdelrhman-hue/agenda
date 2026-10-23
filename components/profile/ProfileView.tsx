"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  Shield,
  Briefcase,
  Calendar,
  Lock,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building2,
  Clock,
  Sparkles,
  Layers,
  ArrowUpRight,
  LogOut,
  CalendarDays,
  Check,
  Eye,
  EyeOff,
  Compass,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, FormField, inputClass, primaryBtn, outlineBtn } from "@/components/ui/form-field";
import { CopyLink } from "@/components/provider/CopyLink";
import { signOutAct } from "@/actions/signout.action";
import { SECTORS } from "@/lib/constants";

export interface ProfileUserData {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | string | null;
  phone: string | null;
  image: string | null;
  role: "ADMIN" | "PROVIDER" | "CLIENT";
  createdAt: Date | string;
  hasPassword: boolean;
  providerProfile?: {
    id: string;
    slug: string;
    category: string;
    bio: string | null;
    address: string | null;
    locationUrl: string | null;
    whatsappNumber: string | null;
    depositType: "NONE" | "FIXED" | "FULL";
    depositAmount: number;
    bufferMinutes: number;
    timezone: string;
    onboardingCompleted: boolean;
    _count?: {
      services: number;
      bookings: number;
    };
  } | null;
  bookings?: Array<{
    id: string;
    startsAt: string;
    endsAt: string;
    status: string;
    service: {
      id: string;
      name: string;
      price: number;
      durationMinutes: number;
    };
    provider: {
      id: string;
      slug: string;
      category: string;
      user: {
        name: string | null;
        phone: string | null;
      };
    };
    payment?: {
      amount: number;
      method: string;
      status: string;
    } | null;
  }>;
}

export function ProfileView({
  initialUser,
  baseUrl,
}: {
  initialUser: ProfileUserData;
  baseUrl: string;
}) {
  const [user, setUser] = useState<ProfileUserData>(initialUser);
  const [activeTab, setActiveTab] = useState<
    "personal" | "security" | "business" | "overview" | "bookings"
  >(user.role === "PROVIDER" ? "personal" : "personal");

  // Personal Info Form State
  const [name, setName] = useState(user.name || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [personalLoading, setPersonalLoading] = useState(false);
  const [personalMsg, setPersonalMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Provider Business Profile Form State
  const [category, setCategory] = useState(
    user.providerProfile?.category || "OTHER"
  );
  const [slug, setSlug] = useState(user.providerProfile?.slug || "");
  const [bio, setBio] = useState(user.providerProfile?.bio || "");
  const [whatsappNumber, setWhatsappNumber] = useState(
    user.providerProfile?.whatsappNumber || ""
  );
  const [address, setAddress] = useState(user.providerProfile?.address || "");
  const [locationUrl, setLocationUrl] = useState(
    user.providerProfile?.locationUrl || ""
  );
  const [businessLoading, setBusinessLoading] = useState(false);
  const [businessMsg, setBusinessMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [, startSignoutTransition] = useTransition();

  // Booking page link
  const bookingPageUrl = user.providerProfile?.slug
    ? `${baseUrl}/${user.providerProfile.slug}`
    : "";

  // Password validation checks
  const passHasLength = newPassword.length >= 8;
  const passHasUpper = /[A-Z]/.test(newPassword);
  const passHasLower = /[a-z]/.test(newPassword);
  const passHasSpecial = /[!@#$%^&*(),.?":{}|<>_\-\\[\]/~`';&+=]/.test(
    newPassword
  );
  const isPasswordValid =
    passHasLength && passHasUpper && passHasLower && passHasSpecial;

  // Handle Personal Info Update
  const handleUpdatePersonalInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setPersonalMsg(null);
    setPersonalLoading(true);

    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          phone: phone.trim() || undefined,
        }),
      });
      const data = await res.json();

      if (res.ok && data.status === "success") {
        setUser((prev) => ({
          ...prev,
          name: name.trim(),
          phone: phone.trim(),
        }));
        setPersonalMsg({ type: "success", text: "تم تحديث البيانات الشخصية بنجاح" });
      } else {
        setPersonalMsg({
          type: "error",
          text: data.message || "فشل تحديث البيانات، يرجى المحاولة لاحقاً",
        });
      }
    } catch {
      setPersonalMsg({
        type: "error",
        text: "تعذر الاتصال بالخادم، يرجى التحقق من اتصالك",
      });
    } finally {
      setPersonalLoading(false);
    }
  };

  // Handle Password Update
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (!isPasswordValid) {
      setPasswordMsg({
        type: "error",
        text: "يرجى استيفاء كافة شروط كلمة المرور الموضحة أدناه",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({
        type: "error",
        text: "كلمة المرور الجديدة وتأكيدها غير متطابقين",
      });
      return;
    }

    setPasswordLoading(true);

    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          password: newPassword,
        }),
      });
      const data = await res.json();

      if (res.ok && data.status === "success") {
        setPasswordMsg({
          type: "success",
          text: "تم تغيير كلمة المرور بنجاح!",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordMsg({
          type: "error",
          text: data.message || "فشل تغيير كلمة المرور",
        });
      }
    } catch {
      setPasswordMsg({
        type: "error",
        text: "تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handle Business Profile Update
  const handleUpdateBusinessProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusinessMsg(null);
    setBusinessLoading(true);

    try {
      const res = await fetch("/api/provider/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          slug: slug.trim() || undefined,
          bio: bio.trim(),
          address: address.trim(),
          locationUrl: locationUrl.trim(),
          whatsappNumber: whatsappNumber.trim(),
        }),
      });
      const data = await res.json();

      if (res.ok && data.data?.profile) {
        setUser((prev) => ({
          ...prev,
          providerProfile: {
            ...prev.providerProfile!,
            ...data.data.profile,
          },
        }));
        setBusinessMsg({
          type: "success",
          text: "تم حفظ بيانات النشاط والخدمة بنجاح",
        });
      } else {
        setBusinessMsg({
          type: "error",
          text: data.message || "تعذر حفظ بيانات النشاط",
        });
      }
    } catch {
      setBusinessMsg({
        type: "error",
        text: "تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً",
      });
    } finally {
      setBusinessLoading(false);
    }
  };

  // User avatar initials
  const initials = (user.name || "مستخدم")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  // Format joined date
  const joinedDateFormatted = new Date(user.createdAt).toLocaleDateString(
    "ar-EG",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div className="space-y-6" dir="rtl">
      {/* 1. Header Hero Card */}
      <Card className="overflow-hidden rounded-[20px] border border-border-subtle bg-surface p-6 shadow-level2 sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* User Info Avatar & Meta */}
          <div className="flex items-start gap-4 sm:items-center sm:gap-5">
            <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-primary/20 bg-primary-light text-primary-dark shadow-inner sm:size-24">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "الملف الشخصي"}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-display-lg-mobile font-bold sm:text-headline-lg">
                  {initials}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-headline-md font-bold text-neutral-primary sm:text-headline-lg">
                  {user.name || "المستخدم"}
                </h1>

                {/* Role Badge */}
                {user.role === "PROVIDER" ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-light px-3 py-1 text-label-md font-semibold text-primary-dark border border-primary/20">
                    <Building2 className="size-3.5" />
                    مقدم خدمة
                  </span>
                ) : user.role === "ADMIN" ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-gold/15 px-3 py-1 text-label-md font-semibold text-accent-gold border border-accent-gold/25">
                    <Shield className="size-3.5" />
                    مدير النظام
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-label-md font-medium text-neutral-muted border border-border-subtle">
                    <User className="size-3.5" />
                    عميل
                  </span>
                )}

                {/* Verification Badge */}
                {user.emailVerified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-status-success/10 px-2.5 py-0.5 text-body-sm font-medium text-status-success">
                    <CheckCircle2 className="size-3.5" />
                    حساب موثق
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-status-warning/10 px-2.5 py-0.5 text-body-sm font-medium text-status-warning">
                    <AlertCircle className="size-3.5" />
                    بانتظار توثيق البريد
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-body-sm text-neutral-muted">
                {user.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="size-4 text-neutral-muted" />
                    <span dir="ltr">{user.email}</span>
                  </span>
                )}
                {user.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="size-4 text-neutral-muted" />
                    <span dir="ltr">{user.phone}</span>
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-4 text-neutral-muted" />
                  <span>انضم في {joinedDateFormatted}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action Quick Button */}
          <div className="flex shrink-0 items-center gap-2">
            {user.role === "PROVIDER" ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-[10px] bg-primary px-4 py-2.5 text-label-lg font-semibold text-white shadow-level2 hover:bg-primary-dark transition-all"
              >
                <span>لوحة التحكم</span>
                <ArrowUpRight className="size-4" />
              </Link>
            ) : (
              <Link
                href="/book"
                className="inline-flex items-center gap-2 rounded-[10px] bg-primary px-4 py-2.5 text-label-lg font-semibold text-white shadow-level2 hover:bg-primary-dark transition-all"
              >
                <span>حجز موعد جديد</span>
                <Compass className="size-4" />
              </Link>
            )}

            <form
              action={() => {
                startSignoutTransition(async () => {
                  await signOutAct();
                });
              }}
            >
              <button
                type="submit"
                title="تسجيل الخروج"
                className="inline-flex cursor-pointer items-center justify-center rounded-[10px] border border-border-subtle bg-surface p-2.5 text-neutral-muted hover:border-status-error/40 hover:bg-status-error/10 hover:text-status-error transition-all"
              >
                <LogOut className="size-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Provider Public Link Strip */}
        {user.role === "PROVIDER" && user.providerProfile && bookingPageUrl && (
          <div className="mt-6 rounded-[14px] border border-primary/20 bg-primary-light/40 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-body-md font-semibold text-neutral-primary">
                  رابط صفحة الحجز العامة لعملائك
                </p>
                <p className="text-body-sm text-neutral-muted">
                  شارك الرابط مع عملائك على واتساب ومواقع التواصل لاستقبال الحجوزات
                </p>
              </div>
              <Link
                href={`/${user.providerProfile.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-body-sm font-semibold text-primary hover:underline"
              >
                <span>معاينة الصفحة</span>
                <ExternalLink className="size-3.5" />
              </Link>
            </div>
            <div className="mt-3">
              <CopyLink url={bookingPageUrl} />
            </div>
          </div>
        )}
      </Card>

      {/* 2. Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border-subtle pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("personal")}
          className={`flex items-center gap-2 rounded-[12px] px-4 py-2.5 text-label-lg font-semibold transition-all cursor-pointer ${
            activeTab === "personal"
              ? "bg-primary text-white shadow-level1"
              : "bg-surface text-neutral-muted border border-border-subtle hover:bg-neutral-50 hover:text-neutral-primary"
          }`}
        >
          <User className="size-4" />
          <span>المعلومات الشخصية</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 rounded-[12px] px-4 py-2.5 text-label-lg font-semibold transition-all cursor-pointer ${
            activeTab === "security"
              ? "bg-primary text-white shadow-level1"
              : "bg-surface text-neutral-muted border border-border-subtle hover:bg-neutral-50 hover:text-neutral-primary"
          }`}
        >
          <Lock className="size-4" />
          <span>الأمان وكلمة المرور</span>
        </button>

        {user.role === "PROVIDER" && (
          <>
            <button
              type="button"
              onClick={() => setActiveTab("business")}
              className={`flex items-center gap-2 rounded-[12px] px-4 py-2.5 text-label-lg font-semibold transition-all cursor-pointer ${
                activeTab === "business"
                  ? "bg-primary text-white shadow-level1"
                  : "bg-surface text-neutral-muted border border-border-subtle hover:bg-neutral-50 hover:text-neutral-primary"
              }`}
            >
              <Briefcase className="size-4" />
              <span>بيانات النشاط والخدمة</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 rounded-[12px] px-4 py-2.5 text-label-lg font-semibold transition-all cursor-pointer ${
                activeTab === "overview"
                  ? "bg-primary text-white shadow-level1"
                  : "bg-surface text-neutral-muted border border-border-subtle hover:bg-neutral-50 hover:text-neutral-primary"
              }`}
            >
              <Layers className="size-4" />
              <span>نظرة عامة وروابط سريعة</span>
            </button>
          </>
        )}

        {user.role === "CLIENT" && (
          <button
            type="button"
            onClick={() => setActiveTab("bookings")}
            className={`flex items-center gap-2 rounded-[12px] px-4 py-2.5 text-label-lg font-semibold transition-all cursor-pointer ${
              activeTab === "bookings"
                ? "bg-primary text-white shadow-level1"
                : "bg-surface text-neutral-muted border border-border-subtle hover:bg-neutral-50 hover:text-neutral-primary"
            }`}
          >
            <CalendarDays className="size-4" />
            <span>حجوزاتي الأخيرة</span>
            {user.bookings && user.bookings.length > 0 && (
              <span className="rounded-full bg-primary-light px-2 py-0.2 text-[11px] font-bold text-primary-dark">
                {user.bookings.length}
              </span>
            )}
          </button>
        )}
      </div>

      {/* 3. Tab Contents */}

      {/* Tab 1: Personal Information */}
      {activeTab === "personal" && (
        <Card className="rounded-[16px] border border-border-subtle bg-surface p-6 shadow-level1 sm:p-7">
          <div className="border-b border-border-subtle pb-4 mb-6">
            <h2 className="text-title-lg font-bold text-neutral-primary">
              البيانات الشخصية
            </h2>
            <p className="mt-1 text-body-sm text-neutral-muted">
              تحديث اسمك ورقم هاتفك المستخدم في التواصل والإشعارات
            </p>
          </div>

          {personalMsg && (
            <div className="mb-6">
              <Alert type={personalMsg.type}>{personalMsg.text}</Alert>
            </div>
          )}

          <form onSubmit={handleUpdatePersonalInfo} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="الاسم الكامل" htmlFor="user-name" required>
                <Input
                  id="user-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="محمد أحمد"
                  required
                  className={inputClass}
                />
              </FormField>

              <FormField
                label="رقم الهاتف"
                htmlFor="user-phone"
                hint="مثال: 01012345678"
              >
                <Input
                  id="user-phone"
                  type="tel"
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01012345678"
                  className={`${inputClass} text-right`}
                />
              </FormField>
            </div>

            <FormField
              label="البريد الإلكتروني"
              htmlFor="user-email"
              hint="البريد الإلكتروني مرتبط بهويتك ولا يمكن تغييره مباشرة"
            >
              <div className="relative">
                <Input
                  id="user-email"
                  type="email"
                  dir="ltr"
                  value={user.email || ""}
                  disabled
                  className={`${inputClass} bg-neutral-100 text-neutral-muted cursor-not-allowed`}
                />
                <div className="absolute left-3 top-3">
                  {user.emailVerified ? (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-status-success">
                      <CheckCircle2 className="size-3.5" />
                      موثق
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-status-warning">
                      <AlertCircle className="size-3.5" />
                      غير موثق
                    </span>
                  )}
                </div>
              </div>
            </FormField>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={personalLoading}
                className={`${primaryBtn} px-8`}
              >
                {personalLoading && <Loader2 className="size-4 animate-spin text-white" />}
                <span className="text-white">حفظ التعديلات</span>
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tab 2: Security & Password */}
      {activeTab === "security" && (
        <Card className="rounded-[16px] border border-border-subtle bg-surface p-6 shadow-level1 sm:p-7">
          <div className="border-b border-border-subtle pb-4 mb-6">
            <h2 className="text-title-lg font-bold text-neutral-primary">
              الأمان وكلمة المرور
            </h2>
            <p className="mt-1 text-body-sm text-neutral-muted">
              إدارة كلمة المرور وحماية بيانات حسابك في أجندة
            </p>
          </div>

          {passwordMsg && (
            <div className="mb-6">
              <Alert type={passwordMsg.type}>{passwordMsg.text}</Alert>
            </div>
          )}

          {!user.hasPassword ? (
            <div className="rounded-[14px] border border-border-subtle bg-primary-light/30 p-5">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  <Shield className="size-5" />
                </span>
                <div className="space-y-1">
                  <h3 className="text-body-lg font-bold text-neutral-primary">
                    حسابك محمي بواسطة تسجيل الدخول عبر Google
                  </h3>
                  <p className="text-body-md text-neutral-muted">
                    تم إنشاء هذا الحساب باستخدام حساب Google الخاص بك. يتم تأمين
                    تسجيل الدخول تلقائياً عبر موفر الهوية ولا حاجة لإعداد كلمة
                    مرور منفصلة.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdatePassword} className="space-y-5">
              <FormField
                label="كلمة المرور الحالية"
                htmlFor="current-password"
                required
              >
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPass ? "text" : "password"}
                    dir="ltr"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className={`${inputClass} pl-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute left-3 top-3 text-neutral-muted hover:text-neutral-primary"
                  >
                    {showCurrentPass ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </FormField>

              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  label="كلمة المرور الجديدة"
                  htmlFor="new-password"
                  required
                >
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPass ? "text" : "password"}
                      dir="ltr"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className={`${inputClass} pl-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute left-3 top-3 text-neutral-muted hover:text-neutral-primary"
                    >
                      {showNewPass ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </FormField>

                <FormField
                  label="تأكيد كلمة المرور الجديدة"
                  htmlFor="confirm-password"
                  required
                >
                  <Input
                    id="confirm-password"
                    type={showNewPass ? "text" : "password"}
                    dir="ltr"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className={inputClass}
                  />
                </FormField>
              </div>

              {/* Password Requirements Checklist */}
              <div className="rounded-[12px] border border-border-subtle bg-canvas p-4">
                <p className="text-body-sm font-semibold text-neutral-primary mb-2">
                  شروط كلمة المرور:
                </p>
                <ul className="grid gap-1.5 text-body-sm sm:grid-cols-2">
                  <li
                    className={`flex items-center gap-1.5 ${
                      passHasLength ? "text-status-success font-medium" : "text-neutral-muted"
                    }`}
                  >
                    <Check
                      className={`size-4 ${
                        passHasLength ? "text-status-success" : "text-neutral-300"
                      }`}
                    />
                    <span>٨ أحرف على الأقل</span>
                  </li>
                  <li
                    className={`flex items-center gap-1.5 ${
                      passHasUpper ? "text-status-success font-medium" : "text-neutral-muted"
                    }`}
                  >
                    <Check
                      className={`size-4 ${
                        passHasUpper ? "text-status-success" : "text-neutral-300"
                      }`}
                    />
                    <span>حرف كبير إنجليزي (A-Z)</span>
                  </li>
                  <li
                    className={`flex items-center gap-1.5 ${
                      passHasLower ? "text-status-success font-medium" : "text-neutral-muted"
                    }`}
                  >
                    <Check
                      className={`size-4 ${
                        passHasLower ? "text-status-success" : "text-neutral-300"
                      }`}
                    />
                    <span>حرف صغير إنجليزي (a-z)</span>
                  </li>
                  <li
                    className={`flex items-center gap-1.5 ${
                      passHasSpecial ? "text-status-success font-medium" : "text-neutral-muted"
                    }`}
                  >
                    <Check
                      className={`size-4 ${
                        passHasSpecial ? "text-status-success" : "text-neutral-300"
                      }`}
                    />
                    <span>رمز خاص مثل (!@#$%^&*)</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={passwordLoading || !isPasswordValid}
                  className={`${primaryBtn} px-8`}
                >
                  {passwordLoading && (
                    <Loader2 className="size-4 animate-spin" />
                  )}
                  <span>تحديث كلمة المرور</span>
                </Button>
              </div>
            </form>
          )}
        </Card>
      )}

      {/* Tab 3: Business & Provider Profile (Providers Only) */}
      {user.role === "PROVIDER" && activeTab === "business" && (
        <Card className="rounded-[16px] border border-border-subtle bg-surface p-6 shadow-level1 sm:p-7">
          <div className="border-b border-border-subtle pb-4 mb-6">
            <h2 className="text-title-lg font-bold text-neutral-primary">
              بيانات النشاط والخدمة
            </h2>
            <p className="mt-1 text-body-sm text-neutral-muted">
              تخصيص قطاع نشاطك، رابط الحجز، بيانات التواصل، وعنوان المكان لعملائك
            </p>
          </div>

          {businessMsg && (
            <div className="mb-6">
              <Alert type={businessMsg.type}>{businessMsg.text}</Alert>
            </div>
          )}

          <form onSubmit={handleUpdateBusinessProfile} className="space-y-6">
            {/* Sector/Category Selector */}
            <div className="space-y-2">
              <label className="text-body-md font-semibold text-neutral-primary">
                القطاع / مجال النشاط
              </label>
              <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {SECTORS.map((s) => {
                  const isSelected = category === s.value;
                  return (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setCategory(s.value)}
                      className={`cursor-pointer rounded-[12px] border p-3.5 text-right transition-all ${
                        isSelected
                          ? "border-primary bg-primary-light/50 ring-1 ring-primary shadow-level1"
                          : "border-border-subtle bg-surface hover:border-primary/40 hover:bg-neutral-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-body-md font-bold text-neutral-primary">
                          {s.label}
                        </span>
                        {isSelected && (
                          <span className="flex size-5 items-center justify-center rounded-full bg-primary text-white">
                            <Check className="size-3" />
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-body-sm text-neutral-muted">
                        {s.hint}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slug */}
            <FormField
              label="رابط الحجز المخصص (Slug)"
              htmlFor="provider-slug"
              hint="الرابط يظهر في عنوان صفحة الحجز، فقط حروف إنجليزية وأرقام وعلامة -"
              required
            >
              <div className="relative">
                <Input
                  id="provider-slug"
                  type="text"
                  dir="ltr"
                  value={slug}
                  onChange={(e) =>
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
                  }
                  placeholder="dr-ahmed"
                  required
                  className={`${inputClass} text-left font-mono`}
                />
                <span className="absolute left-3 top-3 text-[12px] text-neutral-muted pointer-events-none">
                  /{slug || "..."}
                </span>
              </div>
            </FormField>

            {/* Bio */}
            <FormField
              label="نبذة عنك وعن النشاط"
              htmlFor="provider-bio"
              hint="نبذة مختصرة توضح لعملائك خبرتك أو تخصصاتك (بحد أقصى ٣٠٠ حرف)"
            >
              <div className="space-y-1">
                <textarea
                  id="provider-bio"
                  rows={3}
                  value={bio}
                  maxLength={300}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="طبيب متخصص في... / مدرب معتمد بخبرة... / سنتر يقدم..."
                  className="w-full rounded-[10px] border border-border-subtle bg-[#F4F8F6] p-3 text-body-md text-neutral-primary outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none placeholder:text-neutral-muted"
                />
                <p className="text-left text-[11px] text-neutral-muted tabular-nums">
                  {bio.length} / 300 حرف
                </p>
              </div>
            </FormField>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* WhatsApp Number */}
              <FormField
                label="رقم الواتساب للتواصل والإشعارات"
                htmlFor="provider-whatsapp"
                hint="الرقم الذي يتواصل عليه العملاء لتأكيد الحجز"
              >
                <Input
                  id="provider-whatsapp"
                  type="tel"
                  dir="ltr"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="01012345678"
                  className={`${inputClass} text-right`}
                />
              </FormField>

              {/* Physical Address */}
              <FormField
                label="عنوان المقر / العيادة"
                htmlFor="provider-address"
                hint="مثال: مدينة نصر، شارع عباس العقاد، عمارة ٥"
              >
                <Input
                  id="provider-address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="العنوان التفصيلي"
                  className={inputClass}
                />
              </FormField>
            </div>

            {/* Google Maps Location URL */}
            <FormField
              label="رابط خريطة الموقع (Google Maps)"
              htmlFor="provider-location-url"
              hint="رابط المكان على خرائط جوجل ليسهل على عملائك الوصول إليك"
            >
              <Input
                id="provider-location-url"
                type="url"
                dir="ltr"
                value={locationUrl}
                onChange={(e) => setLocationUrl(e.target.value)}
                placeholder="https://maps.app.goo.gl/..."
                className={`${inputClass} text-left`}
              />
            </FormField>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={businessLoading}
                className={`${primaryBtn} px-8`}
              >
                {businessLoading && <Loader2 className="size-4 animate-spin" />}
                <span>حفظ بيانات النشاط</span>
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tab 4: Overview & Quick Links (Providers Only) */}
      {user.role === "PROVIDER" && activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Services Card */}
            <Card className="gap-3 rounded-[16px] border border-border-subtle bg-surface p-5 shadow-level1">
              <div className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-[10px] bg-primary-light text-primary-dark">
                  <Sparkles className="size-5" />
                </span>
                <span className="text-display-lg-mobile font-bold text-neutral-primary tabular-nums">
                  {user.providerProfile?._count?.services ?? 0}
                </span>
              </div>
              <div>
                <h3 className="text-title-md font-bold text-neutral-primary">
                  الخدمات المسجلة
                </h3>
                <p className="mt-0.5 text-body-sm text-neutral-muted">
                  الأسعار، المدد، وطريقة تقديم الخدمة
                </p>
              </div>
              <Link
                href="/dashboard/services"
                className="mt-2 inline-flex items-center gap-1.5 text-body-sm font-semibold text-primary hover:underline"
              >
                <span>إدارة الخدمات</span>
                <ArrowUpRight className="size-3.5" />
              </Link>
            </Card>

            {/* Availability Card */}
            <Card className="gap-3 rounded-[16px] border border-border-subtle bg-surface p-5 shadow-level1">
              <div className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-[10px] bg-[#FEF6E7] text-accent-gold">
                  <Clock className="size-5" />
                </span>
                <span className="text-body-sm font-semibold text-neutral-muted">
                  {user.providerProfile?.bufferMinutes ?? 15} دقيقة راحة
                </span>
              </div>
              <div>
                <h3 className="text-title-md font-bold text-neutral-primary">
                  المواعيد والإجازات
                </h3>
                <p className="mt-0.5 text-body-sm text-neutral-muted">
                  ساعات العمل اليومية وأيام الراحة
                </p>
              </div>
              <Link
                href="/dashboard/availability"
                className="mt-2 inline-flex items-center gap-1.5 text-body-sm font-semibold text-primary hover:underline"
              >
                <span>تعديل ساعات العمل</span>
                <ArrowUpRight className="size-3.5" />
              </Link>
            </Card>

            {/* Bookings Card */}
            <Card className="gap-3 rounded-[16px] border border-border-subtle bg-surface p-5 shadow-level1">
              <div className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-[10px] bg-status-success/15 text-status-success">
                  <CalendarDays className="size-5" />
                </span>
                <span className="text-display-lg-mobile font-bold text-neutral-primary tabular-nums">
                  {user.providerProfile?._count?.bookings ?? 0}
                </span>
              </div>
              <div>
                <h3 className="text-title-md font-bold text-neutral-primary">
                  إجمالي الحجوزات
                </h3>
                <p className="mt-0.5 text-body-sm text-neutral-muted">
                  متابعة وتأكيد مواعيد العملاء والعربون
                </p>
              </div>
              <Link
                href="/dashboard/bookings"
                className="mt-2 inline-flex items-center gap-1.5 text-body-sm font-semibold text-primary hover:underline"
              >
                <span>عرض جدول الحجوزات</span>
                <ArrowUpRight className="size-3.5" />
              </Link>
            </Card>
          </div>

          {/* Quick Settings Overview Card */}
          <Card className="rounded-[16px] border border-border-subtle bg-surface p-6 shadow-level1">
            <h3 className="text-title-lg font-bold text-neutral-primary mb-4">
              سياسات العربون والحجز الحالية
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[12px] border border-border-subtle bg-canvas p-4">
                <div className="text-body-sm text-neutral-muted">نوع العربون</div>
                <div className="mt-1 text-body-lg font-bold text-neutral-primary">
                  {user.providerProfile?.depositType === "NONE"
                    ? "بدون عربون (حجز فوري)"
                    : user.providerProfile?.depositType === "FULL"
                    ? "كامل المبلغ مقدماً"
                    : `${user.providerProfile?.depositAmount || 0} ج.م (عربون ثابت)`}
                </div>
              </div>

              <div className="rounded-[12px] border border-border-subtle bg-canvas p-4">
                <div className="text-body-sm text-neutral-muted">
                  الراحة بين المواعيد (Buffer)
                </div>
                <div className="mt-1 text-body-lg font-bold text-neutral-primary tabular-nums">
                  {user.providerProfile?.bufferMinutes || 0} دقيقة
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end">
              <Link
                href="/dashboard/availability"
                className="inline-flex items-center gap-1.5 text-body-sm font-semibold text-primary hover:underline"
              >
                <span>تعديل سياسة العربون والراحة</span>
                <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 5: Recent Bookings (Clients Only) */}
      {user.role === "CLIENT" && activeTab === "bookings" && (
        <Card className="rounded-[16px] border border-border-subtle bg-surface p-6 shadow-level1 sm:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border-subtle pb-4 mb-6">
            <div>
              <h2 className="text-title-lg font-bold text-neutral-primary">
                حجوزاتي الأخيرة
              </h2>
              <p className="mt-1 text-body-sm text-neutral-muted">
                المواعيد التي قمت بحجزها مع مختلف مقدمي الخدمات
              </p>
            </div>
            <Link
              href="/book"
              className="inline-flex items-center gap-1.5 rounded-[10px] bg-primary px-4 py-2 text-label-md font-semibold text-white shadow-level1 hover:bg-primary-dark transition-all"
            >
              <span>حجز موعد جديد</span>
              <Compass className="size-4" />
            </Link>
          </div>

          {!user.bookings || user.bookings.length === 0 ? (
            <div className="py-14 text-center">
              <CalendarDays className="mx-auto size-12 text-neutral-300 mb-3" />
              <h3 className="text-title-md font-bold text-neutral-primary">
                لا توجد حجوزات مسجلة حتى الآن
              </h3>
              <p className="mt-1 text-body-sm text-neutral-muted">
                يمكنك حجز موعدك الأول واستعراض مقدمي الخدمات المتاحين بكل سهولة
              </p>
              <Link
                href="/book"
                className="mt-4 inline-flex items-center gap-2 rounded-[10px] border border-border-subtle px-4 py-2 text-body-md font-semibold text-primary hover:bg-canvas transition-all"
              >
                <span>استكشاف مقدمي الخدمات</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {user.bookings.map((booking) => {
                const startsDate = new Date(booking.startsAt);
                const isConfirmed = booking.status === "CONFIRMED";
                const isHeld = booking.status === "HELD";
                const isCompleted = booking.status === "COMPLETED";
                const isCancelled = booking.status === "CANCELLED";

                return (
                  <div
                    key={booking.id}
                    className="flex flex-col gap-3 rounded-[14px] border border-border-subtle bg-canvas p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-body-lg font-bold text-neutral-primary">
                          {booking.service.name}
                        </span>
                        {/* Status Badge */}
                        {isConfirmed && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-status-success/15 px-2.5 py-0.5 text-[11px] font-semibold text-status-success">
                            <CheckCircle2 className="size-3" />
                            مؤكد
                          </span>
                        )}
                        {isHeld && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-status-warning/15 px-2.5 py-0.5 text-[11px] font-semibold text-status-warning">
                            <Clock className="size-3" />
                            قيد سداد العربون
                          </span>
                        )}
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                            مكتمل
                          </span>
                        )}
                        {isCancelled && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-status-error/15 px-2.5 py-0.5 text-[11px] font-semibold text-status-error">
                            ملغي
                          </span>
                        )}
                      </div>

                      <p className="text-body-sm text-neutral-muted">
                        مع مقدم الخدمة:{" "}
                        <span className="font-semibold text-neutral-primary">
                          {booking.provider.user.name || booking.provider.slug}
                        </span>
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-body-sm text-neutral-muted tabular-nums">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3.5 text-primary" />
                          <span>
                            {startsDate.toLocaleDateString("ar-EG", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3.5 text-primary" />
                          <span>
                            {startsDate.toLocaleTimeString("ar-EG", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </span>
                        <span>السعر: {booking.service.price} ج.م</span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <Link
                        href={`/${booking.provider.slug}`}
                        className="inline-flex items-center gap-1 rounded-[8px] border border-border-subtle bg-surface px-3 py-1.5 text-body-sm font-semibold text-neutral-primary hover:border-primary hover:text-primary transition-all"
                      >
                        <span>صفحة الحجز</span>
                        <ExternalLink className="size-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
