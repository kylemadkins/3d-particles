import * as THREE from "three";
import gsap from "gsap";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler";
import vertexShader from "./shaders/vertexShader";
import fragmentShader from "./shaders/fragmentShader";

class Model {
  constructor({ name, file, scene, color1, color2 }) {
    this.name = name;
    this.file = file;
    this.scene = scene;
    this.mesh = null;
    this.particles = null;
    this.active = false;
    this.color1 = color1;
    this.color2 = color2;

    /*------------------------------
    Create Particles Material
    ------------------------------*/
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uColor1: { value: new THREE.Color(this.color1) },
        uColor2: { value: new THREE.Color(this.color2) },
        uTime: { value: 0 },
        uScale: { value: 0 }
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.init();
  }

  init() {
    /*------------------------------
    Initialize Loaders
    ------------------------------*/
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("./draco/");
    loader.setDRACOLoader(dracoLoader);

    /*------------------------------
    Load Model
    ------------------------------*/
    loader.load(this.file, response => {

      /*------------------------------
      Get Mesh
      ------------------------------*/
      this.mesh = response.scene.children[0];

      /*------------------------------
      Generate Particles Geometry Based on Mesh Surface
      ------------------------------*/
      const sampler = new MeshSurfaceSampler(this.mesh).build();
      const numParticles = 40000;
      const particlesGeometry = new THREE.BufferGeometry();
      const particlesPosition = new Float32Array(numParticles * 3);
      const particlesRandom = new Float32Array(numParticles * 3);
      for (let i = 0; i < numParticles; i++) {
        const position = new THREE.Vector3();
        sampler.sample(position);
        particlesPosition.set([
          position.x,
          position.y,
          position.z
        ], i * 3);
        particlesRandom.set([
          Math.random() * 2 - 1,
          Math.random() * 2 - 1,
          Math.random() * 2 - 1,
        ], i * 3);
      }
      /* Why doesn't the `position` attribute need to be declared in the vertex shader? */
      particlesGeometry.setAttribute("position", new THREE.BufferAttribute(particlesPosition, 3));
      particlesGeometry.setAttribute("aRandom", new THREE.BufferAttribute(particlesRandom, 3));

      /*------------------------------
      Create Particles
      ------------------------------*/
      this.particles = new THREE.Points(particlesGeometry, this.material);

      /*------------------------------
      Add Particles to Scene
      ------------------------------*/
      this.scene.add(this.particles);
      this.active = true;
      gsap.to(this.material.uniforms.uScale, {
        value: 1,
        duration: 2,
        ease: "power3.out"
      });
      gsap.fromTo(this.particles.rotation, {
        y: Math.PI
      }, {
        y: 0,
        duration: 2,
        ease: "power3.out"
      });
    });
  }
}

export default Model;
