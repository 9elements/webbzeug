window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Rectangle = class RectangleAction extends Webbzeug.Action
  type: 'rectangle'
  name: 'Rect'
  availableParameters: ->
    {
      x: { name: 'X', type: 'integer', min: 0, max: 256, default: 64, scrollPrecision: 1 },
      y:  { name: 'Y', type: 'integer', min: 0, max: 256, default: 64, scrollPrecision: 1 },
      width:  { name: 'Width', type: 'integer', min: 0, max: 256, default: 128, scrollPrecision: 1 },
      height:  { name: 'Height', type: 'integer', min: 0, max: 256, default: 128, scrollPrecision: 1 }
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

    console.log "rendering", x, y, w, h

    @copyRendered contexts

    @context.fillStyle = @getParameter('color')
    @context.fillRect x, y, w, h
 
    return @context