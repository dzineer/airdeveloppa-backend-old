# Some saved Mongo DB Queries

## Get AQI for a business by device

```
db.business.find({"devices.deviceid": "fb450036-2acd-4a34-93cc-cdc90ca60b9b"}, {"devices": {$elemMatch: {"deviceid": "fb450036-2acd-4a34-93cc-cdc90ca60b9b"}}})
```
