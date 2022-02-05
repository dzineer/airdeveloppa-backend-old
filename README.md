# AirDeveloppa Backend

* [Running on docker](#running-docker)
* [MongoDB Commands](#mongodb)
* [Maintainer Notes](#maintainer-notes)
* [Generating an admin key](#generating-an-admin-key)
* [Endpoint Descriptions](#sample-endpoints)

## Architecture

The backend is a `nodejs` application packaged in a `docker` container self built by gitlab CI and pushed to the gitlab container registry.

The `docker-compose` file in this repository also has the database engine within here for easy access.

All thats required is `docker(1)` and `docker-compose(1)` (latest versions recommended) installed. You may follow the [guide](https://docs.docker.com/engine/install/ubuntu/) for steps how to do so.

## Running (Docker)

```
# First two steps may no longer be needed

# Login as user nolim1t
docker login registry.gitlab.com -u nolim1t
# Enter personal access token as password
docker pull registry.gitlab.com/nolim1t/airdeveloppa-backend:latest

# Pull specific version
docker pull registry.gitlab.com/nolim1t/airdeveloppa-backend:v0.1.16
```

## MongoDB

Some sample mongodb commands

```bash
docker exec -it mongodb mongo -uroot -ppasssword
```

## Sample endpoints

### Register

**Endpoint:** https://backend.airdeveloppa.services/1/register

This endpoint automatically creates an authentication token for a device or checks to see if the authentication token exists. The purpose of this is to identify users in the system

This endpoint also lets an existing device re-validate an authentication token.


#### POST Parameters

- `device_id` (required. This should be a uuid generated by the device)
- `token` (not required if the uuid generated by the device exists, it should be kept private)

### List

**Endpoint:** https://backend.airdeveloppa.services/1/list

#### GET Parameters

- `lat` (required. eg. 18.798444546939923)
- `lat` (required. eg. 98.96888142026467)
- `distance` (required. in meters)

### Balance

**Endpoint:** https://backend.airdeveloppa.services/1/balance

This endpoint shows the users balance in satoshis.

#### GET Parameters

- `token` (Required)

### Withdraw

**Endpoint:** https://backend.airdeveloppa.services/1/withdraw

#### POST parameters

- `token` (required. account authorization token)
- `invoice` (required. Lightning invoice for the withdraw request)

### Verify

**Endpoint:** https://backend.airdeveloppa.services/1/verify

#### POST Parameters

- `token` (required. This is the authentication token. You should keep this safe)
- `id` (required. This is the device UUID)
- `fakeVerify` (for testing. If you set this to false this will simulate a fail response)

### Device Info

**Endpoint:** https://backend.airdeveloppa.services/1/deviceinfo/UUID

#### GET Notes

- Requires a `uuid` as part of the GET parameters
- Returns the business associated with the device along with the device(s) as the response

### Device push

**Endpoint:** https://backend.airdeveloppa.services/1/device_push

#### POST notes

- Must send a ```Content-Type: application/json``` header
- Must send a JSON object with the following parameters `deviceid`, and `AQI`

## Maintainer Notes

- Copy `env-dist` to `.env` before starting `docker-compose.yml`. Configure the defaults is recommended
- Have a `PERSONALTOKEN` variable set up in gitlab
- When releasing push a tag
- Ensure that there is a `mongodb` directory available in the route.

### Admin endpoints

#### Business Register

**Endpoint:** POST https://backend.airdeveloppa.services/1/business

##### parameters

- `token` - Admin authentication
- `businessname`
- `businessaddress`
- `businesscity` (eg. Chiang Mai)
- `businessregion` (eg. Chiang Mai)
- `businesscountry` (eg. TH)
- `lat` - latitude of business
- `lng` - longitude of busines

```bash
# Example
curl "https://backend.airdeveloppa.services/1/business" \
-H "Content-type: application/json" \
-d '{"token": "security token", "businessname": "Corner Bistro & Burrito Squad", "businessaddress": "8, 8 Ratchaphuek Alley", "businesscity": "Chiang Mai", "businessregion": "Chiang Mai", "businesscountry": "TH", "lat": 18.798663671992312, "lng": 98.97526790697208}'
```
#### Device register

**Endpoint:** POST https://backend.airdeveloppa.services/1/deviceregister

##### parameters

- `token` - Admin authentication
- `businessid` - to associate a device with a business.
- `devicebounty` - Bounty in satoshis
- `devicelabel` - freeform label of the device
- `devicelocation` - freeform location of device

```bash
curl "https://backend.airdeveloppa.services/1/deviceregister" \
-H "Content-type: application/json" \
-d '{"token": "", "businessid": "70c59c79-66f9-4c1f-938d-91c5dc2fd208", "devicelocation": "Upstairs", "devicelabel": "Corner Bistro test"}'
```

#### Device register

**Endpoint:** POST https://backend.airdeveloppa.services/1/setdeviceattr

##### parameters

- `token` - Admin authentication (for now)
- `deviceid` - Required field. Specify the device to modify
- `devicelabel` - Optional devicelabel
- `devicelocation` - Optional devicelocation
- `devicebounty` - Optional devicebounty
- `devicestatus` -  - Optional devicestatus

```bash
curl "https://backend.airdeveloppa.services/1/setdeviceattr" \
-H "Content-type: application/json" \
-d '{"token": "", "deviceid": "fb450036-2acd-4a34-93cc-cdc90ca60b9b", "devicelabel": "new label"}'
```
#### Generating admin key

## Generating an admin key

```bash
node -e 'var crypto = require("crypto"); var adminkey = crypto.createHash("sha256").update(crypto.createHash("sha256").update("admin" + "||" + (new Date().getTime()).toString()).digest("hex")).digest("hex"); console.log(adminkey);'
```

## Validating a device ID (No auth needed)

```bash
curl "https://backend.airdeveloppa.services/1/validatedevice" \
-H "Content-type: application/json" \
-d '{"businessid": "", "deviceid": ""}'
```
