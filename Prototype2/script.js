import * as THREE from 'three';
import { OrbitControls } from "OrbitControls";
import * as dat from "lil-gui";

/**********
** SCENE **
**********/

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    aspectRatio: window.innerWidth / window.innerHeight
}

// Canvas
const canvas = document.querySelector('.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('#0A0A0A')

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.aspectRatio,
    0.1,
    100
)
scene.add(camera)
camera.position.set (2, 3, -7)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/***********
** MESHES **
***********/

// Torus Knot
const torusKnotGeometry = new THREE.TorusKnotGeometry( 1, 0.3, 100, 16 ); 
const torusKnotMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#015d57')
}); 
const torusKnot = new THREE.Mesh( torusKnotGeometry, torusKnotMaterial ); 

scene.add( torusKnot );

// Plane
const planeGeometry = new THREE.PlaneGeometry( 8, 8, 50, 50 );
const planeMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color('white'),
    side: THREE.DoubleSide,
    wireframe: false
});
const plane = new THREE.Mesh( planeGeometry, planeMaterial );
plane.rotation.x = Math.PI * 0.5

scene.add(plane);

/*******
** UI **
*******/
// Ui
const ui = new dat.GUI()

// UI Object
const uiObject = {
    speed: 1,
    distance: 1,
    rotSpeed: 1
}

// TorusKnot UI
const torusKnotFolder = ui.addFolder('Torus Knot')
    
torusKnotFolder
    .add(uiObject, 'speed')
    .min(0.1)
    .max(10)
    .step(0.1)
    .name("Speed")

torusKnotFolder
    .add(uiObject, 'distance')
    .min(0.1)
    .max(10)
    .step(0.1)
    .name("Distance")

torusKnotFolder
    .add(uiObject, 'rotSpeed')
    .min(0.1)
    .max(10)
    .step(0.1)
    .name("Rotational Speed")
// Plane UI
const planeKnotFolder = ui.addFolder('Plane')
    planeKnotFolder
        .add(planeMaterial, "wireframe")
        .name("Toggle Wireframe")


/*******************
** ANIMATION LOOP **
*******************/
const clock = new THREE.Clock()

const animation = () => {
    // return elapsed time
    const elapsedTime = clock.getElapsedTime()

    // animate Torus Knot
    torusKnot.position.y = Math.sin(elapsedTime * uiObject.speed) * uiObject.distance
    torusKnot.rotation.y = elapsedTime * uiObject.rotSpeed
    torusKnot.rotation.x = elapsedTime * uiObject.rotSpeed

    // Update Orbit Controls
    controls.update()

    // renderer
    renderer.render(scene,camera)

    // request next frame
    window.requestAnimationFrame(animation)
}

animation()