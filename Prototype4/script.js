import * as THREE from 'three';
import { OrbitControls } from "OrbitControls";
import * as dat from "lil-gui";

/**********
** SETUP **
**********/
// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    aspectRatio: window.innerWidth / window.innerHeight
}

//resizing
window.addEventListener('resize', () => 
{
    //update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.aspectRatio = window.innerWidth / window.innerHeight

    //update camera
    camera.aspect = sizes.aspectRatio
    camera.updateProjectionMatrix()

    //update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**********
** SCENE **
**********/
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
camera.position.set (0, 10, -20)

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
** LIGHTS **
***********/
//directional light
const directionalLight = new THREE.DirectionalLight( 0x404040, 100 );
scene.add( directionalLight );

/***********
** MESHES **
***********/
// cube geometry
const cubeGeometry = new THREE.BoxGeometry( 0.5, 0.5, 0.5 ); 

const drawCube = (height, color) => 
{
    // create cube material
    const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(color)
    })

    //create cube
    const cube = new THREE.Mesh(cubeGeometry, material)

    //position cube
    cube.position.x = (Math.random() - 0.5) * 10
    cube.position.z = (Math.random() - 0.5) * 10
    cube.position.y = height - 10

    // randomize cube rotation
    cube.rotation.x = Math.random() * 2 * Math.PI
    cube.rotation.y = Math.random() * 2 * Math.PI
    cube.rotation.z = Math.random() * 2 * Math.PI

    //add cube
    scene.add(cube)
}

/*******
** UI **
*******/
// Ui
const ui = new dat.GUI()

/******************
** TEXT ANALYSIS **
******************/
// source text
const sourceText= "Once upon a time, a drunk druid stumbled into a forest. He was angry that most human bars and taverns don't allow many other races like goblins or dwarves on account of their carelessness. In his drunken rage and nautious spell casting, he created a mushroom boy. The druid and the mushroom would then open a bar in the middle of the forest that would allow any and all guests, no matter the race. The mushroom would bartend and the druid would drink, at Mushy's Mushroom Tavern"

// variables
let parsedText, tokenizedText

// parse and tokenized source text
const tokenizeSourceText = () => {
    //strip periods and downcase of sourcetext
    parsedText = sourceText.replaceAll('.', '').toLowerCase()
    //tokenize text
    tokenizedText = parsedText.split(/[^\w']+/)
}

// find searchTerm in tokenizedText
const findSearchTermInTokenizedText = (term, color) => 
{
    // use a for loop to go through the tokenizedText array
    for (let i = 0; i < tokenizedText.length; i++)
    {
        //if tokenizedText[i] matches our searchTerm, then we draw a cube
        if(tokenizedText[i] === term){
            // convert i into height , which is a value between 0 and 20
            const height = (100 / tokenizedText.length) * i * 0.2

            //call draw function 100 times using converted height value
            for (let a = 0; a < 100; a++)
            {
                drawCube(height, color)
            }
        }
    }
}

tokenizeSourceText()
findSearchTermInTokenizedText('mushroom', 'red')
findSearchTermInTokenizedText('druid', 'green')
findSearchTermInTokenizedText('forest', 'brown')

/*******************
** ANIMATION LOOP **e
*******************/
const clock = new THREE.Clock()

const animation = () => {
    // return elapsed time
    const elapsedTime = clock.getElapsedTime()

    // Update Orbit Controls
    controls.update()

    // renderer
    renderer.render(scene,camera)

    // request next frame
    window.requestAnimationFrame(animation)
}

animation()