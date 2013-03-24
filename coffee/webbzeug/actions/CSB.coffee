window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.CSB = class NormalAction extends Webbzeug.Action
  type: 'csb'
  name: 'CSB'

  availableParameters: ->
    {
      contrast: { name: 'Contrast', type: 'integer', min: 0, max: 255, default:   127, scrollPrecision: 1 }
      brightness: { name: 'Brightness', type: 'integer', min: 0, max: 255, default:   127, scrollPrecision: 1 }
      saturation: { name: 'Saturation', type: 'integer', min: 0, max: 255, default:   127, scrollPrecision: 1 }
    }

  validations: (contexts) ->
    errors = []
    warnings = []
    if contexts.length > 1
      warnings.push 'CSB will only use one input.'
    if contexts.length < 1
      errors.push 'CSB needs one input.'

    return { errors: errors, warnings: warnings }

  setUniforms: ->
    x = parseInt @getParameter('contrast')
    x /= 255.0
    x *= 2.0
    @distortMaterial.uniforms['contrast'].value = x

    x = parseInt @getParameter('brightness')
    x /= 255.0
    x *= 2.0
    @distortMaterial.uniforms['brightness'].value = x

    x = parseInt @getParameter('saturation')
    x /= 255.0
    x *= 2.0
    @distortMaterial.uniforms['saturation'].value = x

  render: (inputs) ->
    super()
    if @screenAlignedQuadMesh.material is null
      @distortMaterial = new THREE.ShaderMaterial (THREE.CSBShader)
      @screenAlignedQuadMesh.material = @distortMaterial

    @distortMaterial.uniforms['input1'].value = inputs[0]
    @setUniforms()

    @app.renderer.render @renderToTextureScene , @app.renderToTextureCamera, @renderTarget, true
    return @renderTarget
