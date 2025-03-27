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
// mesh geometry
const boxGeometry = new THREE.BoxGeometry( 0.5, 0.5, 0.5 ); 

const drawShape = (height, params) => {
    //create shape material
    const materialOptions = {
        color: new THREE.Color(params.color)
    }
    
    //defining material 
    const material = new THREE.MeshStandardMaterial(materialOptions)
    
    // defining geometry
    let geometry
    
    // which meshes to use for which words
    if (params.term === 'throat') {
        geometry = new THREE.TorusGeometry( 0.5, 0.4, 12, 10 ); 
    } 
    else if (params.term === 'razor')
    {
        geometry = new THREE.CylinderGeometry( 0.03, 0.03, 0.3, 12 );
    }
    else {
        geometry = boxGeometry
    }
    
    // tying mesh to the object
    const mesh = new THREE.Mesh(geometry, material)
    
    //height diameter
    let diaMultiplier = 1
    if (params.diaIncrease) {
        diaMultiplier = Math.min(3, 1 + height * 0.09)
    }
    
    // defining diameter guidelines
    mesh.userData.height = height
    
    const effectiveDiameter = params.diameter * diaMultiplier
    
    mesh.position.x = (Math.random() - 0.5) * effectiveDiameter
    mesh.position.z = (Math.random() - 0.5) * effectiveDiameter
    mesh.position.y = height - 10
    mesh.userData.height = mesh.position.y

    //height scaling
    if (params.heightScale) {
        mesh.scale.x = height * 0.1
        mesh.scale.y = height * 0.1
        mesh.scale.z = height * 0.1
    }
    
    mesh.userData.height = mesh.position.y
    
    //random mesh rotation
    if(params.randomized){
        mesh.rotation.x = Math.random() * 2 * Math.PI
        mesh.rotation.y = Math.random() * 2 * Math.PI
        mesh.rotation.z = Math.random() * 2 * Math.PI
    }

    // cylinder rotation
    if(params.heightRotation) {
        // map height to rotation
        const minRotation = 0;
        const maxRotation = Math.PI;

        // more mapping
        const rotationAmount = THREE.MathUtils.mapLinear(height, 0, 10, minRotation, maxRotation);

        // apply randomization
        const randomRotation = rotationAmount * Math.random();

        // apply rotation to the object
        mesh.rotation.x = randomRotation;
        mesh.rotation.y = randomRotation;
        mesh.rotation.z = randomRotation;
    }

    //add object to group
    params.group.add(mesh)     
}

/*******
** UI **
*******/
// Ui
const ui = new dat.GUI()

let preset = {}

// groups
const group1 = new THREE.Group()
scene.add(group1)
const group2 = new THREE.Group()
scene.add(group2)
const group3 = new THREE.Group()
scene.add(group3)

const uiObj = {
    sourceText: "The quick brown fox jumped over the lazy dog.",
    saveSourceText() {
        saveSourceText()
    },
    term1: {
        term: "torres",
        color: "#1f3d0c",
        diameter: 10,
        group: group1,
        nCubes: 100,
        randomized: true,
        scale: 1,
        diaIncrease: true,
        heightRotation: false,
        heightScale: true
    },
    term2: {
        term: "razor",
        color: "#f5f5f5",
        diameter: 10,
        group: group2,
        nCubes: 250,
        randomized: false,
        scale: 1,
        diaIncrease: true,
        heightRotation: true,
        heightScale: false
    },
    term3: {
        term: "throat",
        color: "#780606",
        diameter: 15,
        group: group3,
        nCubes: 100,
        randomized: true,
        scale: 1,
        diaIncrease: true,
        heightRotation: false,
        heightScale: false
    },
    saveTerms() {
        saveTerms()
    },
    rotateCamera: false
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
    cameraFolder.show()

    // text analysis
    findSearchTermInTokenizedText(uiObj.term1)
    findSearchTermInTokenizedText(uiObj.term2)
    findSearchTermInTokenizedText(uiObj.term3)
}

// Text Folder
const textFolder = ui.addFolder("Source Text")

textFolder
    .add(uiObj, 'sourceText')
    .name("Source Text")

textFolder
    .add(uiObj, 'saveSourceText')
    .name("Save")

// Terms, Camera and Visualize Folders
const termsFolder = ui.addFolder("Search Terms")
const visualizeFolder = ui.addFolder("Visualize")
const cameraFolder = ui.addFolder("Camera")

//terms folders
termsFolder
    .add(uiObj.term1, 'term')
    .name("Term 1")
    
termsFolder
    .add(group1, "visible")
    .name("Term 1 Visibility")

termsFolder
    .addColor(uiObj.term1, 'color')
    .name("Term 1 Color")

termsFolder
    .add(uiObj.term2, 'term')
    .name("Term 2")

termsFolder
    .add(group2, "visible")
    .name("Term 2 Visibility")

termsFolder
    .addColor(uiObj.term2, 'color')
    .name("Term 2 Color")

termsFolder
    .add(uiObj.term3, 'term')
    .name("Term 3")

termsFolder
    .add(group1, "visible")
    .name("Term 3 Visibility")

termsFolder
    .addColor(uiObj.term3, 'color')
    .name("Term 3 Color")

//visuailze folder
visualizeFolder
    .add(uiObj, 'saveTerms')
    .name("Visualize")

//camera folder
cameraFolder
    .add(uiObj, 'rotateCamera')
    .name("Turntable")

//terms, camera and visualize folders are hidden by default
termsFolder.hide()
visualizeFolder.hide()
cameraFolder.hide()

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
const findSearchTermInTokenizedText = (params) => 
{
    // use a for loop to go through the tokenizedText array
    for (let i = 0; i < tokenizedText.length; i++)
    {
        //if tokenizedText[i] matches our searchTerm, then we draw a cube
        if(tokenizedText[i] === params.term){
            // convert i into height , which is a value between 0 and 20
            const height = (100 / tokenizedText.length) * i * 0.2

            //call draw function nCubes times using converted height value
            for (let a = 0; a < params.nCubes; a++)
            {
                drawShape(height, params)
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

    //rotate camera
    if (uiObj.rotateCamera) {
        camera.position.x = Math.sin(elapsedTime * 0.1) * 20
        camera.position.z = Math.cos(elapsedTime * 0.1) * 20
        camera.position.y = 15
        camera.lookAt(0, 0, 0)
    }

    // renderer
    renderer.render(scene,camera)

    // request next frame
    window.requestAnimationFrame(animation)
}

animation()