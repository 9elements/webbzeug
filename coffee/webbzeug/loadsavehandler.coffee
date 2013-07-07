window.Webbzeug ?= {}
window.Webbzeug.LoadSaveHandler = class LoadSaveHandler
  constructor: (@app, saveLink, loadInput, exportLink) ->
    @pngExporter = new Webbzeug.PNGExporter
    @exporter = new Webbzeug.Exporter
    @importer = new Webbzeug.Importer @app
    @jsonExporter = new Webbzeug.JSONExporter
    @jsonImporter = new Webbzeug.JSONImporter @app

    saveLink.click =>
      if filename = prompt('Please enter a filename:', 'workspace.webb')

        unless filename.match /\.webb$/i
          filename = filename + '.webb'
        @jsonExporter.exportJSON filename, @app.actions

    exportLink.click =>
      if filename = prompt('Please enter a filename:', 'workspace.png')
        unless filename.match /\.png$/i
          filename = filename + '.png'
        @pngExporter.exportPNG filename

    loadInput.change (evt) =>
      evt.stopPropagation()
      evt.preventDefault()

      file = evt.target.files[0]

      reader = new FileReader()
      reader.onload = ((theFile) =>
        return (e) =>
          data = e.target.result

          @app.reset()
          @jsonImporter.loadData(data)
      )(file)
      reader.readAsDataURL(file)

  openData: (data) ->
    @app.reset()
    @importer.loadData data