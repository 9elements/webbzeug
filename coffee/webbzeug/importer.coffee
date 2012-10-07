window.Webbzeug ?= {}
window.Webbzeug.Importer = class Importer
  debug: true
  constructor: (@app) -> return
  importDataURL: (data) ->
    splitData      = data.split 'base64,'
    b64encodedData = splitData[1]
    @data          = Base64.decode b64encodedData

    @debugPrint @data

    @actions = []

    # Read file identifier
    identifier = @readBytes 2
    if identifier isnt 'WZ'
      alert 'This file is not a webbzeug file! (File identifier not found)'
      return false

    if @debug
      console.log "Parsing file..."

    for i in [3...@data.length]
      byte = @readBytes 1
      if byte is '\x01'
        version = @readBytesUntil '\x02'

        if version > Webbzeug.Utilities.versionToInt(Webbzeug.Version)
          alert 'This file has been created with a newer version of webbzeug! (' + version + ' > ' + Webbzeug.Utilities.versionToInt(Webbzeug.Version)
          return false

        if @debug
          console.log 'File version', version

      if byte is '\x03'
        # new action starts
        @readAction()
        

    return true

  readAction: ->
    type = @readBytesUntil '\x04'

    if @debug
      console.log 'Action type', type

    index = @readData()
    @readBytes 1

    x = @readData()
    @readBytes 1

    y = @readData()
    @readBytes 1

    width = @readData()
    @readBytes 1

    if @debug
      console.log "Action index", index, "x", x, "y", y, "width", width

    el = @app.newActionElement x * @app.gridWidth, y * @app.gridHeight, @app.classMap[type].name, width, @app.classMap[type].type
    action = @app.applyActionToElement type, x, y, width, index, el

    parameterKey = null
    parameterVal = null
    while (byte = @readBytes(1)) isnt '\xff'
      if byte is '\x07'
        parameterKey = @readBytesUntil '\x08'
        parameterVal = @readData()

        if @debug
          console.log "Action parameter", parameterKey, parameterVal

        action.setParameter parameterKey, parameterVal

  readData: ->
    valueType = @readBytes 1
    if valueType is '\xfa'
      # Integer
      val = @readInt()

    if valueType is '\xfb'
      # String
      stringLength = @readInt()
      val = @readBytes stringLength

    if valueType is '\xfd'
      # Float
      stringLength = @readInt()
      val = parseFloat(@readBytes(stringLength, false))

    if valueType is '\xfc'
      # Object (JSON stringified)
      stringLength = @readInt()
      val = JSON.parse(@readBytes(stringLength))

    return val

  readInt: ->
    int = ord(@data[0])
    @data = @data.slice 1
    return int
    
  readBytes: (count, translate=true) ->
    bytes = @data[0...count]
    @data = @data.slice count

    if translate
      bytes = Webbzeug.Utilities.bytesToString bytes

    return bytes

  readBytesUntil: (findChar, eatChar=true) ->
    bytes = ''
    for i in [0...@data.length]
      byte = @data[i]
      unless byte is findChar
        bytes += byte
      else
        break


    @data = @data.slice bytes.length
    if eatChar
      @readBytes 1

    bytes = Webbzeug.Utilities.bytesToString bytes
    return bytes

  debugPrint: (str) ->
    r = ""
    e = str.length
    c = 0
    while c < e
      h = str.charCodeAt(c++).toString(16)
      while(h.length < 2)
        h = "0" + h
      r += " " + h

    console.log str.length, "<Object" + r + ">"