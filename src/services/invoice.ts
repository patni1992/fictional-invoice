import { Parcel } from "../models/parcel";

export interface DetailedInvoice {
  parcelId: string;
  baseRate: number;
  weightSurcharge: number;
  sizeSurcharge: number;
  distanceSurcharge: number;
  additionalServices: number;
  timingAdjustment: number;
  total: number;
}

export function calculateBaseRate(serviceType: Parcel["serviceType"]): number {
  switch (serviceType) {
    case "Express":
      return 15;
    case "Ground":
      return 5;
    case "International":
      return 25;
    default:
      return 0;
  }
}

export function calculateWeightSurcharge(weight: number): number {
  if (weight > 5) return 5;
  if (weight > 1) return 2;
  return 0;
}

export function calculateSizeSurcharge({
  length,
  width,
  height,
}: {
  length: number;
  width: number;
  height: number;
}): number {
  const totalDimensions = length + width + height;
  if (totalDimensions > 120) return 7;
  if (totalDimensions > 60) return 3;
  return 0;
}

export function calculateDistanceSurcharge(distance: number): number {
  if (distance > 500) return 20;
  if (distance > 100) return 10;
  return 0;
}

export function calculateAdditionalServices(
  insurance: boolean,
  signatureConfirmation: boolean
): number {
  return (insurance ? 10 : 0) + (signatureConfirmation ? 2 : 0);
}

export function calculateTimingAdjustments(
  actualDeliveryDate: string | Date | undefined,
  expectedDeliveryDate: string | Date | undefined
): number {
  if (!actualDeliveryDate || !expectedDeliveryDate) return 0;
  const actual = new Date(actualDeliveryDate).getTime();
  const expected = new Date(expectedDeliveryDate).getTime();
  const daysLate = (actual - expected) / (1000 * 60 * 60 * 24);

  if (daysLate > 0) {
    return -Math.min(daysLate * 0.02, 0.1);
  }

  return 0;
}

export function applyVolumeDiscount(
  total: number,
  parcelCount: number
): number {
  if (parcelCount > 200) return total * 0.85;
  if (parcelCount > 100) return total * 0.9;
  if (parcelCount > 50) return total * 0.95;
  return total;
}

export function calculateTotalInvoice(parcels: Parcel[]): {
  detailedInvoices: DetailedInvoice[];
  total: number;
} {
  let detailedInvoices: DetailedInvoice[] = [];
  let grandTotal = 0;

  parcels.forEach((parcel) => {
    const baseRate = calculateBaseRate(parcel.serviceType);
    const weightSurcharge = calculateWeightSurcharge(parcel.weight.value);
    const sizeSurcharge = calculateSizeSurcharge(parcel.dimensions);
    const distanceSurcharge = calculateDistanceSurcharge(parcel.distance ?? 0);
    const additionalServices = calculateAdditionalServices(
      parcel.insurance,
      parcel.signatureConfirmation
    );
    const timingAdjustment = calculateTimingAdjustments(
      parcel.actualDeliveryDate,
      parcel.expectedDeliveryDate
    );

    let parcelInvoiceTotal =
      baseRate +
      weightSurcharge +
      sizeSurcharge +
      distanceSurcharge +
      additionalServices;
    parcelInvoiceTotal += parcelInvoiceTotal * timingAdjustment;

    grandTotal += parcelInvoiceTotal;

    detailedInvoices.push({
      parcelId: parcel._id.toString(),
      baseRate,
      weightSurcharge,
      sizeSurcharge,
      distanceSurcharge,
      additionalServices,
      timingAdjustment,
      total: parcelInvoiceTotal,
    });
  });

  const totalInvoiceWithDiscount = applyVolumeDiscount(
    grandTotal,
    parcels.length
  );

  return {
    detailedInvoices,
    total: totalInvoiceWithDiscount,
  };
}
