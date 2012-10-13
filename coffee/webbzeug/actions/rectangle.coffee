window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Rectangle = class RectangleAction extends Webbzeug.Action
  type: 'rectangle'
  availableParameters: ->
    {
      x: { name: 'X', type: 'number', min: 0, max: 255, default: 64 },
      y:  { name: 'Y', type: 'number', min: 0, max: 255, default: 64 },
      width:  { name: 'Width', type: 'number', min: 0, max: 255, default: 128 },
      height:  { name: 'Height', type: 'number', min: 0, max: 255, default: 128 }
      color: { name: 'Color', type: 'color', default: 'rgba(255,255,255,1)' }
    }

  validations: (contexts) ->
    warnings = []
    if contexts.length > 1
      warnings.push 'Rectangle will only use the first input.'
  
    return { warnings: warnings }

  render: (contexts) ->
    super()

    x = @getParameter('x')
    y = @getParameter('y')
    w = @getParameter('width')
    h = @getParameter('height')

    @copyRendered contexts

    @context.fillStyle = @getParameter('color')
    @context.fillRect x, y, w, h
 
    return @context