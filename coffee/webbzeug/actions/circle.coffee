window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Circle = class CircleAction extends Webbzeug.Action
  type: 'circle'
  availableParameters: ->
    {
      x: { name: 'X', type: 'number', min: 0, max: 255, default: 128 },
      y:  { name: 'Y', type: 'number', min: 0, max: 255, default: 128 },
      radiusX:  { name: 'Radius X', type: 'number', min: 0, max: 255, default: 50 },
      color: { name: 'Color', type: 'color', default: 'rgba(255,0,0,1)' }
    }

  validations: (contexts) ->
    warnings = []
    if contexts.length > 1
      warnings.push 'Circle will only use the first input.'
    
    return { warnings: warnings }

  render: (contexts) ->
    super()
    # no children ? -> clear context, otherwise copy what has been rendered so far
    if contexts.length is 0
      @context.fillStyle = 'black'
      @context.fillRect 0, 0, @app.getWidth(), @app.getHeight()
    else
      imageData = contexts[0].getImageData 0, 0, @app.getWidth(), @app.getHeight()
      @context.putImageData imageData, 0, 0

    @context.beginPath()
    @context.arc @getParameter('x'), @getParameter('y'), @getParameter('radiusX'), 0, 2*Math.PI, false
    @context.closePath()
    @context.fillStyle = @getParameter('color')
    @context.fill()
    return @context