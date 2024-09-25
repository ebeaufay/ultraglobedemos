import { Map,  SingleImageElevationLayer, WMSLayer} from '@jdultra/ultra-globe';
import * as THREE from "three";
import earthElevationImage from './images/earth_elevation.jpg';
//import { NOAAGFSCloudsLayer } from '@jdultra/ultra-globe';
//let map = new Map({ divID: 'screen', shadows:true });
let map = new Map({
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



map.moveAndLookAt({ x: 13.42, y: 0, z: 9000000 }, { x: 13.42, y: 10, z: 170 })


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
    url: "https://wms.gebco.net/mapserv",
    layer: "GEBCO_LATEST_SUB_ICE_TOPO",
    epsg: "EPSG:4326",
    version: "1.3.0",
    visible: true,
    imageSize: 512
})
map.setLayer(wmsLayer, 1);






// The following code uses standard threejs to add a few polyline around the earth
const points = [];
let geodeticPoint = { x: 0, y: 0, z: 0 };
for (let i = 0; i < 201; i++) {
    geodeticPoint.x = (360 / 200) * i;
    const cartesianPoint = map.planet.llhToCartesian.forward(geodeticPoint)
    points.push(new THREE.Vector3(cartesianPoint.x, cartesianPoint.y, cartesianPoint.z));
}

const geometry = new THREE.BufferGeometry().setFromPoints(points);
for(let i = 0; i<100; i++){
    const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
        color: 0xcd2235,
        linewidth: 5,
    }));
    line.rotateX(Math.random()*Math.PI)
    line.rotateY(Math.random()*Math.PI)
    line.rotateZ(Math.random()*Math.PI)
    const scale = 1+Math.random()*0.01;
    line.scale.set(scale, scale, scale)
    map.scene.add(line);
}



