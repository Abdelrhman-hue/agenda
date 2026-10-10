import { BookingStatus, PaymentMethod, PaymentStatus, DepositType } from "@/generated/prisma/enums";

export interface IBookingPricingSummary {
  servicePrice: number;
  depositType: DepositType;
  depositAmount: number;
  remainingAmount: number;
  currency: string;
}

export interface IAvailabilitySlot {
  time: string; // "09:00"
  endTime: string; // "09:30"
  startsAt: string; // ISO
  endsAt: string; // ISO
  isAvailable: boolean;
  status: "AVAILABLE" | "BOOKED" | "HELD" | "PAST";
}

export interface IProviderAvailabilityResponse {
  providerId: string;
  providerName: string;
  slug: string;
  date: string;
  dayOfWeek: number;
  isWorkingDay: boolean;
  isAbsent: boolean;
  absenceReason?: string | null;
  workingHours?: {
    startTime: string;
    endTime: string;
  } | null;
  slotDurationMinutes: number;
  bufferMinutes: number;
  totalSlots: number;
  availableSlotsCount: number;
  slots: IAvailabilitySlot[];
}

export interface IBookingResponseItem {
  id: string;
  providerId: string;
  serviceId: string;
  clientId: string;
  startsAt: string;
  endsAt: string;
  status: BookingStatus;
  holdExpiresAt: string | null;
  address: string | null;
  clientNotes: string | null;
  cancellationReason: string | null;
  createdAt: string;
  client: {
    id: string;
    name: string | null;
    phone: string | null;
    email: string | null;
  };
  service: {
    id: string;
    name: string;
    price: number;
    durationMinutes: number;
    requiresAddress: boolean;
  };
  provider: {
    id: string;
    slug: string;
    category: string;
    depositType: DepositType;
    depositAmount: number;
    user: {
      name: string | null;
      phone: string | null;
    };
  };
  payment: {
    id: string;
    amount: number;
    method: PaymentMethod;
    status: PaymentStatus;
  } | null;
}
