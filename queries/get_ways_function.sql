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
          WHERE  tags -> 'name' = from_street
		AND ST_Contains(ST_GeomFromText(selected_area,4326),linestring)))) 
    AND  tags->'name' = street; 

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