# Backend for Realm

[<- Tilbake til ROOT README](../README.md)

En Apollo Server backend, med Express, Prisma og PostgreSQL som database

## Innholdfortegnelse

- [Backend for Realm](#backend-for-realm)
  - [Innholdfortegnelse](#innholdfortegnelse)
  - [Oppsett](#oppsett)
  - [Konfigurer Miljøvariabler](#konfigurer-miljøvariabler)
  - [Kjør backend gjennom VM](#kjør-backend-gjennom-vm)
  - [Kjøre backend lokalt](#kjøre-backend-lokalt)
  - [Har du backend problemer?](#har-du-backend-problemer)

> [!IMPORTANT]
> Vi anbefaler å kjøre backend gjennom VM i stedet for lokalt. Dette skyldes to hovedpunkter: 1. Du må seede en json fil som tar svært lang tid (6-10min), ettersom den inneholder over 53 000 spill. 2. Du trenger Postgres installert lokalt, og må i tillegg opprette en egen database for å populere JSON-filen. Dette kan komme i konflikt med eksisterende databaser på maskinen din. Vi anbefaler derfor hoppe over seksjonene `Oppsett` og `Konfigurer Miljøvariabler`, og heller les [Kjør backend gjennom VM](#kjør-backend-gjennom-vm).

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
DATABASE_URL="postgresql:<DB_USER>:<DB_PASSWORD>@localhost:5432/<DB_NAME>?schema=public"
JWT_SECRET=your_super_secret_string_here
```

JWT_SECRET kan du bare føre en tilfeldig og random string/setning som er ønskelig. Du kan generere en tilfeldig en, da det eneste kravet er at den er vanskelig å gjette og er konstant på serveren.

> [!NOTE]
> Miljøvariablene som trengs for å kjøre applikasjonen kan man finne i vår VM under `/home/jennicad/backend/backend/.env`. Dersom du ønsker å kopiere dette for å bruke lokalt, må du legge de under .env filen i `backend` folder for at ting skal funke. Evt, så kan du bruke din egen postgresql database.

<!-- >[!IMPORTANT]
> Vi har valgt å ta med `DATABASE_URL` i dette README-filen, men dette er en praksis som ellers ikke anbefales å gjøre. Dette er bare for å gjøre det enklere å medstudentvurdere/sensurere. `DATABASE_URL="postgresql://admin:123@localhost:5432/webdev` -->

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

3. (Valgfri) Seede databasen med brukere og reviews.
   Den starter på id 20, så dersom du har brukere med id 20+ blir disse slettet.
   Du kan kjøre scriptet flere ganger uten å få dupliserte reviews/favorites.
   Legg reviews.json og users.json filene i db-mappen.

```bash
cd backend
npm run seed
```

4. For å kjøre koden

```bash
npm run dev
```

## Har du backend problemer?

Serveren holdes gående kontinuerlig ved hjelp av PM2 (Process Manager 2), som sikrer at den automatisk starter opp igjen ved eventuelle feil eller server-restart.

Dersom den likevel har stoppet/kræsjet, kan den restartes ved hjelp av følgende kommandoer:

1. Naviger til backend-mappen som ligger under brukeren "jennicad":

   ```bash
   cd home/jennicad/backend/backend
   ```

2. Sjekk om serveren er der:

   ```bash
   pm2 list
   ```

   1. Dersom serveren er der, men status kommer opp som 'stopped' kjør:
      ```bash
      pm2 start 0
      ```
   2. Dersom du ikke får opp serveren, start den med PM2:

      ```bash
      pm2 start dist/server.js
      ```

> [!IMPORTANT]
> Gjerne kontakt oss dersom feilen ikke løser seg. Kontaktinformasjon finner du på [README.md](../README.md) under `Utviklet av`.
