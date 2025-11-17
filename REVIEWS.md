# Review Summary P2: IT2810-H25-T01

*Generated on 2025-11-11*

**Takk for at du leser tilbakemeldingene fra medstudentvurderingene!**
Vi vil gjerne høre din mening om de oppsummerte tilbakemeldingene. Bruk dette [spørreskjemaet](https://nettskjema.no/a/565641). Etter å ha svart på skjemaet har du mulighet til å være med i trekking av 3 gavekort á 200 kroner.

---

## Tilgjengelighet

**Begrenset tastaturnavigasjon og fokus under VoiceOver**  
Til tross for god generell tilgjengelighet gjennom semantisk HTML og ARIA, oppstår det betydelige begrensninger i tastaturnavigasjonen for VoiceOver-brukere. Ocean påpeker at man ikke alltid kan tabbe til submit-knappen uten å bruke VoiceOver, og enkelte elementer (favorittknappen, favoritter og discover-siden i hamburgermenyen) er ikke tabbable og må nås med piltaster. Dette gjør navigasjonen tung og mindre intuitiv for brukere som kun bruker tastaturnavigasjon. Effekten er at kritiske handlinger og rask tilgang til innhold kan bli vanskelig i praksis, noe som reduserer opplevelsen for en viktig brukergruppe. Forslagene eller steg mot forbedring ligger i å gjøre flere elementer tabbable, forbedre fokusrekkefølgen og sikre at navigasjonen fungerer uten avhengighet av piltaster, samt å teste med skjermlesere for å verifisere forbedringer.

Reviewer(s): [Ocean](#tilgjengelighet-ocean), [Yara](#tilgjengelighet-yara)

------------------------------

**Headeren skaper ekstra navigasjonsbryderier ved sidebytte**  
Val23 peker på at headeren er litt hodebry fordi man må gjennom den hver gang man kommer inn på en ny side. Dette gjør det noe mindre intuitivt å få tak i innhold raskt og kan være en friksjon ved tastaturnavigasjon. Det gir en mindre sømløs opplevelse når man bytter mellom sider. For å bedre dette bør man gjennomgå header-strukturen og vurdere løsninger som skip-lenker eller raskere tilgang til hovedinnhold, samt teste tastaturnavigasjon i hele nettstedet.

Reviewer(s): [Val23](#tilgjengelighet-val23)

------------------------------

**Filtrering med tastatur kan låse brukeren inne i filterboksen**  
Kai41 observerte at når man prøver å filtrere (for eksempel Categories), kom man aldri ut av filterboksen med kun tastaturet. Dette utgjør en betydelig hindring for tastaturnavigasjon og kan hindre brukere i å fullføre filtreringen eller fortsette til neste seksjon. Dette påvirker brukere som bruker tastatur eller assistive teknologier. En mulig løsning vil være å bryte ut fokus-løkka i filterwidgeten og sikre at brukeren kan avslutte eller flytte fokus med Esc eller Tab for å navigere videre.

Reviewer(s): [Kai41](#tilgjengelighet-kai41)

------------------------------

**Forbedring av fargekontraster og størrelsen på knapper for tilgjengelighet**  
Val23 og Kai41 peker begge på behov for bedre fargekontraster og større knapper for tilgjengelighet. Val23 nevner også at enkelte knapper er små og at ARIA-roller kan være inkompatible, noe som bør adresseres. Til tross for at Lighthouse gir en god score, er kontrastene fortsatt et område som kan forbedres for å støtte brukere med nedsatt syn. Forbedringer kan inkludere å justere fargepaletten for tilstrekkelig kontrast, gjøre små kontroller mer brukervennlige og validere ARIA-roller slik at de fungerer konsistent på tvers av komponenter.

Reviewer(s): [Val23](#tilgjengelighet-val23), [Kai41](#tilgjengelighet-kai41)

------------------------------

---

## Funksjonalitet

**Generelt inntrykk: profesjonell funksjonalitet og skalerbarhet**  
Tilbakemeldingen viser at applikasjonen har profesjonell funksjonalitet og en god brukeropplevelse. Kai41 beskriver at appen har tydelige interaktive elementer og at søk, filtrering, sortering, favorittsystem og innlogging fungerer bra, noe som gir en intuitiv navigasjon. Piper legger vekt på at løsningen har en omfattende funksjonalitet og at den håndterer store datasett på en skalerbar og profesjonell måte. Samlet sett oppfattes løsningen som solid og fokusert på ytelse og brukervennlighet, med noen små mangler som blir sett på som pirk.  

Reviewer(s): [Kai41](#funksjonalitet-kai41), [Piper](#funksjonalitet-piper)

--------------------

**Små UX-forbedringer: skrivefelt og hover på favoritknappen**  
Ocean peker på behovet for små, men relevante forbedringer i brukergrensesnittet: en karakter teller i anmeldelsesfeltet vil gi kontinuerlig tilbakemelding om hvor mye plass som gjenstår. Han nevner også behovet for en tydeligere visuell feedback ved hover over favorit-knappen, for eksempel skygge eller fargeendring. Disse endringene anses som pirk, men vil bidra til en mer intuitiv opplevelse. Implementering av disse små forbedringene kan forbedre skriveopplevelsen og den generelle brukeropplevelsen uten å endre kjernen av funksjonaliteten.  

Reviewer(s): [Ocean](#funksjonalitet-ocean)

--------------------

**Favorittside og anmeldelser: bedre oversikt**  
Yara påpeker at hvis en bruker har veldig mange spill i favorittlisten, kan det bli uoversiktlig. Hun foreslår derfor å legge til enkel søk eller sortering på favorittsiden slik at man raskt finner relevante titler. I tillegg nevner hun at det hadde vært nyttig å kunne se en liste over alle anmeldelsene man har skrevet. Disse endringene vil gjøre favoritt- og anmeldelsessiden mer oversiktlig og brukervennlig for aktive brukere.  

Reviewer(s): [Yara](#funksjonalitet-yara)

--------------------

**Søk og filtrering: sammenhengende filtrering og engasjement**  
Val23 roser at søkefeltet fungerer bra og gir forslag i en drop-down meny, og at det kommer opp en melding hvis søket ikke gir treff. Han foreslår også å kunne kombinere filtre fra ulike kriterier (for eksempel sjangere) i stedet for å velge ett av gangen. I tillegg nevner han at det finnes mange sorteringsalternativer og at disse fungerer som forventet. For å holde brukeren engasjert foreslås det å kunne vise populære spill, og at man også kunne logge inn direkte fra favoritt-siden om man ikke allerede er logget inn.  

Reviewer(s): [Val23](#funksjonalitet-val23)

--------------------

**Loading, mobilnavigasjon og anmeldelsesredigering: tekniske og brukeropplevelsesaspekter**  
Henry peker på flere forbedringsområder: karusell-navigasjonen på berøringsenheter kunne være mer intuitiv, og loading-states med skeleton-loader er inkonsekvente og noen komponenter mangler error-states. Det påpekes også at anmeldelsessystemet for tiden tillater kun én anmeldelse per bruker, og at en redigeringsfunksjonalitet ville vært ønskelig. Samlet sett vil disse forbedringene gjøre grensesnittet mer robust og brukervennlig, spesielt på feilsituasjoner og i mobil brukeropplevelse.  

Reviewer(s): [Henry](#funksjonalitet-henry)

---

## Design og utforming

**Konsistent header-ikonbruk og visuell stabilitet**
Tilbakemeldingene peker på behov for en mer konsekvent header, da Ocean påpeker at favoritter og Discover bruker tekst+ikon mens profil og light/dark-mode kun har ikoner. Dette kan gjøre grensesnittet mindre enhetlig og noe mindre intuitivt for brukeren. Henry legger også vekt på at den sticky headeren kan virke litt “floatende” og foreslår en tydeligere definisjon, for eksempel full bredde eller en synlig skygge for bedre stabilitet. Dette påvirker brukeropplevelsen ved at inkonsekvens i ikonbruk og en svak headerfølelse kan skape forvirring. En løsning kan være å standardisere ikon-/tekstkombinasjonen i headeren og vurdere en tydelig header-effekt som gir bedre visuell stabilitet.

Reviewer(s): [Ocean](#design-og-utforming-ocean), [Henry](#design-og-utforming-henry)

------------------------------

**Utydelig hover-tilbakemelding i lys modus**
Yara påpeker at de mørkelilla knappene i lysmodus mangler tydelig hover-effekt, noe som reduserer interaksjonstilknytningen ved musepeker. Dette kan gjøre det vanskelig å oppfatte direkte tilbakemelding ved interaksjon. En tydelig hover-effekt eller endring av farge ved hover vil forbedre brukeropplevelsen og gjøre grensesnittet mer responsivt. Implementering av en konsekvent hover-stil anbefales for å styrke interaksjonsopplevelsen.

Reviewer(s): [Yara](#design-og-utforming-yara)

------------------------------

**Discover-layouubalanse ved små skjermer**
Yara nevner at Discover-siden henter 9 spill ved mindre skjermer, noe som kan skape en ubalanse fordi det siste spillet ofte står alene på en ny rad i stedet for å følge to-og-to-raden. Dette påvirker den visuelle balansen og flyten i designet. Det anbefales å vurdere endringer i pagineringen eller antall elementer som hentes for disse skjermstørrelsene for å opprettholde en jevn layout.

Reviewer(s): [Yara](#design-og-utforming-yara)

------------------------------

**Drop-down-meny for søk lukker seg ikke ved sletting**
Val23 peker på at drop-down-menyen som viser spill ikke forsvinner når man sletter et søk i søkefeltet, noe som kan skape forvirring. Dette påvirker brukeropplevelsen ved at konteksten ikke oppdateres automatisk. En løsning er å sikre at drop-down-menyen lukkes eller oppdateres når søkefeltet blir tømt. Implementasjon av denne logikken vil gjøre søkefunksjonen mer konsekvent.

Reviewer(s): [Val23](#design-og-utforming-val23)

------------------------------

**Mobilvisning: vis flere spill per side**
Kai41 opplever at mobilvisningen viser kun ett spill per rad, noe som gjør scrolling mindre effektivt. Dette reduserer utnyttelsen av liten skjerm og kan gjøre opplevelsen tregere på mobil. Det vil være bedre å vise flere spill per side på mobile skjermstørrelser for en mer sømløs og effektiv navigasjon.

Reviewer(s): [Kai41](#design-og-utforming-kai41)

------------------------------

**Bedre fokus-states og tastaturnavigasjon**
Henry peker på at enkelte kort mangler tydelige fokus-states ved tastaturnavigasjon, noe som svekker tilgjengelighet. Dette gjør det vanskelig for brukere som navigerer med tastaturet å se hvor fokus ligger. Det anbefales å legge til klare og synlige fokus-stiler på alle interaktive elementer og sikre konsistent fokus-logikk gjennom hele grensesnittet.

Reviewer(s): [Henry](#design-og-utforming-henry)

------------------------------

**Oppfrisk fonten for en friskere spillside**
Val23 kommenterer at fonten virker litt kjedelig og minner om en gammeldags skrivemaskin, noe som kan redusere den lekne følelsen til en spillside. En mer moderne eller variert typografi kunne forbedre den visuelle appellen og gjøre siden mer engasjerende. Dette er et forslag for å gjøre designet mer dynamisk og tiltalende.

Reviewer(s): [Val23](#design-og-utforming-val23)

------------------------------

---

## Bærekraft

Tydeligere dokumentasjon av bærekraftbeslutninger i README
Det er bred enighet om at bærekrafttiltakene er godt implementert og forklart i README, med tiltak som debounced søk, lazy loading og bildeoptimalisering som WebP og srcSet. Likevel påpeker Henry at dokumentasjonen kunne være tydeligere ved å liste opp bevisste bærekraftvalg og begrunnelser bak dem, for eksempel system monospace og backend-kompresjon. Å gjøre dette vil forbedre sporbarheten og gjøre det lettere for andre å forstå hvorfor beslutningene ble tatt og hvordan de bidrar til lavere ressursbruk. Flertallet av reviewerene uttrykker at README allerede beskriver beslutningene bra, men en eksplisitt oversikt over bevisste valg vil styrke dokumentasjonen ytterligere. Foreslått tiltak er å legge til en kort seksjon i README som beskriver hvilke bærekraftvalg som ble tatt og hvorfor.

Reviewer(s): [Ocean](#b-rekraft-ocean), [Yara](#b-rekraft-yara), [Val23](#b-rekraft-val23), [Kai41](#b-rekraft-kai41), [Henry](#b-rekraft-henry), [Piper](#b-rekraft-piper), [River42](#b-rekraft-river42)

------------------------------

---

## Bruk av kunstig intelligens

**Manglende dokumentasjon av KI-bruk i prosjektet**
Det er tydelig at gruppen ikke dokumenterer bruk av kunstig intelligens i prosjektet, og flere kommentatorer antar at KI ikke er tatt i bruk. Dette gjelder spesielt README-filene hvor ingen referanser til KI er funnet. Mangel på dokumentasjon kan gjøre det vanskelig å vurdere hvilke KI-verktøy eller prosesser som er vurdert eller brukt, og hvilke potensielle fordeler KI kunne ha bidratt med. For å rette opp bør README eller annen prosjektdokumentasjon tydelig beskrive om KI har blitt brukt, hvilke områder KI eventuelt har bidratt til (for eksempel generering av dummy-data, tester eller automatiseringsstøtte), og hvilke verktøy som er vurdert. Dette vil gjøre prosjektet mer transparent og forenkle evaluering i neste innlevering, og gi bedre retning for nye bidragsytere.

Reviewer(s): [Ocean](#bruk-av-kunstig-intelligens-ocean), [Yara](#bruk-av-kunstig-intelligens-yara), [Val23](#bruk-av-kunstig-intelligens-val23), [Kai41](#bruk-av-kunstig-intelligens-kai41), [Henry](#bruk-av-kunstig-intelligens-henry), [Piper](#bruk-av-kunstig-intelligens-piper), [River42](#bruk-av-kunstig-intelligens-river42)

---

**Forslag til konkrete KI-bruksområder for å øke effektivitet og kvalitet**
Flere av reviewerene peker på konkrete områder der KI kunne ha blitt benyttet for å gjøre arbeidet mer effektivt og sikre bedre kvalitet. Spesielt nevnes testing, der KI kunne generere enhetstester eller hjelpe med å produsere testdata, samt automatisk generering av TypeScript-typer. I tillegg ble det foreslått å bruke KI til å forbedre dokumentasjon og kommentarer (f.eks. JSDoc og inline-dokumentasjon). Noen nevnte også potensialet for verktøy som Claude Code for raskere å vibe-kode tester, med advarsel om risiko for spaghetti-kode hvis man lar verktøyet kjøre fritt, og at Husky for pre-commit hooks kan bidra til å sikre kvalitet før commits. Disse forslagene bør vurderes i neste sprint og tas i bruk med en kritisk tilnærming og tydelige krav til dokumentasjon og kvalitetskontroll.

Reviewer(s): [Ocean](#bruk-av-kunstig-intelligens-ocean), [Yara](#bruk-av-kunstig-intelligens-yara), [Kai41](#bruk-av-kunstig-intelligens-kai41), [Piper](#bruk-av-kunstig-intelligens-piper)

---

## Kodekvalitet

**Filtreringslogikk i useResultFilters gjør koden mindre lesbar**  
useResultFilters-hooken inneholder mye logikk og håndterer flere ulike funksjoner. Dette gjør den enkel å bruke, men kan gjøre koden mer krevende å lese og vedlikeholde. Dette gjelder særlig filtreringslogikken som ligger til grunn for mye av grensesnittets oppførsel. For bedre struktur anbefales det å dele logikken opp i flere mindre, spesialiserte hooks, slik at hver del blir lettere å lese og teste.  
Reviewer(s): [Yara](#kodekvalitet-yara), [Val23](#kodekvalitet-val23)

---

**Store komponenter og hooks bryter Single Responsibility Principle**  
Henry peker på at enkelte komponenter og hooks er betydelig store (200–650 linjer) og at dette gjør at Single Responsibility Principle ikke alltid er tydelig oppfylt. Dette gjør koden vanskeligere å lese, vedlikeholde og teste. For å bedre oppnå tydelige ansvarsområder bør disse komponentene deles opp i mindre, mer fokuserte enheter, og logikken kan flyttes til egne hooks eller bibliotekfunksjoner. Dette vil også bidra til bedre gjenbruk og enklere feilsøking.  
Reviewer(s): [Henry](#kodekvalitet-henry)

---

**Hardkodede verdier bør erstattes av navngitte konstanter**  
Henry påpeker at noen verdier er hardkodet i koden og bør erstattes med navngitte konstanter. Dette vil forbedre lesbarheten og gjøre det enklere å endre verdier på et sted. Det bør sentraliseres der det gir mening, og konstanter bør brukes konsekvent i stedet for hardkodede tall eller strenger. En slik løsning vil også bidra til mindre duplisering og enklere vedlikehold.  
Reviewer(s): [Henry](#kodekvalitet-henry)

---

**Inkonsistent filnavnekonvensjon**  
Henry og Kai41 peker på inkonsekvent filnavnekonvensjon (pirk) og oppfordrer til å velge én standard. Dette kan skape forvirring og gjøre navigasjonen i prosjektet mindre intuitiv. Tiltakene som foreslås er å velge en enhetlig naming-konvensjon og bruke den konsekvent i hele repoet, samt å oppdatere dokumentasjon og lintersregler for å sikre konsekvent praksis.  
Reviewer(s): [Henry](#kodekvalitet-henry), [Kai41](#kodekvalitet-kai41)

---

**Manglende JSDoc-kommentarer på komplekse funksjoner**  
Henry påpeker at noen komplekse funksjoner mangler JSDoc-kommentarer. Dette kan gjøre det vanskelig for nye bidragsytere å forstå formål og bruk. Løsningen er å legge til JSDoc-kommentarer for offentlige funksjoner og spesielt lange eller komplekse funksjoner, slik at lesbarhet og vedlikehold blir bedre over tid.  
Reviewer(s): [Henry](#kodekvalitet-henry)

---

## Tekniske valg

**Lagring av aktuell Discover-side (sessionStorage) for riktig tilbake-navigering**  
Denne forbedringen ble foreslått av Yara, og handler om å lagre hvilken side brukeren var på i Discover-siden. Uten dette kan brukeren ende opp på feil side når de går bort og kommer tilbake igjen. Det vil påvirke brukeropplevelsen negativt ved unødvendig omlasting eller feil sidevisning. Det foreslås å bruke sessionStorage til å lagre den aktuelle siden slik at brukeren returnerer til riktig side når de bruker tilbake-knappen. 

Reviewer(s): [Yara](#tekniske-valg-yara)


**Søkefunksjonens avslutning av pågående søk ved sletting bør forbedres**  
Val23 peker på en konkret teknisk flaskehals i søkefunksjonen: gamle søk blir ikke avbrutt når søkefeltet slettes. Dette kan føre til at gamle forespørsler pågår i bakgrunnen og potensielt viser utdatert eller inkonsekvent data. Problemet berører brukeropplevelsen spesielt når man raskt endrer eller fjerner søkeord. Det foreslås å justere søke-logikken slik at pågående lazy query-er avbrytes eller cancelles ved sletting, og å sikre at URL-synkroniseringen ikke viser foreldede resultater.

Reviewer(s): [Val23](#tekniske-valg-val23)


**For stor filter-hook på 649 linjer – behov for splitting og testbarhet**  
Henry tar opp at filter-hooken er for stor og blir vanskelig å teste og vedlikeholde. Den store koden gjør det utfordrende å isolere og verifisere enkel funksjonalitet. Dette påvirker vedlikeholdbarhet og testdekning, spesielt når krav endres eller feil oppstår. Forslaget er å splitte opp hooken i mindre, mer fokuserte deler eller separate hooks for ulike filteraspekter, noe som bør gjøre testing og videreutvikling enklere.

Reviewer(s): [Henry](#tekniske-valg-henry)


**Bildeoptimalisering via weserv.nl mangler fallback**  
Henry peker på at bildeoptimaliseringen bruker weserv.nl uten en fallback-løsning, noe som kan føre til at bilder ikke lastes riktig ved feil eller avbrudd i tjenesten. Dette kan påvirke brukeropplevelsen og bildekvaliteten i appen ved nedetid eller langsom lasting. En anbefaling er å legge inn en fallback- eller standardbildemulighet ved feil, samt overvåke tjenesten og vurdere alternative løsninger ved utilgjengelighet.

Reviewer(s): [Henry](#tekniske-valg-henry)


**Backend har ikke tester – stor forbedringspotensiell risiko og testdekning**  
Henry fremhever at backend mangler tester, noe som anses som det største forbedringsområdet, til tross for generelt høy kvalitet. Dette reduserer tryggheten ved endringer og regresjonstester. Forslaget er å etablere en testbasis, begynne med enkle enhetstester og/eller integrasjonstester for kritiske domenekontrakter, og sette opp et testmiljø for kontinuerlig testing. Dette vil øke påliteligheten og gjøre fremtidige tekniske valg tryggere.

Reviewer(s): [Henry](#tekniske-valg-henry)

---


# Original Feedback

## Tilgjengelighet

<a id="tilgjengelighet-ocean"></a>
**Reviewer Ocean:**

> Applikasjonen bruker semantisk HTML og Aria attributter som aria-label, i tillegg til fokusindikatorer som viser hvilket element som har fokus når man navigerer med tastatur. Søkefelt og review form kan brukes med tastatur, elementer blir korrekt lest opp av skjermleser. Samtidig er det også noen begrensninger. Man kan ikke tabbe til for eksempel submit knappen når man kun navigerer med tastatur uten å bruke VoiceOver funksjonen. Når man bruker VoiceOver funksjonen er det også enkelte elementer man ikke kan tabbe til \(favoritt knapp, favorites og discover side i hamburgermeny\), men må bruke piltaster for å navigere til. Piltastene leser opp hver enkelt bokstav og gjør navigasjonen noe tungvint.

<a id="tilgjengelighet-yara"></a>
**Reviewer Yara:**

> Applikasjonen har god tilgjengelighet. Man kan navigere med tastatur, tabbe gjennom elementer og bruke Enter for å aktivere knapper og lenker. Google Lighthouse viser også høy score på tilgjengelighet, noe som bekrefter gode valg og fokus på universell utforming.
> 
> Et mindre forbedringspunkt er at favoritt knappen på spillsiden ikke er mulig å tabbe til.

<a id="tilgjengelighet-val23"></a>
**Reviewer Val23:**

> Tilgjengeligheten er meget god i det aller meste av nettsiden, det brukes globalt fokusdesign og godt merket søk/moduler og liveoppdateringer. Bruk av tastatur og skjermleser gir en god opplevelse selv om det er noe krunglete å navigere gjennom hjemmesiden på tastatur. Det er lett å se hvor på siden man er til enhver tid og en begrenset mengde med resultater per side gjør det enklere å navigere. Headeren er litt hodebry da man må gjennom den hver gang man kommer inn på en ny side. Ved kjøring av siden i google lighthouse scorer den godt på tilgjenglighet \(92\) med noe pirk på farge kontraster og bruk av ARIA på inkopatible roller samt noe på at noen knapper er litt små.

<a id="tilgjengelighet-kai41"></a>
**Reviewer Kai41:**

> 89 i score av Lighthouse. Ett problem jeg merket meg da jeg forsøkte å navigere med tastatur var at da jeg prøvde å filtrere på for eksempel "Categories" så kom jeg med aldri ut av filterboksen med kun tastaturet. Lighthouse ga kommentar på at fargekontrasten må økes for å bedre tilgjengeligheten

<a id="tilgjengelighet-henry"></a>
**Reviewer Henry:**

> Systematisk bruk av semantisk HTML \(nav, article, figure, header, footer, aside\). Omfattende ARIA-attributter \(30+ forekomster\) med aria-label, aria-labelledby, aria-hidden, aria-live, aria-busy. Keyboard navigation med konsistente focus-indikatorer. Screen reader support med sr-only legends og aria-hidden på dekorative ikoner.
> 
> Ikke noe forbedring som jeg fant.

<a id="tilgjengelighet-piper"></a>
**Reviewer Piper:**

> Tilgjengeligheten er også veldig godt gjennomført. Dere bruker Shadcn UI som bygger på Radix UI Primitives, som følger WAI-ARIA-retningslinjene og har innebygd tastaturnavigasjon og skjermleserstøtte. Dere har selv lagt til ARIA-attributter der det manglet og justert fargekontraster. Både dark og light mode har god kontrast. Semantiske HTML-elementer brukes konsistent, ingen unødvendig eller overbruk av div'er. Fint dere har testet med Lighthouse og tatt hensyn til tilbakemeldinger derfra. Jeg testet selv med tastaturnavigasjon og kunne navigere gjennom siden uten problemer. Knapper og interaktive elementer har tydelig focus states, og jeg kan bruke spacebar og enter for å interagere med de. Ser også at dere har lagt tid inn i få det fungerende på mobil, imponert!

---

## Funksjonalitet

<a id="funksjonalitet-ocean"></a>
**Reviewer Ocean:**

> - Løsninger som er gjort er i stor grad utfordrende og profesjonelle, ikke trivielle. Gruppen har for eksempel implementert kombinert sortering og filtrering, og fem ulike søkemetoder. Det er tydelig at gruppen har hatt fokus på ytelse, som reflekteres i at de har implementert debounce funksjon på søk, lazy loading osv. Applikasjonen er også svært brukervennlig, ettersom at man får umiddelbar feedback når man legger til spill til favoritter eller legger ved reviews. At irrelevante filtre deaktiveres i dropdown menyen, er et godt eksempel på at gruppen har hatt fokus på brukervennlighet. 
> - Et forbedringspotensiale er at dere kan implementere en karakter teller i review-feltet. Dette vil gi brukeren kontinuerlig tilbakemelding om hvor mye plass som gjenstår, og dermed forebygge forvirring når skrivingen avsluttes. Dere kan også forbedre brukeropplevelsen ved å implementere en tydeligere visuell feedback ved hover over favoritt knappen \(for eksempel skygge, eller fargeendring\), men dette er pirk.

<a id="funksjonalitet-yara"></a>
**Reviewer Yara:**

> På nettsiden er det lett å finne fram til alle spill man ønsker. Via hjemmesiden er det et statisk utvalg av spill, og på Discover siden kan man bla gjennom hele spillutvalget ved hjelp av paginering,  dette fungerer bra. I tillegg kan man filtrere spill etter flere kriterier og sortere resultatene. Dette er godt løst.
> 
> Jeg liker også at navigasjonsmenyen følger brukeren på alle sider. Dette gjør det enkelt å søke og navigere til ønsket spill. Man kan også favorisere spill og legge igjen reviews, men man må være innlogget. Dette er i tråd med hvordan profesjonelle nettsider håndterer slike funksjoner.
> 
> Dersom en bruker har veldig mange spill i favorittlisten, kan det bli litt uoversiktlig. Det kan derfor være lurt å legge til en enkel søke eller sorteringsfunksjon på favorittsiden. Det hadde også vært nyttig for brukeren å kunne se en liste over alle anmeldelsene de har skrevet.

<a id="funksjonalitet-val23"></a>
**Reviewer Val23:**

> - Søkefeltet fungerer bra og gir forslag på ulike søkeresultater \(med bilde\) i en drop-down meny, det gjør det enkelt for brukeren å navigere seg frem til riktig spill. Det vises en melding når et søk ikke gir noen resultater. Mulig å vise frem populære spill for å holde brukeren engasjert? I tillegg kan dere vurdere å vise frem den samme meldingen i drop-down menyen hvis en bruker søker på noe som ikke finnes. 
> - Dere har mange ulike filtreringsmuligheter hvor det er mulig å kombinere ulike filtre. Eneste jeg savner der er å kunne kombinere filtre fra for eksempel sjangrene \(per nå kan man kun velge en og en\) Sortering fungerer også som forventet, og det er mange muligheter å velge mellom!
> 
> Søk og filtrering virker som en godt implementert og lur løsning ved bruk av debounce, URL og cursor som gjør begge elementene skalerbare og brukervennlig. Resultatene vises frem på riktig måte, til tross for de store datamengdene. 
> 
> - Reviews/anmeldelser er godt implementert og viser frem antall stjerner, brukeren som la igjen vurderingen og når den ble lagt igjen. 
> - Favorittene lagres som forventet når man trykker på favoritknappen, i tillegg til at brukeren får beskjed om at man har lagret spillet som favoritt. Kunne vært greit med en knapp for å logge inn direkte fra favoritt-siden hvis man ikke er logget in.
> - Spill-kortene ser estetisk bra ut og har responsivt bilde og favoritt-knappen som forventet. 
> 
> Oppsumert er det løsninger som er godt gjennomtenkte, med fokus på at de har stort dataset, løsningene virker skalerbare og det er lagt vekt på en behagelig brukeropplevelse med noen få mangler som kun blir småpirk. 
> 
> 

<a id="funksjonalitet-kai41"></a>
**Reviewer Kai41:**

> Applikasjonen har en profesjonell funksjonalitet med tydelige interaktive elementer som søkefelt, filtrering, sortering, favorittsystem og innlogging. Brukeropplevelsen er god med en navigasjon som er veldig intuitiv. Systemet håndterer store datasett på en ryddig måte! Dette er en skalerbar og solid løsning som viser at dere har valgt mer utfordrende og gjennomtenkte løsninger fremfor trivielle.

<a id="funksjonalitet-henry"></a>
**Reviewer Henry:**

> Search med autocomplete har debouncing \(200ms\) og keyboard-navigasjon. Filter-systemet bruker URL basert state management som gjør filtre delbare og bookmark-bare, solid og skalerbar. Cursor-basert paginering er mer avansert enn vanlig offset-pagination. Favoritt funksjonalitet med optimistisk UI oppdatering og toast-notifikasjoner fungerer bra.
> 
> Forbedringspotensiale Carousel-navigasjon kunne vært mer intuitiv på touch devices. Loading states med skeleton-loadere er inkonsistente, noen komponenter mangler error-states. Review-systemet tillater kun én review per bruker \(bra\), men mangler edit-funksjonalitet \(? må ikke ha det men hadde vært nice\).
> 
> 

<a id="funksjonalitet-piper"></a>
**Reviewer Piper:**

> Dere har implementert et imponerende sett med interaktive elementer. Søkefunksjonen er særlig godt gjort med flere ulike søkemetoder, og debouncing på 200ms fungerer smooth. Det at dere bruker URL-query parameters i stedet for sessionStorage er et smart valg som gjør at søk kan deles mellom brukere, dette er noe jeg ikke har sett i andre prosjekter. Paginering er implementert med cursor-based pagination, noe som er mye mer skalerbart enn tradisjonell offset-basert paginering når man skal håndtere 60 000 spill. Sorteringen har åtte ulike alternativer og filtreringen har fem ulike metoder, dette gir brukeren god kontroll. Rating-systemet med stjerner fungerer intuitivt, og muligheten til å favorisere spill og skrive reviews gir god interaktivitet. Navigasjonen er smooth og siden føles responsiv. Har ikke noe negativt å komme med her, dette er definitivt på nivå med profesjonelle applikasjoner. 

<a id="funksjonalitet-river42"></a>
**Reviewer River42:**

> Løsningen har alle de viktigste funksjonene som en sånn side trenger. Man kan søke og filtrere for å finne akkurat de spillene man leter etter, og det funker bra. Man kan også anmelde og sette spill som favoritter. 
> 
> Funksjonaliteten lider litt av at steam databasen er såpass stor, og at det finnes veldig mange spill som antageligvis ikke er så relevante for brukeren. En profesjonell applikasjon hadde nok hatt funksjonalitet for å gi deg anbefalinger basert på tidligere spill du har anmeldt, og favorisert. \(men det er kanskje litt utenfor scopet til prosjektet\)

---

## Design og utforming

<a id="design-og-utforming-ocean"></a>
**Reviewer Ocean:**

> - Designet fremstår ryddig og konsistent, noe som gir et profesjonelt inntrykk. Bruken av avrundede hjørner, font og farger er sammenhengende gjennom hele applikasjonen, og alle kort, knapper og menyer har samme stil. Layouten er behagelig å se på og lett å følge, da elementene er plassert i tydelige seksjoner. Dere bruker marger effektivt for å lage passende avstand mellom elementene. Layouten er også responsiv og fleksibel, for eksempel blir headeren til en hamburgermeny på smalere skjermer. 
> - I headeren bruker dere en kombinasjon av tekst og ikon for favoritter og discover, men kun ikoner for profil og light/dark mode. Et lite forbedringspotensiale er at dere kan gjøre applikasjonen enda ryddigere ved å enten velge tekst og ikon, eller kun ikon på alt.

<a id="design-og-utforming-yara"></a>
**Reviewer Yara:**

> Applikasjonen har et oversiktlig design der innholdet hovedsakelig er sentrert på skjermen. Dette fungerer godt, fordi verken navbaren eller footeren inneholder sentrerte elementer, noe som skaper en god balanse i layouten. Applikasjonen kan brukes både i mørk og lysmodus, noe som er bra. Ved mindre skjermstørrelser tilpasser elementene seg godt, og navigasjonsmenyen endres til en hamburgermeny, som fungerer fint. Filtreringsmenyen på Discover siden blir også gjort om til en liten pop up meny som gir tilgang til alle filtreringsmulighetene. Dette er en veldig god og brukervennlig løsning.
> 
> Et lite forbedringspunkt kan være å gi de mørkelilla knappene i lysmodus en tydeligere hover effekt. Dette vil bidra til en enda bedre brukeropplevelse.
> 
> Ved mindre skjermbredder hentes det alltid ut 9 spill på Discover siden. Dette kan føre til en liten ubalanse i designet, siden det siste spillet plasseres alene på en rad, mens resten vises to og to. Det kan derfor være lurt å vurdere å justere antall elementer som hentes i pagineringen i dette tilfellet.

<a id="design-og-utforming-val23"></a>
**Reviewer Val23:**

> - Det er en konsekvent og strømlinjet fargepalett som er implementert via tailwind. Fargen er behagelig og estetisk fin. I tillegg er det lagt inn mulighet for bruk av darkmode. Ved bytte til darkmode er fortsatt alt av tekst synlig og leselig. Fonten er kanskje noe kjedelig og minner om gammeldags skrivemaskin, noe kjedelig for en artig spillside etter min mening. 
> - Kortene/bildene av spillene er store og oversiktlige uten at man mister oversikt, runde hjørner på kortene er behagelig å se på og det er nok luft mellom de ulike kortene.
> - Headeren forsvinner ikke når man scroller ned, og er intuitiv med ikke alt for mange knapper og felt. Eneste kritikken er at når man sletter et søk i søkemotoren forsvinner ikke drop-down menyen med spill av seg selv. 
> - Nettsiden fungerer godt på mobil og er interaktiv på samme måte som på pc, elementene skaleres på riktig måte og det er mulig å sveipe som forventet. 

<a id="design-og-utforming-kai41"></a>
**Reviewer Kai41:**

> Designet er moderne og gjennomført, med god balanse mellom bilder, tekst og luft som gir et ryddig uttrykk. Fargepaletten er fin og konsistent, og mørk/lys-modus er et fint tillegg som styrker både tilgjengelighet og brukeropplevelse. Marger og spacing gir god struktur uten å virke tettpakket. Med tanke på responsivt design så funker løsningen, men det blir litt tungvint å scrolle gjennom spill på mobil da det kun er ett spill som vises per linje. Her hadde det vært mer optimalt å kunnet vise flere spill på en side

<a id="design-og-utforming-henry"></a>
**Reviewer Henry:**

> Konsistent fargepalett med custom CSS-variabler for light/dark mode. Responsiv typografi med clamp-basert sizing skalerer godt. Spacing med konsistente patterns og max-width på 1600 px tror jeg, sikrer god lesbarhet. Dark mode med localStorage-persistence og gjennomtenkte fargekontraster.
> 
> Forbedring:
> Sticky header med margin kan virke litt "floatende", vurder full-width eller mer definert shadow. Noen cards mangler tydelige focus states ved keyboard-navigasjon.
> 
> 

<a id="design-og-utforming-piper"></a>
**Reviewer Piper:**

> Designet er gjennomtenkt og profesjonelt. Støtte for både dark og light mode er veldig bra, og begge modusene har god fargekontrast. Bildene ser skarpe ut og layouten er responsiv med god tilpasning til både mobil og desktop. Dere bruker Shadcn UI basert på Radix UI Primitives, så siden er veldig estetisk. Spacing virker gjennomført, og samme med typografien. Hover effekter på spillkort og knapper gir god feedback. Skeleton loaders mens data laster er også en fin touch som gjør siden føles raskere, vi har samme løsning i vårt prosjekt.  Generelt et veldig clean og profesjonelt design. Ser dere har lagt inn mye arbeid i utseende og å gjøre nettsiden responsiv, som å kunne swipe karusellen på mobil. Veldig bra jobba :\)

<a id="design-og-utforming-river42"></a>
**Reviewer River42:**

> Utformingen er enkel, og stilren. Fargene passer til tema uten å gjøre for mye ut av seg. Layouten er ryddig og det er intiuitivt hvilke elementer man kan interagere med. Løsningen funker også bra på smalere skjermer, som telefon. Bra jobbet :\)

---

## Bærekraft

<a id="b-rekraft-ocean"></a>
**Reviewer Ocean:**

> - Gruppen har dokumentert flere valg som viser at de har hatt bærekraft i bakhodet. Bruk av debounced søk og lazy loading bidrar til redusert energiforbruk ved å laste inn data når det er nødvendig. Bruk av skeleton loading kan bidra til å redusere opplevd ventetid, og kan redusere serverkrav og dermed også energiforbruk. Bilder leveres med srcSet og WebP format, som reduserer lastetid og båndbredde. 

<a id="b-rekraft-yara"></a>
**Reviewer Yara:**

> Gruppen har tatt bevisste bærekraftige valg i utviklingen av applikasjonen og forklart disse godt. Det er gjort gjennomtenkte vurderinger knyttet til bilder, fonter, light/darkmode og håndtering av trafikk mellom frontend og backend. Dette viser at gruppen har jobbet med bærekraft i fokus i løpet av prosjektet.

<a id="b-rekraft-val23"></a>
**Reviewer Val23:**

> README til gruppa beskriver at de har redusert datamengden ved å kun hente ut "top publishers" og bruker cursor paginering for å begrense kall. De konverterer bilder til WebP for nedskalering av bilder og bruker debounced søk, caching og fonter som er innebygde. Dette er alle gode tiltak for å effektivisere siden og minimere belastningen. Det virker som overordnet hensiktsmessige og lure valg for lavere dataforbruk og raske lastetider. Det er en tydelig bevissthet rundt bruken av ulike elementer og funksjoner. README er tydelig og oversiktlig på de ulike punktene og implementasjonen støtter dokumentasjonen.

<a id="b-rekraft-kai41"></a>
**Reviewer Kai41:**

> Dere har implementert flere smarte løsninger med tanke på bærekraft, og forklart disse grundig i README. Dere har tatt gode valg når det gjelder bildehåndtering, debouncing og caching blant annet. Designet er også bærekraftig med enkelt fargepalett og med støtte for dark/light mode. Disse tiltakene viser god forståelse av at bærekraft handler om å minimere ressursbruk gjennom hele stacken!

<a id="b-rekraft-henry"></a>
**Reviewer Henry:**

> Debouncing på 200ms i søk reduserer unødvendige API-kall. Image optimization med WebP format, responsive srcSet \(320w, 480w, 640w\) og lazy loading er bra for bandwidth. Apollo cache bruker cache-first for statisk data og network-only kun der nødvendig.
> 
> Ikke så mye forbedring her, veldig bra, kanskje dokumentere om dere har tatt beviste valg f.eks. System monospace, backend compression etc.

<a id="b-rekraft-piper"></a>
**Reviewer Piper:**

> Dere har tydelig tenkt på bærekraft gjennom hele utviklingen. Debounced søk reduserer unødvendige API-kall, lazy loading av bilder gjør at kun synlige bilder lastes, og dere har konvertert bilder fra JPG til WebP for mindre filstørrelse. Apollo Client's caching reduserer gjentatte forespørsler til serveren betydelig. Cursor-based pagination betyr at dere kun henter de spillene som faktisk vises, ikke hele datasettet på 60 000 spill. Skeleton loaders i stedet for spinners gir bedre perceived performance. Dere bruker også systemfonter i stedet for importerte webfonter, sparer både downloadspeed og energi. Det kommer godt fram i README også, så ikke noe å kommentere på her heller. 

<a id="b-rekraft-river42"></a>
**Reviewer River42:**

> Gruppen forklarer godt hvilke valg som er blitt gjort knyttet til bærekraft. Bilder blir konvert og skalert ned, for  å redusere filstrørrelse og lette på traffiken. De bruker debouncing for å unngå for mange unødvendige kall. Alt i alt veldig bra

---

## Bruk av kunstig intelligens

<a id="bruk-av-kunstig-intelligens-ocean"></a>
**Reviewer Ocean:**

> Jeg fant ikke dokumentasjon rundt bruk av KI i noen av README filene, så det ser ut som at gruppen ikke har benyttet seg av dette. Potensielt kunne KI blitt brukt til å effektivisere arbeidet, for eksempel ved å generere dummy data til tester eller lage enkle komponenter som knapper. 

<a id="bruk-av-kunstig-intelligens-yara"></a>
**Reviewer Yara:**

> Gruppen har ikke nevnt noe om bruk av KI i prosjektet. KI kunne eventuelt vært benyttet for å effektivisere og kvalitetssikre utviklingen, for eksempel gjennom støtte til koding og testing, men dette bør vurderes med en kritisk tilnærming.

<a id="bruk-av-kunstig-intelligens-val23"></a>
**Reviewer Val23:**

> Jeg klarte ikke å finne noe i README som nevnte bruk av språkmodeller eller generativ KI? Om dette er brukt bør det nevnes i README. 

<a id="bruk-av-kunstig-intelligens-kai41"></a>
**Reviewer Kai41:**

> Dere har ikke dokumentert bruk av KI i prosjektet, og jeg regner da med at dere ikke har tatt dette i bruk?
> Elementer eller områder i prosjektet hvor dere kunne ha tatt i bruk KI for å jobbe mer effektivt kunne vært:
> 
> - Testing: enhetestester kunne vært generert med KI, spesielt for de mange komponenttestene dere har i test-mappen.
> 
> - Automatisk generering av TypeScript typer
> 
> - Dokumentasjon og kommentarer - JSDoc-kommentarer og inline-dokumentasjon kunne vært forbedret med AI.
> 
> 

<a id="bruk-av-kunstig-intelligens-henry"></a>
**Reviewer Henry:**

> Ikke noe dokumentasjon om dette, få det på plass før neste/siste innlevering. 
> 
> Men generelt veldig bra jobb.

<a id="bruk-av-kunstig-intelligens-piper"></a>
**Reviewer Piper:**

> README nevner ikke eksplisitt bruk av KI-verktøy, så det er uklart om dere har brukt det og eventuelt til hva. Det kunne vært nyttig å legge inn en kort beskrivelse av dette. Om dere ikke allerede gjør det, kan KI-verktøy for eksempel brukes til å generere flere enhetstester. Dere har Vitest satt opp og noen tester fra før, men testdekningen kunne gjerne vært høyere.
> 
> For fremtidige sprinter kan det være verdt å se på Claude Code for å raskt “vibe-kode” tester, men vær oppmerksom på at det kan føre til spaghetti kode dersom man bare lar den holde på. Dere kan også vurdere å sette opp Husky for pre-commit hooks, slik at linting og tester kjøres automatisk før commit.

<a id="bruk-av-kunstig-intelligens-river42"></a>
**Reviewer River42:**

> Så vidt jeg kan se står det ingenting om generativ KI i dokumentasjonen, så jeg antar at det ikke er brukt.

---

## Kodekvalitet

<a id="kodekvalitet-ocean"></a>
**Reviewer Ocean:**

> Prosjektet er ryddig og organisert, med en tydelig separasjon mellom frontend og backend som følger prinsipper for fullstack utvikling. Strukturen i frontend og backend viser god forståelse for modularitet og gjenbruk. Backend er delt inn i egne mapper for resolvers, database og scripts, som gjør koden enklere å vedlikeholde. Frontend følger god praksis med en tydelig inndeling av komponenter, hooks, typer og hjelpefunksjoner. Navngiving av filer og mapper fremstår konsekvent. Alt i alt fremstår prosjektet som strukturert og oversiktlig og i tråd med anbefalte prinsipper for clean code og mappestruktur i React prosjekter.

<a id="kodekvalitet-yara"></a>
**Reviewer Yara:**

> Filstrukturen er satt opp på en svært ryddig og gjennomtenkt måte, og README-filen forklarer prosjektets oppbygging på en klar og forståelig måte. Navngivningen er konsekvent og gir mening, noe som gjør det lett å navigere i prosjektet. I tillegg er komponenter og filer stort sett korte og oversiktlige, noe som bidrar til god lesbarhet og gjør koden enklere å vedlikeholde. 
> 
> En mulig forbedring gjelder useResultFilters hooken, som inneholder mye logikk og håndterer flere ulike funksjoner. Dette gjør den enkel å bruke, men kan gjøre koden mer krevende å lese og vedlikeholde. For bedre struktur og lesbarhet kan det være lurt å dele logikken opp i flere mindre, spesialiserte hooks. 

<a id="kodekvalitet-val23"></a>
**Reviewer Val23:**

> - Filstrukturen er strukturert som man forventer i et react prosjekt med egne mapper for overordnede komponenter, sider, hooks, tester osv.. Enkelt å finne fram og viser forståelse av hvordan et React prosjekt skal settes opp
> - Det er konsekvent god navngivning som gjør det enkelt å få oversikt og følger god navnepraksis/standard i React prosjekter.
> - Det er lagt opp til gjenbruk av klasser som følger samme stil som reduserer duplisering og holder oppsettet ganske likt ved oppretting av nye komponenter. God gjenbruk av eksisterende kode
> - I overkant mye logikk i filtreringsfilen, kunne vurdert å dra noe ut og lage egne hjelpefunksjoner for å holde bedre oversikt. 
> - Komponentene i prosjektet blir gjenbrukt og er isolerte, det gir en god separasjon i koden. 

<a id="kodekvalitet-kai41"></a>
**Reviewer Kai41:**

> Prosjektet viser veldig god kodekvalitet med en gjennomgående organisering og struktur. Mappestrukturen følger React best practices med tydelig separasjon mellom backend \(graphql, /prisma/\) og frontend \(/src/components/, /src/hooks/, /src/types/\), hvor hver domene har egne undermapper som game/, user/, review/. Navngivingen er konsekvent og beskrivende. Komponentgjenbruk er godt implementert gjennom shadcn/ui biblioteket og custom hooks. Koden er ryddig med konsistent formattering gjennom Prettier. Dere har også implementert shared constants i classNames.ts for gjenbruk av CSS-klasser, og bruker semantisk HTML med proper aria attributter for tilgjengelighet

<a id="kodekvalitet-henry"></a>
**Reviewer Henry:**

> Ryddig mappestruktur med tydelig separasjon mellom frontend/backend og domain-driven nesting. Navngivning konsistent og beskrivende. Gjenbrukbar komponent-hierarki viser god arkitektur. TypeScript med egne types-mapper gir god type-safety. Constants pattern for Tailwind classes reduserer duplikasjon.
> 
> Forbedring:
> Noen komponenter og hooks er store \(200-650 linjer\), følg Single Responsibility Principle strengere \(mer funksjonelt\). Hardkodede verdier burde være named constants. Komplekse funksjoner mangler JSDoc-kommentarer \(pirk\). Inkonsistent file naming convention \(pirk her også\) velg én.

<a id="kodekvalitet-piper"></a>
**Reviewer Piper:**

> Er veldig fornøyd med prosjektstrukturen deres. Dere har en veldig tydelig separasjon mellom frontend og backend, og begge har en god "intern struktur". Backend har modulær GraphQL-struktur med separate mapper for filter, game, review og user, hvor hver modul har sine egne resolvers og types. Dette er mye mer skalerbart enn å ha alt i en fil naturligvis. Frontend har også logisk inndeling med components, hooks, pages og types. Dere har også laget gjenbrukbare komponenter som GameCardBase som brukes av både PromoCard og GameCardDetail, dette viser god forståelse av komponentarkitektur. Navngivning er deskriptiv og konsistent. Dere har både ESLint og Prettier satt opp i både frontend og backend, og jeg ser dere bruker format-scripts. Ikke noe å kommentere på her :\). Dere har også GitHub workflows for CI/CD, CODEOWNERS fil og PR-template, så tydelig at dere sikter på en A.

<a id="kodekvalitet-river42"></a>
**Reviewer River42:**

> Kodekvaliteten er bra. Filstrukturen er ryddig med tydelig skille mellom frontend og backend. Filer og funksjoner er også navngitt på en god og leselig måte. Komponenter er gjenbrukt der det er hensiktsmessig.

---

## Tekniske valg

<a id="tekniske-valg-ocean"></a>
**Reviewer Ocean:**

> Gruppen har tatt gjennomtenkte tekniske valg som viser god forståelse. Dette kommer tydelig frem i dokumentasjonen gruppen har skrevet. Gruppen benytter relevante tredjeparts bibliotek som Tailwind CSS, Shadcn/UI, HeroIcons, Lucide, som gir et konsistent og gjenbrukbart grensesnitt. I backend gir kombinasjonen av Apollo Server, Prisma og PostgreSQL en fleksibel og typesikker arkitektur som passer til prosjektets krav. Til frontend utvikling bruker gruppen React og Typescript, komponentene er små og gjenbrukbare, og funksjonalitet/state håndteres gjennom hooks på en ryddig måte. Løsningen for autentisering med JWT og bcrypt viser forståelse for sikkerhet. 

<a id="tekniske-valg-yara"></a>
**Reviewer Yara:**

> Apollo klienten er satt opp på en ryddig og effektiv måte. Den håndterer innloggingstoken automatisk og cacher data godt, slik at appen unngår unødvendige spørringer. All logikk for filtrering og paginering ligger samlet i en egen React hook. Den håndterer sidevalg, lasting og synkronisering på en ryddig måte, noe som gjør koden enklere å gjenbruke. Bibliotekene er godt valgt. Radix og Tailwind gir et fleksibelt og tilgjengelig UI, Embla brukes til karuseller, og Heroicons til ikoner. Løsningene dekker behovene uten å gjøre koden for kompleks.
> 
> Et lite forbedringspunkt kan være å vurdere å bruke sessionStorage for å lagre hvilken side brukeren var på i Discover siden. Da vil man bli sendt tilbake til riktig side når man navigerer bort og senere bruker tilbake knappen.

<a id="tekniske-valg-val23"></a>
**Reviewer Val23:**

> - Apollo verktøyene blir brukt på riktig måte og det virker som gruppa har god forståelse for bruken av; useQuery til data, useMutation med refectQueries, og cache-first på filter og spilldata.
> - Resultatsidene har cursor paginering med lagring av endCursor i et kart og laster inn de neste sidene på forhånd slik at det ikke tar lang tid å hente fra databasen. Meget god og teknisk avansert løsning!
> - Søkefunksjonen er implementert med lazy querey og debounce + tastaturnavigasjon og henting av URL. Hooken er generelt godt implementert med unntak av at gamle søk ikke blir avbrutt ved sletting av søkefeltet. 
> - GraphQL spørringene ser bra ut og virker strukturerte, filtrering og sortering sendes til serveren, bra! Godt samspill mellom frontend og backend som belaster klienten så lte som mulig 
> 
> Generelt sett god React og Apollo kunnskap med gjennomgående bruk av et moderne UI-bibliotek. De tekniske valgene fører til at nettsiden er enkelt skalerbar i fremtiden 

<a id="tekniske-valg-kai41"></a>
**Reviewer Kai41:**

> Applikasjonen bruker GraphQL med Apollo Server og Prisma, som er bra valg for en spilldatabase med mange relasjoner. Frontend bruker React med custom hooks som useGameResults og god Apollo Client-konfigurasjon for caching. shadcn/ui og Tailwind for konsistent styling. Implementeringen av autentisering med JWT og database-indeksering viser at dere tenker på både sikkerhet og ytelse, bra!

<a id="tekniske-valg-henry"></a>
**Reviewer Henry:**

> Fornuftig cache-strategi \(cache-first for statisk data, network-only for user data\). Prisma schema med proper indexes og 8 versjonerte migrasjoner. GraphQL følger modular approach med separate resolvers per domain. JWT autentisering med bcrypt hashing. Pragmatisk å droppe Auth0 for egen løsning når HTTPS var issue. Mye bra altså!
> 
> 
> Forbedring:
> Filter-hook på 649 linjer er for stor imo, vurder å splitte for bedre testbarhet. 
> Image optimization via weserv.nl mangler fallback. Backend har 0 tester som er det største forbedringspotensialet, men generelt veldig bra.

<a id="tekniske-valg-piper"></a>
**Reviewer Piper:**

> Dere har valgt Apollo Client med InMemoryCache for GraphQL og Prisma med PostgreSQL på backend. Apollo Client er et godt valg, og jeg ser at dere faktisk utnytter caching-funksjonaliteten, noe som er bra. Cursor-based pagination i stedet for offset er et smart valg når man skal håndtere 60 000 spill, det skalerer mye bedre. Database-schemaet er godt strukturert med mange-til-mange relasjoner mellom Game og ulike entiteter som Genre, Tag, Publisher osv. Jeg la også merke til at dere har lagt til indekser på popularityScore, avgRating og publishedStore, dette gjør at queries går mye raskere selv med store datamengder. State management er løst med Apollo Client's cache og URL som "source of truth" for filtre, noe som gir en ryddig løsning uten å måtte trekke inn Redux. Custom hooks for datalogikk holder page-komponentene ryddige. Autentisering er implementert med JWT og bcryptjs for password hashing, som fungerer fint. Dere viser god forståelse, og det er tydelig at dere har brukt tid på å tenke ut gode løsninger. 

---


---

**Takk for at du leste tilbakemeldingene!**
Husk å fylle ut [https://nettskjema.no/a/565641]!
