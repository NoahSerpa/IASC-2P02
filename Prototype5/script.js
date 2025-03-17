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

let preset = {}

const uiObj = {
    sourceText: "The quick brown fox jumped over the lazy dog.",
    saveSourceText() {
        saveSourceText()
    },
    term1: 'fox',
    color1: '#aa00ff',
    term2: 'dog',
    color2: '#00ffaa',
    term3: '',
    color3: '',
    saveTerms() {
        saveTerms()
    }
}

// Ui function
const saveSourceText = () => {
    // UI
    preset = ui.save()
    textFolder.hide()
    termsFolder.show()
    visualizeFolder.show()

    // Text Analysis
    tokenizeSourceText(uiObj.sourceText)
}

const saveTerms = () => {
    // UI
    preset = ui.save
    visualizeFolder.hide()

    // text analysis
    findSearchTermInTokenizedText(uiObj.term1, uiObj.color1)
    findSearchTermInTokenizedText(uiObj.term2, uiObj.color2)
    findSearchTermInTokenizedText(uiObj.term3, uiObj.color3)
}

// Text Folder
const textFolder = ui.addFolder("Source Text")

textFolder
    .add(uiObj, 'sourceText')
    .name("Source Text")

textFolder
    .add(uiObj, 'saveSourceText')
    .name("Save")

// Terms and Visualize Folders
const termsFolder = ui.addFolder("Search Terms")
const visualizeFolder = ui.addFolder("Visualize")

termsFolder
    .add(uiObj, 'term1')
    .name("Term 1")

termsFolder
    .addColor(uiObj, 'color1')
    .name("Term 1 Color")

termsFolder
    .add(uiObj, 'term2')
    .name("Term 2")

termsFolder
    .addColor(uiObj, 'color2')
    .name("Term 2 Color")

termsFolder
    .add(uiObj, 'term3')
    .name("Term 3")

termsFolder
    .addColor(uiObj, 'color3')
    .name("Term 3 Color")

visualizeFolder
    .add(uiObj, 'saveTerms')
    .name("Visualize")


termsFolder.hide()
visualizeFolder.hide()

/******************
** TEXT ANALYSIS **
******************/

// variables
let parsedText, tokenizedText

// parse and tokenized source text
const tokenizeSourceText = (sourceText) => {
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