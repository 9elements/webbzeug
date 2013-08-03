window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Directional = class DirectionalAction extends Webbzeug.Action
  type: 'directional'
  name: 'Directional'
  availableParameters: ->
    {
      strength: { name: 'Strength', type: 'integer', default: 1, min: 1 , max: 30, scrollPrecision: 1 },
      type: { name: 'Type', type: 'enum', values: { gauss: 'Gauss', triangle: 'Triangle'}, default: 'gauss' }
      direction: { name: "Direction", type: 'enum', values: { vertical: 'Vertical', horizontal: 'Horizontal'}, default: 'horizontal' }
  }

  validations: (contexts) ->
    warnings = []
    errors   = []
    if contexts.length > 1
      warnings.push 'Blur will only use the first input.'
    if contexts.length < 1
      errors.push 'Blur needs exactly 1 input.'

    return { errors: errors, warnings: warnings }


  renderTriangle: (inputs) ->
    strength = parseInt @getParameter('strength')
    if @getParameter('direction') is 'vertical'
      @renderVerticalTrianglePass inputs[0]
    else
      @renderHorizontalTrianglePass inputs[0]

  renderHorizontalTrianglePass: (input) ->
    strength = parseInt @getParameter('strength')
    if not @horizonalTriangleBlurMaterial?
      @horizonalTriangleBlurMaterial = new THREE.ShaderMaterial (THREE.TriangleBlurH)
    @screenAlignedQuadMesh.material = @horizonalTriangleBlurMaterial
    @horizonalTriangleBlurMaterial.uniforms['tDiffuse'].value = input
    @horizonalTriangleBlurMaterial.uniforms['delta'].value = new THREE.Vector2(strength/ 256.0, 0)
    @app.renderer.render @renderToTextureScene , @app.renderToTextureCamera, @renderTarget, true

  renderVerticalTrianglePass:  (input)->
    strength = parseInt @getParameter('strength')
    if not @verticalTriangleBlurMaterial?
      @verticalTriangleBlurMaterial = new THREE.ShaderMaterial (THREE.TriangleBlurV)
    @screenAlignedQuadMesh.material = @verticalTriangleBlurMaterial
    @verticalTriangleBlurMaterial.uniforms['tDiffuse'].value = input
    @verticalTriangleBlurMaterial.uniforms['delta'].value = new THREE.Vector2(0, strength / 256.0)
    @app.renderer.render @renderToTextureScene , @app.renderToTextureCamera, @renderTarget, true


  renderGauss: (inputs) ->
    @copyInputToRenderTarget inputs[0]

    strength = parseInt @getParameter('strength')
    renderToTarget = false
    for i in [0...strength]
      if @getParameter('direction') is 'vertical'
        @renderVerticalGaussPass renderToTarget
      else
        @renderHorizontalGaussPass renderToTarget
      renderTarget = !renderTarget

  renderHorizontalGaussPass: (renderToTarget) ->
    @createTempTarget()
    @source = @renderTarget
    @destination = @tempTarget

    if renderToTarget
      @source = @tempTarget
      @destination = @renderTarget


    if not @horizonalGaussBlurMaterial?
      @horizonalGaussBlurMaterial = new THREE.ShaderMaterial (THREE.HorizontalGaussianShader)
    @screenAlignedQuadMesh.material = @horizonalGaussBlurMaterial
    @horizonalGaussBlurMaterial.uniforms['tDiffuse'].value = @renderTarget
    @horizonalGaussBlurMaterial.uniforms['h'].value = 1.0 / 256.0
    @app.renderer.render @renderToTextureScene , @app.renderToTextureCamera, @tempTarget, true

  renderVerticalGaussPass: (renderToTarget) ->
    @createTempTarget()

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

