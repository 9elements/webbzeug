(function() {
  var LoadSaveHandler, _ref;

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  window.Webbzeug.LoadSaveHandler = LoadSaveHandler = (function() {

    function LoadSaveHandler(app, saveLink, loadInput, exportLink) {
      var _this = this;
      this.app = app;
      this.pngExporter = new Webbzeug.PNGExporter;
      this.exporter = new Webbzeug.Exporter;
      this.importer = new Webbzeug.Importer(this.app);
      this.jsonExporter = new Webbzeug.JSONExporter;
      this.jsonImporter = new Webbzeug.JSONImporter(this.app);
      saveLink.click(function() {
        var filename;
        if (filename = prompt('Please enter a filename:', 'workspace.webb')) {
          if (!filename.match(/\.webb$/i)) {
            filename = filename + '.webb';
          }
          return _this.jsonExporter.exportJSON(filename, _this.app.actions);
        }
      });
      exportLink.click(function() {
        var filename;
        if (filename = prompt('Please enter a filename:', 'workspace.png')) {
          if (!filename.match(/\.png$/i)) {
            filename = filename + '.png';
          }
          return _this.pngExporter.exportPNG(filename);
        }
      });
      loadInput.change(function(evt) {
        var file, reader;
        evt.stopPropagation();
        evt.preventDefault();
        file = evt.target.files[0];
        reader = new FileReader();
        reader.onload = (function(theFile) {
          return function(e) {
            var data;
            data = e.target.result;
            _this.app.reset();
            return _this.jsonImporter.loadData(data);
          };
        })(file);
        return reader.readAsDataURL(file);
      });
    }

    LoadSaveHandler.prototype.openData = function(data) {
      this.app.reset();
      return this.importer.loadData(data);
    };

    return LoadSaveHandler;

  })();

}).call(this);
