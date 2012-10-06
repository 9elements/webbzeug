window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Rectangle = class RectangleAction extends Webbzeug.Action
  availableParameters: ->
    {
      x: { name: 'X', type: 'number', min: 0, max: 255, default: 0 },
      y:  { name: 'Y', type: 'number', min: 0, max: 255, default: 0 },
      width:  { name: 'Width', type: 'number', min: 0, max: 255, default: 50 },
      height:  { name: 'Height', type: 'number', min: 0, max: 255, default: 50 }
      color: { name: 'Color', type: 'color', default: 'rgba(255,255,255,1)' }
    }

  render: (contexts) ->
    super()

    x = @getParameter('x')
    y = @getParameter('y')
    w = @getParameter('width')
    h = @getParameter('height')

    # no children ? -> clear context, otherwise copy what has been rendered so far
    if contexts.length is 0
      @context.fillStyle = 'black'
      @context.fillRect 0, 0, @app.getWidth(), @app.getHeight()
    else 
      imageData = contexts[0].getImageData 0, 0, @app.getWidth(), @app.getHeight()
      @context.putImageData imageData, 0, 0

    @context.fillStyle = @getParameter('color')
    @context.fillRect x, y, w, h
 
    return @context