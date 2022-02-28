#!/bin/bash

BUSINESSID="265d301c-aae4-443c-9183-e8595ae0e5d1"

if [[ ! -z $ADMINKEY ]]; then
    for i in {1..50}
    do
        curl "https://backend.airdeveloppa.services/1/deviceregister" \
        -d "token=${ADMINKEY}&businessid=${BUSINESSID}" 2>/dev/null |  jq .result.deviceid
    done
else
    echo "ADMINKEY must be set"
fi
