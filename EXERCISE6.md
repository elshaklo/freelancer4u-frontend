# Freelancer4u – Übung 6: aktueller Stand

Stand: 27.10.2026. Moodle wird ausdrücklich nicht abgegeben.

## Umsetzung und Tests

Auth0 Login/Signup/Logout, automatische Anmeldung nach Signup, geprüfte JWT-Cookies, Account-Seite, JWT-Weiterleitung, geschützte API und Admin-Berechtigungen sind umgesetzt. Normale Benutzer sehen Jobs; Admins dürfen zusätzlich Companies lesen/erstellen und Jobs erstellen. Direkte Seitenaufrufe und Formularaktionen prüfen dieselben Regeln.

- Backend: Maven package erfolgreich. 20 Tests erfolgreich, einschliesslich separater lokaler MongoDB-Integration und HTTP-Sicherheitstests mit signierten JWTs.
- Frontend: Produktionsbuild und 7 Tests erfolgreich.
- Live gegen den vorhandenen Auth0-Tenant und das Backend auf Port 8080: normale Anmeldung, Jobs, Account, gesperrte Companies, Logout und anschliessend wieder gesperrte Seiten erfolgreich.
- Live Signup mit neuem Testkonto: automatische Anmeldung, HttpOnly-Cookies, Home/Account/Jobs erfolgreich.
- Externer Auth0-Logout liefert die erlaubte Rückleitung auf `http://localhost:5173/`.
- Elf zusätzliche echte HTTP-Zugriffsprüfungen erfolgreich: fehlendes JWT, manipulierte Signatur und fehlende Admin-Rechte. Ergebnisse in `HTTP-Zugriffstests.json` neben dieser Datei.
- Der echte Admin-Durchlauf und die Ausführung beider Postman-Sammlungen stehen noch aus, bis die Rollen-Konfiguration aktiviert ist.

Der aktive Backend-Start verwendet die vorhandene Atlas-Verbindung und Datenbank `Freelancer`. Die automatischen MongoDB-Integrationstests verwendeten ausschliesslich die separate lokale Datenbank. Es wurden keine Zugangsdaten oder JWTs nach GitHub übertragen.

## Auth0

Bestehende Anwendung `Freelancer4u` und bestehendes persönliches Konto erhalten. Password-Grant und Cross-Origin Authentication waren bereits eingeschaltet. Der Default Directory funktioniert mit dem bestehenden Passwort-Login; Logout-URI ist durch einen echten Request bestätigt.

Drei separate Testkonten wurden erstellt:

- `e6-user-20261027@example.invalid`: normaler Benutzer
- `e6-admin-20261027@example.invalid`: vorbereitetes Admin-Testkonto, Rollenzuweisung noch nicht bestätigt
- `e6-signup-20261027@example.invalid`: über das Frontend registriert

Zufällige Passwörter liegen ausschliesslich lokal in der ignorierten Datei `.env.auth0-test` im Frontend-Repository, mit nur für den Eigentümer lesbaren Dateirechten. Keine persönlichen Passwörter wurden verwendet.

Die Action `Freelancer4u user roles` ist erstellt und erfolgreich deployed:

```js
exports.onExecutePostLogin = async (event, api) => {
  if (event.authorization) {
    api.idToken.setCustomClaim('user_roles', event.authorization.roles);
    api.accessToken.setCustomClaim('user_roles', event.authorization.roles);
  }
};
```

Die leere Rolle `admin` ist erstellt. Die Zuweisung an das neue Admin-Testkonto ist im Auth0-Dialog vorbereitet, aber noch nicht gespeichert: Die Browsersteuerung verlangt für die Rechteerweiterung eine separate Bestätigung.

Die Action muss noch im offenen Tab «Post Login» zwischen Start und Complete gezogen und mit Apply aktiviert werden. Mehrere Versuche über die Browsersteuerung haben die Platzierung nicht ausgeführt; hierfür wurde Klodian um den kurzen manuellen Schritt gebeten.

## GitHub

Beide Branches `exercise6-auth-roles` sind gepusht. Die Pull Requests sind erstellt, konfliktfrei und noch offen, bis der Admin-Live-Test besteht:

- Backend: https://github.com/elshaklo/freelancer4u/pull/17
- Frontend: https://github.com/elshaklo/freelancer4u-frontend/pull/4

Im gemeinsamen Projekt «Freelancer4u SCRUM Planning» sind alle sechs Issues eingeplant: aktueller Sprint am 27.10.2026 ist Iteration 5 (21.–27.10.), Typ Feature, Status In progress.

- Backend #15 «add login» mit Backend #13 und Frontend #1 als Sub-Issues
- Frontend #2 «add admin page»
- Backend #16 «add role-based backend access» mit Frontend #3 als Sub-Issue

Die Pull Requests schliessen die zugehörigen Implementierungs-Issues beim Merge. Das Parent-Issue #15 und der Board-Status werden danach abgeschlossen. Noch wurde kein Merge und keine vorzeitige Schliessung durchgeführt.

## Postman

Die bestehende Sammlung `postman/Freelancer4U.postman_collection.json` verwendet jetzt `ADMIN_JWT` als Bearer-Token. `postman/DEV.postman_environment.json` enthält leere, als geheim markierte Platzhalter `ADMIN_JWT` und `USER_JWT`.

Zusätzlich ist `postman/Exercise6-Security.postman_collection.json` mit zwölf Zugriffsprüfungen vorbereitet. Sie schreibt keine Datensätze. Nach Aktivierung der Rolle werden die Sammlungen mit aktuellen echten Testkonto-Tokens ausgeführt; Tokens bleiben lokal.

## Noch offene Reihenfolge

1. Klodian aktiviert die Action im Flow und bestätigt die Admin-Rolle für das neue Testkonto.
2. Admin-Rolle speichern, neu anmelden, Admin-Frontend und Backend sowie Postman-Sammlungen testen.
3. Ergebnis dokumentieren, Pull Requests mergen, Issues und Board abschliessen und lokale main-Branches aktualisieren.
4. Moodle-Abgabe bleibt bei Klodian.
