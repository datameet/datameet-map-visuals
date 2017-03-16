//////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////Assembly Constituencies India////////////////////////////
var plotAC = function(pane){
	d3.json('/data/geojson/ac.geojson' , function(asscon){	
		var map = L.map(pane,{scrollWheelZoom:false}).setView([23.40, 83.00], 5);
		var tile = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
			maxZoom: 18,
			minZoom:2,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		}).addTo(map);
		var getColor = d3.interpolateHcl("#fff7f3",'#49006a');
		var style = function(feature) {
		    return {
		        fillColor: getColor((feature['properties']['Shape_Area']-minarea)/(maxarea-minarea)),
		        weight: 1,
		        opacity: 1,
		        color: 'white',
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
		    this._div.innerHTML = '<h6>Assembly Constituencies</h6>' +  (props ?
		        'State :<b>' + props.ST_NAME + '</b><br />PC : <b>' + props.PC_NAME +
		        '</b><br />AC : <b>' + props.AC_NAME + '</b><br />Area : <b>' + props.Shape_Area + ' km<sup>2</sup></b>'
		        : 'Hover over a District');
		};
		infoTip.addTo(map);
		
		var legend = L.control({position: 'bottomright'});
		var highlightFeature =function(e) {
		    var layer = e.target;

		    layer.setStyle({
		        weight: 4,
		        color: '#fff',
		        dashArray: '',
		        fillOpacity: 0.9
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
		
		for(i=0; i<asscon['features'].length ;i++){
			asscon['features'][i]['properties']['Shape_Area'] = parseInt(asscon['features'][i]['properties']['Shape_Area']*1000000)
		}
		
		var maxarea = (1/7)*d3.max(d3.values(asscon['features']), function(d){return (d['properties']['Shape_Area'])})
		var minarea = d3.min(d3.values(asscon['features']), function(d){return (d['properties']['Shape_Area'])})
		var geolayer = L.geoJson(asscon,{style: style, onEachFeature:onEachFeature}).addTo(map);
	})
}
