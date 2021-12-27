# AirDeveloppa Backend

## Runnin (Docker)

```
# Login as user nolim1t
docker login registry.gitlab.com -u nolim1t
# Enter personal access token as password
docker pull registry.gitlab.com/nolim1t/airdeveloppa-backend:latest

# Pull specific version
docker pull registry.gitlab.com/nolim1t/airdeveloppa-backend:v0.0.5-db4a13b0
```

## Maintainer Notes

- Have a `PERSONALTOKEN` variable set up in gitlab
- When releasing push a tag
- Have a ```postgres``` directory created
- Make sure ```postgresql.conf``` is available where we run ```docker-compose up -d```

