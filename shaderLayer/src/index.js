import { Map, SingleImageElevationLayer, WMSLayer, JetElevation } from '@jdultra/ultra-globe';
import * as THREE from "three";
import earthElevationImage from './images/earth_elevation.jpg';
import {CustomShaderLayer} from './customShaderLayer.js'

let map = new Map({
    divID: 'screen',
    clock: false,
    shadows: false,
    debug: false,
    detailMultiplier: 1.0,
    ocean: false,
    atmosphere: false,
    atmosphereDensity: 1.0,
    sun: true,
    rings:false,
    space: true

});


map.moveAndLookAt({ x: 9.6, y: 40.8, z: 300000 }, { x: 9.6, y: 45, z: 170 })


var earthElevation = new SingleImageElevationLayer({
    id: 0,
    name: "singleImageEarthElevation",
    bounds: [-180, -90, 180, 90],
    url: earthElevationImage,
    layer: "1",
    visible: true,
    min: -100,
    max: 100000
});
map.setLayer(earthElevation, 0);


var wmsLayer = new WMSLayer({
    id: 1,
    name: "BlueMarble",
    bounds: [-180, -90, 180, 90],
    url: "https://wms.gebco.net/mapserv",
    layer: "GEBCO_LATEST_SUB_ICE_TOPO",
    epsg: "EPSG:4326",
    version: "1.3.0",
    visible: true,
    imageSize: 512
})
map.setLayer(wmsLayer, 1);


var slope = new CustomShaderLayer({
    id: 1,
    name: "customShaderLayer",
    bounds: [-180, -90, 180, 90],
    transparency: 0.25,
    visible: true
    
})
map.setLayer(slope, 2);
var jetElevation = new JetElevation({
    id: 1,
    name: "jet Elevation",
    bounds: [-180, -90, 180, 90],
    transparency: 0.5,
    visible: false,
    min:0,
    max:100000
    
});
map.setLayer(jetElevation, 3);

const heightButton = document.getElementById("heightBtn");
const slopeButton = document.getElementById("slopeBtn");

heightButton.onclick = ()=>{
    showJetElevation();
    heightButton.style.border = "4px solid #FFD700";
    slopeButton.style.border = "2px solid #4CAF50";
}
slopeButton.onclick = ()=>{
    showSlope();
    heightButton.style.border = "2px solid #4CAF50";
    slopeButton.style.border = "4px solid #FFD700";
}

setTimeout(()=>{
    //showJetElevation();
    showSlope();
},1000);


function showSlope(){
    jetElevation.setVisible(false);
    slope.setVisible(true);
}
function showJetElevation(){
    jetElevation.setVisible(true);
    slope.setVisible(false);
}
//map.setLayer(jetElevation, 3);


