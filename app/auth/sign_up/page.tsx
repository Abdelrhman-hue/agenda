// import "@/app/home/globals.css"
import { RegisterForm } from "./RegisterForm";
import Benefits from "./BenefitsSection";

function sign_up() {


  return <div className="px-6 py-3 w-full gap-6 scale-90 bg-canvas grid grid-cols-12 " dir="rtl">
    {/* form for register */}
    <div className="lg:col-span-8 col-span-12    
    overflow-hidden
    rounded-[16px]
    bg-[#FAFBF8]
    shadow-lg
    before:pointer-events-none
    before:absolute
    after:absolute
    before:-left-32
    after:-right-32
    before:-top-32
    after:-bottom-32
    before:size-105
    after:size-90
    relative
    before:rounded-full
    before:bg-[radial-gradient(circle,rgba(221,244,238,0.9)_0%,rgba(221,244,238,0.45)_35%,transparent_70%)]
     justify-center
    after:bg-[radial-gradient(circle,rgba(231,184,75,0.35)_12%,rgba(231,184,75,0.15)_40%,transparent_90%)]
     ">
      <RegisterForm />

    </div>

    {/* benifits section */}
    <div className="col-span-4 hidden lg:block items-center justify-center w-full h-full gap-4">
      <Benefits />
    </div>

  </div>;
}

export default sign_up;
