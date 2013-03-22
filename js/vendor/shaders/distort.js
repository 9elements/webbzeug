/**
 * @author Kastor
 *
 * here we haz some shaders to combine
 */

THREE.DistortShader = {

  uniforms: {
    baseMap:  { type: "t", value: 0, texture: null },
    distMap:  { type: "t", value: 0, texture: null },
    amount:  { type: "f", value: 0 },
  },

  vertexShader: [

    "varying vec2 vUv;",

    "void main() {",

      "vUv = uv;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    "}"

  ].join("\n"),

  fragmentShader: [
    "uniform sampler2D baseMap;",
    "uniform sampler2D distMap;",
    "uniform float amount;",

    "varying vec2 vUv;",

    "void main() {",

      "vec4 distorion = 2.0 * texture2D(distMap, vUv ) - 1.0;",
      "vec2 tex = vUv;",
      "tex.x -= amount * distorion.y;",
      "tex.y += amount * distorion.z;",

      "// Pack [-1, 1] into [0, 1]",
      "gl_FragColor = texture2D(baseMap, tex );",
    "}"

  ].join("\n")

};
