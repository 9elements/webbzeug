window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.HSCB = class HSCBAction extends Webbzeug.Action
  type: 'hscb'
  availableParameters: ->
    {
      hue: { name: "Hue", type: 'number', min: -180, max: 180, default: 0 },
      saturation: { name: "Saturation", type: 'number', min: -100, max: 100, default: 0 },
      contrast: { name: "Contrast", type: 'number', min: 0, max: 255, default: 127 },
      brightness: { name: "Brightness", type: 'number', min: 0, max: 255, default: 127 }
    }

  validations: (contexts) ->
    warnings = []
    errors   = []
    if contexts.length > 1
      warnings.push 'HSCB will only use the first input.'
    if contexts.length < 1
      errors.push 'HSCB needs exactly 1 input.'
    
    return { errors: errors, warnings: warnings }

  render: (contexts) ->
    super()

    contrast = @getParameter('contrast')
    contrast = contrast / 128
    brightness = @getParameter('brightness') - 127

    imageData = contexts[0].getImageData 0, 0, @app.getWidth(), @app.getHeight()
   
    for i in [0...imageData.data.length / 4]
      index = i << 2

      r = imageData.data[index]
      g = imageData.data[index + 1]
      b = imageData.data[index + 2]

      # Apply hue and saturation
      hsv = @rgb2hsv(r, g, b)
      hsv.h += @getParameter('hue') / 360

      if hsv.h > 360
        hsv.h -= 360
      else if hsv.h < 0
        hsv.h += 360

      hsv.s += @getParameter('saturation') / 100
      hsv.s =  Math.max(0, Math.min(hsv.s, 100))

      rgb = @hsv2rgb(hsv.h, hsv.s, hsv.v)

      imageData.data[index] = rgb.r
      imageData.data[index + 1] = rgb.g
      imageData.data[index + 2] = rgb.b

      for j in [0...3]
        # Contrast
        imageData.data[index + j] = imageData.data[index + j] * contrast

        # Brightness
        imageData.data[index + j] = imageData.data[index + j] + brightness

        imageData.data[index + j] = Math.min(imageData.data[index + j], 255)

    @context.putImageData imageData, 0, 0 
    return @context

  rgb2hsv: (r, g, b) ->
    r = r / 255
    g = g / 255
    b = b / 255

    max = Math.max(r, g, b)
    min = Math.min(r, g, b)

    d = max - min
    v = max
    s = if max == 0 then 0 else d / max

    if d is 0
      h = 0
    else
      switch max
        when r
          h = (g - b) / d + (if g < b then 6 else 0)
        when g
          h = (b - r) / d + 2
        when b
          h = (r - g) / d + 4

      h /= 6

    return { h: h, s: s, v: v }

  hsv2rgb: (h, s, v) ->
    i = Math.floor(h * 6)
    f = h * 6 - i
    p = v * (1 - s)
    q = v * (1 - f * s)
    t = v * ( 1 - (1 - f) * s)

    switch i % 6
      when 0
        r = v
        g = t
        b = p
      when 1
        r = q
        g = v
        b = p
      when 2
        r = p
        g = v
        b = t
      when 3
        r = p
        g = q
        b = v
      when 4
        r = t
        g = p
        b = v
      when 5
        r = v
        g = p
        b = q

    return { r: r * 255, g: g * 255, b: b * 255 }