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
    center: ol.proj.transform([127.5, 36], 'EPSG:4326', 'EPSG:3857'), // center 좌표
    zoom: 7, // 초기화면 zoom level
    minZoom: 6,
    maxZoom: 19
  })
});

var select = new ol.interaction.Select();
var modify = new ol.interaction.Modify({
  features: select.getFeatures()
});
map.getInteractions().extend([select, modify]);


var optionsSelected = document.getElementById('options');
var featureSelected, mapClicked;

optionsSelected.onchange = function(e) {
  var value = e.target.value;

  if (mapClicked != undefined) {
    ol.Observable.unByKey(mapClicked);
  }
  if (value == "draw") {
    typeSelect.disabled = false;
    draw.setActive(true);
    modify.setActive(false);
  } else if (value == "select") {
    typeSelect.disabled = true;
    draw.setActive(false);
    modify.setActive(false);

    if (typeSelect.value != "Point") {
      map.on("pointermove", function(e) {
        var pixel = map.getEventPixel(e.originalEvent);
        var hit = map.hasFeatureAtPixel(pixel);
        if (hit) {
          map.getTargetElement().style.cursor = "pointer";
        } else {
          map.getTargetElement().style.cursor = "";
        }
      });
      mapClicked = map.on("click", function(e) {
        map.forEachFeatureAtPixel(e.pixel, function(feature) {
          $("#myModal").modal();
          featureSelected = feature;
        })
      });
    }

  } else if (value == "modify") {
    typeSelect.disabled = true;
    draw.setActive(false);
    select.setActive(true);
    modify.setActive(true);
  }
}

var updateStyleSelected = document.getElementById('updateStyle');
updateStyleSelected.onclick = function() {

  var colorPicked = document.getElementById('colorWell').value;
  var fillColorPicked = document.getElementById('fillColor').value;
  style_modify = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: colorPicked,
      //lineDash: [3, 20, 10, 100],
      width: 5
    }),
    fill: new ol.style.Fill({
      color: fillColorPicked
    }),
  })

  featureSelected.setStyle(style_modify);
  $("#myModal").modal('toggle');
}

var typeSelect = document.getElementById('type');
var draw; // global so we can remove it later
function addInteractions() {
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
  addInteractions();
};
addInteractions();
draw.setActive(false);
