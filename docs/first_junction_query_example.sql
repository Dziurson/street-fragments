SELECT id 
FROM   ways 
WHERE  id IN (SELECT DISTINCT way_id 
              FROM   way_nodes 
              WHERE  node_id IN (SELECT DISTINCT node_id 
                                 FROM   way_nodes 
                                 WHERE  way_id IN (SELECT id 
                                                   FROM   ways 
                                                   WHERE 
                                        tags -> 'name' = 'Wielicka')) 
                    ) 
       AND tags -> 'name' = 'Wolska';