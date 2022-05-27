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
  // send header for CORS
  res.header("Access-Control-Allow-Origin", "*");

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
          res.status(results.meta.status);
          res.send(JSON.stringify(results));
        } else {
          // errors
          results.meta.status = 500;
          results.meta.msg = "Error inserting to database";
          client.close(); // close connection
          res.status(results.meta.status);
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
      res.status(results.meta.status);
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
  res.status(results.meta.status);
  res.send(JSON.stringify(results));
});

// Begin actual API (express)
// register
app.get('/1/register', (req, res) => {
  results.meta.msg = "GET method is not supported";
  res.status(results.meta.status);
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
    res.status(results.meta.status);
    res.send(JSON.stringify(results));
  } else {
    results.meta.msg = "required 'device_id' (and 'token' if a device exists)";
    res.status(results.meta.status);
    res.send(JSON.stringify(results));
  }
});

// verify
app.get('/1/verify', (req, res) => {
  results.meta.status = 400;
  results.meta.msg = "Bad request";
  res.status(results.meta.status);
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
      res.status(results.meta.status);
      res.send(JSON.stringify(results));
    } else {
      results.meta.status = 200;
      results.meta.msg = "Verify status";
      results.meta.timestamp = new Date().getTime();
      results.meta.debug = undefined;
      results.result = {
        verified: verify_status
      };
      res.status(results.meta.status);
      res.send(JSON.stringify(results));
    }
  } else {
    results.meta.status = 400;
    results.meta.msg = "missing 'id' and 'token' parameter";
    res.status(results.meta.status);
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
    res.status(results.meta.status);
    res.send(JSON.stringify(results));
  } else {
    results.meta.status = 400;
    results.meta.msg = "Required parameters 'token'";
    res.status(results.meta.status);
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
  results.meta.msg = "Invalid";
  if (req.query !== undefined) {
    if (req.query["lat"] !== undefined && req.query["lng"] !== undefined && req.query["distance"] !== undefined) {
      MongoClient.connect(dburi, (err, client) => {
        if (!err) {
          var dbo = client.db(process.env.DBNAME); // Get DB object
          // Geoquery and also filter out devices that are disabled
          // Maybe look at devices.updateTS too
          // and use new Date().getTime() to get out stale entry
          // use parseFloat(new Date().getTime()) - (86400*1000)
          // to only show places which are updated within 24 hours
          // Also devicestatus should not be "disabled"
          var list_places_query = {
            "businesscoords": { "$near":
                { "$geometry":
                  {
                    "coordinates": [parseFloat(req.query["lng"]), parseFloat(req.query["lat"])],
                    "type": "Point"
                  },
                  "$maxDistance": parseInt(req.query["distance"])
                }
              },
              "devices.devicestatus": {
                "$ne": "disabled"
              },
              "devices.updateTS": {
                "$gt": parseFloat(new Date().getTime()) - (86400*1000)
              }
          };
          var list_places_filter = {
            "_id": 0,
            "devices": 1
          }
          
          var list_devicelog_query = [
            { "$facet" : {
                "daily" : [{
                  "$match": {
                    "timestamp":  {
                      "$gt": parseFloat(Date.now() - 86400 * 1000)
                    }
                  }
                },
                {
                  "$group": {
                    "_id": "$deviceid",
                    "avg": {
                      "$avg": "$AQI"
                    }
                  }
                }],
                "hourly" : [
                  {
                    "$match": {
                      "timestamp":  {
                        "$gt": parseFloat(Date.now() - 3600 * 1000)
                      }
                    }
                  },
                  {
                    "$group": {
                      "_id": "$deviceid",
                      "avg": {
                        "$avg": "$AQI"
                      }
                    }
                  }
                ]
             } 
            }
          ]

          var devicelog = [];
          console.log("Fetching devices");
          dbo.collection("devicelog").aggregate(list_devicelog_query, {}).toArray((findErr, findResult) => {
            if(!findErr){
              devicelog = findResult
            }
          });

          console.log("Fetching business");
          dbo.collection("business").find(list_places_query, list_places_filter).toArray((findErr, findResult) => {
            if (!findErr) {
              // stubbed places
              var places = [];
              var placeentry = {};
              var deviceentry = {};
              var placerectopush = {};
              // init defaults
              var getcategories = ["other"]; // default
              var category = "other"; // default
              var getlinks = []; // default
              var purifiers_count = 0; // default
              var verification_count = 0; // default
              var can_verify = false; // defaults
              for (var i = 0; i < findResult.length; i++) {
                placeentry = findResult[i];
                for (var j = 0; j < placeentry["devices"].length; j++) {
                  deviceentry = placeentry["devices"][j];
                  // Reset defaults per iteration

                  // Categories
                  if (placeentry["categories"] !== undefined) { // if there are categories show it
                    getcategories = placeentry["categories"]
                  } else { // if no categories defined default to other
                    getcategories = ["other"]; // default
                  }
                  if (placeentry["links"] !== undefined) {
                    getlinks = placeentry["links"]
                  } else {
                      getlinks = []; // default
                  }
                  if (placeentry["purifiers"] !== undefined) {
                    purifiers_count = placeentry["purifiers"];
                  } else {
                    purifiers_count = 0; // default
                  }
                  if (placeentry["verifications"] !== undefined) {
                    verification_count = placeentry["verifications"];
                  } else {
                    verification_count = 0; // default
                  }
                  if (placeentry["can_verify"] !== undefined) {
                    can_verify = placeentry["can_verify"];
                  } else {
                    can_verify = false; // defaults
                  }
                  
                  // Populate Array of places by device with business as a nested object
                  // if AQI is present
                  if (deviceentry["AQI"]) {
                    if (deviceentry["AQI"] !== undefined && deviceentry["AQI"] !== null) {
                      // means its real
                      // but we should also look for last updated too (this maybe done at query level)
                      var day = GetAvg(devicelog[0]["daily"], deviceentry["deviceid"])
                      var hour = GetAvg(devicelog[0]["hourly"], deviceentry["deviceid"])

                      placerectopush = {
                        "device_id": deviceentry["deviceid"],
                        "device_location": deviceentry["devicelocation"],
                        "device_label": deviceentry["devicelabel"],
                        "device_bounty": deviceentry["devicebounty"],
                        "business": {
                          "business_id": placeentry["businessid"],
                          "business_name": placeentry["businessname"],
                          "coords": [placeentry["businesscoords"][1], placeentry["businesscoords"][0]],
                          "address": placeentry["businessaddress"],
                          "city": placeentry["businesscity"],
                          "region": placeentry["businessregion"],
                          "countrycode": placeentry["businesscountry"],
                          "purifiers": purifiers_count,
                          "categories": getcategories,
                          "links": getlinks,
                          "verifications": verification_count,
                          "can_verify": can_verify
                        },
                        "aqi": {
                          "now": {
                            "value": deviceentry["AQI"],
                            "lastUpdateTS": deviceentry["updateTS"]
                          },
                          "hour": {
                            "value": hour,
                            "lastUpdateTS": hour == 0 ? 1 : deviceentry["updateTS"]
                          },
                          "day": {
                            "value": day,
                            "lastUpdateTS": day == 0 ? 1 : deviceentry["updateTS"]
                          }
                        }
                      };
                      // sociallinks
                      // type = 'facebook', 'twitter', 'google' as types.
                      // url = string
                      // category = 'cafe', 'restaurant', 'coworking', 'fitness', 'other'
                      places.push(placerectopush); // Add to places object
                    }
                  } // end: check for actual AQI being reported
                } // end: iterate through devices
              } // end iterate through businesses
              results.meta.status = 200;
              results.meta.msg = "Processed successfully";
              results.result = places;
              res.status(results.meta.status);
              res.send(JSON.stringify(results));
            } else {
              results.meta.status = 500;
              results.meta.msg = "Database query error";
              results.result = findErr;
              res.status(results.meta.status);
              res.send(JSON.stringify(results));
            }
          });
        } else {
          results.meta.status = 500;
          results.meta.msg = "Database query error";
          results.result = err;
          res.status(results.meta.status);
          res.send(JSON.stringify(results));
        }
      });
    } else {
      results.meta.status = 400;
      results.meta.msg = "Require 'lat' and 'lng' and 'distance' parameter";
      res.status(results.meta.status);
      res.send(JSON.stringify(results));
    }
  } else {
    results.meta.status = 400;
    results.meta.msg = "Require 'lat' and 'lng' and 'distance'  parameter";
    res.status(results.meta.status);
    res.send(JSON.stringify(results));
  }
});

function GetAvg(devicelog_record, deviceId){
  console.log("GetAvg")
  for(var i = 0; i < devicelog_record.length; i++){
    var device = devicelog_record[i]
    if(device._id == deviceId){
      return device.avg
    }
  }
  return 0
}

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
            res.status(results.meta.status);
            res.send(JSON.stringify(results));
          } else {
            console.log("query error: " + devinfoErr);
            results.meta.status = 500;
            results.meta.msg = "Database query error";
            res.status(results.meta.status);
            res.send(JSON.stringify(results));
          }
        });
      } else {
        results.meta.status = 500;
        results.meta.msg = "Database connection error";
        res.status(results.meta.status);
        res.send(JSON.stringify(results));
      }
    });
})



app.get('/1/device_push', (req, res) => {
  results.meta.status = 400;
  results.meta.msg = "Must send a POST request";
  console.log("Invalid 'device_push' request. User sent a GET rather than post");
  res.status(results.meta.status);
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
                "devices.$.AQI": parseInt(device_push_obj["AQI"]),
                "devices.$.updateTS": parseInt(new Date().getTime()),
                "devices.$.updateDate": new Date()
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
              res.status(results.meta.status);
              res.json(results);
            });
          } else {
            // err connecting
            results.meta.status = 500;
            results.meta.msg = "Error connecting to database";
            res.status(results.meta.status);
            res.json(results);
          }
        });
      } else {
        console.log("Invalid request type");
        console.log("Body: " + JSON.stringify(req.body));
        results.meta.status = 400;
        results.meta.msg = "JSON block requires 'deviceid', and 'AQI' attributes, and header 'application/json' must be specified";
        res.status(results.meta.status);
        res.json(results);
      }
    } else {
      results.meta.status = 400;
      results.meta.msg = "Invalid JSON";
      res.status(results.meta.status);
      res.send(results);
    }
  } catch (e) {
    console.log("Error trapped");
    console.log(e);
    results.meta.status = 500;
    results.meta.msg = "Invalid request";
    res.status(results.meta.status);
    res.send(JSON.stringify(results))
  }
});
// end device push API

// Admin token only
// Device create endpoint
app.get('/1/deviceregister', (req, res) => {
  results.meta.status = 400;
  results.meta.msg = "This endpoint only accepts POST requests";
  res.status(results.meta.status);
  res.send(JSON.stringify(results));
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
                  res.status(results.meta.status);
                  res.send(JSON.stringify(results))
                }
              });
            } else {
              results.meta.status = 500;
              results.meta.msg = "Database connect error";
              client.close(); // close connection
              res.status(results.meta.status);
              res.send(JSON.stringify(results))
            }
          });
        } else {
          results.meta.status = 400;
          results.meta.msg = "Requires a 'businessid' to register the device to  (optional: 'devicelocation', 'devicelabel')";
          res.status(results.meta.status);
          res.send(JSON.stringify(results));
        }
      } else {
        results.meta.status = 401;
        results.meta.msg = "Authentication failed";
        res.status(results.meta.status);
        res.send(JSON.stringify(results));
      }
    } else {
      results.meta.status = 400;
      results.meta.msg = "Invalid request. Require admin 'token', 'businessid' (optional: 'devicelocation', 'devicelabel')";
      res.status(results.meta.status);
      res.send(JSON.stringify(results));
    }
  } else {
    results.meta.status = 400;
    results.meta.msg = "Invalid request. Require admin 'token', 'businessid'  (optional: 'devicelocation', 'devicelabel')";
    res.status(results.meta.status);
    res.send(JSON.stringify(results))
  }
});

// Business create endpoint
app.get('/1/business', (req, res) => {
  results.meta.status = 400;
  results.meta.msg = "This endpoint only accepts POST requests";
  res.status(results.meta.status);
  res.send(JSON.stringify(results));
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
                  res.status(results.meta.status);
                  res.json(results);
                });
              } else {
                results.meta.status = 500;
                results.meta.msg = "Unable to connect to database";
                client.close(); // close connection
                res.status(results.meta.status);
                res.send(JSON.stringify(results))
              }
            });
          } else {
            // Parameters not defined
            results.meta.status = 400;
            results.meta.msg = "Require 'businessname', 'businessaddress', 'businesscity', 'businessregion', 'businesscountry', 'lat', 'lng' parameters";
            res.status(results.meta.status);
            res.send(JSON.stringify(results));
          }
        } else {
          // auth failed
          results.meta.status = 401;
          results.meta.msg = "Authentication failed";
          res.status(results.meta.status);
          res.send(JSON.stringify(results));
        }
      } else {
        results.meta.status = 401;
        results.meta.msg = "Requires authentication";
        res.status(results.meta.status);
        res.send(JSON.stringify(results));
      }
    } else {
      results.meta.status = 400;
      results.meta.msg = "Invalid request. Require 'token' and business creation details";
      res.status(results.meta.status);
      res.send(JSON.stringify(results))
    }
});

app.put('/1/business', (req, res) => {
  if (req.body !== undefined) {
    if (req.body['token'] !== undefined) {
      if (req.body['token'] === process.env.ADMINKEY) {
        // Admin key match
        if (req.body["businessid"] !== undefined) {
          // check that 'businessname', 'businessaddress', 'businesscity', 'businessregion', 'businesscountry' are defined
          MongoClient.connect(dburi, (dberr, client) => {
            if (!dberr) {
              // DB connect
              var dbo = client.db(process.env.DBNAME); // Get DB object

              // var myobj = {
              //   ...req.body,
              // };
              
              if (req.body['businessname'] !== undefined) {
                myobj.business.businessname = req.body['businessname'];
              }
              // optional devicelabel
              if (req.body['businessaddress'] !== undefined) {
                myobj.business.businessaddress = req.body['businessaddress'];
              }

              if (req.body['businesscity'] !== undefined) {
                myobj.business.businesscity = req.body['businesscity'];
              }

              if (req.body['businessregion'] !== undefined) {
                myobj.business.businessregion = req.body['businessregion'];
              }

              if (req.body['businesscountry'] !== undefined) {
                myobj.business.businesscountry = req.body['businesscountry'];
              }

              if(req.body['lng'] && req.body['lat']){
                myobj.business.businesscoords = [parseFloat(req.body['lng']), parseFloat(req.body['lat'])];
              }

              if (req.body['purifiers'] !== undefined) {
                myobj.purifiers = req.body['purifiers'];
              }

              if (req.body['categories'] !== undefined) {
                myobj.categories = req.body['categories'];
              }

              if (req.body['links'] !== undefined) {
                myobj.links = req.body['links'];
              }

              console.log(myobj)

              results.result = {
                "to_be_inserted": myobj
              };

              console.log("Setting up index (businesscoords), long and lat");
              // dbo.collection("business").createIndex({"businesscoords": "2dsphere"});

              // console.log("Prepare update");
              // dbo.collection("business").updateOne(myobj, (colerr, dbres) => {
              //   if (!colerr) {
              //     // inserted
              //     results.meta.status = 200;
              //     results.meta.msg = "Success";
              //     results.result['businessid'] = myobj['businessid'];
              //     results.result['inserted_db_identifier'] = dbres.insertedId;
              //     client.close(); // close connection
              //   } else {
              //     // insert error
              //     results.meta.status = 500;
              //     results.meta.msg = "Insert error";
              //     client.close();
              //   }
              //   res.status(results.meta.status);
              //   res.json(results);
              // });
            } else {
              results.meta.status = 500;
              results.meta.msg = "Unable to connect to database";
              client.close(); // close connection
              res.status(results.meta.status);
              res.send(JSON.stringify(results))
            }
          });
        } else {
          // Parameters not defined
          results.meta.status = 400;
          results.meta.msg = "Require 'businessid' parameter";
          res.status(results.meta.status);
          res.send(JSON.stringify(results));
        }
      } else {
        // auth failed
        results.meta.status = 401;
        results.meta.msg = "Authentication failed";
        res.status(results.meta.status);
        res.send(JSON.stringify(results));
      }
    } else {
      results.meta.status = 401;
      results.meta.msg = "Requires authentication";
      res.status(results.meta.status);
      res.send(JSON.stringify(results));
    }
  } else {
    results.meta.status = 400;
    results.meta.msg = "Invalid request. Require 'token' and businessid";
    res.status(results.meta.status);
    res.send(JSON.stringify(results))
  }
});

app.delete('/1/business', (req, res) => {
  if (req.body !== undefined) {
    if (req.body['token'] !== undefined) {
      if (req.body['token'] === process.env.ADMINKEY) {
        // Admin key match
        if (req.body["businessid"] !== undefined) {
          // check that 'businessname', 'businessaddress', 'businesscity', 'businessregion', 'businesscountry' are defined
          MongoClient.connect(dburi, (dberr, client) => {
            if (!dberr) {
              // DB connect
              var dbo = client.db(process.env.DBNAME); // Get DB object
              var myobj = {
                "businessid": req.body["businessid"]
              };
              results.result = {
                "to_be_inserted": myobj
              };
              console.log("Prepare insert");
              dbo.collection("business").deleteOne(myobj, (colerr, dbres) => {
                if (!colerr) {
                  // inserted
                  results.meta.status = 200;
                  results.meta.msg = "Successfully deleted business with id: " + myobj['businessid'];
                  client.close(); // close connection
                } else {
                  // insert error
                  results.meta.status = 500;
                  results.meta.msg = "Delete error";
                  client.close();
                }
                res.status(results.meta.status);
                res.json(results);
              });
            } else {
              results.meta.status = 500;
              results.meta.msg = "Unable to connect to database";
              client.close(); // close connection
              res.status(results.meta.status);
              res.send(JSON.stringify(results))
            }
          });
        } else {
          // Parameters not defined
          results.meta.status = 400;
          results.meta.msg = "Require 'businessid' parameter";
          res.status(results.meta.status);
          res.send(JSON.stringify(results));
        }
      } else {
        // auth failed
        results.meta.status = 401;
        results.meta.msg = "Authentication failed";
        res.status(results.meta.status);
        res.send(JSON.stringify(results));
      }
    } else {
      results.meta.status = 401;
      results.meta.msg = "Requires authentication";
      res.status(results.meta.status);
      res.send(JSON.stringify(results));
    }
  } else {
    results.meta.status = 400;
    results.meta.msg = "Invalid request. Require 'token' and businessid";
    res.status(results.meta.status);
    res.send(JSON.stringify(results))
  }
});
// Admin token only
// Device create endpoint
app.get('/1/setdeviceattr', (req, res) => {
  results.meta.status = 400;
  results.meta.msg = "This endpoint only accepts POST requests";
  res.status(results.meta.status);
  res.send(JSON.stringify(results));
});
app.post('/1/setdeviceattr', (req, res) => {
  if (req.body !== undefined) {
    if (req.body['token'] !== undefined) {
      if (req.body['token'] === process.env.ADMINKEY) {
        // Admin token matches
        if (req.body['deviceid'] !== undefined) {
          // need a device id at least
          var updateQuery = {
            "devices.deviceid": req.body['deviceid']
          };
          // Empty template
          var updatecmd = {
            "$set": {
            }
          };
          results.meta.status = 200; // Before validation
          // validate devicestatus
          if (req.body['devicestatus'] !== undefined) {
            if (req.body['devicestatus'] !== "enabled" && req.body['devicestatus'] !== "disabled") {
              results.meta.status = 400;
              results.meta.msg = "Device status must be either 'enabled' or 'disabled'";
            } else {
              results.meta.status = 200;
              results.meta.msg = "Successfully processed";
            }
          };
          if (results.meta.status === 200) {
            // Validation all good then proceed
            // devicelabel
            if (req.body['devicelabel'] !== undefined) {
              updatecmd['$set']['devices.$.devicelabel'] = req.body['devicelabel'];
            }
            // devicelocation
            if (req.body['devicelocation'] !== undefined) {
              updatecmd['$set']['devices.$.devicelocation'] = req.body['devicelocation'];
            }
            // devicebounty
            if (req.body['devicebounty'] !== undefined) {
              updatecmd['$set']['devices.$.devicebounty'] = parseInt(req.body['devicebounty']);
            }
            // devicestatus ('disabled' or 'enabled')
            if (req.body['devicestatus'] !== undefined) {
              updatecmd['$set']['devices.$.devicestatus'] = req.body['devicestatus'];
            }
            // begin query
            MongoClient.connect(dburi, (err, client) => {
              if (!err) {
                console.log(updatecmd);
                var dbo = client.db(process.env.DBNAME);
                dbo.collection("business").updateOne(updateQuery, updatecmd, (updaterr, updateres) => {
                  if (!updaterr) {
                    // no error
                    console.log("Device record in business collection updated (" + JSON.stringify(updateres) + ")");
                    results.meta.status = 200;
                    results.meta.msg = "Successfully processed";
                    res.status(results.meta.status);
                    res.send(JSON.stringify(results));
                  } else {
                    // error
                    console.log("Error updating business collection (" + JSON.stringify(updaterr) + ")");
                    results.meta.status = 500;
                    results.meta.msg = "database error";
                    res.status(results.meta.status);
                    res.send(JSON.stringify(results));
                  }
                });
              } else {
                results.meta.status = 500;
                results.meta.msg = "database error";
                res.status(results.meta.status);
                res.send(JSON.stringify(results));
              }
            });
          } else {
            // Send error message
            res.status(results.meta.status);
            res.send(JSON.stringify(results));
          }
        } else {
          // Require 'deviceid' (optional: 'devicelabel', 'devicelocation', 'devicebounty', 'devicestatus')
          results.meta.status = 400;
          results.meta.msg = "Require 'deviceid' (optional: 'devicelabel', 'devicelocation', 'devicebounty', 'devicestatus')";
          res.status(results.meta.status);
          res.send(JSON.stringify(results));
        }
      } else {
        results.meta.status = 401;
        results.meta.msg = "admin 'token' does not match";
        res.status(results.meta.status);
        res.send(JSON.stringify(results));
      }
    } else {
      results.meta.status = 401;
      results.meta.msg = "Require admin 'token'";
      res.status(results.meta.status);
      res.send(JSON.stringify(results));
    }
  } else {
    results.meta.status = 400;
    results.meta.msg = "Missing parameters";
    res.status(results.meta.status);
    res.send(JSON.stringify(results));
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
              res.status(results.meta.status);
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
              res.status(results.meta.status);
              res.send(JSON.stringify(results))
            }
          })
        } else {
          results.meta.status = 500;
          results.meta.msg = "Error connecting to database";
          client.close(); // close connection
          res.status(results.meta.status);
          res.send(JSON.stringify(results))
        }
      });
    } else {
      client.close(); // close connection
      results.meta.status = 400;
      results.meta.msg = "Invalid request. Requires 'businessid' and 'deviceid'";
      res.status(results.meta.status);
      res.send(JSON.stringify(results));
    }
  } else {
    client.close(); // close connection
    results.meta.status = 400;
    results.meta.msg = "Invalid request. Requires 'businessid' and 'deviceid'";
    res.status(results.meta.status);
    res.send(JSON.stringify(results));
  }
});
// End API (express)

// Start express
app.listen(port, () => {
  console.log(`Developpa app listening at http://localhost:${port}`)
})
