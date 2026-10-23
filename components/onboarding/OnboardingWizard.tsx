"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/form-field";
import { api } from "@/lib/client-api";
import type { Category } from "@/lib/constants";
import {
  ServicesManager,
  type ServiceItem,
} from "@/components/provider/ServicesManager";
import { SettingsCards } from "@/components/provider/SettingsCards";
import { WorkingHoursEditor } from "@/components/provider/WorkingHoursEditor";
import { SectorStep } from "./SectorStep";
import { SlugStep } from "./SlugStep";
import { Stepper, StepperNav } from "./Stepper";

const STEPS = ["القطاع", "رابط الحجز", "الخدمات", "ساعات العمل والعربون"];

export type WizardInitial = {
  step: number;
  category: Category | null;
  bio: string;
  slug: string | null;
  suggestedSlug: string;
  activeServices: number;
};

export function OnboardingWizard({ initial }: { initial: WizardInitial }) {
  const router = useRouter();
  const [step, setStep] = useState(initial.step);
  const [category, setCategory] = useState<Category | null>(initial.category);
  const [bio, setBio] = useState(initial.bio);
  const [slug, setSlug] = useState<string | null>(initial.slug);
  const [activeServices, setActiveServices] = useState(initial.activeServices);
  const [finishing, setFinishing] = useState(false);
  const [missing, setMissing] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const back = () => setStep((s) => Math.max(0, s - 1));
  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));

  const onServices = (services: ServiceItem[]) =>
    setActiveServices(services.filter((s) => s.isActive).length);

  const finish = async () => {
    setError(null);
    setMissing([]);
    setFinishing(true);
    const res = await api<{ missing?: string[] }>(
      "/api/provider/onboarding/complete",
      { method: "POST" },
    );
    if (!res.ok) {
      setFinishing(false);
      setError(res.message);
      setMissing(res.data?.missing ?? []);
      return;
    }
    router.push("/dashboard?welcome=1");
    router.refresh();
  };
  const clearFinishError = () => {
    setError(null);
    setMissing([]);
  };
  return (
    <main
      className="min-h-screen w-full bg-canvas px-4 py-8 sm:px-6 lg:px-8"
      dir="rtl"
    >
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div>
          <h1 className="text-headline-lg font-bold text-neutral-primary">
            جهّز نشاطك في دقايق
          </h1>
          <p className="mt-1 text-body-md text-neutral-muted">
            كل خطوة بتتحفظ لوحدها، وتقدر تكمل في أي وقت من حيث وقفت.
          </p>
        </div>

        <Stepper steps={STEPS} current={step} />

        <Card className="gap-6 rounded-[16px] border border-border-subtle bg-surface p-5 shadow-level1 sm:p-7">
          {step === 0 && (
            <SectorStep
              initialCategory={category}
              initialBio={bio}
              onSaved={(c, b) => {
                setCategory(c);
                setBio(b);
                next();
              }}
            />
          )}

          {step === 1 && (
            <>
              <SlugStep
                initialSlug={slug}
                suggestedSlug={initial.suggestedSlug}
                onSaved={(s) => {
                  setSlug(s);
                  next();
                }}
              />
              <StepperNav onBack={back} hideNext />
            </>
          )}

          {step === 2 && category && (
            <>
              <ServicesManager category={category} onChange={onServices} />
              <StepperNav
                onBack={back}
                onNext={next}
                nextDisabled={activeServices === 0}
                nextLabel={
                  activeServices === 0 ? "أضف خدمة للمتابعة" : "التالي"
                }
              />
            </>
          )}

          {step === 3 && (
            <>
              <WorkingHoursEditor
                saveLabel="حفظ ساعات العمل"
                onSaved={clearFinishError}
              />
              <div className="border-t border-border-subtle pt-6">
                <SettingsCards onSaved={clearFinishError} />
              </div>

              {error && (
                <Alert type="error">
                  <p>{error}</p>
                  {missing.length > 0 && (
                    <ul className="mt-1 list-disc pr-5">
                      {missing.map((m) => (
                        <li key={m}>{m}</li>
                      ))}
                    </ul>
                  )}
                </Alert>
              )}

              <StepperNav
                onBack={back}
                onNext={finish}
                nextLabel="إنهاء الإعداد"
                loading={finishing}
              />
            </>
          )}
        </Card>
      </div>
    </main>
  );
}
