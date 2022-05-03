# Development Identifiers

## To trigger certain events

### Create a new business record

```bash
curl "http://localhost:8000/1/business" \
-H "Content-type: application/json" \
-d '{"businessname": "Lightning Network Chiang Mai", "businessaddress": "8, 8 Ratchaphuek Alley", "businesscity": "Chiang Mai", "businessregion": "Chiang Mai", "businesscountry": "TH", "lat": 18.798644321294745, "lng": 98.9752684788364, "token": ""}'
```

### Create a new device record

```bash
curl "http://localhost:8000/1/deviceregister" \
-H "Content-type: application/json" \
-d '{"businessid": "c8be9040-43ca-4e1e-a029-61bccf0fa546", "devicebounty": 1, "devicelabel": "Device Label", "devicelocation": "Wherever", "token": ""}'
```

### Create a new AQI entry

```bash
curl "http://localhost:8000/1/device_push" \
-H "Content-type: application/json" \
-d '{"businessid": "c8be9040-43ca-4e1e-a029-61bccf0fa546", "deviceid": "c65d3c6d-4f05-4054-9929-c6aafe9996be", "AQI": 69}'
```
