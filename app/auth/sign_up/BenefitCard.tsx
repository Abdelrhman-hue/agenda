import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface IBenefitCardProps {
   title: string;
   description: string;
   icon: LucideIcon;
   bgIcon: string;
   iconColor: string;
   badgeText: string;
   badgeBg: string;
   badgeTextColor: string;
}

const BenefitCard = ({ title, description, icon: Icon, bgIcon, iconColor, badgeText, badgeBg, badgeTextColor }: IBenefitCardProps) => {
   return (
      <Card className="w-full shadow-level1">
         <CardContent className="flex items-center gap-3 p-4">
            <div className={`flex size-13 shrink-0 items-center justify-center rounded-[10px] ${bgIcon} =${iconColor}`}>
               <Icon className="size-7" />
            </div>
            <div>
               <div className="flex flex-wrap mb-2 items-center gap-2">
                  <h3 className="text-[16px]  font-medium leading-6.5">{title}</h3>
                  <Badge className={`rounded-full border-0 ${badgeBg} text-[12px] font-medium ${badgeTextColor}`}>
                     {badgeText}
                  </Badge>
               </div>
               <p className="text-[12px] leading-5 text-[#6B7272]">{description}</p>
            </div>
         </CardContent>
      </Card>
   )
}

export default BenefitCard