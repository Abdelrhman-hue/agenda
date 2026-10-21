"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { outlineBtn } from "@/components/ui/form-field";

export function CopyLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center" dir="rtl">
      <code
        dir="ltr"
        className="flex-1 truncate rounded-[10px] border border-border-subtle bg-[#F4F8F6] px-3.5 py-2.5 text-left text-body-md text-neutral-primary"
      >
        {url}
      </code>
      <Button type="button" variant="outline" onClick={copy} className={`${outlineBtn} px-5`}>
        {copied ? <Check className="size-4 text-status-success" /> : <Copy className="size-4" />}
        <span>{copied ? "تم النسخ" : "نسخ الرابط"}</span>
      </Button>
    </div>
  );
}
