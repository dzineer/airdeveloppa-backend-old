const Koa = require('koa');
const compose = require('koa-compose');
var bodyParser = require('koa-body');

const app = new Koa();

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

app.use(bodyParser({
    multipart: true,
    urlencoded: true
}));
async function base(ctx, next) {
    if ('/' == ctx.path) {
        if ('POST' == ctx.request.method) {
            console.log('POST detected');
            console.log("request: " + JSON.stringify(ctx.request.body));
        } else {
            console.log('GET detected')
            console.log("request: " + JSON.stringify(ctx.request.query));
        }
        ctx.body = 'Hello World';
    } else {
        await next();
    }
}

// Recompile all routes
app.use(compose([base]));
app.listen(3000);
