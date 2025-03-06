import * as THREE from 'three';
import { OrbitControls } from "OrbitControls";
import * as dat from "lil-gui";

/**********
** SCENE **
**********/

// Sizes
const sizes = {
    width: window.innerWidth * 0.4,
    height: window.innerHeight,
    aspectRatio: window.innerWidth * 0.4 / window.innerHeight
}

// Canvas
const canvas = document.querySelector('.webgl')

// Scene
const scene = new THREE.Scene()
//scene.background = new THREE.Color('black')

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
    antialias: true,
    alpha: true
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

//left pages
const leftPageGeometry = new THREE.BoxGeometry( 3, 0.3, 1.9 ); 
const leftPageMaterial = new THREE.MeshStandardMaterial( {color: "white"} ); 
const leftPages = new THREE.Mesh( leftPageGeometry, leftPageMaterial ); 
leftPages.position.set(10, 0, -1)
leftPages.castShadow = true;
scene.add(leftPages)

//right pages
const rightPageGeometry = new THREE.BoxGeometry( 3, 0.3, 1.9 ); 
const rightPageMaterial = new THREE.MeshStandardMaterial( {color: "white"} ); 
const rightPages = new THREE.Mesh( rightPageGeometry, rightPageMaterial ); 
rightPages.position.set(10, 0, 1)
rightPages.castShadow = true;
scene.add(rightPages)

//moving page
const pageGeometry = new THREE.BoxGeometry( 2.9, 0.1, 1.7 ); 
const pageMaterial = new THREE.MeshStandardMaterial( {color: "white"} ); 
const page = new THREE.Mesh( pageGeometry, pageMaterial ); 
page.castShadow = true;
page.position.set(10, 0, 0)


// pedestal
const pedestalGeometry = new THREE.BoxGeometry( 5, 5, 5 ); 
const pedestalMaterial = new THREE.MeshStandardMaterial( {color: "gray"} ); 
const pedestal = new THREE.Mesh( pedestalGeometry, pedestalMaterial ); 
pedestal.castShadow = true;
pedestal.position.set(10, -2.7, 0)
scene.add(pedestal)

//book cover R
const bookCoverRGeometry = new THREE.BoxGeometry( 3.1, 0.1, 2.2 ); 
const bookCoverRMaterial = new THREE.MeshStandardMaterial( {color: "brown"} ); 
const bookCoverR = new THREE.Mesh( bookCoverRGeometry, bookCoverRMaterial ); 
bookCoverR.position.set(10, -0.2, 1.1)
bookCoverR.castShadow = true;
scene.add( bookCoverR );

//book cover L
const bookCoverLGeometry = new THREE.BoxGeometry( 3.1, 0.1, 2.2 ); 
const bookCoverLMaterial = new THREE.MeshStandardMaterial( {color: "brown"} ); 
const bookCoverL = new THREE.Mesh( bookCoverLGeometry, bookCoverLMaterial ); 
bookCoverL.position.set(10, -0.2, -1.1)
bookCoverL.castShadow = true;
scene.add( bookCoverL );

const group = new THREE.Group();
group.add(page)
page.position.set(0, 0, -1);
group.position.set(10, 0, 0);


const group2 = new THREE.Group();
group2.add(leftPages)
group2.add(bookCoverL)
scene.add(group2)

/***********
** LIGHTS **
***********/

//Directional Light
const directionalLight = new THREE.DirectionalLight(
    new THREE.Color('white'),
    1.5
)
scene.add(directionalLight)
directionalLight.position.set(20, 0, 0)

directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024

// Sun light
const sun = new THREE.DirectionalLight( 0xffffff, 0.2 );
sun.position.set(20, 6, -6)
sun.target = wall
sun.castShadow = true
sun.shadow.mapSize.width = 1024
sun.shadow.mapSize.height = 1024

//ambient lighjt
const ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
ambientLight.intensity = 1.3
scene.add( ambientLight );

/*********************
** DOM INTERACTIONS **
*********************/
const domObject = {
    part: 1,
    firstChange: false,
    secondChange: false,
    thirdChange: false,
    fourthChange: false,
}

//part-one
document.querySelector('#part-one').onclick = function() {
    domObject.part = 1
}

//part-two
document.querySelector('#part-two').onclick = function() {
    domObject.part = 2
}

//first change
document.querySelector('#first-change').onclick = function() {
    domObject.firstChange = true
}
//second change
document.querySelector('#second-change').onclick = function() {
    domObject.secondChange = true
}
//third change
document.querySelector('#third-change').onclick = function() {
    domObject.thirdChange = true
}
//fourt change
document.querySelector('#fourth-change').onclick = function() {
    domObject.fourthChange = true
}

/*******
** UI **
*******/
// Ui
/*
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
*/

/*******************
** ANIMATION LOOP **
*******************/
var pageIsSpawn = false;
var bookOpen = true;
var canOpen = false;
const clock = new THREE.Clock()
var lightToggle = true;
var sunPos = true

const animation = () => {
    // return elapsed time

    //part-one
    if(domObject.part === 1) {
        camera.position.set(6, 0, 0)
        camera.lookAt(0, 0, 0)
    }
    //part-two
    if(domObject.part === 2) {
        camera.position.set(25, 6, 6)
        camera.lookAt(0, 0, 0)
    }

    //first change
    if(domObject.firstChange === true) {
        if(bookOpen){
            pageIsSpawn = true;
        }
        else {
            domObject.firstChange = false
        }
        if (pageIsSpawn) {
            scene.add(group)
            group.rotation.x += 0.005;
        }
        if (group.rotation.x >= 3.14){
            scene.remove(group)
            group.rotation.x = 0
            domObject.firstChange = false
            pageIsSpawn = false
        }
    }
    //second change
    if(domObject.secondChange && pageIsSpawn == false) { 
        bookOpen = false
        if(canOpen == false){
            group2.rotation.x += 0.005
        }
        if (group2.rotation.x >= 3.14){
            canOpen = true
            domObject.secondChange = false
        }
        if (canOpen == true){
            group2.rotation.x -= 0.005
            if(group2.rotation.x <= 0){
                bookOpen = true
                canOpen = false
                domObject.secondChange = false
            }
        }
    }
    //third change
    if(domObject.thirdChange) {
        if(lightToggle == true){
            directionalLight.intensity = 0.1
            ambientLight.intensity = 0
            lightToggle = false
            domObject.thirdChange = false
        }
        else if(lightToggle == false){
            directionalLight.intensity = 1.5
            ambientLight.intensity = 1.3
            lightToggle = true
            domObject.thirdChange = false
        }

    }
    console.log(domObject.fourthChange)
    //fourth change
    if(domObject.fourthChange) {
        sun.target = wall
        const elapsedTime = clock.getElapsedTime() 
        {
            scene.add(sun)
            sun.position.z = Math.sin(elapsedTime / 4)* 20
            
        }

        if(sun.position.z >= 10){
            scene.remove(sun)
        }

        if(sun.position.z <= -10){
            scene.remove(sun)
        }
    }
    // Update Orbit Controls
    controls.update()

    // renderer
    renderer.render(scene,camera)

    // request next frame
    window.requestAnimationFrame(animation)
}

animation()

