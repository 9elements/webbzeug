(function() {

  THREE.HorizontalGaussianShader = {
    uniforms: {
      tDiffuse: {
        type: "t",
        value: 0,
        texture: null
      },
      h: {
        type: "f",
        value: 1.0 / 512.0
      }
    },
    vertexShader: "varying vec2 vUv;\n\nvoid main() {\n  vUv = uv;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
    fragmentShader: "uniform sampler2D tDiffuse;\nuniform float h;\n\nvarying vec2 vUv;\n\nvoid main() {\n  vec4 sum = vec4( 0.0 );\n\n  sum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * h, vUv.y ) ) * 0.051;\n  sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * h, vUv.y ) ) * 0.0918;\n  sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * h, vUv.y ) ) * 0.12245;\n  sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y ) ) * 0.1531;\n  sum += texture2D( tDiffuse, vec2( vUv.x,                       vUv.y ) ) * 0.1633;\n  sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y ) ) * 0.1531;\n  sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * h, vUv.y ) ) * 0.12245;\n  sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * h, vUv.y ) ) * 0.0918;\n  sum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * h, vUv.y ) ) * 0.051;\n\n  gl_FragColor = sum;\n}"
  };

  THREE.VerticalGaussianShader = {
    uniforms: {
      tDiffuse: {
        type: "t",
        value: 0,
        texture: null
      },
      v: {
        type: "f",
        value: 1.0 / 512.0
      }
    },
    vertexShader: "varying vec2 vUv;\n\nvoid main() {\n  vUv = uv;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
    fragmentShader: "uniform sampler2D tDiffuse;\nuniform float v;\n\nvarying vec2 vUv;\n\nvoid main() {\n  vec4 sum = vec4( 0.0 );\n\n  sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * v ) ) * 0.051;\n  sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * v ) ) * 0.0918;\n  sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * v ) ) * 0.12245;\n  sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * v ) ) * 0.1531;\n  sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y                   ) ) * 0.1633;\n  sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * v ) ) * 0.1531;\n  sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * v ) ) * 0.12245;\n  sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * v ) ) * 0.0918;\n  sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * v ) ) * 0.051;\n\n  gl_FragColor = sum;\n}"
  };

  THREE.TriangleBlurH = {
    uniforms: {
      tDiffuse: {
        type: "t",
        value: 0,
        texture: null
      },
      delta: {
        type: "v2",
        value: new THREE.Vector2(1, 1)
      }
    },
    vertexShader: "varying vec2 vUv;\n\nvoid main() {\n  vUv = uv;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
    fragmentShader: "#define ITERATIONS 10.0\nuniform sampler2D tDiffuse;\nuniform vec2 delta;\n\nvarying vec2 vUv;\n\nfloat random( vec3 scale, float seed ) {\n  return fract( sin( dot( gl_FragCoord.xyz + seed, scale ) ) * 43758.5453 + seed );\n}\n\nvoid main() {\n    vec4 color = vec4( 0.0 );\n    float total = 0.0;\n\n    float offset = random( vec3( 12.9898, 78.233, 151.7182 ), 0.0 );\n    for( float t = -ITERATIONS; t <= ITERATIONS; t ++ ) {\n      float percent = (t + offset - 0.5 ) / ITERATIONS;\n      float weight = 1.0 - abs( percent );\n\n      color += texture2D ( tDiffuse, vUv + delta * percent ) * weight;\n      total += weight;\n    }\n    gl_FragColor = color / total;\n}"
  };

  THREE.TriangleBlurV = {
    uniforms: {
      tDiffuse: {
        type: "t",
        value: 0,
        texture: null
      },
      delta: {
        type: "v2",
        value: new THREE.Vector2(1, 1)
      }
    },
    vertexShader: "varying vec2 vUv;\n\nvoid main() {\n  vUv = uv;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
    fragmentShader: "#define ITERATIONS 10.0\nuniform sampler2D tDiffuse;\nuniform vec2 delta;\n\nvarying vec2 vUv;\n\nfloat random( vec3 scale, float seed ) {\n  return fract( sin( dot( gl_FragCoord.xyz + seed, scale ) ) * 43758.5453 + seed );\n}\n\nvoid main() {\n    vec4 color = vec4( 0.0 );\n    float total = 0.0;\n\n    float offset = random( vec3( 12.9898, 78.233, 151.7182 ), 0.0 );\n    for( float t = -ITERATIONS; t <= ITERATIONS; t ++ ) {\n      float percent = (t + offset - 0.5 ) / ITERATIONS;\n      float weight = 1.0 - abs( percent );\n\n      color += texture2D ( tDiffuse, vUv + delta * percent ) * weight;\n      total += weight;\n    }\n    gl_FragColor = color / total;\n}"
  };

  THREE.DiscBlur = {
    uniforms: {
      tDiffuse: {
        type: "t",
        value: 0,
        texture: null
      },
      delta: {
        type: "v2",
        value: new THREE.Vector2(1, 1)
      }
    },
    vertexShader: "varying vec2 vUv;\n\nvoid main() {\n  vUv = uv;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
    fragmentShader: "varying vec3 vColor;\nvarying vec2 vUv;\n\nuniform sampler2D tDiffuse;\nvec2 offsets[12];\n\nvoid main()\n{\n  float DiscRadius = 0.02;\n  offsets[0] = vec2(-0.326212,-0.40581);\n  offsets[1] = vec2(-0.840144,-0.07358);\n  offsets[2] = vec2(-0.695914,0.457137);\n  offsets[3] = vec2(-0.203345,0.620716);\n  offsets[4] = vec2(0.96234,-0.194983);\n  offsets[5] = vec2(0.473434,-0.480026);\n  offsets[6] = vec2(0.519456,0.767022 );\n  offsets[7] = vec2(0.185461,-0.893124 );\n  offsets[8] = vec2(0.507431,0.064425 );\n  offsets[9] = vec2(0.89642,0.412458 );\n  offsets[10] = vec2(-0.32194,-0.932615 );\n  offsets[11] = vec2(-0.791559,-0.59771 );\n\n  vec4 sampleAccum = texture2D(tDiffuse,vUv);\n\n  for ( int nTapIndex = 0; nTapIndex < 12; nTapIndex++ )\n  {\n    vec2 vTapCoord = vUv + offsets[nTapIndex] * DiscRadius;\n    sampleAccum.rgb += texture2D(tDiffuse, vTapCoord).rgb;\n  }\n  sampleAccum.rgb /= 13.0;\n  gl_FragColor = sampleAccum;\n}"
  };

  THREE.BokehBlur = {
    uniforms: {
      tColor: {
        type: "t",
        value: 0,
        texture: null
      },
      tDepth: {
        type: "t",
        value: 1,
        texture: null
      },
      focus: {
        type: "f",
        value: 1.0
      },
      aspect: {
        type: "f",
        value: 1.0
      },
      aperture: {
        type: "f",
        value: 0.025
      },
      maxblur: {
        type: "f",
        value: 1.0
      }
    },
    vertexShader: "varying vec2 vUv;\n\nvoid main() {\n\n  vUv = uv;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\n}",
    fragmentShader: "varying vec2 vUv;\n\nuniform sampler2D tColor;\nuniform sampler2D tDepth;\n\nuniform float maxblur;\nuniform float aperture;\n\nuniform float focus;\nuniform float aspect;\n\nvoid main() {\n\n  vec2 aspectcorrect = vec2( 1.0, aspect );\n\n  vec4 depth1 = texture2D( tDepth, vUv );\n\n  float factor = depth1.x - focus;\n\n  vec2 dofblur = vec2 ( clamp( factor * aperture, -maxblur, maxblur ) );\n\n  vec2 dofblur9 = dofblur * 0.9;\n  vec2 dofblur7 = dofblur * 0.7;\n  vec2 dofblur4 = dofblur * 0.4;\n\n  vec4 col = vec4( 0.0 );\n\n  col += texture2D( tColor, vUv.xy );\n  col += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur );\n  col += texture2D( tColor, vUv.xy + ( vec2(  0.15,  0.37 ) * aspectcorrect ) * dofblur );\n  col += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur );\n  col += texture2D( tColor, vUv.xy + ( vec2( -0.37,  0.15 ) * aspectcorrect ) * dofblur );\n  col += texture2D( tColor, vUv.xy + ( vec2(  0.40,  0.0  ) * aspectcorrect ) * dofblur );\n  col += texture2D( tColor, vUv.xy + ( vec2(  0.37, -0.15 ) * aspectcorrect ) * dofblur );\n  col += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur );\n  col += texture2D( tColor, vUv.xy + ( vec2( -0.15, -0.37 ) * aspectcorrect ) * dofblur );\n  col += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur );\n  col += texture2D( tColor, vUv.xy + ( vec2( -0.15,  0.37 ) * aspectcorrect ) * dofblur );\n  col += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur );\n  col += texture2D( tColor, vUv.xy + ( vec2(  0.37,  0.15 ) * aspectcorrect ) * dofblur );\n  col += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur );\n  col += texture2D( tColor, vUv.xy + ( vec2( -0.37, -0.15 ) * aspectcorrect ) * dofblur );\n  col += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur );\n  col += texture2D( tColor, vUv.xy + ( vec2(  0.15, -0.37 ) * aspectcorrect ) * dofblur );\n\n  col += texture2D( tColor, vUv.xy + ( vec2(  0.15,  0.37 ) * aspectcorrect ) * dofblur9 );\n  col += texture2D( tColor, vUv.xy + ( vec2( -0.37,  0.15 ) * aspectcorrect ) * dofblur9 );\n  col += texture2D( tColor, vUv.xy + ( vec2(  0.37, -0.15 ) * aspectcorrect ) * dofblur9 );\n  col += texture2D( tColor, vUv.xy + ( vec2( -0.15, -0.37 ) * aspectcorrect ) * dofblur9 );\n  col += texture2D( tColor, vUv.xy + ( vec2( -0.15,  0.37 ) * aspectcorrect ) * dofblur9 );\n  col += texture2D( tColor, vUv.xy + ( vec2(  0.37,  0.15 ) * aspectcorrect ) * dofblur9 );\n  col += texture2D( tColor, vUv.xy + ( vec2( -0.37, -0.15 ) * aspectcorrect ) * dofblur9 );\n  col += texture2D( tColor, vUv.xy + ( vec2(  0.15, -0.37 ) * aspectcorrect ) * dofblur9 );\n\n  col += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur7 );\n  col += texture2D( tColor, vUv.xy + ( vec2(  0.40,  0.0  ) * aspectcorrect ) * dofblur7 );\n  col += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur7 );\n  col += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur7 );\n  col += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur7 );\n  col += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur7 );\n  col += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur7 );\n  col += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur7 );\n\n  col += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur4 );\n  col += texture2D( tColor, vUv.xy + ( vec2(  0.4,   0.0  ) * aspectcorrect ) * dofblur4 );\n  col += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur4 );\n  col += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur4 );\n  col += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur4 );\n  col += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur4 );\n  col += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur4 );\n  col += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur4 );\n\n  gl_FragColor = col / 41.0;\n  gl_FragColor.a = 1.0;\n}"
  };

}).call(this);
