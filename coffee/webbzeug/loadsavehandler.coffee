window.Webbzeug ?= {}
window.Webbzeug.LoadSaveHandler = class LoadSaveHandler
  constructor: (@app, saveLink, loadInput, exportLink) ->
    @exporter = new Webbzeug.Exporter
    @importer = new Webbzeug.Importer @app
    saveLink.click =>
      if filename = prompt('Please enter a filename:', 'workspace.webb')

        unless filename.match /\.webb$/i
          filename = filename + '.webb'

        url = @exporter.actionsToDataURL @app.actions
        if url?
          downloadDataURI
            filename: filename
            data: url

    exportLink.click =>
      if filename = prompt('Please enter a filename:', 'workspace.png')

        unless filename.match /\.png$/i
          filename = filename + '.png'

        url = @exporter.renderedToDataURL()
        if url?
          downloadDataURI
            filename: filename
            data: url

    loadInput.change (evt) =>
      evt.stopPropagation()
      evt.preventDefault()

      file = evt.target.files[0]

      reader = new FileReader()
      reader.onload = ((theFile) =>
        return (e) =>
          data = e.target.result

          @app.reset()
          @importer.importDataURL(data)
      )(file)
      reader.readAsDataURL(file)
  
  openData: (data) ->
    @importer.loadData data