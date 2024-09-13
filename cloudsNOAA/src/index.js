import { Map,  SingleImageElevationLayer, WMSLayer,  PanController, RotateController, ZoomController, NOAAGFSCloudsLayer } from '@jdultra/ultra-globe';
import * as THREE from "three";
import earthElevationImage from './images/earth_elevation.jpg';
//import { NOAAGFSCloudsLayer } from '@jdultra/ultra-globe';
//let map = new Map({ divID: 'screen', shadows:true });
let map = new Map({
    divID: 'screen',
    clock: true,
    shadows: true,
    debug: false,
    detailMultiplier: 1.0,
    ocean: false,
    atmosphere: true,
    atmosphereDensity: 1.0,
    sun: true,
    rings:false,
    space: true,

});

// Just showing off how to work with controller chain here

map.controller.clear(); // clear existing controller chain

map.controller.append(new PanController(map.camera, map.domContainer, map));
map.controller.append(new RotateController(map.camera, map.domContainer, map));
map.controller.append(new ZoomController(map.camera, map.domContainer, map));

map.moveAndLookAt({ x: 13.42, y: 0, z: 9000000 }, { x: 13.42, y: 10, z: 170 })


var earthElevation = new SingleImageElevationLayer({
    id: 0,
    name: "singleImageEarthElevation",
    bounds: [-180, -90, 180, 90],
    url: earthElevationImage,
    layer: "1",
    visible: true,
    min: -100,
    max: 8000
});
map.setLayer(earthElevation, 0);


var wmsLayer = new WMSLayer({
    id: 1,
    name: "BlueMarble",
    bounds: [-180, -90, 180, 90],
    url: "https://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv",
    layer: "GEBCO_LATEST_SUB_ICE_TOPO",
    epsg: "EPSG:4326",
    version: "1.3.0",
    visible: true,
    imageSize: 512
})
map.setLayer(wmsLayer, 1);



var environmentLayer = new NOAAGFSCloudsLayer({
    id: 84,
    name: "clouds",
    quality: 0.5
});
map.setLayer(environmentLayer, 3);
// set a specific date on the map to get forecast cloud cover (or use the clock widget). NOAA GFS service only provides forecast for a limited amount of time in the future
//map.ultraClock.setDate(new Date());



