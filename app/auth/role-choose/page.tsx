import { RoleChooseForm } from "@/components/provider/RoleChooseForm";

export default function RoleChoosePage() {
  return (
    <main
      className="flex min-h-screen w-full items-center justify-center bg-canvas px-4 py-8 sm:px-6 lg:px-8"
      dir="rtl"
    >
      <div className="w-full max-w-xl rounded-[16px] border border-border-subtle bg-surface p-6 shadow-level1 sm:p-8">
        <h1 className="text-headline-lg font-bold text-neutral-primary">إيه نوع حسابك؟</h1>
        <p className="mb-6 mt-1 text-body-md text-neutral-muted">
          اختر الطريقة اللي هتستخدم بيها أجندة علشان نجهز لك التجربة المناسبة.
        </p>
        <RoleChooseForm />
      </div>
    </main>
  );
}
