import { ObjectId } from "mongodb";
import { connectToDB } from "../db";

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface Weight {
  value: number;
  units: string;
}

interface Dimensions {
  length: number;
  width: number;
  height: number;
  units: string;
}

type ParcelStatus =
  | "Shipped"
  | "In Transit"
  | "Delivered"
  | "Pending"
  | "Cancelled";

interface StatusHistory {
  date: Date;
  location: string;
  city: string;
  state: string;
  status: ParcelStatus;
}

interface Status {
  current: ParcelStatus;
  history: StatusHistory[];
}

export interface Parcel {
  _id: ObjectId | string;
  trackingNumber: string;
  sender: {
    name: string;
    address: Address;
  };
  recipient: {
    name: string;
    address: Address;
  };
  weight: Weight;
  dimensions: Dimensions;
  status: Status;
  expectedDelivery: string;
  actualDeliveryDate?: Date;
  expectedDeliveryDate?: Date;
  carrier: ObjectId;
  serviceType: "Express" | "Ground" | "International" | "Unknown";
  distance?: number;
  insurance: boolean;
  signatureConfirmation: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export async function getParcelsByCarrierAndDateRange(
  carrierId: string,
  toDate: Date,
  fromDate: Date
): Promise<Parcel[]> {
  const db = await connectToDB();
  const collection = db.collection<Parcel>("parcels");
  const query = {
    carrier: new ObjectId(carrierId),
    createdAt: {
      $gte: fromDate,
      $lte: toDate,
    },
  };

  return collection.find(query).toArray();
}
