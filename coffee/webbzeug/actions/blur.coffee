window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Blur = class BlurAction extends Webbzeug.Action
  type: 'blur'
  name: 'Blur'
  availableParameters: ->
    {
      strength: { name: 'Strength', type: 'integer', default: 1, min: 1 , max: 30, scrollPrecision: 1 },
      type: { name: 'Type', type: 'enum', values: { disc: 'Disc'}, default: 'disc' }
    }

  validations: (contexts) ->
    warnings = []
    errors   = []
    if contexts.length > 1
      warnings.push 'Blur will only use the first input.'
    if contexts.length < 1
      errors.push 'Blur needs exactly 1 input.'

    return { errors: errors, warnings: warnings }

  renderDisc: (inputs) ->
    if not @discBlurMaterial?
      @discBlurMaterial = new THREE.ShaderMaterial (THREE.DiscBlur)
    @screenAlignedQuadMesh.material = @discBlurMaterial
    @discBlurMaterial.uniforms['tDiffuse'].value = inputs[0]

    strength = parseInt @getParameter('strength')

    @discBlurMaterial.uniforms['discRadius'].value = strength * 0.0007
    @app.renderer.render @renderToTextureScene , @app.renderToTextureCamera, @renderTarget, true

  renderGauss: (inputs) ->

  renderHorizontalPass: (inputs) ->
    if not @horizonalGaussBlurMaterial?
      @horizonalGaussBlurMaterial = new THREE.ShaderMaterial (THREE.HorizontalGaussianShader)

  renderVerticalPass: (inputs) ->

  render: (inputs) ->
    super()
    switch @getParameter('type')
      when 'disc'
        @renderDisc inputs

    return @renderTarget

