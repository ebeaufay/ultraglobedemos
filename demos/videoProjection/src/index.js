import { Map, GoogleMap3DTileLayer, ProjectedLayer } from '@jdultra/ultra-globe';
import * as THREE from "three"
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
    rings: false,
    space: true,

});

map.moveAndLookAt({ x: -103.453, y: 43.87879500659957, z: 1800 }, { x: -103.455, y: 43.87879500659957, z: 1750 })

// here loading Google maps but video projection will work on all loaded data
var googleMaps3DTiles = new GoogleMap3DTileLayer({
    id: 3,
    name: "Google Maps 3D Tiles",
    visible: true,
    apiKey: "AIzaSyD8itL-pHmdilXJY8FXvS7I25IJypc-MCI", // replace with your google maps API key!!
    loadOutsideView: false,
    geometricErrorMultiplier: 0.75,
    loadingStrategy: "INCREMENTAL",
    displayCopyright: true,
});
map.setLayer(googleMaps3DTiles, 0);

// Video and projected Layer
const video = document.createElement('video');
const videoTexture = new THREE.VideoTexture(video);

// The projected layer also accepts regular textures, not only VideoTexture
const projectedLayer = new ProjectedLayer({
    id: 983,
    name: "projected",
    texture: videoTexture,
    depthTest: true,
    chromaKeying: false,
});
map.setLayer(projectedLayer, 9);

let lat = 43.87879500659957;
let lon = -103.455;
let yaw = 0;
let pitch = -20;
let roll = -40;
setInterval(() => {
    lat -= 0.000001;
    lon -= 0.000001;
    yaw+=0.2;
    roll+=0.1;
    projectedLayer.setCameraFromLLHYawPitchRollFov(new THREE.Vector3(lon, lat, 1750), yaw, pitch, roll, 20);
}, 17);

// stream webcam
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const constraints = { video: { width: 1280, height: 720, facingMode: 'user' } };
    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        video.srcObject = stream;
        video.play();
    }).catch(function (error) {
        console.error('Unable to access the camera/webcam.', error);
    });
} else {
    console.error('MediaDevices interface not available.');
}



// UI
const depthTestBtn = document.getElementById("depthTest");
const chromaKeyBtn = document.getElementById("chromaKeyBtn");
const chromaMenu = document.getElementById("chromaMenu");
const chromaKeyColorPicker = document.getElementById("chromaKeyColor");
const chromaKeyTolerance = document.getElementById("chromaKeyTolerance");

depthTestBtn.onclick =()=>{
    projectedLayer.depthTest = !projectedLayer.depthTest;
    if(projectedLayer.depthTest){
        depthTestBtn.style.border = "4px solid #FFD700";
    }else{
        depthTestBtn.style.border = "2px solid #4CAF50";
    }
}

chromaKeyBtn.onclick =()=>{
    projectedLayer.chromaKeying = !projectedLayer.chromaKeying;
    if(projectedLayer.chromaKeying){
        chromaKeyBtn.style.border = "4px solid #FFD700";
        chromaMenu.style.display = "block";
    }else{
        chromaKeyBtn.style.border = "2px solid #4CAF50";
        chromaMenu.style.display = "none";
    }
}

chromaKeyTolerance.addEventListener('input', function() {
    projectedLayer.chromaKeyTolerance = this.value;
});

chromaKeyColorPicker.addEventListener('input', function() {
    let hex = this.value.replace(/^#/, '');

    // Handle shorthand hex colors (e.g., "f00")
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }

    // Parse the r, g, b values
    const bigint = parseInt(hex, 16);
    const r = ((bigint >> 16) & 255) / 255;
    const g = ((bigint >> 8) & 255) / 255;
    const b = (bigint & 255) / 255;
    projectedLayer.chromaKey.set(r,g,b);
});