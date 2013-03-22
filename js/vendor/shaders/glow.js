/**
 * @author Kastor
 *
 * paints a circle
 */

THREE.GlowShader = {

  uniforms: {

    x:  { type: "f", value: 0.0 },
    y:  { type: "f", value: 0.0 },
    sx:  { type: "f", value: 0.5 },
    sy:  { type: "f", value: 0.5 },
    glow:  { type: "f", value: 1.0 },
    alpha:  { type: "f", value: 1.0 },
    r:  { type: "f", value: 1.0 },
    g:  { type: "f", value: 1.0 },
    b:  { type: "f", value: 1.0 }

  },

  vertexShader: [

    "varying vec2 vUv;",

    "void main() {",

      "vUv = uv;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    "}"

  ].join("\n"),

  fragmentShader: [
    "uniform float x;",
    "uniform float y;",
    "uniform float sx;",
    "uniform float sy;",
    "uniform float glow;",
    "uniform float alpha;",
    "uniform float r;",
    "uniform float g;",
    "uniform float b;",

    "varying vec2 vUv;",

    "void main() {",
      "vec2 texturCoord =  vUv - vec2 (0.5,0.5);",
      "texturCoord.x -= x;",
      "texturCoord.y -= y;",
      "texturCoord.x /= sx;",
      "texturCoord.y /= sy;",
      "lowp float d = clamp (1.0 - dot(texturCoord, texturCoord), 0.0, 1.0);",
      "d = pow(d, glow);",
      "vec3 color = vec3(r,g,b);",
      "gl_FragColor = vec4(vec3(d) * color ,1.0);",
    "}"

  ].join("\n")

};