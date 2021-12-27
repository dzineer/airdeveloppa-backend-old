const Koa = require('koa');
const compose = require('koa-compose');
const process = require("process");

const { Client } = require('pg');
var bodyParser = require('koa-body');

// create PG Client
const client = new Client({
      host: process.env.DBHOST || '10.254.1.6',
      port: process.env.DBPORT || 5432,
      user: process.env.DBUSER || 'pgadmin',
      password: process.env.DBPASS || 'secretaccess',
})

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
    } else if ('/dbconnect' == ctx.path) {
        if ('GET' == ctx.request.method) {
            client.connect(err => {
                if (err) {
                    ctx.body('connection error: ' + err.stack);
                } else {
                    // if all good
                    ctx.body('connected to database');
                }
            });
        } else {
            ctx.body('Method not supported');
        }
    } else {
        await next();
    }
}

// Recompile all routes
app.use(compose([base]));
app.listen(3000);
