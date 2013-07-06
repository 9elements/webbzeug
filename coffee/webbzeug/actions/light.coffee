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
      lightX: { name: 'Light X', type: 'float', min: -1, max: 1, default: 0.5, scrollPrecision: 0.001 }
      lightY: { name: 'Light Y', type: 'float', min: -1, max: 1, default: 0.5, scrollPrecision: 0.001 }
      lightZ: { name: 'Light Z', type: 'float', min: -1, max: 1, default: 0.5, scrollPrecision: 0.001 }
      power: { name: 'Power', type: 'integer', min: 0.1, max: 100, default: 20, scrollPrecision: 1 },
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
    ###
    x = parseInt @getParameter('contrast')
    x /= 255.0
    x *= 2.0
    @directLightMaterial.uniforms['contrast'].value = x

    x = parseInt @getParameter('brightness')
    x /= 255.0
    x *= 2.0
    @directLightMaterial.uniforms['brightness'].value = x

    x = parseInt @getParameter('saturation')
    x /= 255.0
    x *= 2.0
    @directLightMaterial.uniforms['saturation'].value = x
    ###

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
