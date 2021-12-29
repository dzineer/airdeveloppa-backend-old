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
var results;
function base(ctx, next) {
    if ('/' == ctx.path) {
        console.log("default / path detected");
        if ('POST' == ctx.request.method) {
            console.log('POST detected');
            console.log("request: " + JSON.stringify(ctx.request.body));
        } else {
            console.log('GET detected')
            console.log("request: " + JSON.stringify(ctx.request.query));
        }
        ctx.body = 'Hello World';
    } else if ('/1/verify' == ctx.path) {
        if ('POST' == ctx.request.method) {
            var verify_status;
            var verify_message;
            if (ctx.request.body.fakeVerify !== undefined) {
                verify_status = JSON.parse(ctx.request.body.fakeVerify.toLowerCase());
                if (verify_status == false) {
                    verify_message = "Could not verify device";
                }
            } else {
                verify_status = true;
                verify_message = "Verified successfully";
            }
            if (ctx.request.body.device === undefined) {
                verify_status = false;
                verify_message = "Must specify a valid 'device' parameter";
            }
            results = {
                verified: verify_status,
                verify_msg: verify_message,
                meta: {"status": "OK", "msg": "Success", "timestamp": new Date().getTime()}
            };
            ctx.body = JSON.stringify(results);
        } else {
            results = {
                meta: {"status": "Method Not supported", "msg": "Error", "timestamp": new Date().getTime()}
            };
            ctx.body = JSON.stringify(results);
        }
    } else if ('/1/list' == ctx.path) {
        results = {
            result: [
                {
                    device_id: "mostlikely-a-uuid",
                    device_location: "cafe",
                    place: {
                        name: "Yellow Coworking Space",
                        coords: [18.79829143251964, 98.96882473444388],
                        address: "16 2 Nimmanahaeminda Road, Su Thep, Mueang Chiang Mai, Chiang Mai 50200",
                        meta: {
                            "bounty": 5000,
                            "purifiers": 8,
                            "floors": 2,
                            "rating": 1,
                        }
                    },
                    aqi: {
                        now: 9,
                        week: 13,
                        month: 10
                    },
                }
            ],
            meta: {"status": "OK", "msg": "Processed", "timestamp": new Date().getTime()}
        };
        if ('GET' == ctx.request.method) {
            ctx.body = JSON.stringify(results);
        } else {
            results = {
                meta: {"status": "Not supported", "msg": "Error", "timestamp": new Date().getTime()}
            };
            ctx.body = JSON.stringify(results);
        }
    } else {
        console.log("Default path");
        next();
    }
}

// Recompile all routes
app.use(compose([base]));
app.listen(3000);
