(function() {
  var App, _ref;

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  window.Webbzeug.App = App = (function() {

    App.prototype.gridHeight = 27;

    App.prototype.gridWidth = 112 / 3;

    App.prototype.classMap = {
      rectangle: Webbzeug.Actions.Rectangle
    };

    function App(canvas) {
      this.canvas = canvas;
      this.context = this.canvas.getContext('experimental-webgl');
      this.incrementalIndex = 0;
      this.actions = [];
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
        var offsetX, offsetY;
        if (_this.selectedElement && _this.selectedActionId) {
          offsetX = $('.workspace').offset().left;
          offsetY = $('.workspace').offset().top;
          return _this.selectedElement.css({
            left: Math.floor((e.pageX - offsetX) / _this.gridWidth) * _this.gridWidth,
            top: Math.floor((e.pageY - offsetY) / _this.gridHeight) * _this.gridHeight
          });
        }
      });
      return $('.workspace').mousedown(function(e) {
        var action, x, y;
        if (_this.selectedElement && _this.selectedActionId) {
          x = _this.selectedElement.position().left / _this.gridWidth;
          y = _this.selectedElement.position().top / _this.gridHeight;
          console.log(_this.selectedActionId);
          action = new _this.classMap[_this.selectedActionId](x, y, _this.incrementalIndex);
          _this.incrementalIndex++;
          _this.actions.push(action);
          _this.render();
          _this.selectedElement = null;
          return _this.selectedActionId = _this.selectedActionType = _this.selectedActionName = null;
        }
      });
    };

    App.prototype.render = function() {
      var action, _i, _len, _ref1, _results;
      console.log("Existing actions:");
      _ref1 = this.actions;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        action = _ref1[_i];
        _results.push(action.render());
      }
      return _results;
    };

    return App;

  })();

}).call(this);
