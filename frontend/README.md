# Frontend for Realm

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

### Installering

Klon repoet og last ned dependencies

```bash
git clone https://git.ntnu.no/IT2810-H25/T01-Project-2.git
cd frontend
npm install
```

### Kjør Serveren

Start dev serveren med:

```bash
npm run dev
```

## Testing

Prosjektet inkluderer enhet. For å kjøre testene, bruk følgende kommando:

```bash
npm run test
```

### Test Struktur

Testene er organisert ved hjelp av komponenter, hver komponent har sin egen test fil. For eksempel:

- Header komponent tester: test/Header.test.tsx

Mer utfyllende og oppdatert informasjon kommer i Sprint 2
