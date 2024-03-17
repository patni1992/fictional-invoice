import { ObjectId } from "mongodb";
import { Parcel } from "../models/parcel";
import {
  calculateBaseRate,
  calculateWeightSurcharge,
  calculateSizeSurcharge,
  calculateDistanceSurcharge,
  calculateAdditionalServices,
  calculateTimingAdjustments,
  applyVolumeDiscount,
  calculateTotalInvoice,
} from "./invoice";

describe("Invoice Module", () => {
  test("calculateBaseRate returns correct base rate for service types", () => {
    expect(calculateBaseRate("Express")).toBe(15);
    expect(calculateBaseRate("Ground")).toBe(5);
    expect(calculateBaseRate("International")).toBe(25);
    expect(calculateBaseRate("Unknown")).toBe(0);
  });

  test("calculateWeightSurcharge applies correct surcharge based on weight", () => {
    expect(calculateWeightSurcharge(0.5)).toBe(0);
    expect(calculateWeightSurcharge(3)).toBe(2);
    expect(calculateWeightSurcharge(10)).toBe(5);
  });

  test("calculateSizeSurcharge applies correct surcharge based on dimensions", () => {
    expect(calculateSizeSurcharge({ length: 40, width: 30, height: 10 })).toBe(
      3
    );
    expect(calculateSizeSurcharge({ length: 60, width: 40, height: 30 })).toBe(
      7
    );
    expect(calculateSizeSurcharge({ length: 20, width: 20, height: 10 })).toBe(
      0
    );
  });

  test("calculateDistanceSurcharge applies correct surcharge based on distance", () => {
    expect(calculateDistanceSurcharge(50)).toBe(0);
    expect(calculateDistanceSurcharge(150)).toBe(10);
    expect(calculateDistanceSurcharge(600)).toBe(20);
  });

  test("calculateAdditionalServices calculates correct fees for insurance and signature confirmation", () => {
    expect(calculateAdditionalServices(true, true)).toBe(12);
    expect(calculateAdditionalServices(true, false)).toBe(10);
    expect(calculateAdditionalServices(false, true)).toBe(2);
    expect(calculateAdditionalServices(false, false)).toBe(0);
  });

  test("calculateTimingAdjustments calculates correct adjustments based on delivery dates", () => {
    const expectedDelivery = "2024-03-15T00:00:00Z";
    // Delivered on time
    expect(
      calculateTimingAdjustments("2024-03-15T00:00:00Z", expectedDelivery)
    ).toBe(0);
    // Delivered 1 day late
    expect(
      calculateTimingAdjustments("2024-03-16T00:00:00Z", expectedDelivery)
    ).toBe(-0.02);
  });

  test("applyVolumeDiscount applies correct discount based on the number of parcels", () => {
    // No discount for less than 50 parcels
    expect(applyVolumeDiscount(100, 25)).toBe(100);
    // 5% discount for more than 50 parcels
    expect(applyVolumeDiscount(100, 60)).toBe(95);
    // 10% discount for more than 100 parcels
    expect(applyVolumeDiscount(100, 150)).toBe(90);
    // 15% discount for more than 200 parcels
    expect(applyVolumeDiscount(100, 250)).toBe(85);
  });

  describe("calculateTotalInvoice", () => {
    const parcels: Parcel[] = [
      {
        _id: "65f453c8d9f14d7cb9ce8c1f",
        trackingNumber: "DHL12345678",
        sender: {
          name: "John Doe",
          address: {
            street: "123 Main St",
            city: "Anytown",
            state: "CA",
            zipCode: "12345",
            country: "USA",
          },
        },
        recipient: {
          name: "Jane Smith",
          address: {
            street: "456 Elm St",
            city: "Othertown",
            state: "NY",
            zipCode: "54321",
            country: "USA",
          },
        },
        weight: { value: 2, units: "kg" },
        dimensions: { length: 30, width: 20, height: 10, units: "cm" },
        status: {
          current: "Shipped",
          history: [],
        },
        expectedDelivery: "2024-03-20T00:00:00Z",
        carrier: new ObjectId("65f44a8fd9f14d7cb9ce8c18"),
        serviceType: "Express",
        createdAt: new Date("2024-03-15T08:00:00Z"),
        updatedAt: new Date("2024-03-16T09:00:00Z"),
        distance: 250,
        insurance: true,
        signatureConfirmation: false,
        actualDeliveryDate: new Date("2024-03-19T00:00:00Z"),
      },
    ];

    test("calculates total invoice correctly", () => {
      const result = calculateTotalInvoice(parcels);
      expect(result.total).toBeGreaterThan(0);
      expect(result.detailedInvoices.length).toEqual(parcels.length);
    });
  });
});
