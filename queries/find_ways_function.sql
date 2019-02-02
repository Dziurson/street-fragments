CREATE OR REPLACE FUNCTION find_ways(way_id_arg bigint, destination varchar, source varchar, previous bigint[]) RETURNS way_result AS $$
DECLARE 
  get_neighbor_ways CURSOR (way_id_param bigint, way_name varchar) FOR
    select distinct wn1.way_id as way_id, w.tags->'name' from way_nodes as wn1 join ways as w on (w.id = wn1.way_id)
    where node_id in (
      select node_id 
      from way_nodes as wn2 
      where wn2.way_id = way_id_param) 
    and wn1.way_id != way_id_param 
    and upper(w.tags->'name') = upper(way_name);
	
  query varchar;

  result_way bigint;
  result_name varchar;
  _result way_result;
  _path bigint[];
  _loop_result way_result;
  _rec bigint;
BEGIN	
    _path := previous;
    OPEN get_neighbor_ways(way_id_arg,destination);
    FETCH get_neighbor_ways INTO result_way, result_name;
    CLOSE get_neighbor_ways;

    IF result_way IS NULL THEN  
	  FOR _rec IN 
      	select distinct wn1.way_id as way_id from way_nodes as wn1 join ways as w on (w.id = wn1.way_id)
      	where node_id in (
        select node_id 
        from way_nodes as wn2 
        where wn2.way_id = way_id_arg) 
      and wn1.way_id != way_id_arg 
      and upper(w.tags->'name') = upper(source) 
    LOOP
      IF (previous @> array[_rec]) THEN
        CONTINUE;
      END IF;
	  	  _loop_result := find_ways(_rec,destination,source,array_append(previous,_rec));
		  IF (_loop_result.found = true) THEN
		    RETURN _loop_result;
		  END IF;
	  END LOOP;
	  _loop_result.ways = previous;
	  _loop_result.found = false;
	  RETURN _loop_result;																	 
    ELSE
	  _result.ways = _path;
	  _result.found = true;
	  RETURN _result;
    END IF;
    RETURN _path;
END;
$$ LANGUAGE plpgsql;