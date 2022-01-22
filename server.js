// Web server parameters
const express = require('express')
const app = express()

// for envirobment
const process = require("process");

// define web port
const port = process.env.BACKENDPORT || 3000;

// for uuid
const { v4: uuidv4 } = require('uuid');

// For generating hashes
var crypto = require('crypto');

// MongoDB
const { MongoClient, ObjectID } = require("mongodb");
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
      var dbo = client.db(process.env.DBNAME); // Get DB object
      var myobj = { name: "Test object", timestamp: new Date().getTime().toString() };
      results.result = {
        "to_be_inserted": myobj
      };
      dbo.collection("testcol").insertOne(myobj, (colerr, dbres) => {
        if (!colerr) {
          // no errors
          results.meta.status = 200;
          results.meta.msg = "Success";
          results.result['inserted_identifier'] = dbres.insertedId;
          client.close(); // close connection
          res.send(JSON.stringify(results));
        } else {
          // errors
          results.meta.status = 500;
          results.meta.msg = "Error inserting to database";
          client.close(); // close connection
          res.send(JSON.stringify(results));
        }
      });
    } else {
      console.log("Not connected to database");
      results.meta.msg = "Not connected to database";
      results.meta.status = 500;
      results.result = {
        "error": err
      };
      console.log(JSON.stringify(err));
      res.send(JSON.stringify(results));
    }
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

// deviceinfo
app.get('/1/deviceinfo/:id', (req, res) => {
    MongoClient.connect(dburi, (err, client) => {
      if (!err) {
        results.meta.status = 200;
        results.meta.msg = "Done";
        var dbo = client.db(process.env.DBNAME); // Get DB object
        var device_query_obj = {
          "devices.deviceid": req.params.id
        };
        var device_query_filter = {
          "devices": {
            "$elemMatch": {"deviceid": req.params.id}
          }
        };
        results.result = {
          "idsent": req.params.id,
          "query": device_query_obj
        };
        dbo.collection("business").find(device_query_obj, {projection: device_query_filter}).toArray((devinfoErr, devinfoRes) => {
          if (!devinfoErr) {
            results.result = devinfoRes;
            res.send(JSON.stringify(results));
          } else {
            console.log("query error: " + devinfoErr);
            results.meta.status = 500;
            results.meta.msg = "Database query error";
            res.send(JSON.stringify(results));
          }
        });
      } else {
        results.meta.status = 500;
        results.meta.msg = "Database connection error";
        res.send(JSON.stringify(results));
      }
    });
})

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
      if (device_push_obj["deviceid"] !== undefined && device_push_obj["AQI"] !== undefined) {
        results.meta.status = 200;
        results.meta.msg = "Processed successfully";
        results.result = {
          "deviceid": device_push_obj["deviceid"],
          "AQI": device_push_obj["AQI"]
        }
        if (device_push_obj["timestamp"] !== undefined) {
          console.log("Timestamp on their end: " + device_push_obj["timestamp"]);
        }
        MongoClient.connect(dburi, (err, client) => {
          if (!err) {
            // no error
            // db.business.find({"businessid": "c8be9040-43ca-4e1e-a029-61bccf0fa546", "devices.deviceid": "c65d3c6d-4f05-4054-9929-c6aafe9996be"})
            // db.business.update({"businessid": "c8be9040-43ca-4e1e-a029-61bccf0fa546", "devices.deviceid": "c65d3c6d-4f05-4054-9929-c6aafe9996be"}, {"$set": {"devices.0.AQI": 69}})
            console.log("Device logged. deviceid=" + device_push_obj["deviceid"] + " AQI=" + device_push_obj["AQI"]);
            var dbo = client.db(process.env.DBNAME); // Get DB object
            var myobj = {
              "deviceid": device_push_obj["deviceid"],
              "AQI": parseInt(device_push_obj["AQI"]),
              "timestamp": parseInt(new Date().getTime()),
              "createDate": new Date
            };
            var updatequery = {
              "devices.deviceid": device_push_obj["deviceid"]
            };
            var updatecmd = {
              "$set": {
                "devices.0.AQI": parseInt(device_push_obj["AQI"]),
                "devices.0.updateTS": parseInt(new Date().getTime()),
                "devices.0.updateDate": new Date()
              }
            };
            // Update business collection
            // Don't block the result run asynchronously
            dbo.collection("business").updateOne(updatequery, updatecmd, (updaterr, updateres) => {
              if (!updaterr) {
                // no error
                console.log("Device record in business collection updated (" + JSON.stringify(updateres) + ")");
              } else {
                // error
                console.log("Error updating business collection (" + JSON.stringify(updaterr) + ")");
              }
            })
            results.result = {
              "to_be_inserted": myobj
            };
            // Below wait for the results
            // create index
            console.log("Setting up index");
            dbo.collection("devicelog").createIndex({"createDate": 1}, {"expireAfterSeconds": 86400});
            console.log("Prepare insert");
            dbo.collection("devicelog").insertOne(myobj, (colerr, dbres) => {
              if (!colerr) {
                // inserted
                results.meta.status = 200;
                results.meta.msg = "Success";
                results.result['inserted_identifier'] = dbres.insertedId;
                client.close(); // close connection
              } else {
                // insert error
                results.meta.status = 500;
                results.meta.msg = "Insert error";
                client.close()
              }
              res.json(results);
            });
          } else {
            // err connecting
            results.meta.status = 500;
            results.meta.msg = "Error connecting to database";
            res.json(results);
          }
        });
      } else {
        console.log("Invalid request type");
        console.log("Body: " + JSON.stringify(req.body));
        results.meta.status = 400;
        results.meta.msg = "JSON block requires 'deviceid', and 'AQI' attributes, and header 'application/json' must be specified";
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

// Admin token only
// Device create endpoint
app.get('/1/deviceregister', (req, res) => {
  results.meta.status = 400;
  results.meta.msg = "This endpoint only accepts POST requests";
  res.send(JSON.stringify(results))
});
app.post('/1/deviceregister', (req, res) => {
  if (req.body !== undefined) {
    if (req.body['token'] !== undefined && req.body['businessid'] !== undefined) {
      if (req.body['token'] === process.env.ADMINKEY) {
        if (req.body["businessid"] !== undefined) {
          MongoClient.connect(dburi, (dberr, client) => {
            if (!dberr) {
              var dbo = client.db(process.env.DBNAME); // Get DB object
              var updatequery = {
                "businessid": req.body['businessid']
              };
              var deviceid = uuidv4();
              var deviceobj = {
                "_id": new ObjectID(),
                "deviceid": deviceid,
                "devicelabel": "Unlabeled device",
                "devicelocation": "Unlocated device",
                "devicebounty": 0,
                "createDate": new Date(),
                "updateDate": new Date()

              };
              // optional devicelocation
              if (req.body['devicelocation'] !== undefined) {
                deviceobj['devicelocation'] = req.body['devicelocation'];
              }
              // optional devicelabel
              if (req.body['devicelabel'] !== undefined) {
                deviceobj['devicelabel'] = req.body['devicelabel'];
              }
              // Add verify bounty
              if (req.body['devicebounty'] !== undefined) {
                deviceobj['devicebounty'] = parseInt(req.body['devicebounty']);
              }
              var updateddata = {
                "$addToSet": {
                  "devices": deviceobj
                }
              };
              // do query (add to business)
              dbo.collection("business").update(updatequery, updateddata, (updateerr, updateres) => {
                if (!updateerr) {
                  if (updateres["modifiedCount"] === 0) {
                    results.meta.status = 400;
                    results.meta.msg = "Device not added";
                  } else {
                    // Device added
                    results.meta.status = 200;
                    results.meta.msg = "Added device";
                  }
                  results.result = {
                    "deviceid": deviceid,
                    "addToSet": updateddata,
                    "affectedCount": updateres["modifiedCount"]
                  }
                  client.close(); // close connection
                  res.send(JSON.stringify(results));
                } else {
                  results.meta.status = 500;
                  results.meta.msg = "Error executing query";
                  results.meta.query = {
                    "query": updatequery,
                    "update": updateddata
                  };
                  results.result = {
                    "error": updateerrr
                  };
                  client.close(); // close connection
                  res.send(JSON.stringify(results))
                }
              });
            } else {
              results.meta.status = 500;
              results.meta.msg = "Database connect error";
              client.close(); // close connection
              res.send(JSON.stringify(results))
            }
          });
        } else {
          results.meta.status = 400;
          results.meta.msg = "Requires a 'businessid' to register the device to  (optional: 'devicelocation', 'devicelabel')";
          res.send(JSON.stringify(results))
        }
      } else {
        results.meta.status = 401;
        results.meta.msg = "Authentication failed";
        res.send(JSON.stringify(results))
      }
    } else {
      results.meta.status = 400;
      results.meta.msg = "Invalid request. Require admin 'token', 'businessid' (optional: 'devicelocation', 'devicelabel')";
      res.send(JSON.stringify(results))
    }
  } else {
    results.meta.status = 400;
    results.meta.msg = "Invalid request. Require admin 'token', 'businessid'  (optional: 'devicelocation', 'devicelabel')";
    res.send(JSON.stringify(results))
  }
});

// Business create endpoint
app.get('/1/business', (req, res) => {
  results.meta.status = 400;
  results.meta.msg = "This endpoint only accepts POST requests";
  res.send(JSON.stringify(results))
});
app.post('/1/business', (req, res) => {
    if (req.body !== undefined) {
      if (req.body['token'] !== undefined) {
        if (req.body['token'] === process.env.ADMINKEY) {
          // Admin key match
          if (req.body["businessname"] !== undefined && req.body['lng'] !== undefined && req.body['lat'] !== undefined && req.body["businessaddress"] !== undefined && req.body["businesscity"] !== undefined && req.body["businessregion"] !== undefined && req.body["businesscountry"] !== undefined) {
            // check that 'businessname', 'businessaddress', 'businesscity', 'businessregion', 'businesscountry' are defined
            MongoClient.connect(dburi, (dberr, client) => {
              if (!dberr) {
                // DB connect
                var dbo = client.db(process.env.DBNAME); // Get DB object
                var myobj = {
                  "businessid": uuidv4(),
                  "businessname": req.body["businessname"],
                  "businessaddress": req.body["businessaddress"],
                  "businesscity": req.body["businesscity"],
                  "businessregion": req.body['businessregion'],
                  "businesscountry": req.body['businesscountry'],
                  "businesscoords": [parseFloat(req.body['lng']), parseFloat(req.body['lat'])],
                  "createDate": new Date()
                };
                results.result = {
                  "to_be_inserted": myobj
                };
                console.log("Setting up index (businesscoords), long and lat");
                dbo.collection("business").createIndex({"businesscoords": "2dsphere"});

                console.log("Prepare insert");
                dbo.collection("business").insertOne(myobj, (colerr, dbres) => {
                  if (!colerr) {
                    // inserted
                    results.meta.status = 200;
                    results.meta.msg = "Success";
                    results.result['businessid'] = myobj['businessid'];
                    results.result['inserted_db_identifier'] = dbres.insertedId;
                    client.close(); // close connection
                  } else {
                    // insert error
                    results.meta.status = 500;
                    results.meta.msg = "Insert error";
                    client.close();
                  }
                  res.json(results);
                });
              } else {
                results.meta.status = 500;
                results.meta.msg = "Unable to connect to database";
                client.close(); // close connection
                res.send(JSON.stringify(results))
              }
            });
          } else {
            // Parameters not defined
            results.meta.status = 400;
            results.meta.msg = "Require 'businessname', 'businessaddress', 'businesscity', 'businessregion', 'businesscountry', 'lat', 'lng' parameters";
            res.send(JSON.stringify(results));
          }
        } else {
          // auth failed
          results.meta.status = 401;
          results.meta.msg = "Authentication failed";
          res.send(JSON.stringify(results));
        }
      } else {
        results.meta.status = 401;
        results.meta.msg = "Requires authentication";
        res.send(JSON.stringify(results));
      }
    } else {
      results.meta.status = 400;
      results.meta.msg = "Invalid request. Require 'token' and business creation details";
      res.send(JSON.stringify(results))
    }
});

app.post('/1/validatedevice', (req, res) => {
  // db.business.find({"businessid": "70c59c79-66f9-4c1f-938d-91c5dc2fd208", "devices.deviceid": "b27fb2a5-89ce-4613-9239-356f0fe7ddf3"}).count()
  if (req.body !== undefined) {
    if (req.body['businessid'] !== undefined && req.body['deviceid'] !== undefined) {
      MongoClient.connect(dburi, (dberr, client) => {
        if (!dberr) {
          var dbo = client.db(process.env.DBNAME); // Get DB object
          var  validatequery = {
            "businessid": req.body["businessid"],
            "devices.deviceid": req.body["deviceid"]
          };
          dbo.collection("business").find(validatequery).toArray((vdErr, vdResult) => {
            if (!vdErr) {
              if (vdResult.length === 1) {
                results.meta.status = 200;
                results.meta.msg = "Found";
                results.result = {
                  found: true,
                  count: vdResult.length
                };
              } else {
                results.meta.status = 404;
                results.meta.msg = "Not found";
                results.result = {
                  found: false,
                  count: vdResult.length
                };
              }
              client.close(); // close connection
              res.send(JSON.stringify(results))
            } else {
              console.log(vdErr);
              results.meta.status = 500;
              results.meta.msg = "Error performing query";
              results.meta.debug = vdErr;
              results.result = {
                query: validatequery
              }
              client.close(); // close connection
              res.send(JSON.stringify(results))
            }
          })
        } else {
          results.meta.status = 500;
          results.meta.msg = "Error connecting to database";
          client.close(); // close connection
          res.send(JSON.stringify(results))
        }
      });
    } else {
      client.close(); // close connection
      results.meta.status = 400;
      results.meta.msg = "Invalid request. Requires 'businessid' and 'deviceid'";
      res.send(JSON.stringify(results))
    }
  } else {
    client.close(); // close connection
    results.meta.status = 400;
    results.meta.msg = "Invalid request. Requires 'businessid' and 'deviceid'";
    res.send(JSON.stringify(results))
  }
});
// End API (express)

// Start express
app.listen(port, () => {
  console.log(`Developpa app listening at http://localhost:${port}`)
})
