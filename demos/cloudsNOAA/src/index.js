import { Map,  WMSElevationLayer, WMSLayer, NOAAGFSCloudsLayer } from '@jdultra/ultra-globe';

let map = new Map({
    divID: 'screen',
    clock: true,
    shadows: true,
    debug: false,
    ocean: false,
    atmosphere: true,
    sun: true,
    rings:false,
    space: true,

});

map.moveAndLookAt({ x: 13.42, y: 0, z: 9000000 }, { x: 13.42, y: 10, z: 170 })


var wmsElevation = new WMSElevationLayer({
    id:0,
    name:"wmsElevation",
    bounds: [-180, -90, 180, 90],
    url: "https://worldwind26.arc.nasa.gov/elev",
    epsg: "EPSG:4326",
    version: "1.3.0",
    layer: "aster_v2",
    visible: true,
    transparency: 0.0,
    maxResolution: 30
})
map.setLayer(wmsElevation, 0);


var wmsLayer = new WMSLayer({
    id: 1,
    name: "BlueMarble",
    bounds: [-180, -90, 180, 90],
    url: "https://worldwind25.arc.nasa.gov/wms",
    format:"png",
    layer: "BlueMarble-200412",
    epsg: "EPSG:4326",
    version: "1.3.0",
    visible: true,
    maxLOD: 10,
    transparency: 0.0,
    imageSize: 512
});
map.setLayer(wmsLayer, 1);



var environmentLayer = new NOAAGFSCloudsLayer({
    id: 2,
    name: "clouds"
});
map.setLayer(environmentLayer, 2);



