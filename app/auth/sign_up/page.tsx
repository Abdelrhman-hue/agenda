import { RegisterForm } from "./RegisterForm";
import Benefits from "./BenefitsSection";

export default function SignUpPage() {
  return (
    <main className="min-h-screen w-full bg-canvas py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center" dir="rtl">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Container (8 columns on large screens) */}
        <div className="lg:col-span-7 xl:col-span-7 w-full">
          <RegisterForm />
        </div>

        {/* Benefits Sidebar (5 columns on large screens) */}
        <div className="hidden lg:block lg:col-span-5 xl:col-span-5 w-full sticky top-8">
          <Benefits />
        </div>
      </div>
    </main>
  );
}
