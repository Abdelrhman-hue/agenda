export type Category =
  | "CLINIC"
  | "TUTOR"
  | "GYM"
  | "CONSULTANT"
  | "BEAUTY"
  | "CRAFTSMAN"
  | "OTHER";

export type ServiceMode = "ONSITE" | "ONLINE" | "HOME_VISIT";

// الواجهة بتعرض الأسبوع من السبت، والترقيم نفس Date.getDay() (0 = الأحد)
export const WEEK_ORDER = [6, 0, 1, 2, 3, 4, 5] as const;

export const DAY_NAMES: Record<number, string> = {
  6: "السبت",
  0: "الأحد",
  1: "الاثنين",
  2: "الثلاثاء",
  3: "الأربعاء",
  4: "الخميس",
  5: "الجمعة",
};

export const SECTORS: { value: Category; label: string; hint: string }[] = [
  { value: "CLINIC", label: "عيادة / طبيب", hint: "كشف، متابعة، استشارة" },
  { value: "TUTOR", label: "مدرس / سنتر", hint: "حصص، مجموعات، دروس" },
  { value: "GYM", label: "جيم / مدرب", hint: "تدريب، حصص، اشتراكات" },
  { value: "CONSULTANT", label: "معالج / استشاري", hint: "جلسات واستشارات" },
  { value: "BEAUTY", label: "صالون / سبا", hint: "قص، عناية، مكياج" },
  { value: "CRAFTSMAN", label: "صنايعي / فني", hint: "صيانة، تركيب، إصلاح" },
  { value: "OTHER", label: "أخرى", hint: "أي نشاط بمواعيد" },
];

export const MODE_LABELS: Record<ServiceMode, string> = {
  ONSITE: "في المكان",
  ONLINE: "أونلاين",
  HOME_VISIT: "زيارة منزلية",
};

// أنواع الجلسة المقترحة حسب القطاع (أول نوع هو الافتراضي)
export const MODES_BY_CATEGORY: Record<Category, ServiceMode[]> = {
  CLINIC: ["ONSITE", "ONLINE"],
  TUTOR: ["ONSITE", "ONLINE"],
  GYM: ["ONSITE"],
  CONSULTANT: ["ONSITE", "ONLINE"],
  BEAUTY: ["ONSITE", "HOME_VISIT"],
  CRAFTSMAN: ["HOME_VISIT", "ONSITE"],
  OTHER: ["ONSITE", "ONLINE", "HOME_VISIT"],
};

export const RESERVED_SLUGS = [
  "auth", "api", "home", "dashboard", "onboarding", "admin", "terms",
  "privacy", "support", "solutions", "book", "bookings", "providers",
  "users", "profile", "services", "login", "signup", "sign-up", "me",
];
