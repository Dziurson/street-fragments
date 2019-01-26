install https://www.enterprisedb.com/thank-you-downloading-postgresql?anid=1256160
download https://onedrive.live.com/?authkey=%21AKTrfl1VnEgKjRc&cid=AF1B403467A1667C&id=AF1B403467A1667C%216310&parId=root&action=defaultclick

install postgis during installation (stack builder)
add postgres to path
connect to psql and

unzpi roads.zip and go to this dir

CREATE DATABASE roads;
use roads;
CREATE EXTENSION postgis;
CREATE EXTENSION hstore;


Zainstalowaæ wszystkie skrypty z paczki
psql -U postgres -d roads -f pgsnapshot_schema_0.6.sql
psql -U postgres -d roads -f pgsnapshot_schema_0.6_action.sql
psql -U postgres -d roads -f pgsnapshot_schema_0.6_bbox.sql
psql -U postgres -d roads -f pgsnapshot_schema_0.6_linestring.sql
przy pomocy narzêdzia osmosis zaimportowaæ dane do bazy
osmosis --read-xml roads.osm --log-progress --write-pgsql database=roads user=postgres password=XXXXX


To run:
type 'npm install' in project root
type 'ng serve' in project root
type 'node server' in server dir
