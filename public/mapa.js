// function connected to M button to change the view mode

let clicked_times = 0

function changeMode(){
    clicked_times += 1
    if (clicked_times%2==0){
        document.getElementById('map').style.width = '100%';
        document.getElementById('picture').style.display = 'none';
        map.invalidateSize();
        map.setZoom(map.getZoom()+1)
    }
    else{
        document.getElementById('map').style.width = '50%';
        document.getElementById('picture').style.display = 'flex';
        map.invalidateSize();
        map.setZoom(map.getZoom()-1)             
    }   
}

// function which returns boolean if the url exists

function UrlExists(url)
{
    const http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status!=404;
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

// displaying the geojson data (objects and properties) on the map from txt file

const myStyle = {
        "color": "#ff7800",
        "weight": 5,
        "fillOpacity": 0.90
    };
 
$.getJSON( "/getu", function( data ) {
    geojsondata1 = JSON.stringify(data)
    try {
        const readfromjson = L.geoJSON(JSON.parse(geojsondata1), {
            //style:myStyle,
            onEachFeature: function (feature, layer) {   
                if (feature.properties && feature.properties.filename) {
                    if (UrlExists(feature.properties.filename)){
                        layer.bindPopup('<img src=' + JSON.stringify(feature.properties.filename) + 'width="100" height="auto" id="imageBox"></img>', {maxWidth: "auto"})
                        layer.on('click', function(e) {
                        document.getElementById('btn').style.visibility = 'visible'
                        console.log(e)
                        console.log(layer)
                        document.getElementById("poza1").src=e.target.feature.properties.filename;
                        })
                    } 
                    else {
                        layer.bindPopup('Image not found')
                    }
                }
            }
        }).addTo(map);
    }
    catch(e) {
        console.log('loaded geojson data is invalid')
    }
});




