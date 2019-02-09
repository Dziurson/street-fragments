**Instrukcja instalacji Bazy Danych:**

1. Zainstalować serwer bazy danych PostgreSQL dostępny pod linkiem:

    https://www.enterprisedb.com/software-downloads-postgres
    
2. Podczas Instalacji wybrać dodatek PostGIS
3. Pobrać narzędzie Osmosis dostępne na stronie:

    https://wiki.openstreetmap.org/wiki/Osmosis

4. Odpowiednio przygotować bazę danych wykonując następujące kroki:

    a) Utworzyć nową bazę danych roads:

        CREATE DATABASE roads;
        \c roads;
        
    b) Zainstalować wymagane dodatki:

        CREATE EXTENSION postgis;
        CREATE EXTENSION hstore;
        
    c) Zainstalować skrypty zgodnie z instrukcją znajdującą sięna stronie https://wiki.openstreetmap.org/wiki/Osmosis/PostGIS_Setup:
    
        psql -U postgres -d roads -f pgsnapshot_schema_0.6.sql
        psql -U postgres -d roads -f pgsnapshot_schema_0.6_action.sql
        psql -U postgres -d roads -f pgsnapshot_schema_0.6_bbox.sql
        psql -U postgres -d roads -f pgsnapshot_schema_0.6_linestring.sql
        
5. Przy pomocy narzędzia Osmosis zaimportować dane do bazy (Dane można przygotować we własnym zakresie, korzystając z zasobów OSM i ogólnodostępnych narzędzi)

    osmosis --read-xml roads.osm --log-progress --write-pgsql database=roads user=postgres password=postgres
    
6. Po poprawnym zakończeniu importu pliku baza danych jest gotowa
7. Należy zainstalować typy i funkcje w celu poprawnego działania projektu, przy czym należy zachować poniższą kolejność instalacji:

    - `queries/types.sql`
    
    - `queries/find_ways_function.sql`
    
    - `queries/get_ways_function.sql`

**Instrukcja Uruchamiania projektu**

1. Pobrać repozytorium na dysk
2. Otworzyć projekt
3. W głównym katalogu projektu (street-sections) uruchomić konsolę i zainstalować pakiety npm:

    `npm install`

4. Jeśli npm nie jest zainstalowany należy pobrać npm oraz Node.js ze strony 

    https://nodejs.org/en/ 
    
5. Przejść do pliku server.js znajdującego się w lokalizacji street-sections/server/server.js, i ustawić odpowiedni connection string w linii 28 w formacie:

    postgres://login:hasło@host:port/baza_danych
    
6. Zapisać i uruchomić serwer w katalogu street-sections/server komendą 

    `node server.js`
    
7. Otworzyć drugi terminal i przejść do głównego katalogu aplikacji
8. Uruchomić aplikację komendą:

    `npm run start`