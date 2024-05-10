
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

# Run docker sql db locally for development
```pwsh
    # Start postgresql server docker image:
        docker run --rm --name pg -p 5432:5432 \
        -e POSTGRES_PASSWORD=welcome \
        postgres:16

    # (optional) To have a psql terminal on pg. 
    # In another terminal (tab) run psql:
    docker exec -it -u postgres pg psql
    
                /c app_db = connect to db
                /d = all tables

    # (optional) For pg to print all sql statements.
    # In psql command line started above.
    ALTER DATABASE postgres SET log_statement = 'all';
```

# Unit test (watch)
```shell
    cargo watch -q -c -x "test -- --nocapture"
    
    # Specific test
    cargo watch -q -c -x "test test_create_ok -- --nocapture"

    # Specific test with filter.
    cargo watch -q -c -x "test -p lib-core test_create -- --nocapture"
```



Starting the DB
# Start postgresql server docker image:
docker run --rm --name pg -p 5432:5432 \
-e POSTGRES_PASSWORD=welcome \
postgres:15

# (optional) To have a psql terminal on pg.
# In another terminal (tab) run psql:
docker exec -it -u postgres pg psql

# (optional) For pg to print all sql statements.
# In psql command line started above.
ALTER DATABASE postgres SET log_statement = 'all';
Dev (watch)
NOTE: Install cargo watch with cargo install cargo-watch.

# Terminal 1 - To run the server.
cargo watch -q -c -w crates/services/web-server/src/ -w crates/libs/ -w .cargo/ -x "run -p web-server"

# Terminal 2 - To run the quick_dev.
cargo watch -q -c -w crates/services/web-server/examples/ -x "run -p web-server --example quick_dev"

Dev
# Terminal 1 - To run the server.
cargo run -p web-server

# Terminal 2 - To run the tests.
cargo run -p web-server --example quick_dev
Unit Test (watch)
cargo watch -q -c -x "test -- --nocapture"

# Specific test with filter.
cargo watch -q -c -x "test -p lib-core test_create -- --nocapture"

Unit Test
cargo test -- --nocapture

cargo watch -q -c -x "test -p lib-core model::task::tests::test_create -- --nocapture"

Tools
cargo run -p gen-key