import Router from "koa-router";
import { Context } from "koa";
import { getCarriers } from "./models/carrier";

const router = new Router();

router.get("/", async (ctx: Context) => {
  const carriers = await getCarriers();
  await ctx.render("index", {
    title: "Generate Invoice",
    carriers: carriers,
  });
});

export default router;
