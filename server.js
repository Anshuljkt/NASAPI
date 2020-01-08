require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fetch = require('node-fetch');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

console.log();
var API_KEY = 'DEMO_KEY';
if(process.env.API_KEY != undefined && process.env.API_KEY != '') {
  API_KEY = process.env.API_KEY;
}

const API = `https://api.nasa.gov`

console.log(`Using Base URL: ${API}`);

function getPotD() {

}

const simpleGet = {
  method: 'GET',
  headers: {
    "Accept": 'application/json'
  } 
}

app.get('/', function (req, res) {
  //Sets picture of the day
  var potdURL;
  var altText;
  url = `${API}/planetary/apod?api_key=${API_KEY}`;
  // console.log(url);
  fetch(url, simpleGet)
  .then(resp => resp.json())
  .then(resp => {
    potdURL = resp.url;
    altText = resp.explanation;
    if(potdURL === undefined) {
      potdURL = "https://apod.nasa.gov/apod/image/1912/J0030_NICER_1024.jpg";
    }
    // console.log(`potdURL: ${potdURL}`);
    res.render('index', {
      imgSrc: potdURL,
      text: altText
    });
  })
  .catch(err=> {
    console.error(err);
  })
})

app.get('/asteroids', function(req, res) {
  //Returns Asteroids using NASA's NeoWS API.
  url = `${API}/neo/rest/v1/feed?detailed=false&api_key=${API_KEY}`;
  console.log(url);
  fetch(url, simpleGet)
  .then(resp => resp.json())
  .then(resp => {
    res.send(resp);
  })
  .catch(err => {
    console.error(err);
  })
})

app.get('/imagery/:lat/:long', function(req, res) {
  //Returns JSON data linking to an image from NASA's Earth Imagery API
  url = `${API}/planetary/earth/imagery/?lat=${req.params.lat}&lon=${req.params.long}&api_key=${API_KEY}`;
  console.log(url);
  fetch(url, simpleGet)
  .then(resp => resp.json())
  .then(resp => {
    res.send(resp);
  })
  .catch(err => {
    console.error(err);
  })
})

app.get('/marsImagery/:sols', function(req, res) {
  url = `${API}/mars-photos/api/v1/rovers/curiosity/photos?sol=${req.params.sols}&api_key=${API_KEY}`;
  console.log(url);
  fetch(url, simpleGet)
  .then(resp => resp.json())
  .then(resp => {
    res.send(resp);
  })
  .catch(err => {
    console.error(err);
  })
})

app.get('/search/:query', function(req, res) {
  url = `https://images-api.nasa.gov/search?q=${req.params.query}`
  console.log(url);
  fetch(url, simpleGet)
  .then(resp => resp.json())
  .then(resp => {
    res.send(resp);
  })
  .catch(err => {
    console.error(err);
  })
})

app.listen(9001, function () {
  console.log(`Listening on port 9001`);
})

