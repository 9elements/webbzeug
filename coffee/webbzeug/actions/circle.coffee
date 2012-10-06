window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Circle = class CircleAction extends Webbzeug.Action
  availableParameters: ->
    {
      x: { name: 'X', type: 'number', min: 0, max: 255, default: 0 },
      y:  { name: 'Y', type: 'number', min: 0, max: 255, default: 0 },
      radiusX:  { name: 'Radius X', type: 'number', min: 0, max: 255, default: 10 },
      color: { name: 'Color', type: 'color', default: 'rgba(0,0,0,0)' }
    }
  
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