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
scene.background = new THREE.Color('black')

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.aspectRatio,
    0.1,
    100
)
scene.add(camera)
camera.position.set (10, 2, 7.5)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.shadowMap.enabled = true

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/***********
** MESHES **
***********/

// Wall
const wallGeometry = new THREE.PlaneGeometry( 15.5, 7.5 );
const wallMaterial = new THREE.MeshStandardMaterial( {
    color: new THREE.Color('white'), 
    side: THREE.DoubleSide
} );
const wall = new THREE.Mesh( wallGeometry, wallMaterial );
wall.rotation.y = Math.PI * 0.5
wall.receiveShadow = true
scene.add( wall );

// torus 
const torusGeometry = new THREE.TorusGeometry(1, 0.2, 12, 48, Math.PI); 
const torusMaterial = new THREE.MeshNormalMaterial(); 
const torus = new THREE.Mesh( torusGeometry, torusMaterial ); 
torus.position.set(6, 1, 0)
torus.castShadow = true
torus.rotation.x = Math.PI
torus.rotation.y = Math.PI *0.5
scene.add( torus );

// sphere1
const sphereGeometry1 = new THREE.SphereGeometry( .2, 12, 8 ); 
const sphereMaterial1 = new THREE.MeshNormalMaterial(); 
const sphere1 = new THREE.Mesh( sphereGeometry1, sphereMaterial1 ); 
sphere1.position.set(6, 2, 0.5)
sphere1.castShadow = true
scene.add( sphere1 );

//sphere2
const sphereGeometry2 = new THREE.SphereGeometry( .2, 12, 8 ); 
const sphereMaterial2 = new THREE.MeshNormalMaterial(); 
const sphere2 = new THREE.Mesh( sphereGeometry2, sphereMaterial2 ); 
sphere2.position.set(6, 2, -0.5)
sphere2.castShadow = true
scene.add( sphere2 );

/***********
** LIGHTS **
***********/

//Directional Light
const directionalLight = new THREE.DirectionalLight(
    new THREE.Color('white'),
    0.5
)
scene.add(directionalLight)
directionalLight.position.set(20, 4.1, 0)
directionalLight.target = wall
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024

//Directional Light Helper
const directionalLightHelper = new THREE.DirectionalLightHelper( directionalLight, 5 );
scene.add( directionalLightHelper );

/*******
** UI **
*******/
// Ui
const ui = new dat.GUI()

const lightPosFolder = ui.addFolder('Light Position')

lightPosFolder
    .add(directionalLight.position, 'y')
    .min(-10)
    .max(10)
    .step(0.1)
    .name('Y')

lightPosFolder
    .add(directionalLight.position, 'z')
    .min(-10)
    .max(10)
    .step(0.1)
    .name('Z')

/*******************
** ANIMATION LOOP **
*******************/
const clock = new THREE.Clock()

const animation = () => {
    // return elapsed time
    const elapsedTime = clock.getElapsedTime()
    
    // update directional Lighe helper
    directionalLightHelper.update()

    // Update Orbit Controls
    controls.update()

    // renderer
    renderer.render(scene,camera)

    // request next frame
    window.requestAnimationFrame(animation)
}

animation()