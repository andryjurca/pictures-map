// 1. geojson file

var geojsonphotos = {"type": "FeatureCollection","features": [{"type": "Feature","properties": {"filename": "img/crimsonu.jpg"},"geometry": {"type": "Point","coordinates": [26.109008789062496,44.43377984606822]}},{"type": "Feature","properties": {"filename": "img/biserica.jpg"},"geometry": {"type": "Point","coordinates": [26.102142333984375,44.422011314236634]}},{"type": "Feature","properties": {"filename": "img/arcul.jpg"},"geometry": {"type": "Point","coordinates": [26.09574794769287,44.43218632942285]}},{"type": "Feature","properties": {"filename": "img/dambovita.jpg"},"geometry": {"type": "Point","coordinates": [26.107420921325684,44.430531477686436]}},{"type": "Feature","properties": {"filename": "img/palatul.jpg"},"geometry": {"type": "Point","coordinates": [26.104202270507812,44.426363495332495]}},{"type": "Feature","properties": {"filename": "img/crimsonu.jpg"},"geometry": {"type": "Point","coordinates": [26.100382804870605,44.42804911222499]}},{"type": "Feature","properties": {"filename": "img/biserica.jpg"},"geometry": {"type": "Point","coordinates": [26.111712455749508,44.42752810855755]}},{"type": "Feature","properties": {"filename": "img/dambovita.jpg"},"geometry": {"type": "Point","coordinates": [26.109437942504883,44.42427939270172]}},{"type": "Feature","properties": {"filename": "img/palatul.jpg"},"geometry": {"type": "Point","coordinates": [26.095576286315918,44.42820234771396]}}]}

var markers = [
  ["img/crimsonu.jpg",[44.43,26.102]],
  ["img/arcul.jpg",[44.43,26.104]],
  ["img/biserica.jpg",[44.43,26.106]],
  ["img/palatul.jpg",[44.43,26.108]],
  ["img/dambovita.jpg",[44.43,26.11]],
  ["img/palatul.jpg",[44.43,26.112]],
  ["img/arcul.jpg",[44.43,26.114]],
  ["img/biserica.jpg",[44.43,26.116]],
  ["img/crimsonu.jpg",[44.43,26.118]]
  ];

// 2. functions



// 2. create map

var map = L.map('map').setView([44.427, 26.1], 14)

// 3. create tilelayer

L.tileLayer('https://tiles01.rent-a-planet.com/arhet2-carto/{z}/{x}/{y}.png?{foo}', {
        foo: 'bar', 
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// 4. display meter

L.control.scale({metric: true, imperial: false }).addTo(map);

// 5. create test marker

var marker = L.marker([51.5, -0.09], {
        draggable: true,
        title: "hover text",
        opacity: 0.5,
}).addTo(map);

marker.bindPopup('<img src="img/crimsonu.jpg" width="100" height="100">');

// 6. reading from geojson

//var myStyle = { // not working (uite-te mai mult la geojson styling)
        //"color": "#ff7800",
        //"weight": 5,
        //"fillOpacity": 0.90
    //};

//var readfromjson = L.geoJSON(geojsonphotos, {
        //style: {
          
        //}, // not working
        //onEachFeature: function (feature, layer) {      
          //layer.bindPopup('<img src=' + JSON.stringify(feature.properties.filename) + 'width="100" height="100" id="imageBox"></img>')
          //document.getElementById("poza1").src=feature.properties.filename;  
        //}
        
  //}).addTo(map);^

// 7. create markers using own data

markerlist = []

for (var i = 0; i < markers.length; i++) {
  markerlist[i] = new L.marker([markers[i][1][0],markers[i][1][1]])
    .bindPopup('<img src=' + JSON.stringify(markers[i][0]) + 'width="100" height="100" id="imageBox"></img>')
    .addTo(map).on('click', function(e) {
    lat_marker = this.getLatLng().lat
    lng_marker = this.getLatLng().lng
    alert(markers.prototype.includes([lat_marker, lng_marker]))
    

  });

  

var featureGroup = L.featureGroup(markerlist)



    
}


