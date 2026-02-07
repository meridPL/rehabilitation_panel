# EgzoTech – Panel Rehabilitacji Pacjenta

Prosty system do podglądu planu rehabilitacji oraz symulacji treningu na urządzeniach rehabilitacyjnych. Zbudowany w Next.js 16, React 19 i TypeScript.

## Wymagania

- Node.js 20+
- npm, yarn, pnpm lub bun

## Instalacja

1. Sklonuj repozytorium i wejdź do katalogu projektu:

```bash
cd EgzoTech_2
```

2. Zainstaluj zależności:

```bash
npm install
```

3. Utwórz plik `.env.local` w katalogu głównym projektu i dodaj zmienną JWT_SECRET:

```env
JWT_SECRET=twoj-tajny-klucz-min-32-znaki
```

4. Uruchom serwer deweloperski:

```bash
npm run dev
```

5. Otwórz [http://localhost:3000](http://localhost:3000) w przeglądarce.

## Uruchomienie produkcyjne

```bash
npm run build
npm run start
```

## Dane testowe

Przykładowe konta użytkowników (hasła = loginy, jeśli nie podano inaczej):

| Użytkownik    | Email                      | Hasło      |
|---------------|----------------------------|-------------|
| Anna Kowalska | anna.kowalska@example.com | anna123     |
| Bartosz Nowak | bartosz.nowak@example.com | bartosz123  |
| Piotr Nowak   | piotr.nowak@example.com   | piotr123    |

Dane są przechowywane w pliku `src/db/db.json`.

## Funkcjonalności

- **Logowanie** – email + hasło, walidacja po stronie frontendu i backendu
- **Rejestracja** – imię, nazwisko, email, hasło (min. 6 znaków)
- **Profil** – podgląd i edycja danych, zmiana hasła
- **Plan ćwiczeń** – lista przypisanych ćwiczeń ze statusami (Do zrobienia / Rozpoczęte / Wykonane)
- **Symulacja treningu** – odliczanie 15 sekund z wizualizacją (progress bar, koło)
- **Wylogowanie**

## Skrypty

| Polecenie       | Opis                     |
|-----------------|--------------------------|
| `npm run dev`   | Uruchamia serwer dev     |
| `npm run build` | Buduje aplikację         |
| `npm run start` | Uruchamia build produkcyjny |
| `npm run lint`  | Uruchamia ESLint         |
| `npm test`      | Testy jednostkowe (Jest) |
| `npm run test:e2e` | Testy E2E (Playwright) |

## Struktura projektu

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # Endpointy API
│   │   ├── tasks/         # Zadania (start, complete, lista)
│   │   └── users/         # Użytkownicy (login, register, update)
│   ├── dashboard/         # Panel zalogowanego użytkownika
│   ├── register/          # Strona rejestracji
│   └── page.tsx           # Strona logowania
├── components/            # Komponenty React
├── db/                    # Warstwa dostępu do danych
│   ├── db.json            # Baza danych (plik JSON)
│   ├── fileDb.ts          # Odczyt/zapis db.json
│   ├── task-client.ts     # Klient API zadań (fetch)
│   ├── task-server.ts     # Odczyt zadań po stronie serwera
│   └── user.ts            # Odczyt użytkowników
├── provider/              # Konteksty (JWT, React Query)
├── types/                 # Typy TypeScript (Task, User)
└── tests/                 # Testy jednostkowe i E2E
```

## Technologie

- **Frontend:** React 19, Next.js 16, TypeScript, Tailwind CSS, TanStack Query
- **Backend:** Next.js API Routes
- **Baza:** Plik JSON (`src/db/db.json`)
- **Autoryzacja:** JWT w cookie
