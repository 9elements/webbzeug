`var CustomRandom = function(nseed) {

    var seed,
        constant = Math.pow(2, 13)+1,
        prime = 37,
        maximum = Math.pow(2, 50);
 
    if (nseed) {
        seed = nseed;
    }
 
    if (seed == null) {
        seed = (new Date()).getTime();
    } 
 
    return {
        next : function() {
            seed *= constant;
            seed += prime;
            seed %= maximum;
            
            return seed;
        }
    }
}`

window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Cell = class CellAction extends Webbzeug.Action
  type: 'cell'
  gridX: 8
  gridY: 8
  render: (contexts) ->
    super()
    imageData = @context.getImageData 0, 0, @app.getWidth(), @app.getHeight()

    points = @generatePoints()

    # DEBUG
    #
    

    gridW = @app.getWidth() / @gridX
    gridH = @app.getHeight() / @gridY

    w = @app.getWidth()
    h = @app.getHeight()

    for x in [0...w]
      for y in [0...h]
        index = ((y * w) << 2) + (x << 2)

        cellX = Math.floor(x / gridW)
        cellY = Math.floor(y / gridH)

        minDist = 255
        maxDist = Math.sqrt(Math.pow(@gridX,2) + Math.pow(@gridY,2))

        for gx in [(cellX - 1)...(cellX + 1)]
          for gy in [(cellY - 1)...(cellY + 1)]

            # Tiling
            if gy < 0 then gy = @gridX + gy
            if gx < 0 then gx = @gridY + gx

            point = points[(gy * @gridX) + gx]
            if point
              dist  = Math.sqrt( Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2) )
            else
              dist = 10
            minDist = Math.min(dist, minDist)

        # Normalize minDist
        value = minDist / maxDist * 255

        imageData.data[index] = value
        imageData.data[index + 1] = value
        imageData.data[index + 2] = value
        imageData.data[index + 3] = 255

    for point in points
      imageData.data[((point.y * 256) << 2) + (point.x << 2)] = 255
      imageData.data[((point.y * 256) << 2) + (point.x << 2) + 3] = 255


    @context.putImageData imageData, 0, 0 
    return @context

  generatePoints: ->
    w = @app.getWidth()
    h = @app.getHeight()

    gridW = @app.getWidth() / @gridX
    gridH = @app.getHeight() / @gridY

    points = []
    for x in [0...@gridX]
      for y in [0...@gridY]
        points.push { x: Math.round(x * gridW + Math.random() * gridW), y: Math.round(y * gridH + Math.random() * gridH) }

    console.log points.length

    return points

###
  OLD APPROACH
###
###
  w = @app.getWidth()
  h = @app.getHeight()

  smallestDistances = []
  maxDist = 0
  minDist = 255

  for x in [0...w]
    for y in [0...h]
      index = ((y * w) << 2) + (x << 2)

      smallestDistance = 255
      for point in @points
        dist = Math.sqrt(Math.pow( (x - point.x), 2 ) + Math.pow( (y - point.y), 2 ))
        smallestDistance = Math.min(dist, smallestDistance)
      maxDist = Math.max(maxDist, smallestDistance)
      minDist = Math.min(minDist, smallestDistance)
      smallestDistances.push smallestDistance

  dDist = maxDist - minDist
  # normalize array
  for distance, i in smallestDistances
    smallestDistances[i] = (distance - minDist) / dDist * 255

  for x in [0...w]
    for y in [0...h]
      pixindex = y * w + x
      value = smallestDistances[pixindex]

      index = ((y * w) << 2) + (x << 2)
      imageData.data[index] = value
      imageData.data[index + 1] = value
      imageData.data[index + 2] = value

      imageData.data[index + 3] = 255
###