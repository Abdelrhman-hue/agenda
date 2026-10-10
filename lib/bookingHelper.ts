import { prisma } from "@/lib/prisma";
import { DepositType, BookingStatus } from "@/generated/prisma/enums";

/**
 * Automatically update expired HELD bookings to EXPIRED
 */
export async function expireOverdueHeldBookings(providerId?: string) {
  try {
    const now = new Date();
    await prisma.booking.updateMany({
      where: {
        status: BookingStatus.HELD,
        holdExpiresAt: {
          lt: now,
        },
        ...(providerId ? { providerId } : {}),
      },
      data: {
        status: BookingStatus.EXPIRED,
      },
    });
  } catch (error) {
    console.error("Error expiring overdue bookings:", error);
  }
}

/**
 * Resolve provider profile by providerId, slug, or businessId
 */
export async function resolveProviderProfile(identifier: {
  providerId?: string;
  slug?: string;
  businessId?: string;
}) {
  const { providerId, slug, businessId } = identifier;
  const target = providerId || businessId || slug;
  if (!target) return null;

  return await prisma.providerProfile.findFirst({
    where: {
      OR: [
        { id: target },
        { slug: target },
        { userId: target },
      ],
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      services: {
        where: { isActive: true },
      },
      workingHours: true,
    },
  });
}

/**
 * Calculate deposit amount based on provider deposit settings and service price
 */
export function calculateDeposit({
  depositType,
  depositAmount,
  servicePrice,
}: {
  depositType: DepositType;
  depositAmount: number;
  servicePrice: number;
}) {
  let requiredDeposit = 0;

  switch (depositType) {
    case DepositType.NONE:
      requiredDeposit = 0;
      break;
    case DepositType.FULL:
      requiredDeposit = servicePrice;
      break;
    case DepositType.FIXED:
    default:
      // Fixed deposit amount, capped at the service price
      requiredDeposit = Math.min(Math.max(depositAmount, 0), servicePrice);
      break;
  }

  const remainingAmount = Math.max(servicePrice - requiredDeposit, 0);

  return {
    servicePrice,
    depositType,
    depositAmount: requiredDeposit,
    remainingAmount,
    currency: "EGP",
  };
}
