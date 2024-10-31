import * as THREE from 'three';
import { Controller } from '@jdultra/ultra-globe';


const rotation180 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    

/**
 * Camera controller that controls an object with plane like controls and places the camera behind it.
 */
class PlaneController extends Controller {
    constructor(camera, domElement, map, object3D, showUI = false) {
        super(camera, domElement, map);

        this.speed = new THREE.Vector3();
        this.acceleration = 0.1;
        this.yaw = 0;
        this.pith = 0;
        this.roll = 0;
        this.pitchSpeed = 0;
        this.rollSpeed = 0;
        this.yawSpeed = 0;
        this.pitchAcceleration = 0;
        this.rollAcceleration = 0;
        this.yawAcceleration = 0;
        this.forward = new THREE.Vector3();
        this.up = new THREE.Vector3();
        this.right = new THREE.Vector3();
        this.horizonUp = new THREE.Vector3();
        this.horizonRight = new THREE.Vector3();

        this.pitchQuaternion = new THREE.Quaternion();
        this.yawQuaternion = new THREE.Quaternion();
        this.rollQuaternion = new THREE.Quaternion();
        this.gravityQuaternion = new THREE.Quaternion();
        
        this.cameraOffset = new THREE.Vector3(0, 5, -30);
        this.targetCameraPosition = new THREE.Vector3();
        this.targetCameraQuaternion = new THREE.Quaternion();
        
        this.object3D = object3D;
        if (showUI) {
            this.addUI(domElement);
        }
        this.clock = new THREE.Clock();
    }


    _handleEvent(eventName, e) {
        const self = this;
        switch (eventName) {
            case "keydown": self._keyDown(e); break;
            case "keyup": self._keyUp(e); break;
        }
        super._handleEvent(eventName, e);
    }

    _keyDown(event) {
        switch (event.code) {
            case 'KeyW':
            case 'ArrowUp':
                this.pitchAcceleration = 0.00075;
                break;
            case 'KeyA':
            case 'ArrowLeft':
                this.rollAcceleration = -0.003;
                break;
            case 'KeyS':
            case 'ArrowDown':
                this.pitchAcceleration = -0.00075;
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.rollAcceleration = 0.003;
                break;
            case 'KeyQ':
                this.yawAcceleration = 0.00025;
                break;
            case 'KeyE':
                this.yawAcceleration = -0.00025;
                break;
            case 'Space':
                this.acceleration = 0.2;
                break;
        }
    }

    _keyUp(event) {
        switch (event.code) {
            case 'KeyW':
            case 'ArrowUp':
                this.pitchAcceleration = 0;
                break;
            case 'KeyA':
            case 'ArrowLeft':
                this.rollAcceleration = 0.0;
                break;
            case 'KeyS':
            case 'ArrowDown':
                this.pitchAcceleration = 0;
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.rollAcceleration = 0.0;
                break;
            case 'KeyQ':
                this.yawAcceleration = 0;
                break;
            case 'KeyE':
                this.yawAcceleration = 0;
                break;
            case 'Space':
                this.acceleration = 0.1;
                break;
        }
    }

    _update() {
        const self = this;
        
        self.speed.multiplyScalar(0.85);
        self.pitchSpeed = self.pitchSpeed * 0.85 + self.pitchAcceleration;
        self.rollSpeed = self.rollSpeed * 0.85 + self.rollAcceleration;
        self.yawSpeed = self.yawSpeed * 0.85 + self.yawAcceleration;
        
        

        self.forward.set(0,0,1).applyQuaternion(self.object3D.quaternion).normalize();
        self.up.set(0,1,0).applyQuaternion(self.object3D.quaternion).normalize();
        self.right.set(1,0,0).applyQuaternion(self.object3D.quaternion).normalize();
        
        self.horizonUp.copy(self.object3D.position).normalize();
        const lift = Math.abs(self.horizonUp.dot(self.up));
        self.horizonRight.crossVectors(self.forward, self.horizonUp);

        self.pitchQuaternion.setFromAxisAngle(self.right, self.pitchSpeed);
        self.yawQuaternion.setFromAxisAngle(self.up, self.yawSpeed);
        self.rollQuaternion.setFromAxisAngle(self.forward, self.rollSpeed);
        self.gravityQuaternion.setFromAxisAngle(self.horizonRight, Math.max((1-lift),0.02)*-0.005);

        self.yawQuaternion.multiply(self.pitchQuaternion).multiply(self.rollQuaternion).multiply(self.gravityQuaternion);
        
        self.object3D.quaternion.multiplyQuaternions(self.yawQuaternion, self.object3D.quaternion);
        
        self.forward.multiplyScalar(self.acceleration);
        self.speed.add(self.forward);
        self.object3D.position.add(self.speed);
        
        self.object3D.updateMatrix();

        self.targetCameraPosition.copy(self.cameraOffset);
        self.targetCameraPosition.applyQuaternion(self.object3D.quaternion);
        self.targetCameraPosition.add(self.object3D.position);
        self.camera.position.lerp(self.targetCameraPosition, 0.1);

        self.targetCameraQuaternion.multiplyQuaternions(self.object3D.quaternion, rotation180);
        self.camera.quaternion.slerp(self.targetCameraQuaternion, 0.1);
        self.camera.up.set(0,1,0).applyQuaternion(self.camera.quaternion).normalize();
    }
    

    

    _dispose(){
        if(this.uiContainer){
            this.uiContainer.parentElement.removeChild(this.uiContainer);
        }
        super._dispose();
    }
    addUI(container) {
        const self = this;
        // Create an inner container to hold all UI elements
        self.uiContainer = document.createElement('div');

        // Style the inner container to match the parent container
        Object.assign(self.uiContainer.style, {
            position: 'absolute',
            bottom: '0',
            left: '0',
            width: '100%',
            //height: '100%',
            pointerEvents: 'none', // Allow underlying game to receive events
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'stretch',
        });

        // Append the inner container to the parent container
        container.appendChild(self.uiContainer);

        // Common styles for buttons
        const buttonStyle = {
            width: '60px',
            height: '60px',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            borderRadius: '30px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#fff',
            fontSize: '24px',
            userSelect: 'none',
            touchAction: 'none',
            transition: 'background-color 0.2s',
            cursor: 'pointer',
            margin: '10px', // Add margin for spacing
        };

        // Helper function to create a button
        function createButton(symbol, onPressCallback, onReleaseCallback) {
            
            const button = document.createElement('div');
            button.innerText = symbol;
            Object.assign(button.style, buttonStyle);

            // Add active state on press
            const onPress = () => {
                button.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
                onPressCallback();
            };
            const onRelease = () => {
                button.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
                onReleaseCallback();
            };

            // Mouse events
            button.addEventListener('mousedown', onPress);
            button.addEventListener('mouseup', onRelease);
            button.addEventListener('mouseleave', onRelease);

            // Touch events
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                onPress();
            });
            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                onRelease();
            });

            return button;
        }

        // Create a container for the jump button and control buttons
        const bottomContainer = document.createElement('div');
        Object.assign(bottomContainer.style, {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            padding: '20px', // Add padding for margins
            pointerEvents: 'none', // Allow only buttons to receive events
        });
        self.uiContainer.appendChild(bottomContainer);

        // Create Jump Button
        const jumpButton = createButton('⬆️',()=>self.acceleration = 0.2, ()=>self.acceleration = 0.1);
        Object.assign(jumpButton.style, {
            pointerEvents: 'auto', // Enable events on buttons
            marginBottom:"70px"
        });
        bottomContainer.appendChild(jumpButton);

        // Create Control Buttons Container
        const controlsContainer = document.createElement('div');
        Object.assign(controlsContainer.style, {
            position: 'absolute',
            width:"200px",
            height:"200px",
            bottom:"45px",
            right:"20px",
            pointerEvents: 'none', // Allow only buttons to receive events
        });
        bottomContainer.appendChild(controlsContainer);

        // Define control buttons with symbols and actions
        const forwardContainer = document.createElement('div');
        Object.assign(forwardContainer.style, {
            position: "absolute",
            width:"80px",
            height:"80px",
            bottom:"120px",
            right:"60px",
            pointerEvents: 'none', // Allow only buttons to receive events
        });
        controlsContainer.appendChild(forwardContainer);
        const btnForward = createButton('↑',()=>self.pitchAcceleration = 0.00075, ()=>self.pitchAcceleration = 0);
        Object.assign(btnForward.style, {
            pointerEvents: 'auto', // Enable events on individual buttons
        });
        forwardContainer.appendChild(btnForward);
        
        const backContainer = document.createElement('div');
        Object.assign(backContainer.style, {
            position: "absolute",
            width:"80px",
            height:"80px",
            bottom:"20px",
            right:"60px",
            pointerEvents: 'none', // Allow only buttons to receive events
        });
        controlsContainer.appendChild(backContainer);
        const btnBackward = createButton('↓',()=>self.pitchAcceleration = -0.00075, ()=>self.pitchAcceleration = 0);
        Object.assign(btnBackward.style, {
            pointerEvents: 'auto', // Enable events on individual buttons
        });
        backContainer.appendChild(btnBackward);


        const rightContainer = document.createElement('div');
        Object.assign(rightContainer.style, {
            position: "absolute",
            width:"80px",
            height:"80px",
            bottom:"70px",
            right:"0px",
            pointerEvents: 'none', // Allow only buttons to receive events
        });
        controlsContainer.appendChild(rightContainer);
        const btnRight = createButton('→',()=>self.rollAcceleration = 0.003, ()=>self.rollAcceleration = 0);
        Object.assign(btnRight.style, {
            pointerEvents: 'auto', // Enable events on individual buttons
        });
        rightContainer.appendChild(btnRight);

        const leftContainer = document.createElement('div');
        Object.assign(leftContainer.style, {
            position: "absolute",
            width:"80px",
            height:"80px",
            bottom:"70px",
            left:"0px",
            pointerEvents: 'none', // Allow only buttons to receive events
        });
        controlsContainer.appendChild(leftContainer);
        const btnLeft = createButton('←',()=>self.rollAcceleration = -0.003, ()=>self.rollAcceleration = 0);
        Object.assign(btnLeft.style, {
            pointerEvents: 'auto', // Enable events on individual buttons
        });
        leftContainer.appendChild(btnLeft);
        
        
        const rightContainer2 = document.createElement('div');
        Object.assign(rightContainer2.style, {
            position: "absolute",
            width:"80px",
            height:"200px",
            bottom:"60px",
            right:"0px",
            pointerEvents: 'none', // Allow only buttons to receive events
        });
        controlsContainer.appendChild(rightContainer2);
        const btnRight2 = createButton('⟳',()=>self.yawAcceleration = -0.00025, ()=>self.yawAcceleration = 0);
        Object.assign(btnRight2.style, {
            pointerEvents: 'auto', // Enable events on individual buttons
        });
        rightContainer2.appendChild(btnRight2);

        const leftContainer2 = document.createElement('div');
        Object.assign(leftContainer2.style, {
            position: "absolute",
            width:"80px",
            height:"200px",
            bottom:"60px",
            left:"0px",
            pointerEvents: 'none', // Allow only buttons to receive events
        });
        controlsContainer.appendChild(leftContainer2);
        const btnleft2 = createButton('⟲',()=>self.yawAcceleration = 0.00025, ()=>self.yawAcceleration = 0);
        Object.assign(btnleft2.style, {
            pointerEvents: 'auto', // Enable events on individual buttons
        });
        leftContainer2.appendChild(btnleft2);
    }

} export { PlaneController }