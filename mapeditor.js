//var realdata = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[26.036749,44.443203]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[26.106981,44.405168]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[26.140122,44.446269]}},{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[26.078476,44.417562],[26.078476,44.428114],[26.104405,44.428114],[26.104405,44.417562],[26.078476,44.417562]]]}}]}

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

var map2 = L.map('map2').setView([44.429, 26.105], 13);
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map2);
L.tileLayer('https://tiles01.rent-a-planet.com/arhet2-carto/{z}/{x}/{y}.png?{foo}', {
        foo: 'bar', 
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map2);

        // FeatureGroup is to store editable layers
var drawnItems = new L.FeatureGroup();
map2.addLayer(drawnItems);
var drawControl = new L.Control.Draw({
    edit: {
        featureGroup: drawnItems
    }
});

map2.addControl(drawControl);

map2.on('draw:created', function(e) {
    var layer = e.layer,
    feature = layer.feature = layer.feature || {};

    feature.type = feature.type || "Feature";
    var props = feature.properties = feature.properties || {};
    drawnItems.addLayer(layer);
});

//document.getElementById('button').addEventListener('click', function() {
    //var data = JSON.stringify(drawnItems.toGeoJSON());
    //download("var realdata = " + data, "test.js", "text/javascript")
    
//});

$(document).ready(function(){
    $('#button').click(function(){
        newdata = JSON.stringify(drawnItems.toGeoJSON());
        alert(newdata);
        datas.writedata(newdata);
        localStorage.setItem('datas1', datas.data); 

    })
})

