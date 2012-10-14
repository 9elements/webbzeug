window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Glowrect = class GlowrectAction extends Webbzeug.Action
  type: 'glowrect'
  name: 'GlowRect'
  availableParameters: ->
    {
      centerX: { name: 'Center X', type: 'integer', min: 0, max: 255, default: 128, scrollPrecision: 1 },
      centerY: { name: 'Center Y', type: 'integer', min: 0, max: 255, default: 128, scrollPrecision: 1 },
      radius: { name: 'Radius', type: 'integer', min: 0, max: 255, default: 30, scrollPrecision: 1 },
      # radiusX: { name: 'Radius X', type: 'integer', min: 0, max: 255, default: 10, scrollPrecision: 1 },
      # radiusY: { name: 'Radius Y', type: 'integer', min: 0, max: 255, default: 10, scrollPrecision: 1 },
      width:  { name: 'Width', type: 'integer', min: 0, max: 255, default: 0, scrollPrecision: 1 },
      height:  { name: 'Height', type: 'integer', min: 0, max: 255, default: 0, scrollPrecision: 1 }

      # power: { name: 'Power', type: 'float', min: 0, max: 1, default: 0.5, scrollPrecision: 0.001 },

      color: { name: 'Color', type: 'color', default: 'rgba(255,255,255,1)' }
    }

  validations: (contexts) ->
    warnings = []
    if contexts.length > 1
      warnings.push 'GlowRect will only use the first input.'
  
    return { warnings: warnings }

  render: (contexts) ->
    super()

    centerX = parseInt(@getParameter('centerX'))
    centerY = parseInt(@getParameter('centerY'))
    # radiusX = parseInt(@getParameter('radiusX'))
    # radiusY = parseInt(@getParameter('radiusY'))
    radius = parseInt(@getParameter('radius'))
    width = parseInt(@getParameter('width'))
    height = parseInt(@getParameter('height'))
    # power = parseFloat(@getParameter('power'))

    colorRGB = Webbzeug.Utilities.getRgb2 @getParameter('color')

    @copyRendered contexts

    w = @app.getWidth()
    h = @app.getHeight()

    imageData = @context.getImageData 0, 0, w, h

    for x in [0...w]
      for y in [0...h]
        index = ((y * w) + x) << 2

        ###
          SEGMENTS:

          0 | 1 | 2
          ---------
          3 | 4 | 5
          ---------
          6 | 7 | 8
        ###

        # seg 0
        if (x < centerX - width / 2 and y < centerY - height / 2)
          distX = centerX - width / 2 - x
          distY = centerY - height / 2 - y
          dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2))
        # seg 2
        else if (x > centerX + width / 2 and y < centerY - height / 2)
          distX = centerX + width / 2 - x
          distY = centerY - height / 2 - y
          dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2))
        # seg 8
        else if (x > centerX + width / 2 and y > centerY + height / 2)
          distX = centerX + width / 2 - x
          distY = centerY + height / 2 - y
          dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2))
        # seg 6
        else if (x < centerX - width / 2 and y > centerY + height / 2)
          distX = centerX - width / 2 - x
          distY = centerY + height / 2 - y
          dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2))

        # seg 3 
        else if (x < centerX - width / 2)
          distX = dist = centerX - width / 2 - x
          distY = 0
        # seg 5
        else if (x > centerX + width / 2)
          distX = dist = x - (centerX + width / 2)
          distY = 0
        # seg 1
        else if (y < centerY - height / 2)
          distY = dist = centerY - height / 2 - y
          distX = 0
        # seg 7
        else if (y > centerY + height / 2)
          distY = dist = y - (centerY + height / 2)
          distX = 0

        # seg 4 (center)
        else
          distX = distY = dist = 0

        value = 255 - (dist / radius * 255)

        imageData.data[index] = colorRGB[0] / 255 * value
        imageData.data[index + 1] = colorRGB[1] / 255 * value
        imageData.data[index + 2] = colorRGB[2] / 255 * value
        imageData.data[index + 3] = 255

    @context.putImageData imageData, 0, 0
 
    return @context