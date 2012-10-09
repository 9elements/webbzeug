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

    for y in [0...h]
      for x in [0...w]
        index = ((y * w) << 2) + (x << 2)

        cellX = Math.floor(x / gridW)
        cellY = Math.floor(y / gridH)

        maxDist = Math.sqrt(Math.pow(gridW,2) + Math.pow(gridH,2)) * 2
        minDist = maxDist

        for gx in [(cellX - 2)...(cellX + 2)]
          for gy in [(cellY - 2)...(cellY + 2)]
            # Tiling
            if gy < 0 then gy = @gridY + gy
            if gy >= @gridY then gy = Math.abs(@gridY - gy)
            if gx < 0 then gx = @gridX + gx
            if gx >= @gridX then gx = Math.abs(@gridX - gx)

            point = points[gx][gy]
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

    @context.putImageData imageData, 0, 0 
    return @context

  generatePoints: ->
    w = @app.getWidth()
    h = @app.getHeight()

    gridW = @app.getWidth() / @gridX
    gridH = @app.getHeight() / @gridY

    points = []
    for x in [0...@gridX]
      pointsCol = []
      for y in [0...@gridY]
        pointsCol.push { x: Math.ceil(x * gridW + Math.random() * gridW), y: Math.ceil(y * gridH + Math.random() * gridH) }
        # points.push { x: x * gridW + gridW, y: y * gridH + gridH / 3 }

      points.push pointsCol

    console.log points

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