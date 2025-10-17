# Realm (Midlertidig navn)

Lenke til nettsiden vår: 

**Innlevering 1:** 
- **Backend**: Foreløping er backend hardkodet ved hjelp av en JSON-fil. Oppsett av database er planlagt til Sprint 2. Det er nå kun satt opp techstacken. 
- **Frontend**: Navbar, promosseksjonen og en seksjon for "featured events" er implementert og koblet til den statiske JSON-filen.

## Innholdsfortegnelse
- [Realm](#realm-midlertidig-navn-1)
- [Utviklet av](#utviklet-av)
- [Designvalg](#designvalg)
- [Teknologier](#teknologier)
- [Oppsett for lokal kjøring](#oppsett-for-lokal-kjøring)


## Realm (Midlertidig navn)
Realm er ikke bare en nettside, det er en portal til spilluniverset! Her kan du oppdage de råeste spillene som finnes akkurat nå, utforske hva som trender, og få enkel tilgang til både rangeringer og topplister.

Målet med Realm er å gjøre det superenkelt å finne neste spillopplevelse, enten du; vil prøve noe helt nytt, trenger litt inspirasjon, eller bare er nysgjerrig på hva alle andre gamer om dagen.

<em>Realm er din guide, din oppdager og din inngangsbillett til spillverdenen.</em>

### Applikasjon og de ulike sidene forklares i følgende gjennomgang

### Hjemmeside: 
Hjemmesiden består av en spillkarusell som fremhever utvalgte titler. Rett under finner brukeren en seksjon som viser populære spill, noe som gjør det enkelt å oppdage hvilke spill som trender akkurat nå.

I tillegg har siden en navbar som gir mulighet til å:
- Navigere tilbake til hjemmesiden
- Gå til en favoritt-side (kommer senere)
- Logge inn (kommer senere)
- Bytte til dark mode (kommer senere)
- Søke etter spill (kommer senere)

### Resultatside 
### Spillside
### Favorittside
### Profilside
### Logge inn og ut side

## Utviklet av:

- Sylvia Suet Wai Yung, <sylvia.yung@ntnu.no>
- Jennica Duong, <jennica.duong@ntnu.no>
- Gustav Skrefsrud, <gustaskr@stud.ntnu.no>
- Nicolay Emil Fremstad Løvlie, <nelovlie@stud.ntnu.no>

## Designvalg

### Valg av data
Vi har valgt å bruke [Steam-data](https://github.com/leinstay/steamdb/blob/main/steamdb.json?fbclid=IwY2xjawNDjqZleHRuA2FlbQIxMQABHsCnZkZy_MaG1QZaY4JE-drjoaUiFSmVxhe9muo9Jg_aEjf3uDMQxz13Ov-S_aem_QnaD-SItGO9e7gRzCDddyw) som grunnlag for prosjektet vårt. Databasen inneholder et bredt spekter av variabler - alt fra bilder, titler og sjangre til pris og en rekke andre underfelter. Dette gir oss et solid utgangspunkt for å bygge mer komplekse komponenter. Målet er å hente inn denne dataen, lagre den i vår egen database og skreddesy den til vår behov. Siden Steam-dataen inneholder mange felter vi ikke har behov for, vil vi filtrere og tilpasse informasjonen slik at vi sitter igjen med akkurat det som er mest relevant for vår plattform.  

<!-- ### Valg knyttet til søk, filtrering, og sortering

#### Søk

#### Filtering

#### Sortering

### Valg knyttet til bærekraft

### Valg knyttet til tilgjengelighet

### Valg knyttet til global tilstandshåndtering

### Valg knyttet til gjenbrukbar kode -->

## Teknologier
### Frontend
- `React` og `TypeScript`
  - Vi bygger frontend med React kombinert med TypeScript. React gjør det enkelt å lage dynamiske og komponentbaserte grensesnitt, der alt kan gjenbrukes og oppdateres effektivt. TypeScript gir ekstra trygghet ved å sjekke typer under utvikling, noe som reduserer bugs og gjør koden mer pålitelig. 
- `React Router`
  - For å håndtere flere "sider" i vår prosjekt, bruker vi React Router. Dette gir oss muligheten til å navigere sømløst mellom ulike deler av applikasjonen, samtidig som brukeropplevelsen blir rask og flytende. 
- `Tailwind CSS`
  - Vi bruker Tailwind CSS til all styling. Tailwind gjør det raskt og intuitivt å designe komponenter og sider uten å skrive masse tilpasset CSS. Det gir også god støtte for ulike nettlesere rett ut av boksen. 
- `HeroIcons`
  - Ikoner henter vi fra HeroIcons, som gir et stort utvalg moderne og stilrene ikoner. Disse kan enkelt brukes i komponentene våre, noe som gjør grensesnittet både mer visuelt appelerende og brukervennlig. 

Les [README for frontend her](frontend/README.md)

### Backend
- `Apollo Server`
  - Vi bruker Apollo Server som en grunnmur for backend. Apollo gir oss et fleksibelt og moderne rammeverk for å bygge GraphQL APIer, og lar oss strukturere og hente data på en effektiv måte. Per nå kjører vi Apollo Server "standalone", noe som gjør oppsettet enkelre i denne fasen av prosjektet. 

- `GraphQL`
  - GraphQL er språket vi bruker for kommunikasjon mellom klient og server. I stedet for å ha faste endepunkter som i REST, kan vi ha GraphQL spørringer slik at klienten kun henter akkurat den dataen den trenger. Dette gir mindre overføring, men kontroll og mer fleksibilitet i frontend. 

- `Prisma + PostgreSQL`
  - Vi bruker Prisma sammen med PostgreSQL som database. PostgreSQL er en kraftig og stabil relasjonsdatabase som lagrer data på en strukturert måte og skalerer godt. Prisma fungerer som en type-sikkert lag mellom applikasjonen vår og databasen, slik at vi kan definere datamodeller og hente eller oppdatere data uten å skrive rå SQL. 
  - Prisma genrerer en klient som vi kan bruke i backend-koden for å gjøre spørringer og oppdateringer mot PostgreSQL på en enkel og sikker måte. 
- `dotenv`
  - Vi bruker dotenv for å håndtere miljøvariabler. Dette gjør at sensitive nøkler og instillinger kan lagres sikkert uten å legge dem direkte inn i koden. 


Les [README for backend her](backend/README.md)

## Oppsett for lokal kjøring
### Frontend kan kjøres med:
```bash
cd frontend
npm ci
npm run dev
```
### Backend kan kjøres med:
> [!IMPORTANT]
> For innlevering 1: En viktig ting å påpeke er at backend techstack kun er satt opp. Det vil si at det ikke er nødvendig å kjøre backend for å teste frontend for denne innleveringen. Det er derfor ikke nødvendig å kjøre backend, da man må installere postgreSQL på sin lokale PC. 
Fra root nivå, naviger til backend mappen: 
```bash
cd backend
npm install
```

Kjør koden under, og fyll inn URL til lokal-database på .env filen.
```bash
cp .env.template .env
```
- **DATABASE_URL**: URL til din lokale database

Deretter generere Prisma Client:

```bash
npx prisma generate
npm start
```

<!-- ## Testing

**Cypress**

**Enhetstester** -->

<!-- ## Hvordan teste

### End to end tester

### Komponenttester -->



