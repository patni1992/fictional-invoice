import { DetailedInvoice } from "./invoice";

import PDFDocument from "pdfkit";
import { PassThrough } from "stream";

export function generateInvoicePdf(
  invoiceDetails: DetailedInvoice[],
  totalInvoice: number
): PassThrough {
  const doc = new PDFDocument();
  const stream = new PassThrough();

  doc.pipe(stream);

  doc.fontSize(20).text("Invoice Summary", { underline: true });
  doc.fontSize(12).moveDown().text(`Total Invoice Amount: $${totalInvoice.toFixed(2)}`);
  doc.moveDown().fontSize(14).text("Details:", { underline: true });

  invoiceDetails.forEach((detail, index) => {
    doc.fontSize(10).moveDown().text(`Parcel ${index + 1} (${detail.parcelId})`);
    doc.fontSize(10).text(`Base Rate: $${detail.baseRate.toFixed(2)}`);
    doc.text(`Weight Surcharge: $${detail.weightSurcharge.toFixed(2)}`);
    doc.text(`Size Surcharge: $${detail.sizeSurcharge.toFixed(2)}`);
    doc.text(`Distance Surcharge: $${detail.distanceSurcharge.toFixed(2)}`);
    doc.text(`Additional Services: $${detail.additionalServices.toFixed(2)}`);
    doc.text(`Timing Adjustment: $${detail.timingAdjustment.toFixed(2)}`);
    doc.text(`Total: $${detail.total.toFixed(2)}`);
  });

  doc.end();

  return stream;
}
