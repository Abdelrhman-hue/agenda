import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface IBenefitCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  bgIcon?: string;
  iconColor?: string;
  badgeText: string;
  badgeBg?: string;
  badgeTextColor?: string;
}

export default function BenefitCard({
  title,
  description,
  icon: Icon,
  bgIcon = "bg-primary-light",
  iconColor = "text-primary-dark",
  badgeText,
  badgeBg = "bg-primary-light",
  badgeTextColor = "text-primary-dark",
}: IBenefitCardProps) {
  return (
    <Card className="w-full rounded-[16px] border border-border-subtle bg-surface shadow-level1 transition-all duration-200 hover:shadow-level2">
      <CardContent className="flex items-start gap-3.5 p-4">
        <div className={`flex size-11 shrink-0 items-center justify-center rounded-[10px] ${bgIcon} ${iconColor}`}>
          <Icon className="size-5.5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-body-md font-semibold text-neutral-primary">{title}</h3>
            <Badge className={`rounded-full border-0 ${badgeBg} ${badgeTextColor} text-body-sm font-medium px-2.5 py-0.5`}>
              {badgeText}
            </Badge>
          </div>
          <p className="text-body-sm text-neutral-muted leading-relaxed">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}