const express = require('express');
const Sequelize = require('sequelize');
var bodyParser = require('body-parser')
const cors = require('cors')

const hostname = 'localhost';
const port = 3000;
const server = express();

const pageSize = 20;

server.use(cors());
server.options('/get-roads', cors());
server.options('/get-roads-from-to', cors());
server.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
server.use(bodyParser({
  extended: true,
  limit: '50mb'
}))
server.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb'
}))
server.use(bodyParser())

const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/roads',{
  logging: false
});

const Road = sequelize.define('project', {
  name: Sequelize.STRING,
  lanes: Sequelize.STRING,
  surface: Sequelize.STRING,
  maxspeed: Sequelize.STRING,
  oneway: Sequelize.STRING,
  object: Sequelize.JSON
})

sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
})
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

server.post('/get-roads', cors(), (req, res, next) => { 

  var query = 
      "select tags->'name' as name, " +
      "tags->'lanes' as lanes, " +
      "tags->'surface' as surface, " +
      "tags->'maxspeed' as maxspeed, " +
      "tags->'oneway' as oneway, " +      
      "ST_AsGeoJSON(linestring) as object " + 
      "from ways where ST_Contains(ST_GeomFromText('" + req.body.wkt + "',4326),linestring) "

  if(req.body.name)
    query = query + "and UPPER(tags->'name') like UPPER('%" + req.body.name + "%') ";
  if(req.body.lanes)
    query = query + "and tags->'lanes' = '" + req.body.lanes + "' ";
  if(req.body.surface)
    query = query + "and tags->'surface' = '" + req.body.surface + "' ";
  if(req.body.maxspeed)
    query = query + "and tags->'maxspeed' = '" + req.body.maxspeed + "' ";
  if(req.body.oneway)
    query = query + "and tags->'oneway' = '" + req.body.oneway + "' ";  
  if(req.body.page)
    query = query + "offset " + (req.body.page - 1) * pageSize + " limit " + pageSize

  sequelize.query(query, { model: Road, mapToModel: true }).then(results => {
      res.json(JSON.stringify(results));
    })
});

server.post('/get-roads-from-to', cors(), (req, res, next) => { 

  var query = 
      "select tags->'name' as name, " +
      "tags->'lanes' as lanes, " +
      "tags->'surface' as surface, " +
      "tags->'maxspeed' as maxspeed, " +
      "tags->'oneway' as oneway, " +      
      "ST_AsGeoJSON(linestring) as object " + 
      "from ways where ST_Contains(ST_GeomFromText('" + req.body.wkt + "',4326),linestring) " + 
      "and id in (select unnest(get_ways('" + req.body.street + "','" + req.body.street_from + "','" + req.body.street_to + "')))";  

  sequelize.query(query, { model: Road, mapToModel: true }).then(results => {
      res.json(JSON.stringify(results));
    })
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});