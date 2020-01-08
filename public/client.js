console.log("Client-side running");

const asteroidButton = document.getElementById("asteroids");
const right = document.getElementById("right");
const rightTitle = document.getElementById("dispTitle");
const rightText = document.getElementById("dispText");
const content = document.getElementById("dispContent");
const image = document.getElementById("dispImage");
const imagerySearchButton = document.getElementById("imagerySearch");
const marsSearchButton = document.getElementById("curiositySearch");
const librarySearchButton = document.getElementById("librarySearch");
const epicButton = document.getElementById("epic")

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

marsSearchButton.addEventListener('click', function (e) {
    sols = document.getElementById('sol').value;
    if (sols < 0 || sols === '') {
        alert("Sol must be non-negative!");
    } else {
        var request = new XMLHttpRequest()
        request.open('GET', `/marsImagery/${sols}`, true)
        request.onload = function () {
            data = JSON.parse(this.response);
            data = data.photos;
            var roverPhotos = [];
            data.forEach(photo => {
                console.log(photo);
                var currPhoto = {
                    date: photo.earth_date,
                    camera: photo.camera.full_name,
                    link: photo.img_src,
                }
                console.log(currPhoto)
                roverPhotos.push(currPhoto);
            })

            rightTitle.textContent = "Curiosity Rover Imagery"
            rightText.textContent = `Using NASA's Mars Rover Photos API for Sol ${sols} of Curiosity's mission`
            var table = new Tabulator("#dispContent", {
                data: roverPhotos,
                layout: "fitDataFill",
                height: "100%",
                responsiveLayout: true,
                columns: [
                    { title: "Earth Date", field: "date", sorter: "date" },
                    { title: "Camera", field: "camera", sorter: "string" },
                    { title: "Link", field: "link", formatter: "link", formatterParams: { label: "View image" } }
                ]
            });
            table.redraw(true);
        }
        request.send();
    }
})

librarySearchButton.addEventListener('click', function (e) {
    searchQ = document.getElementById('searchQ').value;
    if (searchQ === "") {
        alert("Please enter a search term!");
    } else {
        var request = new XMLHttpRequest()
        request.open('GET', `/search/${searchQ}`, true)
        request.onload = function () {
            data = JSON.parse(this.response);
            data = data.collection.items;

            rightTitle.textContent = "NASA Image and Video Library Search"
            rightText.textContent = `Using NASA's Public Image and Video Library API`
            var table = new Tabulator("#dispContent", {
                layout: "fitDataFill",
                height: "100%",
                responsiveLayout: true,
                columns: [
                    { title: "Title", field: "title", sorter: "string", width: 200 },
                    { title: "Date", field: "date" },
                    { title: "Type", field: "type", sorter: "string" },
                    { title: "Link", field: "link", formatter: "link", formatterParams: { label: "View media" } }
                ]
            });
            data.forEach(result => {
                linkToMedia = result.href
                fetch(linkToMedia)
                    .then(res => res.json())
                    .then(json => {
                        console.log(json);
                        href = json[0];
                        var currResult = {
                            type: result.data[0].media_type,
                            date: result.data[0].date_created,
                            title: result.data[0].title,
                            link: href
                        }
                        table.addData(currResult);
                    })

            })
            table.redraw(true);
        }
        request.send();
    }
})

epicButton.addEventListener('click', function (e) {
    var request = new XMLHttpRequest()
    request.open('GET', `/epicImagery`, true)
    request.onload = function () {
        data = JSON.parse(this.response);
        var images = [];
        data.forEach(image => {
            console.log(image);
            var currImage = {
                date: image.date,
                caption: image.caption,
                link: image.image,
            }
            console.log(currImage.date);
            parsedDate = new Date(currImage.date);
            year = parsedDate.getFullYear() + "";
            month = parsedDate.getMonth() + 1 + "";
            date = parsedDate.getDate() + "";
            url = `https://epic.gsfc.nasa.gov/archive/natural/${year}/${month.padStart(2, '0')}/${date.padStart(2, '0')}/png/${currImage.link}.png`;
            currImage.link = url;
            images.push(currImage);
        })

        rightTitle.textContent = "EPIC Imagery"
        rightText.textContent = `Using NASA's EPIC API which provides daily imagery collected by DSCOVR's Earth Polychromatic Imaging Camera (EPIC).`
        var table = new Tabulator("#dispContent", {
            data: images,
            layout: "fitDataFill",
            height: "100%",
            responsiveLayout: true,
            columns: [
                { title: "Date", field: "date", sorter: "date" },
                { title: "Caption", field: "caption", sorter: "string", width: 300 },
                { title: "Link", field: "link", formatter: "link", formatterParams: { label: "View image" } }
            ]
        });
        table.redraw(true);
    }
    request.send();
})