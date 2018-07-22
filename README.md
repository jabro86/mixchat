![Logo](./assets/logo.png)

# Getting Started

## Backend

1.  Navigate into server directory: `cd server`
1.  Build docker container: `docker build -t server .`
1.  Run docker-compose: `docker-compose up`

### Populating SQL data

- Create a dump from locale db: `pg_dump -U postgres slack -f dump.sql`
- Connect to database in docker: `psql -h localhost -p 3030 -U postgres slack`
- Drop current database in docker: `dropdb -h localhost -p 3030 -U postgres slack`
- Create new database: `createdb -h localhost -p 3030 -U postgres slack`
- Write data from dump into database: `psql -h localhost -p 3030 -U postgres slack < dump.sql`

## Frontend

1.  Navigate into client directory: `cd client`
1.  Install dependencies and start the application:
    ```shell
    yarn install
    yarn start
    ```
