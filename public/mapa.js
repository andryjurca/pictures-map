let clicked_times = 0
let currentID = 123456789
let splitScreen = false
let all_markers = []

// function that changes the view mode

function changeMode(){
    clicked_times += 1
    if (clicked_times%2==0){
        normalMode()
    }
    else{
        splitscreenMode()             
    }   
}

// function that changes to normalMode 

function normalMode() {
    document.getElementById('map').style.width = '100%';
    document.getElementById('picture').style.display = 'none';
    map.invalidateSize();
    //map.setZoom(map.getZoom()+1)
    splitScreen = false
}

// function that changes to splitscreenMode 

function splitscreenMode() {
    document.getElementById('map').style.width = '50%';
    document.getElementById('picture').style.display = 'flex';
    map.invalidateSize();
    //map.setZoom(map.getZoom()-1)
    splitScreen = true
}

// function which returns boolean if the url exists !!!error http not secure

function urlExists(url) {
    const request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.send();
    request.onload = function() {
    status = request.status;
    if (request.status == 200) {
      console.log("image exists");
    } 
    else {
      console.log("image doesn't exist");
    }
  }
}

// function to show image in fullscreen in a new window when clicked

function openImage() {
        window.open(document.getElementById('poza1').getAttribute('src'))
    
}
    
// create map

const lat = 44.429
const lng = 26.105
const latlng = L.latLng(lat, lng);
const boundslatlng1 = L.latLng(lat-0.02, lng-0.02)
const boundslatlng2 = L.latLng(lat+0.02, lng+0.02)
const bounds = L.latLngBounds(boundslatlng1, boundslatlng2)

const map = L.map('map', {
  center: latlng,
  zoom: 14,
  doubleClickZoom: false,
  maxBounds: bounds,
  minZoom: 13,
})

// add tilelayer

L.tileLayer('https://tiles01.rent-a-planet.com/arhet2-carto/{z}/{x}/{y}.png?{foo}', {
        foo: 'bar', 
        attribution: 'Tiles and data created by <a href="https://geofictician.net/about.html">Geofictician</a> and contributors | coded by Andrei Jurcă',
        maxZoom: 19
}).addTo(map);

// marker icons and styles

const myStyle = {
        "color": "#ff7800",
        "weight": 5,
        "fillOpacity": 0.90
    };

const greyArrowIcon = L.icon({
    iconUrl: './icons/greyarrow.svg', 
    iconAnchor: [7.5, 8.5],
    iconSize: [15, 15],
    
});

const greyIcon = L.icon({
    iconUrl: './icons/grey.svg', 
    iconAnchor: [7.5, 8.5],
    iconSize: [15, 15],
    
});

const darkblueArrowIcon = L.icon({
    iconUrl: './icons/darkbluearrow.svg', 
    iconAnchor: [7.5, 8.5],
    iconSize: [15, 15]
    
});

const darkblueIcon = L.icon({
    iconUrl: './icons/darkblue.svg', 
    iconAnchor: [7.5, 8.5],
    iconSize: [15, 15],
    
});

const middleblueArrowIcon = L.icon({
    iconUrl: './icons/middlebluearrow.svg', 
    iconAnchor: [7.5, 8.5],
    iconSize: [15, 15],
    
});

const middleblueIcon = L.icon({
    iconUrl: './icons/middleblue.svg', 
    iconAnchor: [7.5, 8.5],
    iconSize: [15, 15],
    
});

const lightblueArrowIcon = L.icon({
    iconUrl: './icons/lightbluearrow.svg', 
    iconAnchor: [7.5, 8.5],
    iconSize: [15, 15],
    
});

const lightblueIcon = L.icon({
    iconUrl: './icons/lightblue.svg', 
    iconAnchor: [7.5, 8.5],
    iconSize: [15, 15],
    
});

// displaying the geojson data (objects and properties) on the map from server
 
$.getJSON( "/getfromdb", function( data ) {
    geojsondata1 = JSON.stringify(data)
    // try {
        const readfromjson = L.geoJSON(JSON.parse(geojsondata1), {
            //style:myStyle,
            pointToLayer: function(feature, latlng) {
                // return L.circleMarker(latlng, {radius:10})
                if (feature.properties.angle) {
                    if (feature.properties.year < 1914) {
                        return L.marker(latlng, { icon:darkblueArrowIcon, opacity: 0.8, rotationAngle: feature.properties.angle })
                    }
                        
                    if (feature.properties.year >= 1914 & feature.properties.year <= 1945) {
                        return L.marker(latlng, { icon:middleblueArrowIcon, opacity: 0.8, rotationAngle: feature.properties.angle })
                    }
                        
                    if (feature.properties.year > 1945) {
                        return L.marker(latlng, { icon:lightblueArrowIcon, opacity: 0.8, rotationAngle: feature.properties.angle })
                    }
                        
                    else {
                        return L.marker(latlng, { icon:greyArrowIcon, opacity: 0.8, rotationAngle: feature.properties.angle })
                    } 
                        
                } 
                    
                else {
                    if (feature.properties.year < 1914) {
                        return L.marker(latlng, { icon:darkblueIcon, opacity: 0.8 })
                    }
                        
                    if (feature.properties.year >= 1914 & feature.properties.year <= 1945) {
                        return L.marker(latlng, { icon:middleblueIcon, opacity: 0.8 })
                    }
                        
                    if (feature.properties.year > 1945) {
                        return L.marker(latlng, { icon:lightblueIcon, opacity: 0.8 })
                    }
                        
                    else {
                        return L.marker(latlng, { icon:greyIcon, opacity:0.8 })
                    }
                }
                    
                        

              },
            onEachFeature: function (feature, layer) {   
                if (feature.properties && feature.properties.filename) {
                    // popupContent = `${'<img src=' + JSON.stringify(`https://res.cloudinary.com/hzyfr8ajt/image/upload/map-pictures/${feature.properties.filename} `) + 'width="100" height="auto" id="imageBox"></img>'}`
                    popupContent = `${'<img src=' + JSON.stringify(`./img/${feature.properties.filename} `) + 'width="100" height="auto" id="imageBox"></img>'}`

                    layer.bindTooltip(popupContent, { direction: 'top' })
                    
                    layer.on('click', function(e) {
                        sameClicked = currentID == layer._leaflet_id
                        if (splitScreen) {
                            if (sameClicked) {
                                changeMode();
                            }
                            else {
                                currentID = layer._leaflet_id
                            }
                        }

                        else {
                            if (sameClicked) {
                                changeMode()
                            }
                            else {
                                changeMode()
                                currentID = layer._leaflet_id
                            }
                        }

                        //document.getElementById('btn').style.visibility = 'visible'
                        // console.log(e)
                        // console.log(layer)
                        // src1 = `https://res.cloudinary.com/hzyfr8ajt/image/upload/map-pictures/${feature.properties.filename}`
                        src1 = `./img/${feature.properties.filename}`

                        //console.log(src1)
                        document.getElementById("poza1").src=src1

                        imageDescription1 = document.getElementById('imageDescription1')
                        imageDescription2 = document.getElementById('imageDescription2')
                        imageDescription1.innerHTML = feature.properties.year || ''
                        imageDescription2.innerHTML = feature.properties.source || ''

                    })      
                        
                } 
                    
            }
            
        }).addTo(map);
    // }
    // catch(e) {
    //     console.log('loaded geojson data is invalid')
    //     console.log(e)
    // }
});

// map.on('zoomend', function() {
//     const currentZoom = map.getZoom(); 
//     console.log(currentZoom)
//     if (currentZoom > 15) { 
//         console.log('aproape')
//     }
//     else {
//         console.log('departe')
//         map.eachLayer(function (layer) {
//             console.log(layer)
//         })
//     }
// })
        



