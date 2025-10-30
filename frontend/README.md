# Frontend for Realm

[<- Tilbake til root README](../README.md)

En React TS + Vite frontend for Realm

## Innholdfortegnelse

- [Oppsett](#oppsett)
  - [Installering](#installering)
  - [Kjør Serveren](#kjør-serveren)
- [Testing](#testing)
  - [Test Struktur](#test-struktur)

## Oppsett

For å sette opp frontend må du ha følgende tilgjengelig på maskinen:

- Node.js
- Npm
- Tilgang til et NTNU nettverk

> [!NOTE]
> Det finnes miljøvariabler i `frontend`-mappen men det er ikke noe du trenger å føre inn. Bare kjør kommandoene som er gitt under.

### Installering

Klon repoet og last ned dependencies

```bash
git clone https://git.ntnu.no/IT2810-H25/T01-Project-2.git
cd frontend
npm ci
```

## Kjøre Serveren

### Koblet til backend VM

Husk å være tilkoblet NTNU vpn eller et NTNU nettverk før du starter serveren for å koble frontend til backend VM.

Start dev med VM backend med:

```bash
npm run dev:vm
```

> [!NOTE]
> Du har nå muligheten til å teste Auth0 implementasjonen ved å ha frontend lokalt, knyttet til backend i VM.

### Koblet til lokal backend

Ønsker du å teste databasen lokalt er det flere steg du må gjennom. Jeg anbefaler derfor steget over, evt å se på nettsiden vår gjennom linken [her](http://it2810-01.idi.ntnu.no/project2).

Når alle stegene er gjennomført i backend sin readme for setup av lokal database, så kan du kjøre følgende:

```bash
npm run dev
```

## Testing

Prosjektet inkluderer enhetstestere. For å kjøre testene, bruk følgende kommando under frontend mappen:

```bash
npm run test
```

### Test Struktur

Testene er organisert ved hjelp av komponenter, hver komponent har sin egen test fil. For eksempel:

- Header komponent tester: Header.test.tsx
