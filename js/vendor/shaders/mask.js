/**
 * @author Kastor
 *
 * blends input1 and 2 acording to input3
 */

THREE.MaskShader = {

  uniforms: {
    input1:  { type: "t", value: 0, texture: null },
    input2:  { type: "t", value: 0, texture: null },
    blendMap:  { type: "t", value: 0, texture: null }
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
    "uniform sampler2D input2;",
    "uniform sampler2D blendMap;",
    "varying vec2 vUv;",

    "void main() {",
      "vec4 color1 = texture2D(input1, vUv );",
      "vec4 color2 = texture2D(input2, vUv );",
      "vec4 color3 = texture2D(blendMap, vUv );",
      "float blend = color3.x;",
      "gl_FragColor = mix(color1, color2, blend ) ;",
    "}"

  ].join("\n")

};
