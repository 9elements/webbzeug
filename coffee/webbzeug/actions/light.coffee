window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Light = class LightAction extends Webbzeug.Action
  type: 'light'
  name: 'Light'
  availableParameters: ->
    {
      ###
      eyeX: { name: 'Eye X', type: 'float', min: -1, max: 1, default: 0.5, scrollPrecision: 0.001 },
      eyeY: { name: 'Eye Y', type: 'float', min: -1, max: 1, default: 0.5, scrollPrecision: 0.001 }
      eyeZ: { name: 'Eye Z', type: 'float', min: -1, max: 1, default: 0.5, scrollPrecision: 0.001 }
      ###
      lightX: { name: 'Light X', type: 'float', min: -300, max: 300, default: 100, scrollPrecision: 1 }
      lightY: { name: 'Light Y', type: 'float', min: -300, max: 300, default: 100, scrollPrecision: 1 }
      lightZ: { name: 'Light Z', type: 'float', min: 0, max: 300, default: 200, scrollPrecision: 1 }
      power: { name: 'Power', type: 'integer', min: 1, max: 200, default: 60, scrollPrecision: 1 },
      diffuseColor: { name: 'Diffuse', type: 'color', default: '#000000' },
      reflectionColor: { name: 'Reflection', type: 'color', default: '#000000' }
    }

  magnitude: (x, y, z) ->
    x *= x
    y *= y
    z *= z
    len = x + y + z
    return Math.sqrt ( len )

  normalize: (v) ->
    mag = @magnitude(v.x, v.y, v.z)
    return {
      x: v.x / mag,
      y: v.y / mag,
      z: v.z / mag
    }

  dot: (v1, v2) ->
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z

  validations: (contexts) ->
    errors = []
    warnings = []
    if contexts.length < 2
      errors.push 'Light needs exactly 2 inputs.'
    if contexts.length > 2
      warnings.push 'Light will only use the first 2 inputs.'

    return { errors: errors, warnings: warnings }

  setUniforms: ->

    x = parseInt @getParameter('power')
    @directLightMaterial.uniforms['specularPower'].value = x / 10

    x = parseInt @getParameter('lightX') * 10
    y = parseInt @getParameter('lightY') * 10
    z = parseInt @getParameter('lightZ') * 10
    @directLightMaterial.uniforms['vLightPosition'].value = new THREE.Vector3(x,y,z)

    colorRGB = Webbzeug.Utilities.getRgb2 @getParameter('diffuseColor')
    @directLightMaterial.uniforms[ "diffuseR" ].value = colorRGB[0] / 255.0
    @directLightMaterial.uniforms[ "diffuseG" ].value = colorRGB[1] / 255.0
    @directLightMaterial.uniforms[ "diffuseB" ].value = colorRGB[2] / 255.0

    colorRGB = Webbzeug.Utilities.getRgb2 @getParameter('reflectionColor')
    @directLightMaterial.uniforms[ "specularR" ].value = colorRGB[0] / 255.0
    @directLightMaterial.uniforms[ "specularG" ].value = colorRGB[1] / 255.0
    @directLightMaterial.uniforms[ "specularB" ].value = colorRGB[2] / 255.0

  render: (inputs) ->
    super()
    if @screenAlignedQuadMesh.material is null
      @directLightMaterial = new THREE.ShaderMaterial (THREE.DirectionalLightShader)
      @screenAlignedQuadMesh.material = @directLightMaterial

    @directLightMaterial.uniforms['baseMap'].value = inputs[0]
    @directLightMaterial.uniforms['bumpMap'].value = inputs[1]
    @setUniforms()

    @app.renderer.render @renderToTextureScene , @app.renderToTextureCamera, @renderTarget, true
    return @renderTarget
