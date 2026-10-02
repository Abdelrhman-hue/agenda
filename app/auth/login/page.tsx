import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import LoginForm from "./LoginForm";
import LoginBenifits from "./LoginBenifits";
import GoogleProvider from "../GoogleProvider";

function login() {
  return (
    <section className="w-full md:p-8 p-4 min-h-screen grid grid-cols-12 bg-canvas" dir="rtl">
      {/* LOGIN FORM */}
      <div className="w-full h-full  border-none p-8 col-span-12 lg:col-span-6 flex flex-col gap-3">

        <div className="flex items-center justify-between">

          <Link className="flex items-center gap-2 text-[#3e4945] text-title-md hover:underline" href={"/"}>
            <ArrowRight />
            العودة للرئيسية
          </Link>

          <Badge className="bg-muted p-2">
            <span className="w-2 h-2 rounded-full bg-primary-dark ml-1"></span>
            <p className="text-label-md text-primary-dark">بوابة الشركاء</p>
          </Badge>

        </div>

        <div className="mt-3">
          <h2 className="text-headline-lg mb-1 text-neutral-primary">اهلاً بك فى اجندة</h2>
          <p className="text-body-md text-neutral-primary">
            سجل دخولك لإدارة مواعيدك, حجوزاتك, وتدفقاتك النقدية
          </p>
        </div>

        <LoginForm />

        {/* Separator */}
        <div className="my-3 flex items-center gap-3">
          <Separator className="flex-1" />

          <span className="text-[12px] text-[#6B7272]">
            أو
          </span>

          <Separator className="flex-1" />
        </div>

        {/* GOOGLE PROVIDER */}
        <GoogleProvider />

      </div>


      {/* LEFT SIDE */}
      <LoginBenifits />

    </section>
  );
}

export default login;
