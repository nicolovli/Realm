# Backend for Realm

En Apollo Server backend, med Prisma og PostgreSQL som database

## Innholdfortegnelse

- [Oppsett](#oppsett)
  - [Installering](#installering)
  - [Konfigurer Miljøvariabler](#konfigurer-miljøvariabler)
  - [Kjør serveren](#kjør-serveren)
- [GraphQL API](#graphql-api)
- [Mutasjoner](#mutasjoner)

## Oppsett

For å sette opp backend må du ha følgende tilgjengelig på maskinen:

- Node.js
- Npm
- Tilgang til et NTNU nettverk

### Installering

> [!IMPORTANT]
> For innlevering 1: En viktig ting å påpeke er at backend techstack kun er satt opp. Det vil si at det ikke er nødvendig å kjøre backend for å teste frontend for denne innleveringen. Det er derfor ikke nødvendig å kjøre backend, da man må installere postgreSQL på sin lokale PC.

1. Klon repoet og last ned dependencies

```bash
git clone https://git.ntnu.no/IT2810-H25/T01-Project-2.git
cd backend
npm install
```

2. To build the project run:

```bash
npx prisma generate
npx tsc
```

3. To run the project in VM:

```bash
npm run dist
```

### Konfigurer Miljøvariabler

Kjør koden under, og fyll inn URL til lokal-database på .env filen.

```bash
cp .env.template .env
```

- **DATABASE_URL**=URL til din lokale database

### Oppsett for første gang (må fjernes før sluttlevering):

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
```

## GraphQL API

Kommer til sprint 2

## Mutasjoner

Kommer til sprint 2
