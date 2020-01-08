console.log("Client-side running");

const asteroidButton = document.getElementById("asteroids");
const right = document.getElementById("right");
const rightTitle = document.getElementById("dispTitle");
const rightText = document.getElementById("dispText");
const content = document.getElementById("dispContent");
const image = document.getElementById("dispImage");
const imagerySearchButton = document.getElementById("imagerySearch");
const marsSearchButton = document.getElementById("curiositySearch");


asteroidButton.addEventListener('click', function (e) {
    var request = new XMLHttpRequest()
    request.open('GET', '/asteroids', true)
    request.onload = function () {
        data = JSON.parse(this.response)
        data = data.near_earth_objects;
        data = Object.entries(data);
        var asteroidData = [];
        data.forEach(date => {
            date[1].forEach(asteroid => {
                var currAsteroid = {
                    name: asteroid.name,
                    diameter: asteroid.estimated_diameter.meters.estimated_diameter_max,
                    date: asteroid.close_approach_data[0].close_approach_date,
                    hazard: asteroid.is_potentially_hazardous_asteroid,
                    link: asteroid.nasa_jpl_url,
                }
                console.log(currAsteroid)
                asteroidData.push(currAsteroid);
            })
        })

        rightTitle.textContent = "Asteroids closest to Earth"
        rightText.textContent = "Using NASA's NeoWS (Near Earth Object Web Service) API"
        var table = new Tabulator("#dispContent", {
            data: asteroidData,
            layout: "fitDataFill",
            height: "100%",
            responsiveLayout: true,
            columns: [
                { title: "Name", field: "name", sorter: "string" },
                { title: "Diameter (m)", field: "diameter", sorter: "number" },
                { title: "Date when closest", field: "date", sorter: "date" },
                { title: "Hazardous", field: "hazard", sorter: "boolean" },
                { title: "Link", field: "link", formatter: "link", formatterParams: { label: "Learn more" } }
            ]
        });
        table.redraw(true);
    }
    request.send();
})

imagerySearchButton.addEventListener('click', function (e) {
    lat = document.getElementById('lat').value;
    long = document.getElementById('long').value;

    //Latitude/Longitude validation sourced from: https://dotnettec.com/validate-latitude-and-longitude/
    if (lat < -90 || lat > 90) {
        alert("Latitude must be between -90 and 90 degrees inclusive.");
    }
    else if (long < -180 || long > 180) {
        alert("Longitude must be between -180 and 180 degrees inclusive.");
    }
    else if (lat == "" || long == "") {
        alert("Enter a valid Latitude or Longitude!");
    } else {
        var request = new XMLHttpRequest()
        request.open('GET', `/imagery/${lat}/${long}`, true)
        request.onload = function () {
            data = JSON.parse(this.response);
            console.log(data);
            url = data.url;
            content.innerHTML = `<img id="dispImage" src="${url}" title="Latitude = ${lat}, Longitude = ${long}"> </img>`;
            rightTitle.textContent = "NASA Earth Imagery for your entered coordinates";
            rightText.textContent = `Using NASA's Earth Imagery API. Image Date: ${data.date}`;
        }
        request.send();
    }
})

marsSearchButton.addEventListener('click', function(e) {
    
})