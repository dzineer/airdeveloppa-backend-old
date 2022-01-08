/*
const Koa = require('koa');
const compose = require('koa-compose');
var bodyParser = require('koa-body');

*/

// Web server parameters
const express = require('express')
const app = express()
const port = 3000

// for envirobment
const process = require("process");
// for uuid
const { v4: uuidv4 } = require('uuid');

// create PG Client
/*
const { Client } = require('pg');
const client = new Client({
      host: process.env.DBHOST || '10.254.1.6',
      port: process.env.DBPORT || 5432,
      user: process.env.DBUSER || 'pgadmin',
      password: process.env.DBPASS || 'secretaccess',
})

const app = new Koa();
*/

// express body parser
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// result set
var results = {
  "meta": {"status": 400, "msg": "Not implemented"}
};
app.use(function (req, res, next) {
  // reset results
  results.meta.status = 400;
  results.meta.msg = "Bad request";
  results.meta.timestamp = new Date().getTime();
  results.result = undefined;
  results.meta.debug = undefined;
  next()
});

//  Default endpoint
app.get('/', (req, res) => {
  results.meta.status = 200;
  results.meta.msg = "Success";
  res.send(JSON.stringify(results));
});

app.post('/', (req, res) => {
  results.meta.status = 400;
  results.meta.msg = "Bad request";
  results.meta.debug = {
    "body": req.body
  };
  res.send(JSON.stringify(results));
});

// Begin actual API (express)
// verify
app.get('/1/verify', (req, res) => {
  results.meta.status = 400;
  results.meta.msg = "Bad request";
  res.send(JSON.stringify(results));
});
app.post('/1/verify', (req, res) => {
  results.meta.status = 400;
  results.meta.msg = "Bad request";
  var verify_status = false;
  if (req.body["id"] !== undefined) {
    // Check for ID
    if (req.body.fakeVerify !== undefined) {
      verify_status = req.body.fakeVerify.toLowerCase();
      results.meta.status = 200;
      results.meta.msg = "Verify status";
      results.meta.timestamp = new Date().getTime();
      results.meta.debug = undefined;
      results.result = {
        verified: verify_status
      };
      res.send(JSON.stringify(results));
    } else {
      results.meta.status = 200;
      results.meta.msg = "Verify status";
      results.meta.timestamp = new Date().getTime();
      results.meta.debug = undefined;
      results.result = {
        verified: verify_status
      };
      res.send(JSON.stringify(results));
    }
  } else {
    results.meta.status = 400;
    results.meta.msg = "missing 'id' parameter";
    res.send(JSON.stringify(results));
  } // end check for ID
});

// list endpoint
app.get('/1/list', (req, res) => {
  results.meta.status = 400;
  results.meta.msg = "";
  console.log(req.query.length);
  if (req.query !== undefined) {
    if (req.query["lat"] !== undefined && req.query["lng"] !== undefined) {
      // stubbed places
      var places = [
        {
            device_id: uuidv4(),
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
      ];
      results.meta.status = 200;
      results.meta.msg = "Processed successfully";
      results.result = places;
      res.send(JSON.stringify(results));
    } else {
      results.meta.status = 400;
      results.meta.msg = "Require 'lat' and 'lng' parameter";
      res.send(JSON.stringify(results));
    }
  } else {
    results.meta.status = 400;
    results.meta.msg = "Require 'lat' and 'lng' parameter";
    res.send(JSON.stringify(results));
  }
});
// End API (express)

// Start express
app.listen(port, () => {
  console.log(`Developpa app listening at http://localhost:${port}`)
})
