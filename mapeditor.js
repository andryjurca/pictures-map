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

var map = L.map('map').setView([44.429, 26.105], 13);
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
L.tileLayer('https://tiles01.rent-a-planet.com/arhet2-carto/{z}/{x}/{y}.png?{foo}', {
        foo: 'bar', 
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // FeatureGroup is to store editable layers
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);
var drawControl = new L.Control.Draw({
    edit: {
        featureGroup: drawnItems
    }
});

map.addControl(drawControl);

map.on('draw:created', function(e) {
    var layer = e.layer,
    feature = layer.feature = layer.feature || {};

    feature.type = feature.type || "Feature";
    var props = feature.properties = feature.properties || {};
    drawnItems.addLayer(layer);
});

document.getElementById('button').addEventListener('click', function() {
    var data = JSON.stringify(drawnItems.toGeoJSON());
    download("var realdata = " + data, "test.js", "text/javascript")
    
});