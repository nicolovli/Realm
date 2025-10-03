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
### Konfigurer Miljøvariabler 
Kjør koden under, og fyll inn URL til lokal-database på .env filen.
```bash
cp .env.template .env
```
- **DATABASE_URL**=URL til din lokale database

### Kjør serveren 
Start med å kjøre dev serveren med:
```bash
npx prisma generate
npm start
```

## GraphQL API
Kommer til sprint 2

## Mutasjoner 
Kommer til sprint 2

