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

// For generating hashes
var crypto = require('crypto');

// MongoDB
const { MongoClient } = require("mongodb");
const username = encodeURIComponent(process.env.DBUSER);
const password = encodeURIComponent(process.env.DBPASS);
const authMechanism = "DEFAULT";
const dburi =
  `mongodb://${username}:${password}@${process.env.DBIP}:${process.env.DBPORT}/?authMechanism=${authMechanism}`;

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
  MongoClient.connect(dburi, (err, client) => {
    if (!err) {
      console.log("Connected to database");
      results.meta.msg = "Connected to database";
      var cursor = client.db(process.env.DBNAME).command({ ping: 1 });
      console.log("Lets try to do stuff")
      console.log(JSON.stringify(cursor));
      client.close(); // close connection      
    } else {
      console.log("Not connected to database");
      results.meta.msg = "Not connected to database";
      results.meta.status = 500;
      results.result = {
        "error": err
      };
      console.log(JSON.stringify(err));
    }
    res.send(JSON.stringify(results));
  })
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
// register
app.get('/1/register', (req, res) => {
  results.meta.msg = "GET method is not supported";
  res.send(JSON.stringify(results));
});
app.post('/1/register', (req, res) => {
  if (req.body["device_id"] !== undefined) {
    // TODO: Database stuff
    // TODO: Check existing registration, otherwise ask for a token too
    results.meta.msg = "Registered";
    results.result = {
      registered: true,
      token: crypto.createHash('sha256').update(crypto.createHash('sha256').update(req.body["device_id"] + "||" + (new Date().getTime()).toString()).digest('hex')).digest('hex')
    };
    res.send(JSON.stringify(results));
  } else {
    results.meta.msg = "required 'device_id' (and 'token' if a device exists)";
    res.send(JSON.stringify(results));
  }
});

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
  if (req.body["id"] !== undefined && req.body["token"]) {
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
    results.meta.msg = "missing 'id' and 'token' parameter";
    res.send(JSON.stringify(results));
  } // end check for ID
});

// Balance endpoint
app.get('/1/balance', (req, res) => {
  if (req.query["token"] !== undefined) {
    results.result = {
      "balance": 0
    };
    results.meta.status = 200;
    results.meta.msg = "Request processed successfully";
    res.send(JSON.stringify(results));
  } else {
    results.meta.status = 400;
    results.meta.msg = "Required parameters 'token'";
    res.send(JSON.stringify(results));
  }
});

// Withdraw endpoint
app.get('/1/withdraw', (req, res) => {
  results.meta.status = 400;
  results.meta.msg = "Bad request";
  res.send(JSON.stringify(results));
});
app.post('/1/withdraw', (req, res) => {
  results.meta.status = 400;
  results.meta.msg = "Requires 'token' and 'invoice'";
  if (req.body["invoice"] !== undefined && req.body["token"] !== undefined) {
    results.meta.status = 200;
    results.meta.msg = "Request processed successfully";
    results.result = {
      "withdraw_status": false,
      "withdraw_msg": "Withdraw failed because this is not implemented"
    };
    res.send(JSON.stringify(results));
  } else {
    res.send(JSON.stringify(results));
  }
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
                    "bounty_total": 100000,
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

app.get('/1/device_push', (req, res) => {
  results.meta.status = 400;
  results.meta.msg = "Must send a POST request";
  console.log("Invalid 'device_push' request. User sent a GET rather than post");
  res.send(JSON.stringify(results));
});

// Begin device push API
app.post('/1/device_push', (req, res) => {
  try {
    if (req.body !== undefined) {
      var device_push_obj = JSON.parse(JSON.stringify(req.body));
      if (device_push_obj["deviceid"] !== undefined && device_push_obj["businessid"] !== undefined && device_push_obj["AQI"] !== undefined) {
        results.meta.status = 200;
        results.meta.msg = "Processed successfully";
        results.result = {
          "deviceid": device_push_obj["deviceid"],
          "businessid": device_push_obj["businessid"],
          "AQI": device_push_obj["AQI"]
        }
        if (device_push_obj["timestamp"] !== undefined) {
          console.log("Timestamp on their end: " + device_push_obj["timestamp"]);
        }
        console.log("Device logged. deviceid=" + device_push_obj["deviceid"] + " business id=" + device_push_obj["businessid"] + " AQI=" + device_push_obj["AQI"]);
        res.json(results);
      } else {
        console.log("Invalid request type");
        console.log("Body: " + JSON.stringify(req.body));
        results.meta.status = 400;
        results.meta.msg = "JSON block requires 'deviceid', 'businessid', and 'AQI' attributes, and header 'application/json' must be specified";
        res.json(results);
      }
    } else {
      results.meta.status = 400;
      results.meta.msg = "Invalid JSON";
      res.send(results);
    }
  } catch (e) {
    console.log("Error trapped");
    console.log(e);
    results.meta.status = 500;
    results.meta.msg = "Invalid request";
    res.send(JSON.stringify(results))
  }
});
// end device push API
// End API (express)

// Start express
app.listen(port, () => {
  console.log(`Developpa app listening at http://localhost:${port}`)
})
