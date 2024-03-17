import Router from "koa-router";
import { Context } from "koa";
import { getCarriers } from "./models/carrier";
import { getParcelsByCarrierAndDateRange } from "./models/parcel";
import { calculateTotalInvoice } from "./services/invoice";
import { generateInvoicePdf } from "./services/invoicePdf";

const router = new Router();

router.get("/", async (ctx: Context) => {
  const carriers = await getCarriers();
  await ctx.render("index", {
    title: "Generate Invoice",
    carriers: carriers,
  });
});

router.post("/invoice", async (ctx: Context) => {
  try {
    const { carrier, toDate, fromDate } = ctx.request.body;
    const parcels = await getParcelsByCarrierAndDateRange(
      carrier,
      new Date(toDate),
      new Date(fromDate)
    );
    const { detailedInvoices, total } = calculateTotalInvoice(parcels);
    const pdfStream = generateInvoicePdf(detailedInvoices, total);

    ctx.response.set("Content-Type", "application/pdf");
    ctx.response.set("Content-Disposition", 'inline; filename="invoice.pdf"');
    ctx.body = pdfStream;
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
});

export default router;
