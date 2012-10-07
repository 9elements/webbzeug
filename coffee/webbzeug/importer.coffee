window.Webbzeug ?= {}
window.Webbzeug.Importer = class Importer
  dataURLToActions: (data) ->
    splitData      = data.split 'base64,'
    b64encodedData = splitData[1]
    @data          = Base64.decode b64encodedData

    # Read file identifier
    identifier = @readBytes 2
    if identifier isnt 'WZ'
      alert 'This file is not a webbzeug file! (File identifier not found)'
      return false

    for i in [3...@data.length]
      byte = @readBytes 1
      if byte is '\x01'
        version = @readBytesUntil '\x02'

        console.log "version:", version
        

    return true
    
  readBytes: (count) ->
    bytes = @data[0...count]
    @data = @data.slice count

    return bytes

  readBytesUntil: (findChar) ->
    bytes = ''
    for i in [0...@data.length]
      byte = @data[i]
      unless byte is findChar
        bytes += byte

    return bytes