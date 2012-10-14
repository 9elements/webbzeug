window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Circle = class CircleAction extends Webbzeug.Action
  type: 'circle'
  name: 'Circle'
  availableParameters: ->
    {
      x: { name: 'X', type: 'integer', min: 0, max: 255, default: 128, scrollPrecision: 1 },
      y:  { name: 'Y', type: 'integer', min: 0, max: 255, default: 128, scrollPrecision: 1 },
      radiusX:  { name: 'Radius X', type: 'integer', min: 0, max: 255, default: 50, scrollPrecision: 1 },
      color: { name: 'Color', type: 'color', default: 'rgba(255,0,0,1)' }
    }

  validations: (contexts) ->
    warnings = []
    if contexts.length > 1
      warnings.push 'Circle will only use the first input.'
    
    return { warnings: warnings }

  render: (contexts) ->
    super()
    @copyRendered contexts

    @context.beginPath()
    @context.arc @getParameter('x'), @getParameter('y'), @getParameter('radiusX'), 0, 2*Math.PI, false
    @context.closePath()
    @context.fillStyle = @getParameter('color')
    @context.fill()
    return @context