import { Map, GoogleMap3DTileLayer, OGC3DTilesLayer } from '@jdultra/ultra-globe';
import { TileLoader } from "@jdultra/threedtiles"
import * as THREE from 'three';


const map = new Map({
    divID: 'screen',
    clock: false,
    shadows: false,
    debug: false,
    detailMultiplier: 1.0,
    ocean: false,
    atmosphere: true,
    atmosphereDensity: 1.0,
    sun: true,
    rings: false,
    space: true,
    splatsOver: true,
    splatsOverMargin: 50,
    //targetFPS:(typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1)?30:2000
});

map.hidePlanet();
map.moveAndLookAt({ x: 13.42, y: 0, z: 1000000 }, { x: 13.42, y: 10, z: 170 })

var splatsTileLoader = new TileLoader({
    renderer: map.renderer,
    maxCachedItems: 600,
    meshCallback: (mesh, geometricError) => {
        mesh.material.flatShading = false;
        //mesh.material = new THREE.MeshLambertMaterial({color: new THREE.Color("rgb("+(Math.floor(Math.random()*256))+", "+(Math.floor(Math.random()*256))+", "+(Math.floor(Math.random()*256))+")")});
        if (mesh.material.isMeshBasicMaterial) {
            const newMat = new THREE.MeshStandardMaterial();
            newMat.map = mesh.material.map;
            mesh.material = newMat;
        }
        /* mesh.material.color.copy(new THREE.Color("rgb("+(Math.floor(Math.random()*256))+", "+(Math.floor(Math.random()*256))+", "+(Math.floor(Math.random()*256))+"))+"));
        mesh.material.needsUpdate = true */
        if (mesh.material.map) {
            mesh.material.map.colorSpace = THREE.LinearSRGBColorSpace;
        }
        mesh.material.wireframe = false;
        mesh.material.side = THREE.DoubleSide;
        if (!mesh.geometry.getAttribute('normal')) {
            mesh.geometry.computeVertexNormals();
        }
        
        if (map.csm) {
            mesh.material.side = THREE.FrontSide;
            mesh.castShadow = self.castShadow
            mesh.receiveShadow = self.receiveShadow;
            mesh.parent.castShadow = self.castShadow
            mesh.parent.receiveShadow = self.receiveShadow;

            mesh.material.shadowSide = THREE.BackSide;
            map.csm.setupMaterial(mesh.material);
        }

    },
    pointsCallback: (points, geometricError) => {

        points.material.size = 1 * Math.max(1.0, 0.1 * Math.sqrt(geometricError));
        points.material.sizeAttenuation = true;
        points.material.receiveShadow = false;
        points.material.castShadow = false;
        if (!!self.pointsCallback) {
            self.pointsCallback(points, geometricError);
        }
    }
});

var googleMaps3DTiles = new GoogleMap3DTileLayer({
    id: 3,
    name: "Google Maps 3D Tiles",
    visible: true,
    apiKey: "AIzaSyD8itL-pHmdilXJY8FXvS7I25IJypc-MCI", // replace with your google maps API key
    loadOutsideView: false,
    geometricErrorMultiplier: 0.35,
    //loadingStrategy: "IMMEDIATE", // uncomment to use immediate loading (faster with gaps)
    displayCopyright: true,
    tileLoader: splatsTileLoader
    //loadingStrategy: "IMMEDIATE",
});
map.setLayer(googleMaps3DTiles, 0);

const splatsLayer1 = new OGC3DTilesLayer({
    id: 1,
    url: "https://storage.googleapis.com/ogc-3d-tiles/splats/church/tileset.json",
    name: "observatoire",
    splats: true,
    scaleX: 101.35999999999802,
    scaleY: 101.35999999999802,
    scaleZ: 101.35999999999802,
    yaw: 209.1,
    pitch: 90,
    roll: 0,
    longitude: 5.5683729999999825,
    latitude: 50.619656999999854,
    height: 163.49999999999963,
    visible: true,
    splatsCropRadius: 20,
    splats: true,
    tileLoader: splatsTileLoader
})
map.setLayer(splatsLayer1, 1);


const snowbird = new OGC3DTilesLayer({
    id: 2,
    url: "https://storage.googleapis.com/ogc-3d-tiles/splats/snowbird/tileset.json",
    name: "snowbird",
    visible: true,
    loadOutsideView: false,
    geometricErrorMultiplier: 1.0,
    loadingStrategy: "INCREMENTAL",
    cacheSize: 200,
    longitude: -111.6450559060215,
    latitude: 40.56095792153038,
    height: 3328,
    pitch: 93.8,
    roll: -3,
    yaw: -57.2,
    scaleX: 22.4,
    scaleY: 22.4,
    scaleZ: 22.4,
    splats: true,
    tileLoader: splatsTileLoader
});
setTimeout(() => {
    snowbird.setSplatsCropRadius(5);

}, 3000)
map.setLayer(snowbird, 2);


const holland = new OGC3DTilesLayer({
    id: 3,
    url: "https://storage.googleapis.com/ogc-3d-tiles/splats/holland/tileset.json",
    name: "holland",
    visible: true,
    loadOutsideView: false,
    geometricErrorMultiplier: 0.2,
    loadingStrategy: "INCREMENTAL",
    cacheSize: 200,
    longitude: 5.195500532196139,
    latitude: 52.22338646922922,
    height: 50,
    pitch: 90,
    roll: 0,
    yaw: 180,
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    splats: true,
    tileLoader: splatsTileLoader
});
map.setLayer(holland, 3);


const belgiumButton = document.getElementById("belgium-button");
const utahButton = document.getElementById("utah-button");
const hollandButton = document.getElementById("holland-button");
const orbitButton = document.getElementById("orbit-button");

let focus;
let start;


orbitButton.addEventListener("click", ()=>{
    if(focus && start){
        map.orbit(focus, start, 20000)
    }
});

belgiumButton.addEventListener("click", () => {
    if (!focus || focus.x!= 5.568500 && focus.y!=50.6196 && focus.z!=200) {
        focus = { x: 5.568500, y: 50.6196, z: 200 };
        start = { x: 5.568500, y: 50.6183, z: 350 };
        map.moveAndLookAt(start, focus, {
            time: 7000,
            callback:()=>{
                map.orbit(focus, start, 20000);
                map.splatsOverMargin = 20
            }
        });
        
    }
});

hollandButton.addEventListener("click", () => {
    if (!focus || focus.x!= 5.195531755678417 || focus.y!=52.22285256463703 || focus.z!=38) {
        focus = { x: 5.195531755678417, y: 52.22285256463703, z: 38 };
        start = { x: 5.195096164258928, y: 52.22163739185969, z: 129.69171113427728 };
        map.moveAndLookAt(start, focus, {
            time: 7000,
            callback:()=>{
                map.orbit(focus, start, 20000)
                map.splatsOverMargin = 200
            }
        });
        
    }
});

utahButton.addEventListener("click", () => {
    if (!focus || focus.x!= -111.6450559060215 || focus.y!=40.56095792153038 || focus.z!=3325) {
        focus = { x: -111.6450559060215, y: 40.56095792153038, z: 3325 };
        start = { x: -111.6440545179456, y: 40.56134703950596, z: 3345.753260702826 };
        map.moveAndLookAt(start, focus, {
            time: 7000,
            callback:()=>{
                map.orbit(focus, start, 20000)
                map.splatsOverMargin = 200
            }
        });
        
    }
});
