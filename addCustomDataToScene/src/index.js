import { Map,  SingleImageElevationLayer, WMSLayer, ObjectLayer} from '@jdultra/ultra-globe';
import * as THREE from "three";
import earthElevationImage from './images/earth_elevation.jpg';
const map = new Map({
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

map.moveAndLookAt({ x: 13.42, y: 0, z: 1000000 }, { x: 13.42, y: 10, z: 170 })


const earthElevation = new SingleImageElevationLayer({
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


const wmsLayer = new WMSLayer({
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


// Use a ObjectLayer to georeference meshes and other THREE.Object3D objects
const boxGeometry = new THREE.BoxGeometry( 20000, 20000, 20000 ); 
const boxMaterial = new THREE.MeshStandardMaterial( {color: 0x00ff00} ); 
const cube = new THREE.Mesh( boxGeometry, boxMaterial ); 
cube.castShadow = true;
cube.receiveShadow = true;
const cubeLayer = new ObjectLayer({
    id: 2,
    name: "cube",
    object: cube,
    longitude: 13,
    latitude: 10,
    height: 9000,
    yaw: 0,
    pitch:0,
    roll:0,
    scaleX:1,
    scaleY:1,
    scaleZ:1
})
map.setLayer(cubeLayer, 2);

// Object rotation works through yaw pitch roll but you can also rotate a mesh in it's local coordinate system independently of the Object layer through three.js standard API
const thorusGeometry = new THREE.TorusGeometry( 20000, 2000, 16, 100 ); 
const thorusMaterial = new THREE.MeshPhongMaterial( { color: 0x0088ff } ); 
const thorus = new THREE.Mesh( thorusGeometry, thorusMaterial ); 
thorus.rotateOnAxis(new THREE.Vector3(1,0,0), Math.PI*0.5);
thorus.castShadow = true;
thorus.receiveShadow = true;
const thorusLayer = new ObjectLayer({
    id: 3,
    name: "thorus",
    object: thorus,
    longitude: 11,
    latitude: 8,
    height: 1800,
    yaw: 0,
    pitch:0,
    roll:0,
    scaleX:1,
    scaleY:1,
    scaleZ:1
})
map.setLayer(thorusLayer, 3);

// If you want add data to the scene directly through three.js, retrieve the three.js scene from the map (Map#scene)
const points = [];
let geodeticPoint = { x: 0, y: 0, z: 0 };
for (let i = 0; i < 201; i++) {
    geodeticPoint.x = (360 / 200) * i;
    const cartesianPoint = map.planet.llhToCartesian.forward(geodeticPoint)
    points.push(new THREE.Vector3(cartesianPoint.x, cartesianPoint.y, cartesianPoint.z));
}

const geometry = new THREE.BufferGeometry().setFromPoints(points);
const lines = new THREE.Object3D();
for(let i = 0; i<100; i++){
    const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
        color: 0xcd2235,
        linewidth: 5,
    }));
    line.castShadow = true;
    line.rotateX(Math.random()*Math.PI)
    line.rotateY(Math.random()*Math.PI)
    line.rotateZ(Math.random()*Math.PI)
    const scale = 1+Math.random()*0.01;
    line.scale.set(scale, scale, scale)
    lines.add(line);
}
map.scene.add(lines);




