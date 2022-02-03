attribute vec3 aRandom;

varying vec3 vPosition;

uniform float uTime;
uniform float uScale;

void main() {
  vPosition = position;

  float time = uTime * 10.0;
  
  vec3 pos = position;
  pos.x += sin(uTime * aRandom.x) * 0.015;
  pos.y += cos(uTime * aRandom.x) * 0.015;
  pos.z += cos(uTime * aRandom.x) * 0.015;

  pos.x *= uScale + (sin(pos.y * 4.0 + time) * (1.0 - uScale));
  pos.y *= uScale + (sin(pos.z * 4.0 + time) * (1.0 - uScale));
  pos.z *= uScale + (sin(pos.x * 4.0 + time) * (1.0 - uScale));

  pos *= uScale;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = 8.0 / -mvPosition.z;
}
