import { Map, RandomCloudsLayer, PerlinElevationLayer, PerlinTerrainColorShader } from '@jdultra/ultra-globe';
import * as THREE from "three";

let map = new Map({
    divID: 'screen',
    clock: true,
    shadows: true,
    debug: false,
    detailMultiplier: 1.0,
    ocean: generateAtmosphereColor(),
    atmosphere: generateAtmosphereColor(),
    atmosphereDensity: 0.8+Math.random()*0.4,
    sun: Math.random()<0.2?false:new THREE.Vector3(Math.random(), Math.random(), Math.random()),
    rings:true,
    space: true,

});



map.moveAndLookAt({ x: 0, y: 0, z: 20000000 }, { x: 0, y: 1, z: 30000 })


var perlinElevation = new PerlinElevationLayer({
    id: 0,
    name: "perlin elevation",
    visible: true,
    bounds: [-180, -90, 180, 90]
});
map.setLayer(perlinElevation, 0);
var shaderLayer = new PerlinTerrainColorShader({
    id: 1,
    name: "randomGroundColor",
    visible: true,
    min: -50000,
    max: 50000,
    transparency: 0.0
});
map.setLayer(shaderLayer, 1);

var environmentLayer = new RandomCloudsLayer({
    id: 2,
    name: "clouds",
    quality: 0.5,
    debug:false,
    coverage: 0.5,
    minHeight: 1000,
    maxHeight: 30000,
    density: 0.15*Math.random()+0.02,
    windSpeed:0.07,
});
map.setLayer(environmentLayer, 2);




function generateAtmosphereColor() {
    let hue = Math.floor(60 + Math.random() * 180);
    let saturation = 50 + Math.random() * 25;
    let lightness = 50 + Math.random() * 25;

    return hslToRgb(hue, saturation, lightness);

}
function hslToRgb(h, s, l) {
    s /= 100;
    l /= 100;
    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c / 2,
        r = 0,
        g = 0,
        b = 0;

    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }
    r = r + m;
    g = g + m;
    b = b + m;

    return new THREE.Vector3(r, g, b);
}


