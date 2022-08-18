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
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// displaying the geojson data (objects and properties) on the map from server

const myStyle = {
        "color": "#ff7800",
        "weight": 5,
        "fillOpacity": 0.90
    };

const Icon = L.icon({
    iconUrl: './icons/arrow.svg', 
    iconAnchor: [15, 15],
    iconSize: [30, 30],
    
});

const Icon2 = L.icon({
    iconUrl: './icons/arrow.svg', 
    iconAnchor: [10, 10],
    iconSize: [10, 10]
});

// const leafIcon = L.Icon.extend({
//     options: {
//         iconSize:     [50, 50] // Change icon size according to zoom level
//     }
// });

// const leafIcon2 = L.Icon.extend({
//     options: {
//         iconSize:     [10, 10] // Change icon size according to zoom level
//     }
// });

 
$.getJSON( "/getfromdb", function( data ) {
    geojsondata1 = JSON.stringify(data)
    // try {
        const readfromjson = L.geoJSON(JSON.parse(geojsondata1), {
            //style:myStyle,
            pointToLayer: function(feature, latlng) {
                // return L.circleMarker(latlng, {radius:10})
                if (feature.properties.angle) 
                    return L.marker(latlng, { icon:Icon, opacity: 0.5, rotationAngle: feature.properties.angle })
                else
                    return L.marker(latlng, { icon:Icon, opacity: 0.5 })

              },
            onEachFeature: function (feature, layer) {   
                if (feature.properties && feature.properties.filename) {
                    popupContent = `'${'<img src=' + JSON.stringify(`https://res.cloudinary.com/hzyfr8ajt/image/upload/map-pictures/${feature.properties.filename} `) + 'width="100" height="auto" id="imageBox"></img>'}'`
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
                        src1 = `https://res.cloudinary.com/hzyfr8ajt/image/upload/map-pictures/${feature.properties.filename}`
                        //console.log(src1)
                        document.getElementById("poza1").src=src1
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
        



