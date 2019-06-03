// 지도
var layers = {};
layers['vworld'] = new ol.layer.Tile({
  title: 'VWorld Gray Map',
  visible: true,
  type: 'base',
  source: new ol.source.XYZ({
    url: 'http://xdworld.vworld.kr:8080/2d/Base/201612/{z}/{x}/{y}.png'
  })
});

// vectorSource 선언
var vectorSource = new ol.source.Vector({
  projection: 'EPSG:4326'
});

// vectorLayer 선언
var vectorLayer = new ol.layer.Vector({
  source: vectorSource
});

// 지도뿌리기
var map = new ol.Map({
  layers: [layers['vworld'], vectorLayer],
  target: 'map',
  view: new ol.View({
    center: ol.proj.transform([127.5, 36], 'EPSG:4326', 'EPSG:3857'),    // center 좌표
    zoom: 7, // 초기화면 zoom level
    minZoom: 6,
    maxZoom: 19
  })
});

var vectorSource = new ol.source.Vector();

var vectorLayer = new ol.layer.Vector({
  source: vectorSource,
  style: new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255, 0, 0, 0.2)'
    }),
    stroke: new ol.style.Stroke({
      color: '#ffcc33',
      width: 2
    }),
    image: new ol.style.Circle({
      radius: 7,
      fill: new ol.style.Fill({
        color: '#ffcc33'
      })
    })
  })
});

map.addLayer(vectorLayer);

var typeSelect = document.getElementById('type');
var draw; // global so we can remove it later
function addInteraction() {
  var value = typeSelect.value;
  if (value !== 'None') {
    draw = new ol.interaction.Draw({
      source: vectorSource,
      type: value
    });
    map.addInteraction(draw);
  }
}
typeSelect.onchange = function(e) {
  map.removeInteraction(draw);
  addInteraction();
};
addInteraction();

var select = new ol.interaction.Select();
var modify = new ol.interaction.Modify({
    features:select.getFeatures()
});
map.getInteractions().extend([select, modify]);

var selected_features = select.getFeatures();
selected_features.on('add', function(event) {
  var feature = event.element;
  feature.on('change', function(event){
    event.target.getGeometry().getCoordinates();
  });
});
