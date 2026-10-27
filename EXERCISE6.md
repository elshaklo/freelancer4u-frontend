# Freelancer4u – Übung 6

Stand: 27.10.2026. Grundlage: /Users/klodian/Downloads/3SE2-Uebung-6.pdf.

## Umgesetzt

Vor Änderungen wurden beide Repositories, Branches und Änderungen geprüft. Das Backend war sauber auf `exercise5-postman-docs`. Das Frontend enthielt bereits vorgemerkte Login-Dateien auf `add-login-frontend`; diese wurden weiterverwendet.

- Login, Signup mit automatischem Login und Logout über den vorhandenen Auth0-Flow aus der Übung.
- Keine Ausgabe von Passwörtern, Axios-Fehlerobjekten oder Tokens mehr.
- JWT bleibt in HttpOnly-Cookies. Die Cookie-Laufzeit entspricht der Token-Laufzeit. Frontend und Backend prüfen RS256-Signatur, Aussteller, Empfänger und Gültigkeit.
- Backend: Spring Security OAuth2 Resource Server, zustandslose API, alle `/api`-Endpunkte geschützt. Fehlende/ungültige Tokens ergeben 401.
- Rollen aus `user_roles`: Companies GET/POST und Job POST verlangen `admin`; fehlende Rolle ergibt 403. Job GET steht allen angemeldeten Benutzern offen. Vorhandene Service-Endpunkte verlangen Login, ohne zusätzliche, von der Übung nicht verlangte Rollenbeschränkungen.
- Frontend: Companies-Menü und Create-Job-Formular nur für Admins. Normale Benutzer laden nur Jobs, keine Companies. Direkte Seitenaufrufe und POST-Aktionen sind ebenfalls geschützt.
- Account-Seite unter `/account` mit Profil und Rollen, entsprechend der als «Admin-Page» bezeichneten Aufgabe.
- Alle bestehenden Frontend-API-Requests senden den Bearer-Token. Backend-401/403 bleiben als entsprechende Fehlermeldungen sichtbar.
- `.env.example` ergänzt. Vorhandene öffentliche Auth0-Domain/Client-ID ins lokale, ignorierte Backend-`.env` übernommen; MongoDB-Konfiguration erhalten.

Die Übung verwendet ausdrücklich das ID-Token und den Passwort-Grant. Dieser bestehende Lehrbeispiel-Flow wurde erhalten; das Backend prüft deshalb die Auth0-Client-ID als Audience.

## Erfolgreich geprüft

- Backend `./mvnw package`: erfolgreich.
- Backend mit aktivierten lokalen MongoDB-Integrationstests: **20 Tests, 0 Fehler, 0 übersprungen**. Separate Datenbank `freelancer4u_exercise6_integration`, kein Test gegen Atlas. Die bestehenden Datenbanktests verwenden einen simulierten angemeldeten Admin; die zusätzlichen Security-Tests prüfen separat echte signierte JWTs über HTTP.
- Security-HTTP-Tests: 401 ohne Token, ungültiges Format, falsche Signatur, falscher Issuer, falsche Audience, abgelaufenes JWT; 403 für normale Benutzer bei Companies und Job-Erstellung; 200/201 für erlaubte Benutzer/Admin-Anfragen. Fehlende Rollen verursachen keinen Serverfehler.
- Frontend `npm test`: **7 Tests erfolgreich**. Direkte Zugriffssperren, Rollenrechte für Formularaktionen, Weitergabe des Bearer-Tokens, keine Company-Abfrage für normale Benutzer, Logout-Cookies und ungültige Session geprüft. API-Antworten in diesen Tests sind simuliert.
- Frontend `npm run build`: erfolgreich.
- Frontend lokal per HTTP: `/`, `/login`, `/signup` liefern 200; `/jobs`, `/companies`, `/account` leiten ohne Login mit 303 zum Login weiter.

Ein echter Signup/Login gegen Klodians Auth0-Tenant wurde nicht durchgeführt: Es wurde kein neues Benutzerkonto angelegt und kein persönliches Passwort verwendet. Auch die vollständige Browser-Anmeldung und der externe Auth0-Logout müssen deshalb noch mit zwei eigenen Testkonten geprüft werden.

## Auth0: Klodians Schritte

1. Bestehende Single Page Application öffnen. Domain und Client-ID in beiden `.env`-Dateien kontrollieren. Backend benötigt jetzt **auch `AUTH0_CLIENT_ID`**.
2. Für den normalen Entwicklungsport `http://localhost:5173` die Application URIs und Cross-Origin Authentication gemäss PDF setzen. Allowed Logout URLs muss `http://localhost:5173/` enthalten. Callback/Web-Origin-Einträge ebenfalls auf den normalen Entwicklungsport setzen.
3. Unter Advanced Settings den Password-Grant aktivieren. Tenant Default Directory auf `Username-Password-Authentication` setzen und die Database Connection für die App aktivieren.
4. Rolle `admin` erstellen und einem separaten Testbenutzer zuweisen. Ein normales Testkonto ohne Rolle behalten.
5. Post-Login Action erstellen, deployen, dem Login-Flow hinzufügen und Apply drücken:

```js
exports.onExecutePostLogin = async (event, api) => {
  if (event.authorization) {
    api.idToken.setCustomClaim('user_roles', event.authorization.roles);
    api.accessToken.setCustomClaim('user_roles', event.authorization.roles);
  }
};
```

6. Nach Rollenänderungen aus- und wieder einloggen. Normaler Benutzer: Jobs sichtbar, Companies und Create Job fehlen. Admin: Companies und Create Job funktionieren. Account zeigt Rollen. Signup, anschliessenden automatischen Login und Logout mit erlaubter Rücksprungadresse prüfen.
7. Für die JWT-Inspektion nach PDF das eigene Token lokal aus dem Cookie im Browser-Entwicklertool kopieren. Nicht in Git oder öffentliche Logs übernehmen. Ein verändertes Token muss am Backend 401 ergeben.

## Lokal starten

Backend im Backend-Ordner (vorher `.env` mit den vorhandenen Werten prüfen):

```sh
set -a
source .env
set +a
./mvnw spring-boot:run
```

Frontend im Frontend-Ordner:

```sh
npm install
npm run dev
```

Die bestehenden Postman-Requests benötigen nun ein aktuelles JWT unter Authorization → Bearer Token. Company-Requests und Job POST benötigen das Token des Admin-Testbenutzers.

## GitHub und Abgabe: Klodians Schritte

GitHub wurde lesend geprüft, aber nicht verändert. Bereits offen: Backend #13 «add login to backend», Backend #15 «add login» und Frontend #1 «add login to frontend». Das gemeinsame Projekt «Freelancer4u SCRUM Planning» existiert.

1. Im gemeinsamen Board die bestehenden Login-Issues dem aktuellen Sprint zuordnen, Frontend #1 und Backend #13 als Sub-Issues von Backend #15 verknüpfen. Parent mit Labels `frontend`, `backend` und Typ Feature pflegen.
2. Frontend-Issue «add admin page» sowie je ein Rollen-Issue in Frontend/Backend ergänzen; Frontend-Rollen-Issue dem Backend-Rollen-Issue als Sub-Issue zuordnen. Im selben Board verwalten.
3. Lokale Änderungen sind auf separaten Branches committet. Beide Branches pushen, Pull Requests erstellen und nach echten Auth0-Tests prüfen/mergen. Login-, Account- und Rollen-Issues erst nach bestätigten Akzeptanztests schliessen, Parent manuell abschliessen.
4. Repository-URL gemäss PDF auf Moodle abgeben. Es wurde nichts auf Moodle eingereicht.
