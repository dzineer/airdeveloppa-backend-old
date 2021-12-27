const Koa = require('koa');
const compose = require('koa-compose');
const process = require("process");

const { Client } = require('pg');
var bodyParser = require('koa-body');

// create PG Client
const client = new Client({
      host: '10.254.1.6',
      port: 5334,
      user: process.env.DBUSER || 'pgadmin',
      password: process.env.DBPASS || 'secretaccess',
})

// connect test
client.connect(err => {
      if (err) {
        console.error('connection error', err.stack)
      } else {
        console.log('connected to database')
      }
});

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
