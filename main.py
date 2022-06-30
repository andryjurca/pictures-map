# 1. import libraries

import base64
import time

from flask import Flask
import folium
import pandas as pd
from folium import plugins

# 2. database for the photos (deocamdata un test)

data = pd.DataFrame({
    'x': [26.11, 2, 145, 30.32, -4.03, -73.57, 36.82, -38.5],
    'y': [44.43, 49, -38, 59.93, 5.33, 45.52, -1.29, -12.97],
    'file': ['dambovita.jpg', 'crimsonu.jpg', 'crimsonu.jpg', 'crimsonu.jpg', 'crimsonu.jpg', 'crimsonu.jpg',
             'crimsonu.jpg', 'crimsonu.jpg'],
    'direction': ['up', 'down', 'right', 'left', 'up', 'down', 'right', 'left']
}, dtype=str)

# 3. create app

app = Flask(__name__)


# 4. main page

@app.route("/")
def base():
    # 5. base map
    map1 = folium.Map(location=[44.42750, 26.10229],
                      zoom_start=17,
                      tiles='https://tiles01.rent-a-planet.com/arhet2-carto/{z}/{x}/{y}.png',
                      attr='Tiles and data created by <a href="http://geofictician.net">Geofictician</a> and contributors, built on the OpenStreetMap platform, including creative re-use of data shared by OpenStreetMap contributors')

    # 6. minimap (poate nu o sa ne mai trebuiasca)

    tilelayer1 = folium.raster_layers.TileLayer(
        location=[44.42750, 26.10229],
        zoom_start=17,
        tiles='https://tiles01.rent-a-planet.com/arhet2-carto/{z}/{x}/{y}.png',
        attr='Tiles and data created by <a href="http://geofictician.net">Geofictician</a> and contributors, built on the OpenStreetMap platform, including creative re-use of data shared by OpenStreetMap contributors')
    minimap = plugins.MiniMap(width=400, height=400, tile_layer=tilelayer1)
    map1.add_child(minimap)
    folium.LayerControl().add_to(map1)

    # 7. read photos from database

    for i in range(0, len(data)):
        folium.Marker(
            location=[data.iloc[i]['y'], data.iloc[i]['x']],
            popup=folium.Popup(folium.IFrame(''' <img src="data:image/png;base64,{}">'''.format(
                base64.b64encode(open(data.iloc[i]['file'], 'rb').read()).decode('UTF-8')), width=200, height=200),
                max_width=200),
            tooltip="poza" + str(i + 1),
            icon=folium.Icon(color='green', icon='ok-sign'),
        ).add_to(map1)

    #folium.plugins.FloatImage(folium.IFrame(''' <img src="data:image/png;base64,{}">'''.format(
                #base64.b64encode(open('chick.jpg', 'rb').read()).decode('UTF-8')), width=200, height=200)).add_to(map1)

    with open('img/chick.jpg', 'rb') as lf:
        # open in binary mode, read bytes, encode, decode obtained bytes as utf-8 string
        b64_content = base64.b64encode(lf.read()).decode('utf-8')

    div_image = folium.plugins.FloatImage('data:image/png;base64,{}'.format(b64_content), bottom=30, left=25)
    div_image.add_to(map1)

    folium.plugins.Fullscreen().add_to(map1)
    folium.plugins.MousePosition().add_to(map1)


    # 8. display the html
    map1.save('porc.html')
    return map1._repr_html_()


# 9. always to be done

if __name__ == "__main__":
    app.run(debug=True)
