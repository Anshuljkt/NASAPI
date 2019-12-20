//Getting stylesheets
// console.log("start here");
// import 'style.css';
// require('dotenv').config();
// console.log(process.env);

const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.render('index');
})

app.listen(3000, function () {
<<<<<<< HEAD
  console.log(`Listening on port 3000`);
=======
  console.log('Example app listening on port 3000!')
>>>>>>> 45db47a4d748316aec93966dcceba8badd02402b
})

console.log("got here");

// const APIURL = 

const options = {
    method: 'GET',
    headers: {
      "Accept": 'application/json'
    } 
  }