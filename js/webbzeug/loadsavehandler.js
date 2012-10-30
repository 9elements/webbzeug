(function() {
  var LoadSaveHandler, _ref;

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  window.Webbzeug.LoadSaveHandler = LoadSaveHandler = (function() {

    function LoadSaveHandler(app, saveLink, loadInput, exportLink) {
      var _this = this;
      this.app = app;
      this.exporter = new Webbzeug.Exporter;
      this.importer = new Webbzeug.Importer(this.app);
      saveLink.click(function() {
        var filename, url;
        if (filename = prompt('Please enter a filename:', 'workspace.webb')) {
          if (!filename.match(/\.webb$/i)) {
            filename = filename + '.webb';
          }
          url = _this.exporter.actionsToDataURL(_this.app.actions);
          if (url != null) {
            return downloadDataURI({
              filename: filename,
              data: url
            });
          }
        }
      });
      exportLink.click(function() {
        var filename, url;
        if (filename = prompt('Please enter a filename:', 'workspace.png')) {
          if (!filename.match(/\.png$/i)) {
            filename = filename + '.png';
          }
          url = _this.exporter.renderedToDataURL();
          if (url != null) {
            return downloadDataURI({
              filename: filename,
              data: url
            });
          }
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
            return _this.importer.importDataURL(data);
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
