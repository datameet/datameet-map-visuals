///////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////PARLIAMENTARY CONSTITUENCIES' DATA PLOT WITH ELECTION RESULTS 2014////////////////
var plotPC = function(pane){
	d3.json('/data/geojson/pc_14.geojson' , function(parcon){	
		d3.csv('/data/csv/pc_14.csv' , function(info){
			var map = L.map(pane,{scrollWheelZoom:false}).setView([23.40, 83.00], 5);
			L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
				maxZoom: 18,
				attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
			}).addTo(map);
			var marker
			var getColor = function(d) {
			    return d == 'GEN' ? '#fdc086' :
			           d == '(SC)'  ? '#beaed4' :
			           d == '(ST)'  ? '#7fc97f' :
			            				'#fff' ;
			}
			var style = function(feature) {
			    return {
			        fillColor: getColor(feature.properties.category),
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
			    this._div.innerHTML = '<h6>Parliamentary Constituencies (2014)</h6>' +  (props ?
			        '<b>' +props.pcname +'</b> ( ' + props.state + ' ) <br />Winning Candidate : <b>' 
			        + props.winner +'</b> ( ' + props.party + ' ) <br />Votes : <b>' + props.votes + '%</b>'
			        : 'Hover over a Constituency');
			};

			infoTip.addTo(map);

			var legend = L.control({position: 'bottomright'});
			legend.onAdd = function (map) {
			    var div = L.DomUtil.create('div', 'info legend')
		        div.innerHTML +=
		            '<i style="background:' + getColor('GEN') + '"></i> ' + ' GEN<br>'+
		            '<i style="background:' + getColor('(SC)') + '"></i> ' + ' SC<br>'+
		            '<i style="background:' + getColor('(ST)') + '"></i> ' + ' ST'
			    return div;
			};

			legend.addTo(map);

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

			var getstate = function(pcnm){
				if(pcnm == null) return 'Not Available'
				entry = info.filter(function(d){
					return d['PC Name'].trim() == pcnm.trim()
				});
				return entry.length >0 ? entry[0]['State'] : 'Not Available'
			}
			var getpcname = function(pcnm){
				if(pcnm == null) return 'Not Available'
				entry = info.filter(function(d){
					return d['PC Name'].trim() == pcnm.trim()
				});
				return entry.length >0 ? entry[0]['PC Name'] : 'Not Available'
			}
			var getwinner = function(pcnm){
				if(pcnm == null) return 'Not Available'
				entry = info.filter(function(d){
					return d['PC Name'].trim() == pcnm.trim()
				});
				return entry.length >0 ? entry[0]['Winner Candidates'] : 'Not Available'
			}
			var getparty = function(pcnm){
				if(pcnm == null) return 'Not Available'
				entry = info.filter(function(d){
					return d['PC Name'].trim() == pcnm.trim()
				});
				return entry.length >0 ? entry[0]['winner Party'] : 'Not Available'
			}
			var getvotes = function(pcnm){
				if(pcnm == null) return '-1'
				entry = info.filter(function(d){
					return d['PC Name'].trim() == pcnm.trim()
				});
				return entry.length >0 ? Math.round((parseInt(entry[0]['Votesw'])*10000) / (parseInt(entry[0]['Votesw']) + parseInt(entry[0]['Votesr'])))/100 : -1
			}
			var getcategory = function(pcnm){
				if(pcnm == null) return 'Not Available'
				entry = info.filter(function(d){
					return d['PC Name'].trim() == pcnm.trim()
				});
				return entry.length >0 ? entry[0]['PC Type'] : 'Not Available'
			}
			
			for(i=0; i<parcon['features'].length ;i++){
				parcon['features'][i]['properties']['state'] = getstate(parcon['features'][i]['properties']['PC_NAME'])
				parcon['features'][i]['properties']['pcname'] = getpcname(parcon['features'][i]['properties']['PC_NAME'])
				parcon['features'][i]['properties']['winner'] = getwinner(parcon['features'][i]['properties']['PC_NAME'])
				parcon['features'][i]['properties']['party'] = getparty(parcon['features'][i]['properties']['PC_NAME'])
				parcon['features'][i]['properties']['votes'] = getvotes(parcon['features'][i]['properties']['PC_NAME'])
				parcon['features'][i]['properties']['category'] = getcategory(parcon['features'][i]['properties']['PC_NAME'])
			}
			var geolayer = L.geoJson(parcon, {style: style, onEachFeature: onEachFeature}).addTo(map);

			
		})
	})
}