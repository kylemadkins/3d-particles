import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Model from "./model";

/*------------------------------
Renderer
------------------------------*/
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/*------------------------------
Scene & Camera
------------------------------*/
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 
  30,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 5;
camera.position.y = 1;

/*------------------------------
OrbitControls
------------------------------*/
const controls = new OrbitControls(camera, renderer.domElement);
controls.enabled = false;

/*------------------------------
Helpers
------------------------------*/
// const gridHelper = new THREE.GridHelper(10, 10);
// scene.add(gridHelper);
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

/*------------------------------
Models
------------------------------*/
const skull = new Model({
  name: "Skull",
  file: "./models/skull.glb",
  scene,
  color1: "#F9A03F",
  color2: "#EE6C4D"
});

/*------------------------------
Clock
------------------------------*/
const clock = new THREE.Clock();

/*------------------------------
Loop
------------------------------*/
const animate = function() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  if (skull.active) {
    skull.material.uniforms.uTime.value = clock.getElapsedTime();
  }
};
animate();

/*------------------------------
Resize
------------------------------*/
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize, false);

/*------------------------------
Mousemove
------------------------------*/
function onMousemove({ clientX, clientY }) {
  gsap.to(scene.rotation, {
    x: gsap.utils.mapRange(0, window.innerHeight, 0.2, -0.2, clientY),
    y: gsap.utils.mapRange(0, window.innerWidth, 0.2, -0.2, clientX)
  })
}
window.addEventListener("mousemove", onMousemove);
