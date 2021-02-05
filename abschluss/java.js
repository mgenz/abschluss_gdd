//popup event
var gdp_container = document.getElementById('gdp_popup');
var cotwo_container = document.getElementById('cotwo_popup');
var gdp_content = document.getElementById('gdp_popup-content');
var cotwo_content = document.getElementById('cotwo_popup-content');
var gdp_closer = document.getElementById('gdp_popup-closer');
var cotwo_closer = document.getElementById('cotwo_popup-closer');
/**
 * Create an overlay to anchor the popup to the map.
 */
var gdp_overlay = new ol.Overlay({
    element: gdp_container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250,
    },
});
var cotwo_overlay = new ol.Overlay({
    element: cotwo_container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250,
    },
});


gdp_closer.onclick = function () {
    gdp_overlay.setPosition(undefined);
    gdp_closer.blur();
    return false;
};

cotwo_closer.onclick = function () {
    cotwo_overlay.setPosition(undefined);
    cotwo_closer.blur();
    return false;
};

// Map_gdp View
var view = new ol.View({
    center: ol.proj.fromLonLat([13, 52]),
    zoom: 4,
});

//gdp WMS-Layer
var gdplayer = new ol.layer.Tile({
    // Countries have transparency, so do not fade tiles:
    opacity: 1,
    visible: true,
    source: new ol.source.TileWMS({
        url: 'http://localhost:8585/geoserver/abschluss_gdd/wms?',
        params: { 'LAYERS': 'abschluss_gdd:gdp', 'TILED': true, 'Version': '1.1.0' },
        serverType: 'geoserver',
        crossOrigin: null,
        // Countries have transparency, so do not fade tiles:
        transition: 0.5
    })
});

//gdp WFS-Layer
var gdp_style = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: 'rgba(0, 0, 0)',
        width: 1,
    }),
});

var gdp_styleLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'http://localhost:8585/geoserver/wfs?service=wfs&version=2.0.0&request=GetFeature&typeNames=abschluss_gdd:gdp&outputFormat=application/json',
        format: new ol.format.GeoJSON(),
    }),
    style: function (feature) {
        return gdp_style;
    },
});

//Map_gdp generation
var map1 = new ol.Map({
    target: 'map_gdp',
    view: view,
    layers: [
        gdplayer,
        gdp_styleLayer,
    ],
    overlays: [gdp_overlay],
});

//cotwo WMS-Layer
var cotwolayer = new ol.layer.Tile({
    // Countries have transparency, so do not fade tiles:
    opacity: 1,
    visible: true,
    source: new ol.source.TileWMS({
        url: 'http://localhost:8585/geoserver/abschluss_gdd/wms?',
        params: { 'LAYERS': 'abschluss_gdd:cotwo'},
        serverType: 'geoserver',
        crossOrigin: null,

    })
});

//cotwo WFS-Layer
var cotwo_style = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: 'rgba(0, 0, 0)',
        width: 1,
    }),
});

var cotwo_styleLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'http://localhost:8585/geoserver/wfs?service=wfs&version=2.0.0&request=GetFeature&typeNames=abschluss_gdd:cotwo&outputFormat=application/json',
        format: new ol.format.GeoJSON(),
    }),
    style: function (feature) {
        return cotwo_style;
    },
});

//Map_cotwo generation
var map2 = new ol.Map({
    target: 'map_cotwo',
    view: view,
    layers: [
    /* new ol.layer.Tile({
         source: new ol.source.OSM()
     }),*/
        cotwolayer,
        cotwo_styleLayer,
    ],
    overlays: [cotwo_overlay],
});

//Slider
var slider = document.getElementById("myRange");
var output = document.getElementById("date_value");
output.innerHTML = slider.value;

slider.oninput = function () {
    output.innerHTML = this.value;
}

var year = 2000;

function updateslider(sliderVal) {
    gdplayer.getSource().updateParams({ 'viewparams': 'year:' + sliderVal });
    cotwolayer.getSource().updateParams({ 'viewparams': 'year:' + sliderVal });
    document.getElementById('date_value').innerHTML = sliderVal
    year = sliderVal;
};

document.getElementById("myRange").addEventListener('input', function () {
    updateslider(this.value);
});

//Pic slider
var val = document.getElementById("myRange").value;

document.getElementById("date_value").innerHTML = val;
document.getElementById("corr_year").src = val + ".png";

function showVal(newVal) {
    document.getElementById("date_value").innerHTML = newVal;
    document.getElementById("corr_year").src = newVal + ".png";
}

//howerevent

var highlightStyle_gdp = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(255,255,255,0.1)',
    }),
    stroke: new ol.style.Stroke({
        color: '#3399CC',
        width: 2,
    }),
});

var highlightStyle_cotwo = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: '#B30000',
        width: 2,
    }),
});

var selected = null;
var co2 = document.getElementById('cotwo');
var gdp = document.getElementById('gdp');
var land = document.getElementById('land');


map1.on('pointermove', function (e) {
    if (selected !== null) {
        selected.setStyle(undefined);
        selected = null;
    }

    map1.forEachFeatureAtPixel(e.pixel, function (f) {
        selected = f;
        f.setStyle(highlightStyle_gdp);
        return true;
    });

    if (selected) {
        land.innerHTML = selected.get('country')
    } else {
        land.innerHTML = '&nbsp;';
    }
});

map2.on('pointermove', function (e) {
    if (selected !== null) {
        selected.setStyle(undefined);
        selected = null;
    }

    map2.forEachFeatureAtPixel(e.pixel, function (f) {
        selected = f;
        f.setStyle(highlightStyle_cotwo);
        return true;
    });

    if (selected) {
        land.innerHTML = selected.get('country')
    }
});


//fullscreen
var isFullscreen = false;

function fullscreen_cotwo() {
    var d = {};
    var speed = 300;
    if (!isFullscreen) { // MAXIMIZATION
        d.width = "100%";
        d.height = "80%";
        isFullscreen = true;
        $("alles").slideUp(speed);
    }
    else { // MINIMIZATION            
        d.width = "49%";
        d.height = "500px";
        isFullscreen = false;
        $("alles").slideDown(speed);
    }
    $("#map_cotwo").animate(d, speed);
}

function fullscreen_gdp() {
    var d = {};
    var speed = 300;
    if (!isFullscreen) { // MAXIMIZATION
        d.width = "100%";
        d.height = "80%";
        isFullscreen = true;
        $("alles").slideUp(speed);
    }
    else { // MINIMIZATION            
        d.width = "49%";
        d.height = "500px";
        isFullscreen = false;
        $("alles").slideDown(speed);
    }
    $("#map_gdp").animate(d, speed);
}

//popup event
map1.on('singleclick', function (evt) {
    var coordinate = evt.coordinate;

    gdp_content.innerHTML = selected.get('country') + '<p></p>' + 'GDP per Capita: ' + selected.get('gdp').toFixed(2) + '$';
    gdp_overlay.setPosition(coordinate);
});

map2.on('singleclick', function (evt) {
    var coordinate = evt.coordinate;

    cotwo_content.innerHTML = selected.get('country') + '<p></p>'+ 'CO2 per Capita: ' + selected.get('co2').toFixed(1) + 't';
    cotwo_overlay.setPosition(coordinate);
});

//Veraltetes Hover event
/*
map1.on('pointermove', mousegdp);

function mousegdp(browserEvent) {
    var coordinate = browserEvent.coordinate;
    var boarder = gdp_styleLayer.getSource().getClosestFeatureToCoordinate(coordinate);
    var gdp_feature = gdplayer.getSource().getClosestFeatureToCoordinate(coordinate);
    var cotwo_feature = cotwolayer.getSource().getClosestFeatureToCoordinate(coordinate);

    var land = boarder.getProperties().country;

    var gdp = gdp_feature.getProperties().gdp;
    var cotwo = cotwo_feature.getProperties().co2;

    document.getElementById('land').innerHTML = land;
    document.getElementById('gdp').innerHTML = gdp.toFixed(2) + '$';
    document.getElementById('cotwo').innerHTML = cotwo.toFixed(1) + 't';
}


map2.on('pointermove', mousecotwo);

function mousecotwo(browserEvent) {
    var coordinate = browserEvent.coordinate;
    var boarder = gdp_styleLayer.getSource().getClosestFeatureToCoordinate(coordinate);
    var cotwo_feature = cotwo_styleLayer.getSource().getClosestFeatureToCoordinate(coordinate);
    var gdp_feature = gdp_styleLayer.getSource().getClosestFeatureToCoordinate(coordinate);

    var land = boarder.getProperties().country;

    var gdp = gdp_feature.getProperties().gdp;
    var cotwo = cotwo_feature.getProperties().co2;

    document.getElementById('gdp').innerHTML = gdp.toFixed(2) + '$';
    document.getElementById('cotwo').innerHTML = cotwo.toFixed(1) + 't';
}
*/


//header warp effekt
function parallax_height() {
    var scroll_top = $(this).scrollTop();
    var sample_section_top = $(".sample-section").offset().top;
    var header_height = $(".sample-header-section").outerHeight();
    $(".sample-section").css({ "margin-top": header_height });
    $(".sample-header").css({ height: header_height - scroll_top });
}
parallax_height();
$(window).scroll(function () {
    parallax_height();
});
$(window).resize(function () {
    parallax_height();
});
