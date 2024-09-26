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

map.moveAndLookAt({ x: -2.915, y: 53.392, z: 300 }, { x: -2.915, y: 53.3922, z: 170 })

var googleMaps3DTiles = new GoogleMap3DTileLayer({
    id: 3,
    name: "Google Maps 3D Tiles",
    visible: true,
    apiKey: "AIzaSyD8itL-pHmdilXJY8FXvS7I25IJypc-MCI", // replace with your google maps API key
    loadOutsideView: false,
    geometricErrorMultiplier:0.75,
    //loadingStrategy: "IMMEDIATE", // uncomment to use immediate loading (faster with gaps)
    displayCopyright: true,
}); 
map.setLayer(googleMaps3DTiles, 0);




