window.Webbzeug ?= {}
window.Webbzeug.PNGExporter = class PNGExporter

  exportPNG:(filename) ->
    url = @renderedToDataURL()
    if url?
      downloadDataURI
        filename: filename
        data: url


  renderedToDataURL: -> return $('canvas#canvas').get(0).toDataURL 'image/png'

