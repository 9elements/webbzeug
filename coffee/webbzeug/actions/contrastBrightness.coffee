window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.ContrastBrightness = class NormalAction extends Webbzeug.Action
  type: 'contrastBrightness'
  name: 'Cont/Bri'

  availableParameters: ->
    {
      contrast: { name: 'Contrast', type: 'integer', min: 0, max: 255, default:   127, scrollPrecision: 1 }
      brightness: { name: 'Brightness', type: 'integer', min: 0, max: 255, default:   127, scrollPrecision: 1 }
    }

  validations: (contexts) ->
    errors = []
    warnings = []
    if contexts.length > 1
      warnings.push 'ContrastBrightness will only use one input.'
    if contexts.length < 1
      errors.push 'ContrastBrightness needs one input.'

    return { errors: errors, warnings: warnings }

  setUniforms: ->
    x = parseInt @getParameter('contrast')
    x /= 127.0
    @distortMaterial.uniforms['contrast'].value = x

    x = parseInt @getParameter('brightness') - 127.0
    @distortMaterial.uniforms['brightness'].value = x / 255.0

  render: (inputs) ->
    super()
    if @screenAlignedQuadMesh.material is null
      @distortMaterial = new THREE.ShaderMaterial (THREE.ContrastBrightnessShader)
      @screenAlignedQuadMesh.material = @distortMaterial

    @distortMaterial.uniforms['input1'].value = inputs[0]
    @setUniforms()

    @app.renderer.render @renderToTextureScene , @app.renderToTextureCamera, @renderTarget, true
    return @renderTarget
