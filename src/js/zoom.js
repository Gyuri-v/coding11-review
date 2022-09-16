import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

let scene, camera, renderer, controls;
let boxGroup = new THREE.Object3D();

const depthNum = 100;
let totalNum = 0;

let scrollY = 0;
let moveArea = 0;
let percent = 0;

let cameraZ = 50;
let cameraTargetZ = 0;
let mouse = { x: 0, y: 0 };
let mouseMove = { x: 0, y: 0 };

const imageDataArr = [
    { "image": "/src/images/soccer_0.png", },
    { "image": "/src/images/soccer_1.png", },
    { "image": "/src/images/soccer_2.png", },
    { "image": "/src/images/soccer_3.png", },
]

const init = () => {
    // totalNum
    totalNum = imageDataArr.length - 1;

    // Container Height
    document.body.style.height = `${HEIGHT + totalNum * depthNum * 10}px`;

    // Renderer
    renderer = new THREE.WebGL1Renderer({
        antialias: true,
    });
    renderer.setSize(WIDTH, HEIGHT);
    document.querySelector("#canvasWrap").appendChild(renderer.domElement);

    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(75, WIDTH/HEIGHT, 5, 1000);
    camera.position.set(0, 0, cameraZ);

    // Controls
    // controls = new OrbitControls(camera, renderer.domElement);

    // Light
    const hemisphereLight = new THREE.HemisphereLight('#fff', '#000', 0.8);
    hemisphereLight.position.set(100, 100, 0);
    scene.add(hemisphereLight);

    // Fog
    scene.fot = new THREE.Fog('#fff', 100, 150);

    // Mesh
    for (let i = 0; i < imageDataArr.length; i++) {
        createBox(i);
    }
    scene.add( boxGroup );
}

const resize = () => {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    camera.updateProjectionMatrix();
    camera.aspect = WIDTH / HEIGHT;
    renderer.setSize(WIDTH, HEIGHT);
    
}


const scroll = () => {
    scrollY = window.scrollY;
    moveArea = document.body.offsetHeight - window.innerHeight
    percent = scrollY / moveArea * ((imageDataArr.length - 1) * depthNum);
    cameraTargetZ = 50 - percent;
}

const draw = () => {
    // controls.update();

    cameraZ -= (cameraZ - cameraTargetZ) * 0.1;
    camera.position.z = cameraZ;

    mouseMove.x += (mouse.x - mouseMove.x - WIDTH / 2) * 0.1;
    mouseMove.y += (mouse.y - mouseMove.y - WIDTH / 2) * 0.1;
    boxGroup.position.x = -(mouseMove.x / 150);
    boxGroup.position.y = mouseMove.y / 150;

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
}

const createBox = (i) => {
    const imageMap = new THREE.TextureLoader().load( imageDataArr[i].image );
    
    const material = new THREE.SpriteMaterial({ map: imageMap });
    const boxMesh = new THREE.Sprite( material );
    boxMesh.scale.set(80, 80, 1);
    boxMesh.position.z = -i * depthNum;
    boxMesh.name = `imageBox_${i}`;
    
    boxGroup.add( boxMesh );
}

// const onMouseMove = (e) => 


init();
draw();
scroll();
window.addEventListener('resize', resize);
window.addEventListener('scroll', scroll);
window.addEventListener('mousemove', (e) => {{
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}
});
