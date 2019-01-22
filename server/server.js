const express = require('express');
const Sequelize = require('sequelize');
const cors = require('cors')

const hostname = 'localhost';
const port = 3000;
const server = express();
server.use(cors());
server.options('/test', cors());
server.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/osm');

const Road = sequelize.define('project', {
  name: Sequelize.STRING,
  lanes: Sequelize.STRING,
  surface: Sequelize.STRING,
  maxspeed: Sequelize.STRING,
  oneway: Sequelize.STRING
})

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

server.get('/test', cors(), (req, res, next) => {
  sequelize.query(
    "select tags->'name' as name, " + 
           "tags->'lanes' as lanes, " +
           "tags->'surface' as surface, " +
           "tags->'maxspeed' as maxspeed, " + 
           "tags->'oneway' as oneway " + 
    "from ways where tags->'name' like '%Mickiewicza%'", { model: Road, mapToModel: true}).then(results => {
    res.json(JSON.stringify(results)); 
  })
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});