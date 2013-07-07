(function() {
  var PNGExporter, _ref;

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  window.Webbzeug.PNGExporter = PNGExporter = (function() {

    function PNGExporter() {}

    PNGExporter.prototype.exportPNG = function(filename) {
      var url;
      url = this.renderedToDataURL();
      if (url != null) {
        return downloadDataURI({
          filename: filename,
          data: url
        });
      }
    };

    PNGExporter.prototype.renderedToDataURL = function() {
      return $('canvas#canvas').get(0).toDataURL('image/png');
    };

    return PNGExporter;

  })();

}).call(this);
