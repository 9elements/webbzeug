window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.ContrastBrightness = class ContrastBrightnessAction extends Webbzeug.Action
  type: 'contbri'
  availableParameters: ->
    {
      contrast: { name: "Contrast", type: 'number', min: 0, max: 255, default: 127 },
      brightness: { name: "Brightness", type: 'number', min: 0, max: 255, default: 127 }
    }
  render: (contexts) ->
    super()
    if contexts.length == 0
      console.log "Dude an cont-bri needs an input"
      return

    contrast = @getParameter('contrast')
    contrast = contrast / 128
    brightness = @getParameter('brightness') - 127

    imageData = contexts[0].getImageData 0, 0, @app.getWidth(), @app.getHeight()
   
    for i in [0...imageData.data.length]
      if (i % 4) != 3
        imageData.data[i] = imageData.data[i] * contrast
        imageData.data[i] = imageData.data[i] + brightness
        imageData.data[i] = Math.min(imageData.data[i], 255)

    @context.putImageData imageData, 0, 0 
    return @context