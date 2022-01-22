# Some saved Mongo DB Queries

## Get AQI for a business by device

```
db.business.find({"devices.deviceid": "fb450036-2acd-4a34-93cc-cdc90ca60b9b"}, {"devices": {$elemMatch: {"deviceid": "fb450036-2acd-4a34-93cc-cdc90ca60b9b"}}})
```

## Find a list of businesses within 100 meters

- Point being at `18.80430033821177,98.98236957936153`

```
db.business.find({"businesscoords": { "$near": { "$geometry": {"coordinates": [98.98236957936153, 18.80430033821177], "type": "Point"}, "$maxDistance": 100} }
```
