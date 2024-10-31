import { Map, RandomCloudsLayer, GoogleMap3DTileLayer, ObjectLayer } from '@jdultra/ultra-globe';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';
import { PlaneController } from './planeController';

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
    space: true

});

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

var environmentLayer = new RandomCloudsLayer({
    id: 2,
    name: "clouds",
    debug:false,
    coverage: 0.5,
    minHeight: 0,
    maxHeight: 1000+Math.random()*5000,
    density: 0.1*Math.random()+0.1,
    windSpeed:0.02,
});
map.setLayer(environmentLayer, 2);

map.moveAndLookAt({x:2.3514, y:48.8575, z:1000}, {x:2.3514, y:48.8575, z:400})

const loader = new GLTFLoader();
loader.load(
	'https://www.jdultra.com/assets/celera_500l.glb', // you'll need to replace this with a model of your own
	function ( gltf ) {

        gltf.scene.rotateY(Math.PI*-0.5)
        const mixer = new THREE.AnimationMixer( gltf.scene );
        mixer.clipAction( gltf.animations[ 0 ] ).play();
        const clock = new THREE.Clock();
        function animate(){
            requestAnimationFrame(animate);
            mixer.update( clock.getDelta() );
        }
        animate();
		const planeLayer = new ObjectLayer({
            id: 2,
            name: "plane",
            object: gltf.scene,
            longitude: 2.3514,
            latitude: 48.8575,
            height: 400,
            yaw: 0,
            pitch:0,
            roll:0,
            scaleX:0.025,
            scaleY:0.025,
            scaleZ:0.025
        })
        map.setLayer(planeLayer, 2);

        // default controls (pan, rotate, zoom, select) can be removed
        map.controller.clear();
        // append the custom controller
        map.controller.append(new PlaneController(map.camera, map.domContainer, map, planeLayer.object3D, _isMobileDevice()));
	},
	function ( xhr ) {
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	},
	function ( error ) {

		console.log( error );

	}
);

function _isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};