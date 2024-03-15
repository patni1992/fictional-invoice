// types/koa.d.ts
import 'koa';

declare module 'koa' {
  interface Context {
    request: {
      body?: any;
    }
  }
}
