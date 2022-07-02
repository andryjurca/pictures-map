// 1. geojson file

var geojsonphotos = {"type": "FeatureCollection","features": [{"type": "Feature","properties": {"filename": "img/crimsonu.jpg"},"geometry": {"type": "Point","coordinates": [26.109008789062496,44.43377984606822]}},{"type": "Feature","properties": {"filename": "img/biserica.jpg"},"geometry": {"type": "Point","coordinates": [26.102142333984375,44.422011314236634]}},{"type": "Feature","properties": {"filename": "img/arcul.jpg"},"geometry": {"type": "Point","coordinates": [26.09574794769287,44.43218632942285]}},{"type": "Feature","properties": {"filename": "img/dambovita.jpg"},"geometry": {"type": "Point","coordinates": [26.107420921325684,44.430531477686436]}},{"type": "Feature","properties": {"filename": "img/palatul.jpg"},"geometry": {"type": "Point","coordinates": [26.104202270507812,44.426363495332495]}},{"type": "Feature","properties": {"filename": "img/arcul.jpg"},"geometry": {"type": "Point","coordinates": [26.100382804870605,44.42804911222499]}},{"type": "Feature","properties": {"filename": "img/biserica.jpg"},"geometry": {"type": "Point","coordinates": [26.111712455749508,44.42752810855755]}},{"type": "Feature","properties": {"filename": "img/dambovita.jpg"},"geometry": {"type": "Point","coordinates": [26.109437942504883,44.42427939270172]}},{"type": "Feature","properties": {"filename": "img/palatul.jpg"},"geometry": {"type": "Point","coordinates": [26.095576286315918,44.42820234771396]}}]}

// 2. functions

var clicked_times = 0

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
    
// 3. create map

var latlng = L.latLng(44.429, 26.105);

var map = L.map('map', {
  center: latlng,
  zoom: 15,
  doubleClickZoom: false
})

// 4. add tilelayer

L.tileLayer('https://tiles01.rent-a-planet.com/arhet2-carto/{z}/{x}/{y}.png?{foo}', {
        foo: 'bar', 
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// 5. reading from geojson

var myStyle = { // not working (uite-te mai mult la geojson styling)
        "color": "#ff7800",
        "weight": 5,
        "fillOpacity": 0.90
    };

var readfromjson = L.geoJSON(geojsonphotos, {
        style:myStyle, // not working
        onEachFeature: function (feature, layer) {   
        if (feature.properties && feature.properties.filename) {
            layer.bindPopup('<img src=' + JSON.stringify(feature.properties.filename) + 'width="100" height="auto" id="imageBox"></img>', {maxWidth: "auto"})
            layer.on('click', function(e) {
            console.log(e)
            console.log(layer)
            document.getElementById("poza1").src=e.target.feature.properties.filename;
          })
        }
    }
}).addTo(map);

