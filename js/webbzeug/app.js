(function() {
  var App, _ref;

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  window.Webbzeug.App = App = (function() {

    App.prototype.gridHeight = 27;

    App.prototype.gridWidth = 112 / 3;

    function App(canvas) {
      this.canvas = canvas;
      this.context = this.canvas.getContext('experimental-webgl');
      this.width = this.context.canvas.width;
      this.height = this.context.canvas.height;
      this.handleNavigation();
      this.handleWorkspaceClick();
    }

    App.prototype.handleNavigation = function() {
      var self;
      self = this;
      return $('.navigation li').click(function(e) {
        e.preventDefault();
        $(this).parent().find('li').removeClass('active');
        $(this).addClass('active');
        self.selectedActionId = $(this).attr('data-id');
        self.selectedActionName = $(this).text();
        return self.selectedActionType = $(this).attr('data-type');
      });
    };

    App.prototype.handleWorkspaceClick = function() {
      var _this = this;
      $('.workspace').mouseenter(function(e) {
        var el, x, y;
        if (!_this.selectedElement && _this.selectedActionId) {
          el = $('<div>').addClass('action');
          x = e.pageX;
          y = e.pageY;
          el.text(_this.selectedActionName).addClass(_this.selectedActionType).css({
            left: x,
            top: y
          });
          $('.workspace').append(el);
          return _this.selectedElement = el;
        }
      });
      $('.workspace').mousemove(function(e) {
        if (_this.selectedElement) {
          return _this.selectedElement.css({
            left: Math.floor(e.pageX / _this.gridWidth) * _this.gridWidth,
            top: Math.floor(e.pageY / _this.gridHeight) * _this.gridHeight
          });
        }
      });
      return $('.workspace').mousedown(function(e) {
        if (_this.selectedElement) {
          _this.selectedElement.css({
            left: Math.floor(e.pageX / _this.gridWidth) * _this.gridWidth,
            top: Math.floor(e.pageY / _this.gridHeight) * _this.gridHeight
          });
          return _this.selectedElement = null;
        }
      });
    };

    App.prototype.render = function() {
      this.context.fillStyle = 'rgba(255,255,255,1)';
      return this.context.fillRect(Math.random() * this.width, Math.random() * this.height, 10, 10);
    };

    return App;

  })();

}).call(this);
