# Realm 

Lenke til nettsiden vår: [Realm](http://it2810-01.idi.ntnu.no/project2)

**Innlevering 2 - Oppsummert:** 
- **Backend**: Database, og backend er nå satt opp i VM Teknologistakken vi har brukt kan du lese mer om [her](#teknologier). Data fra databasen er lastet opp både lokalt på utviklernes maskiner og på VM. Dersom du ønsker å teste prosjektet lokalt, må du koble deg opp på VM sin backend. Et detalijert fremgangsmåte for dette finner du i [README.md](./backend/README.md)-filen under backend-mappen. Jeg anbefaler likevel å teste løsningen via lenken til den hostede nettsiden, og eventuelt se gjennom kodebasen for å kunne svare på spørsmålene i medstudentvurderingen. 
- **Frontend**: Vi har implementert en informasjonskort-komponent for å vise detalijer om hvert enkelt spill. I tillegger det lagt til dark mode, søkefunksjon, filtermuligheter på dicovery-siden, samt søtte for å utforske over 50 000 spill.

> [!IMPORTANT]
> For innlevering 2: Denne seksjonen **Innlevering # - Oppsummert:** vil bli fjernet ved endelig levering, den 14.11.25

## Innholdsfortegnelse
- [Realm](#realm-1)
- [Utviklet av](#utviklet-av)
- [De ulike sidene i applikasjonen](#de-ulike-sidene-i-applikasjonen)
- [Designvalg](#designvalg)
- [Teknologier](#teknologier)
- [Testing](#testing)
- [Hvordan kjøre kode](#hvordan-kjøre-kode)
- [Hvordan teste](#hvordan-teste)
- [Diverse informasjon](#diverse-informasjon)


## Realm 
Realm er ikke bare en nettside, det er en portal til spilluniverset! Her kan du oppdage og utforske de råeste spillene, og få enkel tilgang til både rangeringer og topplister.

Målet med Realm er å gjøre det superenkelt å finne neste spillopplevelse, enten du; vil prøve noe helt nytt, trenger litt inspirasjon, eller bare er nysgjerrig på hva alle andre gamer om dagen.

<em>Realm er din guide, din oppdager og din inngangsbillett til spillverdenen.</em>

![Homepage](./frontend/src/assets/homepage.png)

## Utviklet av:

- Sylvia Suet Wai Yung, <sylvia.yung@ntnu.no>
- Jennica Duong, <jennica.duong@ntnu.no>
- Nicolay Emil Fremstad Løvlie, <nelovlie@stud.ntnu.no>
- Gustav Skrefsrud, <gustaskr@stud.ntnu.no>

## De ulike sidene i applikasjonen

### Hjemmeside: 
Hjemmesiden består av en spillkarusell som fremhever utvalgte titler. Rett over der finner brukeren en seksjon som viser populære spill, noe som gjør det enkelt å oppdage hvilke spill som trender akkurat nå.

I tillegg har siden en navbar som gir mulighet til å:
- Navigere tilbake til hjemmesiden
- Gå til en favoritt-side (kommer senere)
- Logge inn (Ikke tilgjengelig via VM grunnet Auth0 HTTPs krav, mer om dette kan leses [her](#diverse-informasjon))
- Bytte til dark mode
- Søke etter spill 

### Discovery-side 
Resultatsiden gir muligheten til filtrering av sjanger, tags, kategorier, plattformer og topputgivere. Brukeren har også muligheten til å gjøre ulike sorteringer i form av: 
- Popularitet (kommer senere)
- Utgivelsesår 
- Alfabetisk 
- Rating (kommer senere)

Ikke minst har også brukeren muligheten til å bla gjennom 9 ulike spill om gangen, og velge side nummer (kommer senere).

### Spillside

Ved å klikke på et spill blir man tatt med videre til spillsiden. Her blir brukeren presentert for diverse infomasjoner om spillet. På spillsiden vil man få muligheten til å gjøre følgende: 
- Skrive en anmeldelse om spillet (kommer senere)
- Favorisere spillet (kommer senere)
- Se antall stjerne vurderinger (kommer senere)

### Favorittside
Kommer i neste Sprint. 

### Profilside
Profilsiden er kun tilgjengelig lokalt, grunnet Auth0 og dens krav for HTTPs og ikke HTTP. Mer informasjon kan leses under [Diverse Informasjon](#diverse-informasjon). Profilsiden presenterer brukerdata som navn, brukernavn, og epost. På siden vil man også ha muligheten til å logge ut. 

## Designvalg

### Valg av data
Vi har valgt å bruke [Steam-data](https://github.com/leinstay/steamdb/blob/main/steamdb.json?fbclid=IwY2xjawNDjqZleHRuA2FlbQIxMQABHsCnZkZy_MaG1QZaY4JE-drjoaUiFSmVxhe9muo9Jg_aEjf3uDMQxz13Ov-S_aem_QnaD-SItGO9e7gRzCDddyw) som grunnlag for prosjektet vårt. Databasen inneholder et bredt spekter av variabler - alt fra bilder, titler og sjangre til pris og en rekke andre underfelter. Dette gir oss et solid utgangspunkt for å bygge mer komplekse komponenter. Målet er å hente inn denne dataen, lagre den i vår egen database og skreddesy den til vår behov. Siden Steam-dataen inneholder mange felter vi ikke har behov for, vil vi filtrere og tilpasse informasjonen slik at vi sitter igjen med akkurat det som er mest relevant for vår plattform.  

### Valg knyttet til søk, filtrering, og sortering

#### Søk
Applikasjonen tilbyr fem ulike søkemetoder: spill, sjanger, kategori, publisher og tag-søk. Hver søkeoperasjon returnerer opptil seks resultater, men også alle resultater som stemmer ved å trykke på søk. Da vil du bli tatt med videre inn til disovery siden. For å forbedre ytelse og brukeropplevelse har vi implementert en debounce-funksjon som begrenser antall forespørsler ved å hente resultater hvert 200 millisekund.

Vi har lagt vekt på å gi brukeren stor fleksibilitet i søkefunksjonen. Dersom en bruker for eksempel søker etter “Portal”, vil applikasjonen returnere alle spill som inneholder dette ordet i tittel, tag, kategori eller sjanger. Søkeparametrene håndteres via URL-query parameters i stedet for lokal- eller sesjonslagring. Dette muliggjør at søk kan deles mellom brukere ved å kopiere og dele den gjeldende URL-en, som dermed reflekterer søkets nåværende tilstand.

#### Filtering
Filtreringsfunksjonaliteten er tilgjengelig på Discover-siden. Her er filtreringen implementert på backend, fremfor å skje lokalt i frontend. Dette valget gjør det mulig å filtrere basert på hele datasettet, og ikke kun på de elementene som allerede er lastet inn i klienten.

#### Sortering
På Discover-siden kan brukeren også sortere spill basert på ulike kriterier: popularitet, utgivelsesdato, alfabetisk rekkefølge, og anbefalinger. Sorteringen utføres på backend, slik at resultatet reflekterer hele datagrunnlaget fremfor kun de dataene som er tilgjengelige lokalt i applikasjonen. 

<!-- ### Valg knyttet til bærekraft -->
<!-- 
### Valg knyttet til tilgjengelighet
Vi har hatt et sterkt fokus på tilgjengelighet i utviklingen av applikasjonen. Frontenden er bygget med Shadcn/UI, som benytter Radix UI Primitives som grunnlag. Dette rammeverket følger WAI-ARIA-retningslinjene og håndterer sentrale aspekter som tastaturnavigasjon, fokusstyring og støtte for skjermlesere. Dermed får vi et solid utgangspunkt der mange tilgjengelighetsfunksjoner er innebygd, samtidig som vi har full kontroll til å tilpasse og forbedre komponentene etter behov.

For å sikre best mulig brukeropplevelse har vi selv lagt til ARIA-attributter der det manglet, og justert fargekontraster for å bedre lesbarhet for brukere med fargesynshemninger. Vi har også implementert tabbing for effektiv tastaturnavigasjon. Selv om Shadcn/UI tilbyr et sterkt fundament for universell utforming, har vi vært bevisste på at sluttresultatet avhenger av utviklerens egen implementasjon, og har derfor gjort egne tiltak for å ivareta tilgjengeligheten fullt ut. -->

<!-- ### Valg knyttet til global tilstandshåndtering -->

### Valg knyttet til gjenbrukbar kode
I prosjektet har vi hatt et sterkt fokus på å utvikle små og gjenbrukbare komponenter. Dette innebærer at vi bygger større komponenter ved å kombinere mindre og mer generelle byggeklosser. Et eksempel på dette er PromoCard og GameCard, som begge benytter den felles komponenten GameCardBase. Denne tilnærmingen gjør koden enklere å vedlikeholde, gjenbruke og utvide.

Vi har bevisst unngått å legge omfattende logikk direkte i page-komponentene, og heller flyttet mest mulig funksjonalitet ned i gjenbrukbare komponenter og custom hooks. Noe logikk er likevel bevart på sidenivå, da det fungerer som et overordnet kontrollpunkt for datahåndtering og tilstandsstyring mellom flere underkomponenter. På denne måten blir sidekomponentene ansvarlige for å koordinere dataflyt og helhetlig struktur, mens de mindre komponentene fokuserer på spesifikke deler av brukergrensesnittet. Dette gir en ryddig arkitektur der ansvarsområder er tydelig fordelt, samtidig som koden er lett å lese og forstå for hele utviklingsteamet.

## Teknologier
### Frontend
- `React` og `TypeScript`
  - Vi bygger frontend med React kombinert med TypeScript. React gjør det enkelt å lage dynamiske og komponentbaserte grensesnitt, der alt kan gjenbrukes og oppdateres effektivt. TypeScript gir ekstra trygghet ved å sjekke typer under utvikling, noe som reduserer bugs og gjør koden mer pålitelig. 
- `React Router`
  - For å håndtere flere "sider" i vår prosjekt, bruker vi React Router. Dette gir oss muligheten til å navigere sømløst mellom ulike deler av applikasjonen, samtidig som brukeropplevelsen blir rask og flytende. 
- `Tailwind CSS`
  - Vi bruker Tailwind CSS til all styling. Tailwind gjør det raskt og intuitivt å designe komponenter og sider uten å skrive masse tilpasset CSS. Det gir også god støtte for ulike nettlesere rett ut av boksen. 
- `HeroIcons` & `Lucide`
  - Ikoner henter vi fra HeroIcons og Lucide, som gir et stort utvalg moderne og stilrene ikoner. Disse kan enkelt brukes i komponentene våre, noe som gjør grensesnittet både mer visuelt appelerende og brukervennlig. 
- `Shadcn`
  - Vi benytter oss av Shadcn/UI for å bygge moderne og tilgjengelige brukergrensesnitt basert på React og Tailwind CSS. Shadcn tilbyr et omfattende bibliotek av ferdige, men fleksible komponenter som enkelt kan tilpasses prosjektets designprofil. Dette bidrar til et mer konsistent og profesjonelt visuelt uttrykk, samtidig som utviklerstiden reduseres. 
- `Auth0`
  - For autentisering og brukerhåndtering har vi implementert Auth0, en tredjepartstjeneste som tilbyr en sikker og standardisert løsning for innlogging og autorisasjon. For mer informasjon om dette kan leses [her](#diverse-informasjon)
- `Apollo client` (GraphQL)
  - For kommunikasjon mellom frontend og backend benytter vi Apollo Client sammend med GraphQL. Apollo Client gjør det enkelt å hente, cache og oppdatere data på en effektiv måte, og bidrar til at applikasjonen forblir responsiv og konsistent. 

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


## Testing

<!-- **Cypress** -->

**Enhetstester**

Vi har lagd enhetstesting til alle komponentene våre for å verifisere funksjonalitene deres. På denne måten hjelper det oss med å identifisere bugs tidlig, forberede kodekvaliteten, og sikrer at endringene vi gjør ikke medfører til nye problemer. 

Vi har testet reponsivitet gjennom manuelle tester via nettleserens sin inspiser modus. 

## Hvordan kjøre kode
Dette prosjektet er splittet opp i to ulike undermapper, `frontend` og `backend`. De har sine individuelle packages som må kjøres fra deres respektive undermapper. Les gjennom README's til disse mappene for instruksjoner på hvordan man kan installere og kjøre hver av dem.

> [!NOTE]
> Miljøvariablene som trengs for å kjøre applikasjonen kan man finne i vår VM under `/home/jennciad/backend/.env`. Dersom du ønsker å kopiere dette for å bruke lokalt, må du legge de under .env filen i `backend` folder for at ting skal funke. Mer informasjon står i de respektive README filene.

- [Frontend Instruksjoner](./frontend/README.md)
- [Backend Instruksjoner](./backend/README.md)


## Hvordan teste

<!-- ### End to end tester -->

### Komponenttester
For å kjøre komponenttestene, pass på at du er i frontend mappen og kjør følgende kommando: 
```bash
npm run test
```

## Diverse informasjon 
- **Side som ikke svarer**
  - Dersom siden ser ut til å ikke være tilgjengelig, pass på at du er koblet til NTNU sine nettverker, enten gjennom eduroam eller ved å bruke NTNU VPN.
  - Et annet problem kan være at backend ikke kjøres. Dersom dette er tilfellet, les gjennom [README for backend](./backend/README.md). 
- **Mangler miljøvariabler - env filer**
  - Pass på at du har korrekt .env variabler. Mer om dette står kan leses [her](#hvordan-kjøre-kode).
- **Auth0**
  - I Sprint 2 har vi implementert et innloggings- og profilsystem ved hjelp av tredjepartstjenesten Auth0. Valget av Auth0 ble gjort for å redusere kompleksiteten ved å utvikle et eget autentiseringssystem og for å dra nytte av en etablert løsning med innebygd sikkerhet og støtte for moderne autentiseringsprotokoller.
  - Det er imidlertid verdt å merke seg at Auth0 per nå kun fungerer i det lokale utviklingsmiljøet, og ikke på den distribuerte nettsiden. Under arbeidet med Sprint 2 (innlevering 18.10.25) oppdaget vi at Auth0 krever en sikker tilkobling (HTTPS) for å fungere korrekt, mens vår nettside for øyeblikket benytter HTTP. Dette har medført at autentiseringsløsningen ikke er tilgjengelig i produksjonsmiljøet.
  - Vi har valgt å beholde Auth0-koden i kodebasen, ettersom betydelig tid og arbeid er lagt ned i implementasjonen. Vi håper dette blir tatt i betraktning ved vurdering og sensurering av prosjektet. Da vi har vært i dialog med emneansvarlig. For å teste funksjonaliteten lokalt kan instruksjonene i README-filene under hver submappe følges.



