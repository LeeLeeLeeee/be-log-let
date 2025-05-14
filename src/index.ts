// index.ts
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import dotenv from 'dotenv';

dotenv.config();

const app = new Koa();
const router = new Router();

// 전역 미들웨어: 요청 바디 파싱
app.use(bodyParser());

// 로깅 미들웨어
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// 라우터 정의
router
    .get('/', async (ctx) => {
        ctx.body = { message: 'Hello, Koa with TypeScript!!' };
    })
    .get('/users/:id', async (ctx) => {
        const id = ctx.params.id;
        ctx.body = { userId: id, name: `User ${id}` };
    })
    .post('/users', async (ctx) => {
        const { name }: { name: string } = ctx.request.body as { name: string };
        // 실제 서비스라면 DB에 저장하는 로직이 들어갑니다.
        ctx.status = 201;
        ctx.body = { userId: Date.now().toString(), name };
    });

// 라우터를 애플리케이션에 등록
app.use(router.routes()).use(router.allowedMethods());

// 서버 기동
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
app.listen(PORT, () => {
    console.log(`Koa (TypeScript) 서버가 포트 ${PORT}에서 실행 중`);
});
