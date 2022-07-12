// 1. currently unused download function

function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

// 2. create map and add tilelayer

var map2 = L.map('map2').setView([44.429, 26.105], 13);
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map2);
L.tileLayer('https://tiles01.rent-a-planet.com/arhet2-carto/{z}/{x}/{y}.png?{foo}', {
        foo: 'bar', 
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map2);

// 3. initialize drawnitems and add drawcontrol

var drawnItems = new L.FeatureGroup(); // FeatureGroup is to store editable layers
map2.addLayer(drawnItems);
var drawControl = new L.Control.Draw({
    edit: {
        featureGroup: drawnItems
    }
});

map2.addControl(drawControl);

// 4. load existing drawn objects with their properties (also edit filename) through geojson data (stored in localstorage)  

dataa = localStorage.getItem('datas1')
var geeoojson = L.geoJSON(JSON.parse(dataa), {
    onEachFeature: function (feature, layer) {
        layer.addTo(drawnItems);
        div = L.DomUtil.create('div', 'mydiv')
        input = L.DomUtil.create('input', 'myinput', div)
        input.type = 'text'
        input.placeholder = 'filename'
        input.value = feature.properties.filename
        layer.bindPopup(div)
        const inputHandler = function(o) {
            layer.feature.properties.filename = o.target.value
        }
        input.addEventListener('input', inputHandler)
    }
}).addTo(map2)

// 5. add objects and their properties when created 

map2.on('draw:created', function(e) {
    
    var div = L.DomUtil.create('div', 'mydiv')
    var input = L.DomUtil.create('input', 'myinput', div)
    input.type = 'text'
    input.placeholder = 'filename'
    
    var layer = e.layer
    layer.bindPopup(div)
    feature = layer.feature = layer.feature || {};

    feature.type = feature.type || "Feature";
    var props = feature.properties = feature.properties || {};
    const inputHandler = function(o) {
        props.filename = o.target.value
    }
    input.addEventListener('input', inputHandler)
    console.log(input.value)
    drawnItems.addLayer(layer);
});

// 6. when G button is clicked, the drawn objects and properties (drawnItems) is converted to Geojson and saved to localstorage for later to acces it

$(document).ready(function(){
    $('#button').click(function(){
        newdata = JSON.stringify(drawnItems.toGeoJSON());
        alert(newdata);
        datas.writedata(newdata);
        localStorage.setItem('datas1', datas.data); 

    })
})

