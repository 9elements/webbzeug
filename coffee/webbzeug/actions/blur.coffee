window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Blur = class BlurAction extends Webbzeug.Action
  type: 'blur'
  name: 'Blur'
  availableParameters: ->
    {
      strength: { name: 'Strength', type: 'integer', default: 1, min: 1 , max: 30, scrollPrecision: 1 },
      type: { name: 'Type', type: 'enum', values: { disc: 'Disc',gauss: 'Gauss', triangle: 'Triangle'}, default: 'disc' }
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

  renderTriangle: (inputs) ->
    @copyInputToRenderTarget inputs[0]

    strength = parseInt @getParameter('strength')
    #for i in [0...strength]
    @renderHorizontalTrianglePass()
    @renderVerticalTrianglePass()

  renderHorizontalTrianglePass: (input) ->
    @createTempTarget()
    strength = parseInt @getParameter('strength')
    if not @horizonalTriangleBlurMaterial?
      @horizonalTriangleBlurMaterial = new THREE.ShaderMaterial (THREE.TriangleBlurH)
    @screenAlignedQuadMesh.material = @horizonalTriangleBlurMaterial
    @horizonalTriangleBlurMaterial.uniforms['tDiffuse'].value = @renderTarget
    @horizonalTriangleBlurMaterial.uniforms['delta'].value = new THREE.Vector2(strength/ 256.0, 0)
    @app.renderer.render @renderToTextureScene , @app.renderToTextureCamera, @tempTarget, true

  renderVerticalTrianglePass: ->
    strength = parseInt @getParameter('strength')
    if not @verticalTriangleBlurMaterial?
      @verticalTriangleBlurMaterial = new THREE.ShaderMaterial (THREE.TriangleBlurV)
    @screenAlignedQuadMesh.material = @verticalTriangleBlurMaterial
    @verticalTriangleBlurMaterial.uniforms['tDiffuse'].value = @tempTarget
    @verticalTriangleBlurMaterial.uniforms['delta'].value = new THREE.Vector2(0, strength / 256.0)
    @app.renderer.render @renderToTextureScene , @app.renderToTextureCamera, @renderTarget, true


  renderGauss: (inputs) ->
    @copyInputToRenderTarget inputs[0]

    strength = parseInt @getParameter('strength')
    for i in [0...strength]
      @renderHorizontalGaussPass()
      @renderVerticalGaussPass()

  renderHorizontalGaussPass: (input) ->
    @createTempTarget()

    if not @horizonalGaussBlurMaterial?
      @horizonalGaussBlurMaterial = new THREE.ShaderMaterial (THREE.HorizontalGaussianShader)
    @screenAlignedQuadMesh.material = @horizonalGaussBlurMaterial
    @horizonalGaussBlurMaterial.uniforms['tDiffuse'].value = @renderTarget
    @horizonalGaussBlurMaterial.uniforms['h'].value = 1.0 / 256.0
    @app.renderer.render @renderToTextureScene , @app.renderToTextureCamera, @tempTarget, true

  renderVerticalGaussPass: ->
    if not @verticalGaussBlurMaterial?
      @verticalGaussBlurMaterial = new THREE.ShaderMaterial (THREE.VerticalGaussianShader)
    @screenAlignedQuadMesh.material = @verticalGaussBlurMaterial
    @verticalGaussBlurMaterial.uniforms['tDiffuse'].value = @tempTarget
    @verticalGaussBlurMaterial.uniforms['v'].value = 1.0 / 256.0
    @app.renderer.render @renderToTextureScene , @app.renderToTextureCamera, @renderTarget, true

  copyInputToRenderTarget: (input) ->
    if not @copyMaterial?
      @copyMaterial = new THREE.ShaderMaterial (THREE.CopyShader)
    @screenAlignedQuadMesh.material = @copyMaterial
    @copyMaterial.uniforms['tDiffuse'].value = input
    @app.renderer.render @renderToTextureScene , @app.renderToTextureCamera, @renderTarget, true

  render: (inputs) ->
    super()
    switch @getParameter('type')
      when 'disc'
        @renderDisc inputs
      when 'gauss'
        @renderGauss inputs
      when 'triangle'
        @renderTriangle inputs

    return @renderTarget

