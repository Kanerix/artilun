# Artilun

This is a app used to evaluate school lessons. It is created as a school project. This is my first Svelte app, so the code is probably not the best.


### Steps needed no matter what

- Install node if not installed.

- Create a `.env.development` or/and `.env.proudction` file, following the `.env.example`.

- Install `pnpm` if not installed.

### Development

Steps needed to start website in development mode.

- Install docker if not installed.

- Run `docker compose up postgres redis -d` to start the postgres and redis service.

- Run `pnpm install` to install node modules.

- Run `pnpm prisma migrate dev` and `pnpm prisma generate` to setup database.

- **OPTIONAL:** Run `pnpm prisma db seed`, to seed the database with data. 

- Finally run `pnpm dev` to start the website in development mode.

### Production

Steps needed to start website in production mode.

- Run `pnpm install` to install node modules.

- Run `pnpm prisma migrate dev` and `pnpm prisma generate` to setup database.

- Run `pnpm build` to build the application.

- Finally run `node build` to start the website.

#### Docker compose

Steps needed to start the docker environment.

- Run `docker compose up -d` to run the environment in the background.