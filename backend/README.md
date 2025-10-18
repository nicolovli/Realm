# Backend for Realm

[<- Tilbake til ROOT README](../README.md)

En Apollo Server backend, med Prisma og PostgreSQL som database

## Innholdfortegnelse

- [Oppsett](#oppsett)
- [Konfigurer Miljøvariabler](#konfigurer-miljøvariabler)
  - [Installering](#installering)
  - [Kjør serveren](#kjør-serveren)

## Oppsett

For å sette opp backend må du ha følgende tilgjengelig på maskinen:

- Node.js
- Npm
- Tilgang til et NTNU nettverk

## Konfigurer Miljøvariabler

Kjør koden under, og fyll inn URL til din lokal-database på .env filen.

```bash
cp .env.template .env
```

```
PORT=3001
DATABASE_URL="postgresql:<DB_USER>:<DB_PASSWORD>@<DB_HOST>:<DB_PORT>/<DB_NAME>?schema=public"
AUTH0_SECRET=<YOUR_AUTH0_SECRET>
AUTH0_CLIENT_ID=<YOUR_AUTH0_CLIENT_ID>
AUTH0_DOMAIN=<YOUR_AUTH0_DOMAIN>
```

> [!NOTE]
> Miljøvariablene som trengs for å kjøre applikasjonen kan man finne i vår VM under `/home/jennciad/backend/.env`. Dersom du ønsker å kopiere dette for å bruke lokalt, må du legge de under .env filen i `backend` folder for at ting skal funke.

## Kjør backend gjennom VM

Det er allerede satt opp en kjørende backend på VM. Du trenger kun å være på `frontend`-mappen og kjøre:

```bash
npm run dev:vm
```

## Kjøre backend lokalt

For å teste den lokale backend må du ha en [steam.json](https://github.com/leinstay/steamdb/blob/main/steamdb.json) fil lastet opp til folder `backend/db`.

1. Klon repoet og last ned dependencies

```bash
git clone https://git.ntnu.no/IT2810-H25/T01-Project-2.git
cd backend
npm install
```

2. Få databasen opp til din lokale database
   Denne løsningen vil overskrive din nåværende database.

```bash
npx prisma migrate dev
npx tsx src/scripts/importJson.ts
npx prisma generate
```

3. For å kjøre koden

```bash
npm run dev
```

<!-- 2. To build the project run:

```bash
npx prisma generate
npx tsc
```

3. To run the project in VM:

```bash
npm run dist
``` -->

<!-- ## Oppsett for første gang (må fjernes før sluttlevering):

For å se dataen i databasen og importere json fil for første gang, kjør:

```bash
npx prisma migrate dev --name init
npx tsx src/scripts/importJson.ts
npx prisma generate
npx prisma studio
```

- Kjør koden over også dersom schema.prisma har blitt oppdatert.

Dersom det har kommet endringer i migration filen, kjør.

```bash
npx prisma migrate dev
npx prisma generate
npx prisma studio
```

### For ulike kjøringer:

Dersom schema.prisma er endret, eller output og provider kjør:

```bash
npx prisma generate
```

For å se selve databasen på prisma kjør følgende:

```bash
npx prisma studio
```

For å kjøre dev serveren:

```bash
npm run dev
```

For å kjøre serveren for produksjon:

```bash
npm start
``` -->
