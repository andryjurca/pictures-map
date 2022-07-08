var realdata = {}

const datas = {
    data: realdata,
    writedata: function(newdata) {
        this.data = newdata;
    },
    readdata: function() {
        return this.data
    }
}

if (localStorage.getItem('datas1') == {}) {
    realdata = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[26.036749,44.443203]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[26.106981,44.405168]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[26.140122,44.446269]}},{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[26.078476,44.417562],[26.078476,44.428114],[26.104405,44.428114],[26.104405,44.417562],[26.078476,44.417562]]]}}]};
    datas.writedata(realdata);
}
else{
    console.log('exista realdata nou')
    datas.writedata(localStorage.getItem('datas1'))
}

// 1. functions

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
    
// 2. create map

var latlng = L.latLng(44.429, 26.105);

var map = L.map('map', {
  center: latlng,
  zoom: 15,
  doubleClickZoom: false
})

// 3. add tilelayer

L.tileLayer('https://tiles01.rent-a-planet.com/arhet2-carto/{z}/{x}/{y}.png?{foo}', {
        foo: 'bar', 
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// 4. reading from geojson

var myStyle = { // not working (uite-te mai mult la geojson styling)
        "color": "#ff7800",
        "weight": 5,
        "fillOpacity": 0.90
    };

datas.readdata(localStorage.getItem('datas1'))

var readfromjson = L.geoJSON(JSON.parse(datas.data), {
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

