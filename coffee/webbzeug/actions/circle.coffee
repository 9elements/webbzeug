window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Circle = class CircleAction extends Webbzeug.Action
  render: (contexts) ->
    super()
    # no children ? -> clear context, otherwise copy what has been rendered so far
    if contexts.length is 0
      @context.fillStyle = 'black'
      @context.fillRect 0, 0, @app.getWidth(), @app.getHeight()
    else
      imageData = contexts[0].getImageData 0, 0, @app.getWidth(), @app.getHeight()
      @context.putImageData imageData, 0, 0
      console.log imageData.data

    @context.beginPath()
    @context.arc 100, 100, 100, 100, 2*Math.PI, false
    @context.stroke()
    @context.strokeStyle = 'rgba(255,40,20,0.7)'
    @context.closePath()
    @context.fillStyle = 'blue'
    @context.fill()
    return @context