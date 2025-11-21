# Endringer gjort etter medstudentvurdering 4 - Oppdatert 21.11.25 

## Tilgjengelighet 
- **Begrenset tastaturnavigasjon og fokus under VoiceOver**:
  - Nå skal alt være i orden.
- **Headeren skaper ekstra navigasjonsbryderier ved sidebytte**:
  - Når man trykker på x i header for å clear search tar den nå inn hvilken side du er på og holder deg der.
- **Filtrering med tastatur kan låse brukeren inne i filterboksen**:
  - Hvis man har åpnet et filter med tastaturet, kan man nå tabbe seg ut av det.
- **Forbedring av fargekontraster og størrelsen på knapper for tilgjenglighet**:
  - Fargekontraster er nå forbedret på footer, starrating sin "no ratings yet" tekst, og størrelsen på featuread-carousel sine knapper er gjort større

## Funksjonalitet 
- **Favorittside og anmeldelser: bedre oversikt**:
  - Når man skriver inn reviews, så får man opp en teller på antall ord man har igjen.
- **Søk og filtrering: sammenhengende filtrering**:
  - Dette var et ønske vi allerede hadde implementert.
- **Loading, mobilnavigasjon og anmeldelseredigering: tekniske og brukeropplevelsesaspekter**:
  - Nå har alle nødvendige elementer loading- og error-states og mobilnavigasjon i karusell er forbedret. Det gikk allerede ann å redigere sitt review. Det finnes nå forsåvidt "Admin-brukere" som har rettigheter til å redigere og slette alle sitt review.
  - 

# Design og utforming
- **Konsistent header-ikonbruk og visuell stabilitet**:
  - Vi har valgt å beholde ikon+tittel på navbar, da flere brukertesting har indikert på at det er en fin detalj. 
- **Utydelig hover-tilbakemelding i lys og modus**:
  - Det er laget tydeligere hover effekter på knapper.
- **Discover-layoutbalanse ved små skjermer**:
  - Vi økte antall elementer til 12, fra 9, slik at vi nå kan ha 2 elementer på tlf og 3 på pc uten utformingsproblemer.
- **Drop-down meny for søk lukker seg ikke ved sletting**:
  - Det er nå laget en fallback state ("Start typing to search") i searchbar.
- **Mobilvisning: vis flere spill per side**:
  - Vi økt fra 1 til 2 spill per side på tlf.
- **Bedre fokus-status og tastaturnavigasjon**:
  - Dette er ordnet.
- **Oppfrisk fronten for en friskere spillside**:
  - Vi valgte å ha både tekst og ikon da vi mente det var hensiktsmessig på vår nettside.

# Bærekraft
- Vi mener allerede at bærekraft delen vår er godt dokumentert. Og ønsker derfor å ikke gå videre med denne tilbakemeldingen. 

# Bruk av kunstig intelligens 
- **Manglende dokumentasjon av KI-bruk i prosjektet**: Dette har vi ordet
- **Forslag til konkrete KI bruksområder for å øke effektivtiet og kvalitet**: Vi har også skrevet om dette på readme filen. 

# Kodekvalitet 
- **Filtreringslogikk i userResultsFilters gjør koden mindre lesbar**:
  - useResultFilters-hooken er nå delt opp i flere små filer som tar seg av sin del.
- **Store komponenter og hooks bryter Single Responsbility Principle**:
  - Vi har splittet opp flere hooks og komponenter inn i egne filer og mapper. Komponenter håndterer stort sett bare rendering, mens hooks, helpers og constants filer håndterer logikken.
- **Hardkodede verdier bør erstatte av navngitte konstanter**:
  - Vi har gått igjennom koden og endret dette der det har vært nødvendig.
- **Inkonsistent filnavnkonvensjon**:
  - Det er nå ordnet konsistent filnavn gjennom hele kodebasen.
- **Manglende JSDoc-kommentarer på komplekse funksjoner**:
  - Kommentarer er ryddet opp i gjennom hele kodebasen.  

# Tekniske valg 
- **Lagring av aktuell Disocver-side (sessionStorage) for riktig tilbake-navigering**:
  - Cursor-index er nå lagret i sessionstorage, så når man går inn på en side og tilbake til discover så trenger man ikke laste inn hele cursor-listen på nytt da det er hentet fra sessionstorage.
- **Søkefunksjonens avslutning av pågående søk ved sletting bør forbedres**:
  - Ved trykk på x i søkefeltet, så kommer man tilbake til siden man er på.
- **For stor filter-hook på 659 linjer - behov for splitting og testbarhet**:
  - Denne er nå splittet opp i flere mindre dedikerte filer.
- **Bildeoptimailsering via weserv.nl mangler fallback**:
  - Bilder har nå en fallback state.
- **Backend har ikke tester - stor forbedringspotensiell risiko og testdekning**:
  - Siden testing i backend ikke var et krav, har vi uansett implementert 4 testere i backend som tar for seg resolverne og ikke minst fokus på edge cases
