window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Pixels = class PixelsAction extends Webbzeug.Action
  render: (contexts) ->
    super()

    # How to copy the image data from one context to another
    imageData = @context.getImageData 0, 0, @app.getWidth(), @app.getHeight()
    # @context.putImageData imageData, 0, 0

    # Pixel manipulation
    
    # imageData = @context.getImageData 0, 0, @app.getWidth(), @app.getHeight()
    # imageData.data[1] = 255
    # imageData.data[2] = 255

    # @context.putImageData imageData, 0, 0 

    for i in [0...imageData.data.length / 4]
      rand = Math.random()
      rand = rand * 255
      index = (i << 2)
      imageData.data[index] = rand
      imageData.data[index + 1] = rand
      imageData.data[index + 2] = rand
      imageData.data[index + 3] = 255
    @context.putImageData imageData, 0, 0 
    return @context