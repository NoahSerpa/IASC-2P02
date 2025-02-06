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
camera.position.set (5, 5, 5)

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

// sphere
const sphereGeo = new THREE.SphereGeometry(1); 
const sphereMat = new THREE.MeshNormalMaterial(); 
const sphere = new THREE.Mesh( sphereGeo, sphereMat );
scene.add( sphere );
sphere.position.set(5, 5, 5)

const sphereGeo2 = new THREE.SphereGeometry(1); 
const sphereMat2 = new THREE.MeshNormalMaterial(); 
const sphere2 = new THREE.Mesh( sphereGeo2, sphereMat2 );
scene.add( sphere2 );
sphere2.position.set(3, 3, 3)

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

    sphere2.position.z = Math.sin(elapsedTime)
    sphere2.position.x = Math.sin(elapsedTime)
    sphere2.position.y = Math.sin(elapsedTime)

    // animate sphere

    sphere.position.z = -Math.sin(elapsedTime)
    sphere.position.x = -Math.sin(elapsedTime)
    sphere.position.y = -Math.sin(elapsedTime)

    // Update Orbit Controls
    controls.update()

    // renderer
    renderer.render(scene,camera)

    // request next frame
    window.requestAnimationFrame(animation)
}

animation()