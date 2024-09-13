import { Map, GoogleMap3DTileLayer } from '@jdultra/ultra-globe';

let map = new Map({
    divID: 'screen',
    clock: false,
    shadows: false,
    debug: false,
    detailMultiplier: 1.0, // used only for 2D map and elevation tiles
    ocean: false,
    atmosphere: true,
    atmosphereDensity: 1.0,
    sun: true,
    rings:false,
    space: true,

});

map.moveAndLookAt({ x: 13.42, y: 52.480, z: 300 }, { x: 13.42, y: 52.4895, z: 170 })

var googleMaps3DTiles = new GoogleMap3DTileLayer({
    id: 3,
    name: "Google Maps 3D Tiles",
    visible: true,
    apiKey: "Add your google maps API key here!!!",
    loadOutsideView: false,
    geometricErrorMultiplier:0.75,
    //loadingStrategy: "IMMEDIATE", // uncomment to use immediate loading (faster with holes)
    displayCopyright: true,
}); 
map.setLayer(googleMaps3DTiles, 0);




