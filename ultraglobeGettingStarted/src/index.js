import { Map,  SingleImageElevationLayer, WMSLayer, OGC3DTilesLayer } from '@jdultra/ultra-globe';
import earthElevationImage from './images/earth_elevation.jpg';

let map = new Map({
    divID: 'screen',
    clock: false,
    shadows: false,
    debug: false,
    detailMultiplier: 1.0,
    ocean: false,
    atmosphere: true,
    atmosphereDensity: 1.0,
    sun: true,
    rings:false,
    space: true,

});



map.moveAndLookAt({ x: 13.42, y: 52.480, z: 300 }, { x: 13.42, y: 52.4895, z: 170 })


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

var ogc3dTiles = new OGC3DTilesLayer({
    id: 2,
    name: "OGC 3DTiles",
    visible: true,
    url: "https://storage.googleapis.com/ogc-3d-tiles/berlinTileset/tileset.json",
    longitude: 13.42,
    latitude: 52.4895,
    height: 172,
    rotationY: 0.72,
    rotationX: 3.1416,
    scale: 1.0,
    geometricErrorMultiplier: 0.02,
    loadOutsideView: false,
});
map.setLayer(ogc3dTiles, 2);
