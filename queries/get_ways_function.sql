CREATE OR REPLACE FUNCTION get_ways(street varchar, from_street varchar, to_street varchar, selected_area text) RETURNS bigint[] AS $$
DECLARE
  first_way_id bigint;
  _result way_result;
  first_way_cursor CURSOR FOR 
    SELECT id 
      FROM   ways 
      WHERE  id IN (
        SELECT DISTINCT way_id 
        FROM   way_nodes 
        WHERE  node_id IN (
          SELECT DISTINCT node_id 
          FROM   way_nodes 
          WHERE  way_id IN (
            SELECT id 
            FROM   ways 
            WHERE  upper(tags -> 'name') like upper(from_street)
      AND ST_Contains(ST_GeomFromText(selected_area,4326),linestring)))) 
      AND upper(tags->'name') like upper(street)
    UNION
      SELECT w1.id 
      FROM ways as w1 
      WHERE w1.tags->'junction' IS NOT NULL
      AND ST_Contains(ST_GeomFromText(selected_area,4326),w1.linestring)
      AND EXISTS (
        SELECT DISTINCT w1.id 
        FROM way_nodes AS wn1 
	      JOIN way_nodes AS wn2 ON (wn1.node_id = wn2.node_id)
	      JOIN ways AS w2 ON (wn2.way_id = w2.id)
	      WHERE wn1.way_id = w1.id
	      AND upper(w2.tags->'name') like upper(street))
      AND EXISTS (
        SELECT DISTINCT w1.id FROM way_nodes AS wn1 
	      JOIN way_nodes AS wn2 ON (wn1.node_id = wn2.node_id)
	      JOIN ways AS w2 ON (wn2.way_id = w2.id)
	      WHERE wn1.way_id = w1.id
	      AND upper(w2.tags->'name') like upper(from_street));

BEGIN
	OPEN first_way_cursor;
	FETCH first_way_cursor into first_way_id;
	CLOSE first_way_cursor;
						
	_result := find_ways(first_way_id,to_street,street,array[first_way_id]);

  IF(_result.found) THEN
    RETURN _result.ways;
  ELSE
  	RETURN '{}';
  END IF; 
  
END;
$$ LANGUAGE plpgsql;