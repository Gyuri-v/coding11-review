import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

let WIDTH = 500;
let HEIGHT = 500;

let scene, camera, renderer;

let model = new THREE.Object3D();
let modelBody = new THREE.Object3D();

let scrollY = 0;
let moveArea = 0;
let percent = 0;
let modelMove = 0;

const init = () => {
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(WIDTH, HEIGHT);
    document.querySelector('#canvasWrap').appendChild(renderer.domElement);
    
    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(35, WIDTH / HEIGHT, 1, 500);
    camera.position.set(0, 20, 190);

    // Light 
    const hemisphereLight = new THREE.HemisphereLight('#fff', '#000', 0.8);
    hemisphereLight.position.set(100, 100, 100);
    const pointLight = new THREE.PointLight('#fff', 2);
    pointLight.position.set(140, 160, 150);
    scene.add(hemisphereLight, pointLight);
    
    // Loader
    createFBXLoader("/public/model/can.FBX");
}

const scroll = () => {
    scrollY = window.scrollY;
}

const draw = () => {
    modelMove += (scrollY / 500 - modelMove) * 0.1;
    console.log( scrollY )
    
    model.rotation.y += 0.01;
    modelBody.rotation.y = modelMove;
    modelBody.rotation.z = modelMove / 12;

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
    // requestAnimationFrame(draw);
}

const createFBXLoader = ( modelName ) => {
    const fbxLoader = new FBXLoader();
    fbxLoader.load(
        modelName,
        (object) => {
            let scaleNum = 1;
            object.scale.set(scaleNum, scaleNum, scaleNum);
            
            model.add(object.children[0]);
            model.rotation.set(0.4, 9.3, 0);
            
            modelBody.position.set(0, 10, 0);
            modelBody.add(model);
            scene.add(modelBody);

            gsap.from("h1", {
                duration: 0.8,
                delay: 0.35,
                y: 60,
                alpha: 0,
                ease: "Power2.easeInOut",
            });
            gsap.from(model.position, {
                duration: 1.8,
                delay: 0.5,
                x: 0,
                z: -100,
                alpha: 0,
                ease: "Power2.easeInOut",
            });
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        (error) => {
            console.log(error);
        }
    )
}

init();
draw();
scroll();
window.addEventListener('scroll', scroll)