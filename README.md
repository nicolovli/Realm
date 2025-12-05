# Realm

Lenke til nettsiden vår: [Realm](http://it2810-01.idi.ntnu.no/project2)

> [!NOTE]
> Vi har valgt å lage releases og tags for hver sprint innlevering. Det er derfor mulig å se gjennom kodebasen fra alle innleveringene. På denne måten kan man se mengden arbeid og endringer som har blitt gjort gjennom sprintene, frem mot den endelige produktet

## Innholdsfortegnelse

- [Realm](#realm-1)
- [Utviklet av](#utviklet-av)
- [Projektstruktur](#projektstruktur)
- [Funksjonalitet](#funksjonalitet)
- [Designvalg](#designvalg)
- [Teknologier](#teknologier)
- [Testing](#testing)
- [Hvordan kjøre kode](#hvordan-kjøre-kode)
  - [Innlogging](#innlogging)
- [Hvordan teste](#hvordan-teste)
- [Bruk av KI](#bruk-av-ki)
- [Endringer gjort etter medstudentvurderingen](#endringer-gjort-etter-medstudentvurderingen)
- [Hva vi ville gjort annerledes](#hva-vi-ville-gjort-annerledes)
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

## Projektstruktur

<details>
<summary>Klikk her for å se prosjektstrukturen</summary>

```
T01-Project-2/
├── .github/                         # GitHub-relaterte filer for samarbeid og CI
|   ├── workflows/                   # CI pipeline for backend og frontend byggetester og deploy
|   ├── CODEOWNERS                   # CODEOWNERS fil for PR
|   └── Pull_request_template.md     # Standard mal for PR
├── backend/                         # Backend Express-applikasjon
|   ├── db/                          # Seed filer
|   ├── prisma/                      # Databaselagring og ORM-konfigurasjon med Prisma
|   |   ├── migrations/              # Genererte migrasjoner for databaseendringer
|   |   └── schema.prisma            # Databaseskjema og modell-definisjoner
|   ├── src/
|   |   ├── constants/               # Globale konstanter brukt i applikasjonen
|   |   ├── graphql/                 # GraphQL-skjema, resolvers og typer
|   |   |   ├── filter/              # Filtreringsrelaterte resolvers og typer
|   |   |   ├── game/                # Game-relaterte resolvers, queries og mutations
|   |   |   ├── review/              # Review-relaterte resolvers og datalogikk
|   |   |   ├── user/                # Brukerautentisering og brukerdatahåndtering
|   |   |   ├── utils/               # Cache og cursor relevante filer
|   |   |   ├── baseTypeDefs.ts      # Grunnleggende GraphQL-typeDef som definerer tomme Query- og Mutation-typer
|   |   |   ├── context.ts           # Context-object som injiserer Prisma-klient og evt bruker-ID i hver request
|   |   |   └── index.ts             # Samler og merger alle GraphQL-typeDefs og resovlers til ett komplett API
|   |   ├── scripts/                 # Skript som importerer data fra JSON og fyller databasen lokalt eller på VM
|   |   ├── test/                    # Backend-tester
|   |   ├── db.ts                    # Databaseklient og tilkoblingshåndtering
|   |   └── server.ts                # Oppstart og konfigurasjon av Express-server
|   ├── .env.template                # Template for .env fil
|   ├── package.json
|   └── README.md
├── frontend/                        # Frontend React-applikasjon
|   ├── cypress/                     # Cypress ende-til-ende tester
|   ├── public/                      # Statiske fil som favicon
|   ├── src/
|   |   ├── assets/                  # Bilder, og andre mediefiler
|   |   ├── components/              # React-komponenter
|   |   |   ├── FeaturedSection/     # Seksjon for fremhevende spill
|   |   |   ├── Header/              # Hamburgermeny og Navigasjonsmeny
|   |   |   |  ├── Searchbar/        # Komponenter for søking
|   |   |   ├── InformationCards/    # Kortkomponent som viser spill informasjon
|   |   |   ├── ResultFilters/       # Filtreringskomponenter
|   |   |   ├── ResultsGrid/         # Grid-visning for spillresultater
|   |   |   ├── Reviews/             # Komponenter for brukeranmeldelser
|   |   |   ├── Skeletons/           # Lasteanimasjoner (loading states)
|   |   |   ├── ui/                  # Shadcn UI-elementer
|   |   |   └── User/                # Brukerrelaterte komponenter som login og profil
|   |   ├── constants/               # Globale konstanter
|   |   ├── hooks/                   # Custom React-hooks for delte logikkfunksjoner
|   |   |   ├── resultFilters/       # Hooks relevant for Filterlogikk
|   |   |   ├── reviews/             # Hooks relevant for Reviews
|   |   |   ├── search/              # Hooks relevant for søking
|   |   ├── lib/                     # Hjelpefunksjoner og konfigurasjon (utils, apolloClient)
|   |   |   └── graphql/             # Håndtering av GraphQL-spørringer og mutasjoner for kommunikasjon med backend
|   |   |   └── utils/               # Hjelpefunksjoner
|   |   ├── pages/                   # Sidekomponenter
|   |   ├── test/                    # Enhetstester og komponenttester
|   |   ├── types/                   # TypeScript-typer og interfaces
|   |   ├── App.tsx                  # Hovedkomponent for hele applikasjonen
|   |   ├── index.css                # Globale CSS-styling for typ font, og egen definert farger
|   |   └── main.tsx                 # Inngangspunkt for rendrer React-applikasjonen
|   ├── .env.development             # Miljøvariabler for lokal utvikling
|   ├── .env.production              # Miljøvariabler for produksjonsmiljø
|   ├── package.json
|   └── README.md
├── package.json
├── CHANGES.md                       # Endringene som gruppa har gjort basert på medstudentvurdering 4
├── REVIEWS.md                       # Generert medstudentvurdering fra innlevering 4 fra foreleser
└── README.md
```

</details>

## Funksjonalitet

### Søkefunksjon

- 3 ulike søkemetoder: spill, publisher og tag-søk.
- Viser en liten dropdown med opptil 6 forhåndsvisninger av søkeresultater, men også alt ved å trykke på "søk".
- Debounce-funksjon - hente resultater hvert 200 millisekund.
- URL-query paramter istedenfor lokal- eller sessionstorage.
- Case-insensitiv søk.
- [Klikk her](#søk) for mer informasjon

### Listevisning av søkeresultater

- Søkeresultatene vises først som et resultat av 6 spill.
- Ved å klikke på "søk" blir man tatt med videre til "discovery" siden.
- Bruker blir presentert 12 forskjellige spill.
- Brukeren kan bla og velge sidenummer - cursor-paginering.

### Sortering og filtrering av resultater

- Bruker kan sortere på 8 ulike måter:
  - Mest populær
  - Minst populær
  - Lanseringsdato eldst
  - Lanseringsdato nylig
  - A - Z
  - Z - A
  - Høyest rating
  - Lavest rating
- Brukeren har 5 ulike filtreringsmetoder:
  - Sjanger
  - Tags
  - Kategorier
  - Plattformer
  - De største forlagene
- Filtrering og sortering blir en URL-query parameter
- [Klikk her](#filtering) for mer informasjon.

### Detaljvisning av objekter

- Bruker kan klikke på spill og bli videreført til informasjonsiden, hvor hen blir presentert informasjon om spillet.
- Brukere kan lese andre reviews, og klikke på en "read more" for flere reviews gjennom scrolling.

### Brukergenererte data

- Bruker kan legge inn review på informasjonssiden om spillet.
- Bruker kan endre, og slette review.
- Bruker kan legge inn ratings - stjerne.
- Bruker kan favorisere spill, og dette blir lagret i en favorite page.
- Brukeren kan endre kontoinformasjon som brukernavn, e-postadresse og passord.
- Admin bruker kan administrere, og endre andre brukeres kommentarer.
- Admin kan overvåke og slette andre sine kommentarer.

### Persistent datalagring i database

- Lagring av brukergenererte data nevnt over
- Lagring av opprettede brukere
  - Case-insensitiv brukernavn
  - Unik brukernavn og epost
  - Sikker innlogging med JWT tokens

### Universell utforming / web accessibility

- ARIA-labels, tabing gjennom tastaturnavigasjon
- Optimal kontrast i både dark og light mode.
- Mobile og dekstop versjon tilgjengelig
- Mer informasjon kan leses [her](#valg-knyttet-til-tilgjengelighet)

### Bærekraftig webdesign

- Debounced søk
- Lazy loading
- Effektiv henting av opptil 60 000 spill
- Skeleton for loading
- Benytte av gratis font istedenfor importert

## Kodeorganisering og arkitektur

### Barrel Filer (index.ts)

Vi bruker barrel filer (index.ts) for å eksportere komponenter og moduler fra mapper. Dette gjør det enklere å importere flere relaterte elementer fra en enkelt plass og skjuler interne mappestruktur.

### Sentraliserte typer

**Frontend:**
Frontend har en dedikert `types/` folder for alle TypeScript type- og interface-definisjoner.

**Backend:**
Backend har typer spredt i hver GraphQL-modul (`game/gameTypes.ts`, `user/userTypes.ts`, osv.).

## Designvalg

### Valg av data

Vi har valgt å bruke [Steam-data](https://github.com/leinstay/steamdb/blob/main/steamdb.json?fbclid=IwY2xjawNDjqZleHRuA2FlbQIxMQABHsCnZkZy_MaG1QZaY4JE-drjoaUiFSmVxhe9muo9Jg_aEjf3uDMQxz13Ov-S_aem_QnaD-SItGO9e7gRzCDddyw) som grunnlag for prosjektet vårt. Databasen inneholder et bredt spekter av variabler: alt fra bilder, titler og sjangre til pris og en rekke andre underfelter. Dette gir oss et solid utgangspunkt for å bygge mer komplekse komponenter. Målet er å hente inn denne dataen, lagre den i vår egen database og skreddesy den til vårt behov. Siden Steam-dataen inneholder mange felter vi ikke har behov for, vil vi filtrere og tilpasse informasjonen slik at vi sitter igjen med det som er mest relevant for vår plattform.

### Valg knyttet til søk, filtrering, og sortering

#### Søk

Applikasjonen tilbyr tre ulike søkemetoder: spill, publisher og tag-søk. Hver søkeoperasjon returnerer opptil seks resultater, men også alle resultater som stemmer ved å trykke på søk. Da vil du bli tatt med videre inn til disovery siden. For å forbedre ytelse og brukeropplevelse har vi implementert en debounce-funksjon som begrenser antall forespørsler ved å hente resultater hvert 200 millisekund.

Vi har lagt vekt på å gi brukeren stor fleksibilitet i søkefunksjonen. Dersom en bruker for eksempel søker etter “Portal”, vil applikasjonen returnere alle spill som inneholder dette ordet i tittel, tag eller publisher. Søkeparametrene håndteres via URL-query parameters i stedet for lokal- eller sesjonslagring. Dette muliggjør at søk kan deles mellom brukere ved å kopiere og dele den gjeldende URL-en, som dermed reflekterer søkets nåværende tilstand.

Under panseret bruker backend en Postgres-basert tekstindeks. Søkestrengen normaliseres, splittes i ord og oversettes til `contains`/`startsWith`-klosser på feltene vi bryr oss om. I tillegg gjør vi prefiksoppslag på publishers og tags og legger disse som OR-grener i samme spørring. Hele WHERE-klossen (søk + filtre) sendes i én Prisma-spørring, slik at både resultatlisten, tellingen og Autocomplete treffer databaseindeksen direkte. Resultatet er et søk som føles “lett”, men likevel tåler kombinasjoner av filtre og søk uten å hente mer data enn nødvendig.

#### Filtering

Filtreringsfunksjonaliteten er tilgjengelig på Discover-siden. Her er filtreringen implementert på backend, fremfor å skje lokalt i frontend. Dette valget gjør det mulig å filtrere basert på hele datasettet, og ikke kun på de elementene som allerede er lastet inn i klienten.

Hver gang du endrer et filter, sender frontend en GraphQL-spørring til backend som filtrerer direkte i databasen. Dermed ser du alltid resultatet fra hele katalogen, ikke bare det som allerede er lastet inn i nettleseren. Når vi ikke søker, spør vi også backend om hvilke filtervalg som fremdeles gir treff og gråer ut resten; under aktive søk går det ann å hoppe over denne spørringen for å holde responsen rask. Dette gjelder spesielt på VM (Mer informasjon kan leses [her](#hva-vi-ville-gjort-annerledes)). Dersom man ønsker å skru av/på denne funksjonen sammen med aktive søk, kan man sette `useAvailableResultFiltersOnSearch` til true øverst i både [her](./backend/src/graphql/filter/filterResolvers.ts) og [her](/frontend/src/hooks/resultFilters/useResultFiltersData.ts)

Vi har også valgt å definere en konstant `top publisher` som du kan finner [her](./backend/src/constants/topPublishers.ts). Dette valget ble gjort fordi databasen inneholder over 25 000 ulike publishers, noe som ville vært lite effektivt å hente ut i sin helhet. En slik prosess ville skapt unødvendig ressursbruk og dårligere brukeropplevelse. For å fremme ytelse, bærekraft og relevans, har vi derfor valgt å kun inkludere et utvalg av de mest kjente og populære publisherne på markedet i filterseksjonen, men man kan fortsatt søke gjennom alle 25 000 publishers gjennom søkefunksjonen.

#### Sortering

På Discover-siden kan brukeren også sortere spill basert på 8 ulike kriterier: minst populær, mest populær, lanseringsdato eldst, lanseringsdato nylig, A-Z, Z-A, høyest rating, og lavest rating. Sorteringen utføres på backend, slik at resultatet reflekterer hele datagrunnlaget fremfor kun de dataene som er tilgjengelige lokalt i applikasjonen.

Nedenfor følger en kort forklaring på to av sorteringsalternativene:

- **Minst populær:** Viser spill med lavest popularitetsscore (reviews + favoriseringer × 2). Spill uten reviews eller favoriseringer vises først.
- **Lavest rating:** Viser spill med lavest vurdering først. Spill uten rating vises etter alle som har rating.
  Ved å håndtere sortering på serversiden sikres både presisjon, konsistens og bedre ytelse, uavhengig av hvor mye data som er lastet inn hos brukeren.

#### Cursor Pagination

For å håndtere store datamengder i listevisningen av søkeresultater, har vi implementert cursor pagination i backend. I stedet for å bruke tradisjonell sidebasert paginering med offset, hvor man henter resultater basert på sidetall, bruker vi en cursor som peker til det siste elementet i gjeldende resultatside. Dette gir flere fordeler: data hentes mer effektivt fra databasen, og listen forblir konsistent selv om nye spill blir lagt til eller fjernet mens brukeren blar. Cursoren sendes som en del av GraphQL-spørringen, og backend returnerer alltid neste sett med elementer basert på denne referansen. Dette gjør navigasjon gjennom søkeresultater raskere og mer pålitelig, samtidig som serverbelastningen reduseres. Vi lagrer også den siste cursoren i sessionStorage, slik at søkesiden kan åpnes igjen og hente neste side uten å beregne alt på nytt. Dette gjør at brukeren beholder posisjonen sin i listen og at unødvendig tunge spørringer unngås.

### Valg knyttet til bærekraft

Vi har hatt fokus på bærekraft gjennom hele utviklingen, både i bildehåndtering, databruk og designvalg. Ettersom applikasjonen er visuelt basert, har bilder vært nødvendige, men vi har konvertert dem fra JPG til WebP og skalert dem ned ved henting for å redusere filstørrelse og forbedre ytelsen. Vi bruker også bilde-proxyen images.weserv.nl til å skalere ned spillbilder dynamisk, slik at nettleseren alltid mottar en lettversjon først. Discover-siden laster små forhåndsvisninger tidlig, og når brukeren åpner et spill vises den bufrede miniatyren mens den høyoppløste versjonen lastes i bakgrunnen.

For å begrense unødvendig trafikk mot backend benytter vi debouncing i søkefunksjonen og effektiv datainnhenting for å unngå overflødige kall. Vi har også implementert caching av data for å redusere behovet for gjentatte forespørsler til serveren. Dette gjør at brukere får raskere opplevelser ved navigasjon og gjenbesøk, samtidig som det reduserer energibruken og belastningen på serverressurser. Ved å gjenbruke tidligere hentede data i stedet for å hente alt på nytt, bidrar vi både til bedre ytelse og lavere karbonavtrykk.

Vi har valgt en enkel fargepalett med støtte for dark- og light mode, samt bruk av innebygde fonter for å redusere ressursbruk.

### Valg knyttet til tilgjengelighet

Vi har hatt et sterkt fokus på tilgjengelighet i utviklingen av applikasjonen. Frontenden er bygget med Shadcn/UI, som benytter Radix UI Primitives som grunnlag. Dette rammeverket følger WAI-ARIA-retningslinjene og håndterer sentrale aspekter som tastaturnavigasjon, fokusstyring og støtte for skjermlesere. Dermed får vi et solid utgangspunkt der mange tilgjengelighetsfunksjoner er innebygd, samtidig som vi har full kontroll til å tilpasse og forbedre komponentene etter behov.

For å sikre best mulig brukeropplevelse har vi selv lagt til ARIA-attributter der det manglet, og justert fargekontraster for å bedre lesbarhet for brukere med fargesynshemninger. Vi har også implementert tabbing for effektiv tastaturnavigasjon.

Ytterligere har vi brukt Lighthouse i inspeksjonsmodus (Google Chrome DevTools) for å teste og forbedre tilgjengeligheten i løsningen. Dette har gjort det mulig å identifisere mangler og justere både struktur og kontraster for å møte kravene til universell utforming.

Selv om Shadcn/UI tilbyr et sterkt fundament for universell utforming, har vi vært bevisste på at sluttresultatet avhenger av utviklerens egen implementasjon, og har derfor gjort egne tiltak for å ivareta tilgjengeligheten fullt ut.

### Valg knyttet til global tilstandshåndtering

Vi bruker Apollo Client med InMemoryCache som hovedverktøy for global tilstand og caching av GraphQL-data. Cache-oppsettet er enkelt og bygger på standard normalisering. Vi bruker fetchPolicy og målrettet refetch i stedet for komplekse cache-modifikasjoner for å sikre konsistens og enkelhet.

I tillegg fungerer cachen som en lettvekts global tilstandsbuffer: spørringer som spill, filtre og telleverdier lagres per variabelsett, slik at data gjenbrukes når brukeren går tilbake til en visning. Cachen invalideres automatisk ved relevante mutasjoner, noe som reduserer behovet for manuell tilstandshåndtering og forbedrer opplevd ytelse. På backend-nivå memoisers enkelte filteralternativer i noen minutter per søke- og filterkombinasjon, mens øvrige resolvere henter data direkte gjennom databaseindekser uten egen caching.

UI-relatert tilstand håndteres lokalt i komponenter og hooks, mens URL brukes som “source of truth” for filtre og sortering slik at deling og navigasjon fungerer sømløst.

### Valg knyttet til gjenbrukbar kode

I prosjektet har vi hatt et sterkt fokus på å utvikle små og gjenbrukbare komponenter. Dette innebærer at vi bygger større komponenter ved å kombinere mindre og mer generelle byggeklosser. Et eksempel på dette er PromoCard og GameCardDetail, som begge benytter den felles komponenten GameCardBase. Denne tilnærmingen gjør koden enklere å vedlikeholde, gjenbruke og utvide.

Vi har bevisst unngått å legge omfattende logikk direkte i page-komponentene, og heller flyttet mest mulig funksjonalitet ned i gjenbrukbare komponenter og custom hooks. Noe logikk er likevel bevart på sidenivå, da det fungerer som et overordnet kontrollpunkt for datahåndtering og tilstandsstyring mellom flere underkomponenter. På denne måten blir sidekomponentene ansvarlige for å koordinere dataflyt og helhetlig struktur, mens de mindre komponentene fokuserer på spesifikke deler av brukergrensesnittet. Dette gir en ryddig arkitektur der ansvarsområder er tydelig fordelt, samtidig som koden er lett å lese og forstå for hele utviklingsteamet.

## Teknologier

### Frontend

- `React` og `TypeScript`
  - Vi bygger frontend med React kombinert med TypeScript. React gjør det enkelt å lage dynamiske og komponentbaserte grensesnitt, der alt kan gjenbrukes og oppdateres effektivt. TypeScript gir ekstra trygghet ved å sjekke typer under utvikling, noe som reduserer bugs og gjør koden mer pålitelig.
- `React Router`
  - For å håndtere flere "sider" i vårt prosjekt, bruker vi React Router. Dette gir oss muligheten til å navigere sømløst mellom ulike deler av applikasjonen, samtidig som brukeropplevelsen blir rask og flytende.
- `Tailwind CSS`
  - Vi bruker Tailwind CSS til all styling. Tailwind gjør det raskt og intuitivt å designe komponenter og sider uten å skrive masse tilpasset CSS. Det gir også god støtte for ulike nettlesere rett ut av boksen.
- `HeroIcons` & `Lucide`
  - Ikoner henter vi fra HeroIcons og Lucide, som gir et stort utvalg moderne og stilrene ikoner. Disse kan enkelt brukes i komponentene våre, noe som gjør grensesnittet både mer visuelt appelerende og brukervennlig.
- `Shadcn`
  - Vi benytter oss av Shadcn/UI for å bygge moderne og tilgjengelige brukergrensesnitt basert på React og Tailwind CSS. Shadcn tilbyr et omfattende bibliotek av ferdige, men fleksible komponenter som enkelt kan tilpasses prosjektets designprofil. Dette bidrar til et mer konsistent og profesjonelt visuelt uttrykk, samtidig som utviklerstiden reduseres.
- `Apollo client` (GraphQL)
  - For kommunikasjon mellom frontend og backend benytter vi Apollo Client sammend med GraphQL. Apollo Client gjør det enkelt å hente, cache og oppdatere data på en effektiv måte, og bidrar til at applikasjonen forblir responsiv og konsistent.

### Backend

- `Apollo Server`
  - Vi bruker Apollo Server som en grunnmur for backend. Apollo gir oss et fleksibelt og moderne rammeverk for å bygge GraphQL APIer, og lar oss strukturere og hente data på en effektiv måte. Per nå kjører vi Apollo Server "standalone", noe som gjør oppsettet enklere i denne fasen av prosjektet.
- `GraphQL`
  - GraphQL er språket vi bruker for kommunikasjon mellom klient og server. I stedet for å ha faste endepunkter som i REST, kan vi ha GraphQL spørringer slik at klienten kun henter akkurat den dataen den trenger. Dette gir mindre overføring, men kontroll og mer fleksibilitet i frontend.
- `Prisma + PostgreSQL`
  - Vi bruker Prisma sammen med PostgreSQL som database. PostgreSQL er en kraftig og stabil relasjonsdatabase som lagrer data på en strukturert måte og skalerer godt. Prisma fungerer som et type-sikkert lag mellom applikasjonen vår og databasen, slik at vi kan definere datamodeller og hente eller oppdatere data uten å skrive rå SQL.
  - Prisma genrerer en klient som vi kan bruke i backend-koden for å gjøre spørringer og oppdateringer mot PostgreSQL på en enkel og sikker måte.
- `dotenv`
  - Vi bruker dotenv for å håndtere miljøvariabler. Dette gjør at sensitive nøkler og instillinger kan lagres sikkert uten å legge dem direkte inn i koden.
- `JsonWebToken`
  - For autentisering bruker vi JSON Web Tokens (JWT). Når en bruker logger inn, genereres et signert token som senders til klienten og brukes ved videre forespørsler. Dette gir en enkel og sikker måte å håndtere innlogginsstatus og tilgangskontroll på.
- `bcrypt`
  - Passord hashes ved hjelp av bcrypt før de lagres i databasen. Dette sørger for at passord aldri lagres i klartekst, og styrker sikkerheten mot datainnbrudd.

## Testing

**Cypress:**

Vi har implementert ende-til-ende testing ved hjelp av Cypress. Testene simulerer brukerinteraksjoner som navigasjon og innsending av skjemaer for å sikre at applikasjonen fungerer som forventet i et realistisk miljø.

**Enhetstester:**

Vi har lagd enhetstesting til alle komponentene våre for å verifisere funksjonalitene deres. På denne måten hjelper det oss med å identifisere bugs tidlig, forberede kodekvaliteten, og sikrer at endringene vi gjør ikke medfører til nye problemer.

Testfilene har beskrivende navn etter hvilke komponenter de tester, i tillegg er relaterte tester samlet inn i mapper. Større fixtures og mocks er flyttet ut fra enkelte tester der de tok omfattende plass, for å kunne isolere testene.

Testene dekker godt vanlig brukerinteraksjon og rendering av elementer (happy path), i tillegg til tastatur navigasjon, men en del edge cases er også testet for, dette innebærer:

- valideringsfeil i inputskjemaer (tomme felt, white space, passordlengde og mismatch)
- tomme lister (f.eks i Login og Register)
- nettverksfeil/GraphQL errors (feks. i ReviewForm og AuthDialog)
- loading states (f.eks i BreadCrumbs)
- skalerbarhet på store datamengder (f.eks i FilterPill og FilterChips)

**Testverktøy:**

- **jest-axe** er brukt for å systematisk teste tilgjenglighet
- **Vitest** brukes som testrammeverk
- **@testing-library/react** og **user-event** brukes for å teste rendering og brukerinteraksjon
- **MockedProvider (Apollo Client)** isolerer GraphQL-komponenter fra reelle nettverkskall

Grunnet det store omfanget av tester (180+ tester), har vi fokusert på å ha testdekning av prosjektet i bredden ved å ha mange komponenttester, men også vist at vi har kunnskap om hvordan man kan teste i dybden ved å fokusere på å godt teste de viktigste komponentene av prosjektet ved å teste kritisk funksjonalitet, brukerinteraksjon og edge cases.

**Manuelle tester for responsivitet**
Vi har testet reponsivitet gjennom manuelle tester via nettleserens sin inspiser modus.

## Hvordan kjøre kode

Dette prosjektet er splittet opp i to ulike undermapper, `frontend` og `backend`. De har sine individuelle packages som må kjøres fra deres respektive undermapper. Les gjennom README's til disse mappene for instruksjoner på hvordan man kan installere og kjøre hver av dem.

> [!NOTE]
> Miljøvariablene som trengs for å kjøre applikasjonen kan man finne i vår VM under `/home/jennicad/backend/backend/.env`. Dersom du ønsker å kopiere dette for å bruke lokalt, må du legge de under .env filen i `backend` folder for at ting skal funke. Mer informasjon står i de respektive README filene.

- [Frontend Instruksjoner](./frontend/README.md)
- [Backend Instruksjoner](./backend/README.md)

### Innlogging

Vi har full forståelse dersom man ikke ønsker å lage en bruker i vår database på vm! Derfor har vi laget en bruker som alle kan benytte seg av når de skal medstudentvurdere/sensurere vårt prosjekt.

Vanlig testbruker:

- **Brukernavn:** test
- **Passord:** 123456

Vi har også implementert administratorfunksjoner. Dette innebærer blant annet muligheten til å administrere og endre andre brukeres kommentarer, samt overvåke og slette dem ved behov.

- **Brukernavn**: admin
- **Passord**: admin123

## Hvordan teste

### End to end tester

For å kjøre ende-til-ende testing er det viktig å ha frontend kjørende.
For å kjøre kun testene uten å visualisere brukerinteraksjon; kjør følgende kode i mappen `frontend`:

> [!NOTE]
> Benytt split terminals, altså split terminalen i to, ha frontend kjørende på den ene terminalen og cypress på den andre. Begge i `cd frontend`.
> Det trengs ikke å kjøre backend, da du kobler frontend localhost med backend VM.

> [NOTE]
> Benytt split terminals, altså split terminalen i to, ha frontend kjørende på den ene terminalen og cypress på den andre. Begge i `cd frontend`.
> Det trengs ikke å kjøre backend, da du kobler frontend localhost med backend VM.

```bash
# På den ene terminalen kjør:
cd frontend
npm run dev:vm
# Vent til frontend localhost er klar før du kjører neste kode.
# På den andre terminalen kjør:
cd frontend
npm run cy:run
```

For å kjøre koden med visualisering kjør:

```bash
# På den ene terminalen kjør:
npm run dev:vm
# På den andre terminalen kjør:
npm run cy:open
```

Deretter velger du `E2E Testing`, velg så `Chrome` og trykk på `Start E2E Testing in Chrome`.
Du velger da hvilke filer du ønsker å teste og se brukerinteraksjonen live.

### Komponenttester

For å kjøre komponenttestene, pass på at du er i frontend mappen og kjør følgende kommando:

```bash
npm run test
```

### Backend tester

For å kjøre backend testene, kjør følgende:

```bash
cd backend
npm run test
```

## Bruk av KI

I prosjektet har vi benyttet kunstig intelligens, spesielt ChatGPT, som et verktøy for støtte og veiledning under utviklingsprosessen. ChatGPT har blant annet blitt brukt til å vurdere ulike tekniske valg, for eksempel forskjellen mellom cursor-pagination og tradisjonell pagination, samt vurdering av løsninger som bidrar til mer bærekraftig og effektiv kode. Vi har også brukt KI til å generere de to json filene `user.json` og `reviews.json` som har som formål å seede databasen med brukere og reviews.

Forslag og informasjon fra ChatGPT har alltid blitt nøye gjennomtenkt, diskutert og drøftet, inkludert både positive og negative sider, før vi implementerte dem i prosjektet. Alle forslag har blitt kvalitetssikret ved å dobbeltsjekke offisiell dokumentasjon, gjøre egen research, diskutere løsningene med foreleser og studentassistenter. Denne strukturerte og kritiske bruken av kunstig intelligens har gjort det mulig for oss å lære mer, samtidig som vi har utviklet funksjonell, profesjonell og ryddig kode.

Denne strukturerte og kritiske bruken av kunstig intelligens har gjort det mulig for oss å lære mer, samtidig som vi har utviklet funksjonell, profesjonell og ryddig kode. I tillegg har code review vært en sentral del av arbeidsprosessen, for å sikre at all kode følger gruppens standarder og opprettholder høy kvalitet.

## Endringer gjort etter medstudentvurderingen

Vi har kontinuerlig tatt hensyn til medstudentvurderinger og gjort endringer siden innlevering 1. Vi har derfor valgt å ha med en oversikt kun for innlevering 4, da foreleseren har generert en [REVIEWS.md](./REVIEWS.md). Basert på denne filen har vi lagd en [CHANGES.md](./CHANGES.md), her ligger en oversikt over alle endringene fra innlevering 4.

## Hva vi ville gjort annerledes:

- **Codegen**:
  - Gruppa har undersøkt og vurdert å implementere codegen for typesikkerhet i prosjektet. Dette viste seg å være mer tungvint å implementere enn vi først var klar over. Dette var grunnet at mye av prosjektet allerede var implementert, og vi var allerede i sprint 3. Da vi prøvde å refaktorere for å bruke codegen typer istedet ble refaktoreringen så omfattende og enkelte kodesnutter mer avanserte enn de originalt var. Vi kom da fram til at dersom vi var i starten av utviklingsfasen, hadde det å implementere codegen vært veldig nyttig, da det gir konsistent bruk av typer. Dette er en lærdom vi kommer til å ta med oss i fremtidige prosjekter. Forsøket på å refaktorere til codegen er i branch: 111-add-codegen-for-typechecking-in-backend.
- **Enklere queries grunnet redusert VM RAM**:
  - Databasen vår er stor, med over 50 000 spill, 30 000 utviklere og 20 000 utgivere m.m. Flere av spørringene vi bruker er ganske avanserte fordi de filtrerer og sorterer på tvers av flere tabeller. Dette fungerer veldig raskt på våre egne maskiner, men blir krevende når det kjøres på VM-en, som har begrenset RAM. I ettertid ser vi at vi burde tatt mer hensyn til dette og vurdert enklere spørringer eller en annen måte å strukturere dem på. Det var vanskelig å forutse i starten, men det er noe som kunne spart oss for tid og feilsøking.
- **API istedenfor egen database**:
  - Siden vi jobber med over 100 000 rader totalt, burde vi også vurdert å bruke en ekstern API-løsning i stedet for å hoste hele databasen selv. Problemet er ikke nødvendigvis antall rader, men ressursene som kreves for å håndtere store datamengder effektivt. En ekstern API ville sannsynligvis hatt bedre infrastruktur og mer prosessorkraft, og kunne dermed håndtert tunge spørringer bedre enn vår egen VM. Det kunne redusert flere av ytelsesproblemene vi møtte underveis. Vi kunne heller brukt databasen til brukergenerte data som hadde gjort håndteringen av data bedre.

## Diverse informasjon

- **Side som ikke svarer**
  - Dersom siden ser ut til å ikke være tilgjengelig, pass på at du er koblet til NTNU sine nettverker, enten gjennom eduroam eller ved å bruke NTNU VPN.
  - Et annet problem kan være at backend ikke kjøres. Dersom dette er tilfellet, les gjennom [README for backend](./backend/README.md).
- **Mangler miljøvariabler - env filer**
  - Pass på at du har korrekt .env variabler. Mer om dette står kan leses [her](#hvordan-kjøre-kode).
- **Migrasjons filer på backend**
  - Gruppen har valgt å beholde alle eksisterende migrasjonsfiler i prosjektet. Dette er fordi historikken i migrasjonene gir verdifull kontekst om hvordan databasen har utviklet seg over tid, og det reduserer risikoen for feil eller datatap dersom prosjektet skal kjøres i produksjon. Beholdelsen av migrasjonene sikrer dermed både sporbarhet og sikkerhet.
- **Auth0**
  - I Sprint 2 har vi implementert et innloggings- og profilsystem ved hjelp av tredjepartstjenesten Auth0. Valget av Auth0 ble gjort for å redusere kompleksiteten ved å utvikle et eget autentiseringssystem og for å dra nytte av en etablert løsning med innebygd sikkerhet og støtte for moderne autentiseringsprotokoller.
  - Det er imidlertid verdt å merke seg at Auth0 kun fungerer i det lokale utviklingsmiljøet, og ikke på den distribuerte nettsiden. Under arbeidet med Sprint 2 (innlevering 18.10.25) oppdaget vi at Auth0 krever en sikker tilkobling (HTTPS) for å fungere korrekt, mens vår nettside for øyeblikket benytter HTTP. Dette har medført at autentiseringsløsningen ikke er tilgjengelig i produksjonsmiljøet.
  - Vi har valgt å fjerne Auth0 koden, og implementere vår egen Auth løsning. Sensitiv data som password vil bli hashed ved hjelp av bycrypt.
  - Auth0 koden er fortsatt tilgjengelig gjennom releases: `Innlevering2`, tag: `v2`
