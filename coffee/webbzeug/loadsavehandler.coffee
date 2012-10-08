window.Webbzeug ?= {}
window.Webbzeug.LoadSaveHandler = class LoadSaveHandler
  constructor: (@app, saveLink, loadInput) ->
    @exporter = new Webbzeug.Exporter
    @importer = new Webbzeug.Importer @app
    saveLink.click =>
      if filename = prompt('Please enter a filename:', 'workspace.webb')
        url = @exporter.actionsToDataURL @app.actions
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
  