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
scene.background = new THREE.Color('lightblue')

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.aspectRatio,
    0.1,
    100
)
scene.add(camera)
camera.position.set(0, 0, 0)

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

// Cube
const cubeGeometry = new THREE.BoxGeometry( 1, 1, 1 ); 
const cubeMaterial = new THREE.MeshNormalMaterial(); 
const cube = new THREE.Mesh( cubeGeometry, cubeMaterial ); 

scene.add( cube );
cube.position.set(0, 0, -5)

//torus
const geometry = new THREE.TorusGeometry( 2, 0.2, 16, 100 ); 
const material = new THREE.MeshNormalMaterial(); 
const torus = new THREE.Mesh( geometry, material ); 

scene.add( torus );
torus.position.set(0, 0, -5)

/*******
** UI **
*******/
// Ui
const ui = new dat.GUI()

/*******************
** ANIMATION LOOP **
*******************/
const clock = new THREE.Clock()

const animation = () => {
    // return elapsed time
    const elapsedTime = clock.getElapsedTime()

    // animate cube
    cube.rotation.y = elapsedTime 
    cube.rotation.x = elapsedTime 
    cube.rotation.z = elapsedTime 
    cube.scale.x = Math.sin(elapsedTime)
    cube.scale.y = Math.sin(elapsedTime)
    cube.scale.z = Math.sin(elapsedTime)

    //animate torus
    torus.rotation.y = elapsedTime 

    // Update Orbit Controls
    controls.update()

    // renderer
    renderer.render(scene,camera)

    // request next frame
    window.requestAnimationFrame(animation)
}

animation()