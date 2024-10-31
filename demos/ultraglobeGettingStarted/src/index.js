import { Map,  SingleImageElevationLayer,WMSElevationLayer, WMSLayer, OGC3DTilesLayer } from '@jdultra/ultra-globe';
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



// elevation layer 
/* var wmsElevation = new WMSElevationLayer({
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
map.setLayer(wmsElevation, 0); */

//alternative elevation from single image
var earthElevation = new SingleImageElevationLayer({
    id: 1,
    name: "singleImageEarthElevation",
    bounds: [-180, -90, 180, 90],
    url: earthElevationImage,
    layer: "1",
    visible: true,
    min: -100,
    max: 8800
});
map.setLayer(earthElevation, 0);

//base layer
var bluemarble = new WMSLayer({
    id: 2,
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
map.setLayer(bluemarble, 1);

// population density overlay
var popDensity = new WMSLayer({
    id: 3,
    name: "borders",
    bounds: [-180, -90, 180, 90],
    url: "https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi",
    format:"png",
    layer: "GPW_Population_Density_2020",
    epsg: "EPSG:4326",
    version: "1.3.0",
    visible: true,
    maxLOD: 6,
    transparency: 0.6,
    imageSize: 512
});
//map.setLayer(popDensity, 2);

// berlin 3DTiles
var ogc3dTiles = new OGC3DTilesLayer({
    id: 4,
    name: "OGC 3DTiles",
    visible: true,
    url: "https://storage.googleapis.com/ogc-3d-tiles/berlinTileset/tileset.json",
    longitude: 13.42,
    latitude: 52.4895,
    height: 175,
    yaw: 0,
    pitch: 180,
    roll: 0,
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    geometricErrorMultiplier: 0.02,
    loadOutsideView: false,
});
map.setLayer(ogc3dTiles, 3);

