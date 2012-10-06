window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Rectangle = class RectangleAction extends Webbzeug.Action
  render: (contexts) ->
    super()
    # no children ? -> clear context, otherwise copy what has been rendered so far
    if contexts.length is 0
      @context.fillStyle = 'black'
      @context.fillRect 0, 0, @app.getWidth(), @app.getHeight()
    else
      imageData = contexts[0].getImageData 0, 0, @app.getWidth(), @app.getHeight()
      @context.putImageData imageData, 0, 0

    @context.fillStyle = 'white'
    @context.fillRect 0, 0, 100, 100
 
    return @context