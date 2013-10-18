/**
 * @author Kastor
 *
 * this shader rotates and zooms the texture
 */

THREE.RotoZoomShader = {

  uniforms: {
    input1:  { type: "t", value: 0, texture: null },
    zoom:  { type: "f", value: 1.0 },
    rotation:  { type: "f", value: 0.0 }
  },

  vertexShader: [

    "varying vec2 vUv;",

    "void main() {",

      "vUv = uv;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    "}"

  ].join("\n"),

  fragmentShader: [
    "uniform sampler2D input1;",
    "uniform float rotation;",
    "uniform float zoom;",
    "varying vec2 vUv;",

    "void main() {",
      "vec2 v = vUv;",
      "v.x -= 0.5;",
      "v.y -= 0.5;",
      "v = vec2(cos(rotation)*v.x + sin(rotation)*v.y, -sin(rotation)*v.x + cos(rotation)*v.y);",
      "v.x = v.x * zoom;",
      "v.y = v.y * zoom;",
      "v.x += 0.5;",
      "v.y += 0.5;",
      "gl_FragColor = texture2D(input1, v );",

    "}"

  ].join("\n")

};
