import pdfParse from "pdf-parse";
import { generateInvoicePdf } from "./invoicePdf";
import { Readable } from "stream";
import { nextTick } from "process";

describe("generateInvoicePdf", () => {
  it("should generate a PDF stream with the correct invoice details", async () => {
    const invoiceDetails = [
      {
        parcelId: "123",
        baseRate: 10,
        weightSurcharge: 2,
        sizeSurcharge: 1,
        distanceSurcharge: 5,
        additionalServices: 3,
        timingAdjustment: 0,
        total: 21,
      },
    ];
    const totalInvoice = 21;
    const stream = generateInvoicePdf(invoiceDetails, totalInvoice);

    const buffer = await stream2buffer(stream);
    nextTick(() => {
      console.log("nextTick");
    });

    console.log("Parsing pdf");

    const data = await pdfParse(buffer);

    expect(data.text).toContain(
      `Total Invoice Amount: $${totalInvoice.toFixed(2)}`
    );
    invoiceDetails.forEach((detail, index) => {
      expect(data.text).toContain(`Parcel ${index + 1} (${detail.parcelId})`);
    });
  });
});

async function stream2buffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  return new Promise<Buffer>((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", (err) => reject(err));
  });
}
