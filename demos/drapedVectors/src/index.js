import { Map, SingleImageImageryLayer, SingleImageElevationLayer, GeoJsonLayer } from '@jdultra/ultra-globe';
import * as THREE from "three";
import worldPurple from "../images/worldPurple.jpg"
import earthElevationImage from '../images/earth_elevation.jpg';

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
    space: new THREE.Color(0.4,0.35,0.8),

});

map.moveAndLookAt({ x: 0, y: 0, z: 20000000 }, { x: 0, y: 1, z: 30000 })

const earthElevation = new SingleImageElevationLayer({
    id: 0,
    name: "singleImageEarthElevation",
    bounds: [-180, -90, 180, 90],
    url: earthElevationImage,
    visible: true,
    min: -100,
    max: 8880
});
map.setLayer(earthElevation, 0);

var singleImage = new SingleImageImageryLayer({
    id: 1,
    name: "imagery",
    bounds: [-180, -90, 180, 90],
    url: worldPurple,
    visible: true
});
map.setLayer(singleImage, 1);

const countries = new GeoJsonLayer({
    id: 2,
    name: "countries",
    geoJson: "http://localhost:8080/countries.geojson",
    selectable: true,
    maxSegmentLength: 100,
    transparency:0,
    polygonColor: new THREE.Color(0.0, 0.0, 0.0),
    selectedPolygonColor: new THREE.Color(0.4, 0.15, 0.7),
    polylineColor: new THREE.Color(1.0,1.0,1.0),
    selectedPolylineColor: new THREE.Color(0.7,0.5,0.9),
    polygonOpacity: 1.0
});

map.setLayer(countries, 2);

/* var customVectors = new VectorLayer({
    id: 3,
    name:"customVectors",
    selectable: true,
    polygonMaterial: new THREE.MeshToonMaterial({color:0x049ef4}),
    selectedPolygonMaterial: new THREE.MeshToonMaterial({color:0xf604c2})
})
map.setLayer(customVectors, 3);

const poly = [[[[-53,-45], [-0,-25], [15,30], [-10,12], [-25,21], [-53,-45]]]]
customVectors.addPolygons(poly, {},5000) */


//// selected objects info /////
map.addSelectionListener(e=>{
    //console.log(e)
    const selection = [];
    Object.keys(e.selection).forEach(layerID => {
        const selectedLayer = map.getLayerByID(layerID);
        if(selectedLayer.isVectorLayer){
            e.selection[layerID].forEach(selectedObject=>{
                selection.push(selectedLayer.objects[selectedObject.uuid].properties);
            })
        }
        
      });
      displayObjects(selection);
})

function displayObjects(objectsArray) {
    // Check if the container already exists
    
    let container = document.getElementById('object-display-container');
    if(objectsArray.length == 0 && !!container){
        container.style.display = "none";
        return;
    }
    
    if (!container) {
        // Create the container div
        container = document.createElement('div');
        container.id = 'object-display-container';
        
        // Apply styles to position it at the top-right corner
        Object.assign(container.style, {
            position: 'fixed',
            top: '10px',
            right: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            maxHeight: '90vh',
            overflowY: 'auto',
            zIndex: '10000', // Ensures it's on top of other elements
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px'
        });
        
        document.body.appendChild(container);
    } else {
        // Clear previous content
        container.innerHTML = '';
        container.style.display = "block";
    }
    
    // Iterate over each object in the array
    objectsArray.forEach((obj, index) => {
        // Create a wrapper for each object
        const objWrapper = document.createElement('div');
        Object.assign(objWrapper.style, {
            marginBottom: '15px',
            paddingBottom: '10px',
            borderBottom: '1px solid #444'
        });
        
        // Optional: Add a title for each object
        const title = document.createElement('h3');
        title.textContent = `Object ${index + 1}`;
        Object.assign(title.style, {
            margin: '0 0 10px 0',
            fontSize: '16px',
            borderBottom: '1px solid #555',
            paddingBottom: '5px'
        });
        objWrapper.appendChild(title);
        
        // Create a table to display key-value pairs
        const table = document.createElement('table');
        Object.assign(table.style, {
            width: '100%',
            borderCollapse: 'collapse'
        });
        
        // Populate the table with key-value pairs
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                const row = document.createElement('tr');
                
                const keyCell = document.createElement('td');
                keyCell.textContent = key;
                Object.assign(keyCell.style, {
                    padding: '4px 8px',
                    fontWeight: 'bold',
                    backgroundColor: '#333',
                    color: '#ddd',
                    border: '1px solid #555'
                });
                
                const valueCell = document.createElement('td');
                valueCell.textContent = obj[key];
                Object.assign(valueCell.style, {
                    padding: '4px 8px',
                    border: '1px solid #555',
                    color: '#eee',
                });
                
                row.appendChild(keyCell);
                row.appendChild(valueCell);
                table.appendChild(row);
            }
        }
        
        objWrapper.appendChild(table);
        container.appendChild(objWrapper);
    });
}