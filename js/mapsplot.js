var plotStates = function(pane){
	d3.json('/data/geojson/states.geojson' , function(states){	
		d3.csv('/data/csv/statesCensus.csv' , function(info){
			var map = L.map(pane).setView([23.40, 83.00], 4);
			L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
				maxZoom: 18,
				attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
			}).addTo(map);
			var marker
			var getColor = function(d) {
			    return d > 1000 ? '#bd0026' :
			           d > 950  ? '#f03b20' :
			           d > 900  ? '#fd8d3c' :
			           d > 800  ? '#fecc5c' :
			            		'#ffffb2' ;
			}

			var style01 = function(feature) {
			    return {
			        fillColor: getColor(feature.properties.sr01),
			        weight: 2,
			        opacity: 1,
			        color: 'white',
			        dashArray: '3',
			        fillOpacity: 0.7
			    };
			}

			var style11 = function(feature) {
			    return {
			        fillColor: getColor(feature.properties.sr11),
			        weight: 2,
			        opacity: 1,
			        color: 'white',
			        dashArray: '3',
			        fillOpacity: 0.7
			    };
			}

			var infoTip = L.control();
			infoTip.onAdd = function (map) {
			    this._div = L.DomUtil.create('div', 'info');
			    this.update();
			    return this._div;
			};
			infoTip.update = function (props) {
			    this._div.innerHTML = '<h6>India Sex Ratio</h6>' +  (props ?
			        '<b>' + props.ST_NM + '</b><br />Census 2001 : <b>' + props.sr01 + '</b><br />Census 2011 : <b>' + props.sr11
			        : 'Hover over a state');
			};
			infoTip.addTo(map);

			var legend = L.control({position: 'bottomright'});
			legend.onAdd = function (map) {
			    var div = L.DomUtil.create('div', 'info legend'),
			        grades = [0, 800, 900, 950, 1000],
			        labels = [];
			    for (var i = 0; i < grades.length; i++) {
			        div.innerHTML +=
			            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
			            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
			    }
			    return div;
			};

			legend.addTo(map);

			var highlightFeature =function(e) {
			    var layer = e.target;

			    layer.setStyle({
			        weight: 3,
			        dashArray: '',
			        fillOpacity: 0.8
			    });

			    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			        layer.bringToFront();
				}
				infoTip.update(layer.feature.properties);
			}

			var resetHighlight = function(e) {
			    geolayer.resetStyle(e.target);
			    infoTip.update();
			}

			var zoomToFeature = function(e) {
			    map.fitBounds(e.target.getBounds());
			}

			var onEachFeature = function(feature, layer) {
			    layer.on({
			        mouseover: highlightFeature,
			        mouseout: resetHighlight,
			        click: zoomToFeature
			    });
			}

			var getsr01 = function(statenm){
				entry = info.filter(function(d){
					return d['state'].trim() == statenm.trim()
				});
				return entry[0]['2001']
			}

			var getsr11 = function(statenm){
				entry = info.filter(function(d){
					return d['state'].trim() == statenm.trim()
				});
				return entry[0]['2011']
			}
			
			for(i=0; i<states['features'].length ;i++){
				states['features'][i]['properties']['sr01'] = getsr01(states['features'][i]['properties']['ST_NM'])
				states['features'][i]['properties']['sr11'] = getsr11(states['features'][i]['properties']['ST_NM'])
			}
			var geolayer = L.geoJson(states, {style: style11, onEachFeature: onEachFeature}).addTo(map);

			
		})
	})
}
