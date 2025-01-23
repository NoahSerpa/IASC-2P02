import * as THREE from 'three'

/**********
** SCENE **
**********/

// Canvas
const canvas = document.querySelector('.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('pink')

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
)
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight)

/***********
** MESHES **
***********/

// test sphere
const sphereGeometry = new THREE.SphereGeometry(0.65)
const sphereMaterial = new THREE.MeshNormalMaterial()
const testSphere = new THREE.Mesh(sphereGeometry, sphereMaterial)

// Cube
const geometry = new THREE.BoxGeometry( 1, 1, 1 ); 
const material = new THREE.MeshNormalMaterial(); 
const cube = new THREE.Mesh( geometry, material ); 

//add meshes
scene.add( cube );
scene.add(testSphere)
testSphere.position.set(0, 0, -5)
cube.position.set(0, 0, -5)
/*******************
** ANIMATION LOOP **
*******************/
const clock = new THREE.Clock()

const animation = () => {
    // return elapsed time
    const elapsedTime = clock.getElapsedTime()

    // Animate test sphere
    testSphere.position.y = Math.sin(elapsedTime)
    testSphere.position.x = -Math.cos(elapsedTime)
    testSphere.rotation.y = elapsedTime * 2
    testSphere.rotation.y = elapsedTime * 2

    // animate cube
    cube.position.y = -Math.sin(elapsedTime)
    cube.position.x = Math.cos(elapsedTime)
    cube.rotation.y = elapsedTime * 2
    cube.rotation.x = elapsedTime * 2

    // renderer
    renderer.render(scene,camera)

    // request next frame
    window.requestAnimationFrame(animation)
}

animation()