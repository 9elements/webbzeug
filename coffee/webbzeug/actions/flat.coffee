window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Flat = class FlatAction extends Webbzeug.Action
  type: 'flat'
  availableParameters: ->
    {
      color: { name: 'Color', type: 'color', default: 'rgba(255,0,0,1)' }
    }
  render: (contexts) ->
    super()

    # How to copy the image data from one context to another
    # imageData = context.getImageData 0, 0, @app.getWidth(), @app.getHeight()
    # @context.putImageData imageData, 0, 0

    @context.fillStyle = @getParameter('color')
    @context.fillRect 0, 0, @app.getWidth(), @app.getHeight()

    # Pixel manipulation
    
    # imageData = @context.getImageData 0, 0, @app.getWidth(), @app.getHeight()
    # imageData.data[1] = 255
    # imageData.data[2] = 255

    # @context.putImageData imageData, 0, 0 

    return @context