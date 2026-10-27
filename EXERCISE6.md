# Freelancer4u – Übung 6 abgeschlossen

Stand: 27.10.2026. Grundlage: ZHAW `3SE2-Uebung-6.pdf`.

## Ergebnis

Die Umsetzung und die zugehörigen GitHub-Schritte sind abgeschlossen. Nur die Moodle-Abgabe bleibt bei Klodian.

- Auth0 Login, Signup mit automatischem Login und Logout.
- Account-Seite mit Profil und Rollen.
- JWTs in HttpOnly-Cookies, deren Laufzeit an die Token-Gültigkeit gebunden ist. Frontend und Backend prüfen Signatur, Issuer, Audience und Gültigkeit.
- JWT-Weiterleitung bei allen Frontend-Requests an die geschützte API.
- Alle `/api`-Endpunkte verlangen Login. Fehlendes oder ungültiges Token liefert 401.
- Company GET/POST und Job POST verlangen `admin`; fehlende Rechte liefern 403. Normale Benutzer dürfen Jobs lesen.
- Companies-Menü und Create-Job-Formular nur für Admins; direkte Seitenaufrufe und POST-Aktionen ebenfalls geschützt. Normale Benutzer laden keine Companies.
- Passwort- und Token-Debugausgaben entfernt. Vorhandene Login-Dateien wurden weiterverwendet; bestehende Fachlogik blieb erhalten.
- Env-Vorlagen, Startanleitungen und Postman-Sammlungen aktualisiert.

Gemäss Übungs-PDF verwendet der vorhandene Lehrbeispiel-Flow den Passwort-Grant und das ID-Token. Deshalb wird die Auth0-Client-ID als Audience geprüft.

## Erfolgreiche Prüfungen

| Prüfung | Ergebnis |
|---|---|
| Backend Maven package | Erfolgreich |
| Backend inklusive lokaler MongoDB-Integration | 20 Tests, keine Fehler, keine übersprungenen Tests |
| Frontend npm test | 7 Tests, keine Fehler |
| Frontend Produktionsbuild | Erfolgreich |
| Bestehende API-Sammlung mit echtem Admin-JWT | 22 Requests, 35 Assertions, keine Fehler |
| Übung-6-Security-Sammlung mit echten Auth0-JWTs | 12 Requests, 12 Assertions, keine Fehler |
| Live Signup und automatischer Login | Erfolgreich |
| Normaler Benutzer: Login, Jobs, Account, gesperrte Companies, Logout | Erfolgreich |
| Admin: Companies, Create Company, Create Job und erneutes Lesen gespeicherter Daten | Erfolgreich |
| Auth0-Logout und erlaubter Rücksprung auf localhost:5173 | Erfolgreich |
| JWT-Rollen nach neuem Login | Normaler Benutzer: `[]`; Admin: `["admin"]` |

Die Security-Tests prüfen unter anderem fehlende/ungültige Tokens, manipulierte Signaturen, abgelaufene Tokens, falschen Issuer und falsche Audience sowie die Rollenmatrix. Backend-Signaturprüfungen laufen über echte HTTP-Anfragen mit lokal signierten Testtokens; die abschliessenden Newman-Läufe verwenden echte Auth0-Tokens.

Die automatischen Datenbanktests liefen gegen eine getrennte lokale Testdatenbank. Die Live-Frontend- und Newman-Tests liefen gegen das vorhandene Backend auf Port 8080 mit der konfigurierten Atlas-Datenbank `Freelancer`. Klar benannte Übungs-Testdaten bleiben zur Nachvollziehbarkeit gespeichert; bestehende Fachdaten wurden nicht verändert. Der bestehende Postman-Test `/testmongodb` legt zusätzlich ein Testdokument an.

## Auth0

Die Action `Freelancer4u user roles` ist deployed und im Post-Login-Flow aktiviert. Die gespeicherte Konfiguration ist durch neue Tokens mit den erwarteten Rollen bestätigt.

Die Rolle `admin` ist dem separaten Testkonto `e6-admin-20261027@example.invalid` zugewiesen. Die Konten `e6-user-20261027@example.invalid` und `e6-signup-20261027@example.invalid` haben keine Admin-Rolle. Das vorhandene persönliche Konto wurde nicht verändert.

Die zufälligen Testpasswörter liegen ausschliesslich lokal in der ignorierten Datei `.env.auth0-test` im Frontend-Repository, mit nur für den Eigentümer lesbaren Dateirechten. Keine Passwörter oder JWTs wurden nach GitHub übertragen. Für eine spätere eigene Anmeldung können diese lokalen Testzugänge verwendet werden.

## GitHub abgeschlossen

- [Backend PR #17](https://github.com/elshaklo/freelancer4u/pull/17): gemergt.
- [Frontend PR #4](https://github.com/elshaklo/freelancer4u-frontend/pull/4): gemergt.
- Backend-Issues #13, #15 und #16 sowie Frontend-Issues #1, #2 und #3 sind geschlossen.
- Login-Sub-Issues und Rollen-Sub-Issue sind verknüpft. Alle sechs Issues sind im gemeinsamen Projekt «Freelancer4u SCRUM Planning», Iteration 5, Typ Feature und Status Done.
- Beide lokalen Repositories stehen auf `main` und sind mit GitHub synchronisiert.

Die Live-Tests sind in den Pull-Request-Beschreibungen dokumentiert. In den Repositories liegt dieser Abschlussstand als `EXERCISE6.md`; der Backend-Ordner `postman` enthält einen bereinigten Testnachweis ohne Tokens.

## Lokal verwenden

1. Backend: Die vorhandene ignorierte `.env` mit `MONGODB_URI`, `AUTH0_DOMAIN` und `AUTH0_CLIENT_ID` beibehalten und `./scripts/start.sh` ausführen.
2. Frontend: Die vorhandene `.env` mit `API_BASE_URL`, `AUTH0_DOMAIN` und `AUTH0_CLIENT_ID` beibehalten und `npm run dev` ausführen.
3. `http://localhost:5173` öffnen und mit einem Testkonto anmelden. Für Companies und Job-Erstellung das Admin-Konto verwenden.

Für Postman aktuelle Tokens in die lokalen Environment-Werte `ADMIN_JWT` und `USER_JWT` eintragen. Die Platzhalter im Repository bleiben leer. Auf einen anderen Entwicklungsport nur wechseln, wenn auch die Auth0-Origins und Logout-URLs angepasst werden.

## Verbleibende Abgabe

Gemäss PDF die Repository-URL auf Moodle abgeben. Es wurde nichts auf Moodle eingereicht.

- Backend: https://github.com/elshaklo/freelancer4u
- Frontend: https://github.com/elshaklo/freelancer4u-frontend
