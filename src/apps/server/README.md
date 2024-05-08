
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



# start server
```pwsh
    cargo run
```

# Run Server and recompile for quick testing in dev
```pwsh
    cargo watch -q -c -w src/ -w .cargo/ -x "run"
```
every source code change recompiles it and run it again
- -q = quit
- -c = clear in between in each recompile
- -w src/ = watch only the source folder
- -x run = execute

# Run front end 
```pwsh
    cargo watch -q -c -w examples/ -x "run --example quick_dev"
```
every source code change recompiles it and run it again
- -q = quit
- -c = clear in between in each recompile
- -w src/ = watch only the source folder
- -x run = execute