const express = require('express');
const Sequelize = require('sequelize');
var bodyParser = require('body-parser')
const cors = require('cors')

const hostname = 'localhost';
const port = 3000;
const server = express();

server.use(cors());
server.options('/get-road', cors());
server.options('/get-road-from-to', cors());
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

server.post('/get-road', cors(), (req, res, next) => { 

  var query = 
      "select tags->'name' as name, " +
      "tags->'lanes' as lanes, " +
      "tags->'surface' as surface, " +
      "tags->'maxspeed' as maxspeed, " +
      "tags->'oneway' as oneway, " +      
      "ST_AsGeoJSON(linestring) as object " + 
      "from ways where ST_Contains(ST_GeomFromText('" + req.body.wkt + "',4326),linestring) " + 
      "and upper(tags->'name') like (upper('%" + req.body.street + "%'))";

  sequelize.query(query, { model: Road, mapToModel: true }).then(results => {
      res.json(JSON.stringify(results));
    })
});

server.post('/get-road-from-to', cors(), (req, res, next) => { 

  var query = 
      "select tags->'name' as name, " +
      "tags->'lanes' as lanes, " +
      "tags->'surface' as surface, " +
      "tags->'maxspeed' as maxspeed, " +
      "tags->'oneway' as oneway, " +      
      "ST_AsGeoJSON(linestring) as object " + 
      "from ways where id in (select unnest(get_ways('" + req.body.street + "','" + req.body.street_from + "','" + req.body.street_to + "','"+ req.body.wkt +"')))";  

  sequelize.query(query, { model: Road, mapToModel: true }).then(results => {
      res.json(JSON.stringify(results));
    })
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});