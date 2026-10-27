# Freelancer4U Frontend · 3SE2 Übung 6

Svelte-5-Frontend mit Auth0 Login/Signup/Logout, Account-Seite und Admin-Rechten. Aktueller Teststand: [EXERCISE6.md](EXERCISE6.md). Companies und Jobs werden über das geschützte Spring-Boot-Backend geladen und in MongoDB gespeichert.

## Abgabelinks

- Frontend: https://github.com/elshaklo/freelancer4u-frontend
- Veröffentlichte API-Dokumentation: https://documenter.getpostman.com/view/58587091/2sBYHSzgRK
- Backend und getestete Postman-Dateien: https://github.com/elshaklo/freelancer4u/tree/main/postman

## Lokal starten

Voraussetzungen: Node.js in einer von den installierten Vite-/SvelteKit-Versionen unterstützten Version, npm und ein laufendes Freelancer4U-Backend mit gültiger MongoDB-Konfiguration. Getestet mit Node.js 24.15.0.

1. Backend im separaten Backend-Projekt mit `./scripts/start.sh` starten. Die bestehende Backend-`.env` muss `MONGODB_URI`, `AUTH0_DOMAIN` und `AUTH0_CLIENT_ID` enthalten. Backend: `http://localhost:8080`.
2. Im Frontend-Verzeichnis:

```sh
cp .env.example .env
npm install
npm run dev
```

`.env` enthält `API_BASE_URL=http://localhost:8080`, `AUTH0_DOMAIN` und `AUTH0_CLIENT_ID`. Die Auth0-Werte aus der eigenen Single Page Application eintragen; eine vorhandene `.env` erhalten. Die Datei bleibt wie `node_modules`, `.svelte-kit` und `build` durch `.gitignore` ausserhalb des Repositories. Keine MongoDB-Zugangsdaten gehören ins Frontend. Die Backend-URL wird ausschliesslich auf dem Server gelesen.

3. `http://localhost:5173` öffnen. Falls ein anderer Port verwendet wird, müssen auch die erlaubten Origins und Logout-URLs in Auth0 dazu passen.
4. Mit einem normalen Konto anmelden: **Jobs** und **Account** sind verfügbar. Mit einem Konto mit der Rolle **admin** anmelden: Zusätzlich sind **Companies** und das Formular **Create Job** verfügbar. Rollen müssen mit der Post-Login-Action im Claim `user_roles` stehen. Nach Änderungen neu anmelden.

## Umfang aus Übung 5

- Startseite: **Welcome to Freelancer4U!**
- `/companies`: alle Companies anzeigen und neue Companies über `GET/POST /api/company` erstellen.
- `/jobs`: vorhandene Job-Page des Starters; Jobs und Companies laden, Jobs über `GET/POST /api/job` erstellen.
- Formulare mit Svelte `enhance`, Erfolgsmeldungen und erneuter Anzeige der gespeicherten Daten.
- Serverseitige Pflichtfeldprüfung, E-Mail-Prüfung bzw. Prüfung von Jobtyp und Verdienst; ungültige Eingaben werden mit Status 400 abgelehnt.
- Backend-Ausfälle werden als verständliche Fehlermeldung bzw. Status 502 angezeigt. API-Aufrufe haben ein Zeitlimit.

Die englischen Beschriftungen und das Bootstrap-Layout des Starters wurden beibehalten. Bootstrap wird wie im Starter über jsDelivr geladen und benötigt dafür Internetzugriff.

## Verifikation am 21.10.2026

- `npm install`: erfolgreich.
- `npm run build`: erfolgreich mit Svelte 5 und SvelteKit 3.
- `npm audit fix`: kompatible Aktualisierung des mitgelieferten Locks auf Vite 8.3.4; danach **0 gemeldete Schwachstellen**.
- Starttitel im Browser geprüft.
- Company über das Browserformular erstellt; Erfolgsmeldung und Tabellenzeile sichtbar. Datensatz nach vollständigem Neuladen weiterhin vorhanden.
- Job über das Browserformular für diese Company erstellt; Erfolgsmeldung, Verdienst 321.50 und Zustand NEW geprüft. Nach vollständigem Neuladen weiterhin sichtbar.
- Beide Datensätze zusätzlich über die Backend-API per ID aus der Datenbank `Freelancer` mit der vorhandenen Atlas-Verbindung wieder gelesen. Details in `docs/frontend-verification.json`.
- Ungültige Company- und Jobformulare serverseitig getestet: jeweils Status 400, keine Datensatzerstellung.
- Keine Browserfehler während des erfolgreichen Job-Tests.

Die mit `Exercise5-Frontend-` markierten Testdatensätze bleiben für die Nachvollziehbarkeit gespeichert. Vorhandene Datensätze wurden nicht verändert.

## Postman

Die veröffentlichte Collection enthält alle fünf Requests der bereitgestellten Datei `Freelancer Starter.postman_collection.json` sowie die zusätzlichen Job-, Filter-, Service- und Fehlerfall-Requests. Jeder Request besitzt eine Beschreibung und ein gespeichertes Beispiel. Der lokale Newman-Lauf hat 22 Requests und 35 Assertions erfolgreich geprüft.

Für Aufrufe von `localhost` aus Postman Web ist ein laufender Desktop Agent erforderlich; alternativ können Postman Desktop oder Newman verwendet werden. Diese Einschränkung betrifft nicht die öffentliche Dokumentation.
