import { Map, RandomCloudsLayer, GoogleMap3DTileLayer, ObjectLayer } from '@jdultra/ultra-globe';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
import glbmodel from '../mesh/celera_500l.glb'
import { PlaneController } from './planeController';

const cityLocations = [
    {
        name:"Paris",
        planePosition: { x: 2.3514, y: 48.8575, z: 200 },
        cameraStart: { x: 2.3514, y: 48.8575, z: 1000 }
    },
    {
        name: "Brussels",
        planePosition: { x: 4.354989, y: 50.844681, z: 200 },
        cameraStart: { x: 4.354989, y: 50.844681, z: 1000 }
    },
    {
        name:"Tokyo",
        planePosition: { x: 139.756193, y: 35.678942, z: 200 },
        cameraStart: { x: 139.756193, y: 35.678942, z: 1000 }
    },
    {
        name:"Cape-Town",
        planePosition: { x: 18.596782, y: -33.971668, z: 200 },
        cameraStart: { x: 18.596782, y: -33.971668, z: 1000 }
    },
    {
        name:"Grand Canyon",
        planePosition: { x: -112.111246, y: 36.098287, z: 1500 },
        cameraStart: { x: -112.111246, y: 36.098287, z: 2000 }
    },
    {
        name:"Rio",
        planePosition: { x: -43.313679, y: -22.916812, z: 500 },
        cameraStart: { x: -43.313679, y: -22.916812, z: 1000 }
    }
];

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
    rings: false,
    space: true

});

var googleMaps3DTiles = new GoogleMap3DTileLayer({
    id: 3,
    name: "Google Maps 3D Tiles",
    visible: true,
    apiKey: "AIzaSyD8itL-pHmdilXJY8FXvS7I25IJypc-MCI", // replace with your google maps API key
    loadOutsideView: false,
    geometricErrorMultiplier: 0.8,
    //loadingStrategy: "IMMEDIATE", // uncomment to use immediate loading (faster with gaps)
    displayCopyright: true,
});
map.setLayer(googleMaps3DTiles, 0);

var environmentLayer = new RandomCloudsLayer({
    id: 2,
    name: "clouds",
    debug: false,
    coverage: 0.5,
    minHeight: 0,
    maxHeight: 1000 + Math.random() * 5000,
    density: Math.pow(Math.random(),2),
    windSpeed: Math.random()*0.001,
});
map.setLayer(environmentLayer, 2);

//map.moveAndLookAt({ x: 2.3514, y: 48.8575, z: 1000 }, { x: 2.3514, y: 48.8575, z: 400 })

const loader = new GLTFLoader();
loader.load(
    glbmodel,
    function (gltf) {

        gltf.scene.rotateY(Math.PI * -0.5)
        const mixer = new THREE.AnimationMixer(gltf.scene);
        mixer.clipAction(gltf.animations[0]).play();
        const clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);
            mixer.update(clock.getDelta());
        }
        animate();
        const planeLayer = new ObjectLayer({
            id: 2,
            name: "plane",
            object: gltf.scene,
            longitude: 0,
            latitude: 0,
            height: 0,
            yaw: 0,
            pitch: 0,
            roll: 0,
            scaleX: 0.035,
            scaleY: 0.035,
            scaleZ: 0.035
        })
        map.setLayer(planeLayer, 2);

        // default controls (pan, rotate, zoom, select) can be removed
        map.controller.clear();
        
        let locationIndex = 0;
        function moveToNextLocation(){
            const loc = cityLocations[locationIndex++];
            planeLayer.move(loc.planePosition.x, loc.planePosition.y, loc.planePosition.z, 0,0,0,0.025,0.025,0.025);
            map.moveAndLookAt({ x: loc.cameraStart.x, y: loc.cameraStart.y, z: loc.cameraStart.z }, { x: loc.planePosition.x, y: loc.planePosition.y, z: loc.planePosition.z });
            document.getElementById("place").innerText = loc.name;

            environmentLayer.density = Math.pow(Math.random(),2);
            environmentLayer.minHeight = Math.random() * 2000;
            environmentLayer.maxHeight = environmentLayer.minHeight + Math.random() * 5000;
            environmentLayer.density = Math.pow(Math.random(),2);
            environmentLayer.windSpeed = Math.random()*0.001;
        }
        moveToNextLocation();
        document.getElementById("changeLocation").addEventListener('mouseup', e => {
            moveToNextLocation();
        })

        // append the custom controller
        map.controller.append(new PlaneController(map.camera, map.domContainer, map, planeLayer.object3D, _isMobileDevice()));
        
    },
    function (xhr) {
    },
    function (error) {
        console.log(error);
    }


);



function _isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};