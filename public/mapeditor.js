// download function

function download(data, filename, type) {
    const file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        const a = document.createElement("a"),
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

// create map and add tilelayer

const map2 = L.map('map2').setView([44.429, 26.105], 13);
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map2);
L.tileLayer('https://tiles01.rent-a-planet.com/arhet2-carto/{z}/{x}/{y}.png?{foo}', {
        foo: 'bar', 
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map2);

// initialize drawnitems and add drawcontrol

let drawnItems = new L.FeatureGroup(); // FeatureGroup is to store editable layers
map2.addLayer(drawnItems);
let drawControl = new L.Control.Draw({
    draw: {
        circle: false
    },
    edit: {
        featureGroup: drawnItems
    }
});

map2.addControl(drawControl);

// load existing drawn objects with their properties (also edit filename) through geojson data (stored in txt file)  

$.getJSON( "/getfromdb", function( data ) {
    geojsondata1 = JSON.stringify(data)
    try {
        var geeoojson = L.geoJSON(JSON.parse(geojsondata1), {
            onEachFeature: function (feature, layer) {
                layer.addTo(drawnItems);
                div = L.DomUtil.create('div', 'mydiv')

                input = L.DomUtil.create('input', 'myinput', div)
                input.type = 'text'
                input.placeholder = 'filename'
                //if (UrlExists(feature.properties.filename)) 
                input.value = feature.properties.filename || ''                 
                //layer.bindPopup(div)
                const inputHandler = function(o) {
                    layer.feature.properties.filename = o.target.value
                }
                input.addEventListener('input', inputHandler)

                input2 = L.DomUtil.create('input', 'myinput2', div)
                input2.type = 'text'
                input2.placeholder = 'angle'
                //if (UrlExists(feature.properties.filename)) 
                input2.value = feature.properties.angle || ''                
                //layer.bindPopup(div)
                const inputHandler2 = function(o) {
                    layer.feature.properties.angle = o.target.value
                }
                input2.addEventListener('input', inputHandler3)

                input3 = L.DomUtil.create('input', 'myinput3', div)
                input3.type = 'text'
                input3.placeholder = 'year'
                //if (UrlExists(feature.properties.filename)) 
                input3.value = feature.properties.year || ''                
                layer.bindPopup(div)
                const inputHandler3 = function(o) {
                    layer.feature.properties.year = o.target.value
                }
                input3.addEventListener('input', inputHandler3)
            }
        }).addTo(map2)
    }
    catch(e) {
        console.log('loaded geojson data is invalid')
        console.log(e)
    }
});

// add objects and their properties when created 

map2.on('draw:created', function(e) {
    
    const div = L.DomUtil.create('div', 'mydiv')
    const input = L.DomUtil.create('input', 'myinput', div)
    input.type = 'text'
    input.placeholder = 'filename'

    const input2 = L.DomUtil.create('input', 'myinput2', div)
    input2.type = 'text'
    input2.placeholder = 'angle'

    const input3 = L.DomUtil.create('input', 'myinput3', div)
    input3.type = 'text'
    input3.placeholder = 'year'
    
    const layer = e.layer
    layer.bindPopup(div)
    feature = layer.feature = layer.feature || {};

    feature.type = feature.type || "Feature";
    const props = feature.properties = feature.properties || {};
    const inputHandler = function(o) {
        props.filename = o.target.value
    }
    input.addEventListener('input', inputHandler)
    console.log(input.value)

    const inputHandler2 = function(o) {
        props.angle = o.target.value
    }

    input2.addEventListener('input', inputHandler2)
    console.log(input2.value)

    const inputHandler3 = function(o) {
        props.year = o.target.value
    }

    input3.addEventListener('input', inputHandler3)
    console.log(input3.value)

    

    drawnItems.addLayer(layer);
});

// when save button is clicked, the drawn objects and properties (drawnItems) is converted to Geojson and saved to the server

$(document).ready(function(){
    $('#button').click(function(){
        newdata = JSON.stringify(drawnItems.toGeoJSON());
        alert(newdata);
        $.post('/posttodb', {text: newdata})
        

    })
})

// when download button is clicked

$(document).ready(function(){
    $('#download-button').click(function(){
        newdata = JSON.stringify(drawnItems.toGeoJSON());
        alert(newdata);
        $.post('/posttodb', {text: newdata})
        download(newdata, 'newdata.geojson', type=Text)
    })
})

