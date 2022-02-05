# Some saved Mongo DB Queries

## Get AQI for a business by device

```
db.business.find({"devices.deviceid": "fb450036-2acd-4a34-93cc-cdc90ca60b9b"}, {"devices": {$elemMatch: {"deviceid": "fb450036-2acd-4a34-93cc-cdc90ca60b9b"}}})
```

## Find a list of businesses within 100 meters

- Point being at `18.80430033821177,98.98236957936153`
- milliseconds in a day is 86400000


```
db.business.find({"businesscoords": { "$near": { "$geometry": {"coordinates": [98.98236957936153, 18.80430033821177], "type": "Point"}, "$maxDistance": 10000} }, "devices.updateTS": {"$gt": 1643960363899}, "devices.devicestatus": {"$ne": "disabled}})
```

## Pull and push a device from a business

```
# Make sure you grab the information through db.business.find() first and save it (main info is the deviceid, we can probably just reset the label, location, bounty to defaults I think)
db.business.find({ "devices": {$elemMatch: {"deviceid": "2c57c8bb-2a97-4e4c-bfee-8d0eae282fc1"}}})

# example pull device id 2c57c8bb-2a97-4e4c-bfee-8d0eae282fc1 from businessid 5098c082-87fb-4d92-9591-ab30f4b4bc59
db.business.update({"businessid": "5098c082-87fb-4d92-9591-ab30f4b4bc59"}, {"$pull": { "devices": {"deviceid": "2c57c8bb-2a97-4e4c-bfee-8d0eae282fc1"}}})

# push the device into a new business (eg. we are moving it to ffd6894f-1960-40e0-95d2-8d6dcd80a140)
#  { "_id" : ObjectId("61ed0ac847e837737b0a594a"), "deviceid" : "2c57c8bb-2a97-4e4c-bfee-8d0eae282fc1", "devicelabel" : "Roberto", "devicelocation" : "Robertos office", "devicebounty" : 100, "createDate" : ISODate("2022-01-23T07:59:04.725Z"), "updateDate" : ISODate("2022-01-27T05:41:44.672Z"), "AQI" : 76, "updateTS" : 1643262104672 }

db.business.find({"businessid": "ffd6894f-1960-40e0-95d2-8d6dcd80a140"})
db.business.update({"businessid": "ffd6894f-1960-40e0-95d2-8d6dcd80a140"}, {"$push": {"devices": {"_id": ObjectId(), "deviceid": "2c57c8bb-2a97-4e4c-bfee-8d0eae282fc1", "devicelabel": "New Airdeveloppa test", "createDate": new Date(), "updateDate": new Date(), "updateTS": 1 }}})
# verify
db.business.find({"businessid": "ffd6894f-1960-40e0-95d2-8d6dcd80a140"})

```
