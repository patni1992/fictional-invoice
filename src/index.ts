import Koa from 'koa';
import koaBody from 'koa-body';
import views from 'koa-views';
import router from './routes';
import dotenv from 'dotenv';

dotenv.config();

const app = new Koa();

app.use(koaBody());

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}));

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
