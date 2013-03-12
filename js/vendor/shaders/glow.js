/**
 * @author Kastor
 *
 * paints a circle
 */

THREE.GlowShader = {

  uniforms: {
/*
    "x":  { type: "f", value: 0.5 }
    "y":  { type: "f", value: 0.5 }
    "sx":  { type: "f", value: 0.5 }
    "sy":  { type: "f", value: 0.5 }
    "glow":  { type: "f", value: 0.5 }
    "alpha":  { type: "f", value: 1 }
    "tInput":   { type: "t", value: null },
*/
  },

  vertexShader: [

    "varying vec2 vUv;",

    "void main() {",

      "vUv = uv;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    "}"

  ].join("\n"),

  fragmentShader: [


    "varying vec2 vUv;",

    "void main() {",
      "vec2 texturCoord =  vUv ;",
      "texturCoord /= 0.75;",
      "lowp float d = 1.0 - dot(vUv, vUv);",
      "gl_FragColor = vec4(vec3(d),1.0);",
    "}"

  ].join("\n")

};