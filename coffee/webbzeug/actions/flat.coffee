window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Flat = class FlatAction extends Webbzeug.Action
  render: ->
    super()

    @context.fillStyle = 'red'
    @context.fillRect 0, 0, @app.getWidth(), @app.getHeight()

    imageData = @context.getImageData 0, 0, @app.getWidth(), @app.getHeight()

    imageData.data[1] = 255
    imageData.data[2] = 255

    @context.putImageData imageData, 0, 0 

    return @context