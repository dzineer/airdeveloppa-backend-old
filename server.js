const Koa = require('koa');
const compose = require('koa-compose');

const app = new Koa();

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

async function base(ctx, next) {
    if ('/' == ctx.path) {
        ctx.body = 'Hello World';
    } else {
        await next();
    }
}

// Recompile all routes
app.use(compose([base]));
app.listen(3000);
