attribute vec3 position;
attribute vec4 color;
attribute float size;

uniform float pointAngle;

varying vec4 vColor;

void main() {
  vColor = color;

  vec3 p = vec3(cos(position.x * (position.y + pointAngle)), sin(position.x * (position.z + pointAngle)),0.0);
  gl_Position = vec4(p, 1.0);

  gl_PointSize = size;
}