import "@/app/home/globals.css"
import { RegisterForm } from "./RegisterForm";
import Benefits from "./BenefitsSection";

function sign_up() {

  return <div className="px-6 py-4 w-full gap-3 grid grid-cols-12" dir="rtl">
    {/* form for register */}
    <div className="lg:col-span-8 col-span-12 justify-center">
      <RegisterForm />
    </div>

    {/* benifits section */}
    <div className="col-span-4 md:hidden sm:hidden lg:block items-center justify-center w-full h-fullgap-4">
      <Benefits />
    </div>

  </div>;
}

export default sign_up;
