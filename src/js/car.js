import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

let scene, camera, renderer;
let controls;

const carGroup = new THREE.Group();
const wheel_front_Group = new THREE.Group();
const wheel_back_Group = new THREE.Group();

const init = () => {
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(0x0e2255);
    document.body.appendChild(renderer.domElement);

    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera( 75, WIDTH / HEIGHT, 0.1, 1000 );
    camera.position.set(50, 50, 50);
    camera.lookAt(0, 0, 0);
    scene.add(camera);

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    // controls.enableZoom = false;
    // controls.enablePan = false;
    
    // Helper
    const axesHelper = new THREE.AxesHelper(50);
    const gridHelper = new THREE.GridHelper(70, 20);
    scene.add(axesHelper, gridHelper);

    // Light
    const ambientLight = new THREE.AmbientLight('white', 0.5);
    const directionalLight = new THREE.DirectionalLight('white', 1.3);
        directionalLight.position.set(20, 80, 50);
        directionalLight.target.position.set(0, 20, 0);
    scene.add(ambientLight, directionalLight);

    // Mesh
    const geometry = new THREE.BoxGeometry(20, 12, 30);
    const material = new THREE.MeshPhongMaterial({ color: 0xffd400 });
    const boxMesh = new THREE.Mesh(geometry, material);

    const geometry_top = new THREE.BoxGeometry(14, 8, 20);
    const boxMesh_top = new THREE.Mesh(geometry_top, material);
    boxMesh_top.position.set(0, 10, -2);

    carGroup.add(boxMesh, boxMesh_top);

    const geometry_cylinder = new THREE.CylinderGeometry(5, 5, 3, 10);
    const material_cylinder = new THREE.MeshPhongMaterial({
        color: 0x000000,
        wireframe: true,
    });

    const wheel = new THREE.Mesh(geometry_cylinder, material_cylinder);
    wheel.rotateZ(Math.radians(90));

    const wheel_front_L = wheel.clone();
    wheel_front_L.position.x = -12;
    wheel_front_Group.add(wheel_front_L);

    const wheel_front_R = wheel.clone();
    wheel_front_R.position.x = 12;
    wheel_front_Group.add(wheel_front_R);

    wheel_front_Group.position.set(0, -4, 8);
    carGroup.add(wheel_front_Group);

    const wheel_back_L = wheel.clone();
    wheel_back_L.position.x = -12;
    wheel_back_Group.add(wheel_back_L);

    const wheel_back_R = wheel.clone();
    wheel_back_R.position.x = 12;
    wheel_back_Group.add(wheel_back_R);

    wheel_back_Group.position.set(0, -4, -8);
    carGroup.add(wheel_back_Group);

    carGroup.position.y = 9;
    scene.add(carGroup);


    // Event
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
}

// KeyEvent
let keyCode = 0;
let keyDownChk = false;

const onKeyDown = (e) => {
    keyCode = e.key || e.keyCode;
    keyDownChk = true;
}
const onKeyUp = (e) => {
    keyDownChk = false;
}
const animationKey = (e) => {
    if ( keyDownChk ) {
        if ( keyCode == "ArrowUp" || keyCode == 38 ) {
            carGroup.position.z = carGroup.position.z + 1;
            wheel_front_Group.children.forEach((item) => {
                item.rotation.x = item.rotation.x + 0.1;
            });
            wheel_back_Group.children.forEach((item) => {
                item.rotation.x = item.rotation.x + 0.1;
            });
        } else if ( keyCode == "ArrowDown" || keyCode == 40 ) {
            carGroup.position.z = carGroup.position.z - 1;
            wheel_front_Group.children.forEach((item) => {
                item.rotation.x = item.rotation.x - 0.1;
            });
            wheel_back_Group.children.forEach((item) => {
                item.rotation.x = item.rotation.x - 0.1;
            });
        }
    }
}

// Draw
const draw = () => {
    animationKey();

    controls.update();

    renderer.render(scene, camera);
    requestAnimationFrame(draw)
}

// radians
Math.radians = (degrees) => {
    return (degrees * Math.PI) / 180;
};





init();
draw();