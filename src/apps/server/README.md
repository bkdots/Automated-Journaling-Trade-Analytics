
# Running Server For Development
- Using a local postgres database
- Needs Docker installed

## Starting docker db in the background with -d meaning detached
```pwsh
    docker compose up -d db
```

## Enter docker container for sql execution

```pwsh
    docker exec -it db psql -U postgres
```


## Build project in docker container

```pwsh
    docker compose build
```

## Starting docker server application

```pwsh
    docker compose up server
```


## Check running containers
```pwsh
    docker ps -a
```


## Docker Compose Start Containers and Initialize DB
```pwsh
    docker-compose up
```

## Docker Compose Stop Containers and Initialize DB
```pwsh
    docker-compose down -v
```