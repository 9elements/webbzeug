(function() {
  var App, _ref;

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  window.Webbzeug.Version = '0.0.1';

  window.Webbzeug.App = App = (function() {

    App.prototype.gridHeight = 28;

    App.prototype.gridWidth = 112 / 3;

    App.prototype.shiftPressed = false;

    function App(canvas) {
      this.canvas = canvas;
      this.workspace = $('.workspace');
      this.setupCanvas();
      this.buildGrid();
      this.reset();
      this.loadSaveHandler = new Webbzeug.LoadSaveHandler(this, $('.save-link'), $('input#file'));
      this.handleNavigation();
      this.handleKeyboardInput();
    }

    /*
        Setup
    */


    App.prototype.setupCanvas = function() {
      this.context = this.canvas.getContext('2d');
      this.width = this.context.canvas.width;
      return this.height = this.context.canvas.height;
    };

    App.prototype.buildGrid = function() {
      var c, colDiv, cols, grid, r, rowDiv, rows, _i, _j, _results;
      rows = 30;
      cols = 50;
      grid = this.workspace.parent().find('.grid');
      grid.css({
        width: (cols + 1) * this.gridWidth,
        height: (rows + 1) * this.gridHeight
      });
      for (r = _i = 0; 0 <= rows ? _i < rows : _i > rows; r = 0 <= rows ? ++_i : --_i) {
        rowDiv = $('<div>').addClass('grid-row').css({
          height: this.gridHeight - 1
        }).appendTo(grid);
      }
      _results = [];
      for (c = _j = 0; 0 <= cols ? _j < cols : _j > cols; c = 0 <= cols ? ++_j : --_j) {
        _results.push(colDiv = $('<div>').addClass('grid-col').css({
          width: this.gridWidth,
          height: grid.height(),
          left: this.gridWidth * c
        }).appendTo(grid));
      }
      return _results;
    };

    App.prototype.reset = function() {
      this.memory = [];
      this.actions = {};
      this.incrementalIndex = 0;
      this.watchedAction = null;
      this.watchedActionIndex = null;
      this.selectedElement = null;
      this.selectedActionIndex = this.selectedActionId = this.selectedActionName = this.selectedActionType = null;
      return this.workspace.find('.action').remove();
    };

    /*
        Keyboard input
    */


    App.prototype.handleKeyboardInput = function() {
      var _this = this;
      $(document).keyup(function(e) {
        if (e.keyCode === 16) {
          return _this.shiftPressed = false;
        }
      });
      return $(document).keydown(function(e) {
        if (e.keyCode === 16) {
          _this.shiftPressed = true;
        }
        if (e.keyCode === 32) {
          e.preventDefault();
          if (_this.selectedActionIndex) {
            $('.workspace .action').removeClass('watched');
            $('.workspace .action[data-index=' + _this.selectedActionIndex + ']').addClass('watched');
            _this.watchedActionIndex = _this.selectedActionIndex;
            return _this.renderAll();
          }
        }
      });
    };

    /*
        Navigation
    */


    App.prototype.handleNavigation = function() {
      var action, actionLi, actions, actionsUl, name, navigationWrapper, self, type, typeLi, types, _i, _len, _name, _ref1, _ref2;
      types = {};
      _ref1 = Webbzeug.ClassMap;
      for (name in _ref1) {
        action = _ref1[name];
        if ((_ref2 = types[_name = action.type]) == null) {
          types[_name] = [];
        }
        action.id = name;
        types[action.type].push(action);
      }
      navigationWrapper = $('.navigation');
      for (type in types) {
        actions = types[type];
        typeLi = $('<li>').addClass('type ' + type).text(_.str.classify(type)).appendTo(navigationWrapper);
        actionsUl = $('<ul>').addClass('types ' + type).appendTo(typeLi);
        for (_i = 0, _len = actions.length; _i < _len; _i++) {
          action = actions[_i];
          actionLi = $('<li>').attr({
            'data-id': action.id,
            'data-type': type
          }).text(action.name).appendTo(actionsUl);
        }
      }
      self = this;
      return $('.navigation li ul li').click(function(e) {
        e.preventDefault();
        self.handleWorkspaceClick();
        self.selectedActionId = $(this).attr('data-id');
        self.selectedActionName = $(this).text();
        return self.selectedActionType = $(this).attr('data-type');
      });
    };

    /*
        Action creation / handling / dragging / resizing
    */


    App.prototype.newActionElement = function(x, y, actionName, width, actionType) {
      var draggerIcon, el, watchedIcon, wrapper;
      el = $('<div>').addClass('action');
      el.addClass(actionType + ' ' + actionType).css({
        left: x,
        top: y,
        width: width * this.gridWidth
      });
      wrapper = $('<div>').addClass('wrapper').text(actionName).appendTo(el);
      watchedIcon = $('<div>').addClass('watched-icon').appendTo(wrapper);
      draggerIcon = $('<div>').addClass('dragger').appendTo(wrapper);
      this.workspace.append(el);
      return el;
    };

    App.prototype.applyActionToElement = function(actionId, x, y, width, index, element) {
      var action,
        _this = this;
      action = new Webbzeug.ClassMap[actionId]["class"](this, x, y, width, index);
      element.attr({
        'data-index': index
      });
      this.actions[index] = action;
      this.handleElementClick(null, element);
      element.click(function(e) {
        return _this.handleElementClick(e, element);
      });
      this.handleElementDrag(element);
      element.on('mouseenter', function() {
        if (action.renderTime) {
          return $('.debug').text(action.constructor.name + ' rendered in ' + action.renderTime + 'ms');
        }
      });
      element.on('mouseleave', function() {
        if (_this.renderTime) {
          return $('.debug').text('Texture rendered in ' + _this.renderTime + 'ms');
        }
      });
      return action;
    };

    App.prototype.handleWorkspaceClick = function() {
      var _this = this;
      $('.workspace-wrapper').mouseenter(function(e) {
        var el;
        if (!_this.selectedElement && _this.selectedActionId) {
          el = _this.newActionElement(e.pageX, e.pageY, _this.selectedActionName, 3, _this.selectedActionType);
          return _this.selectedElement = el;
        }
      });
      $('.workspace-wrapper').mousemove(function(e) {
        var offsetX, offsetY;
        if (_this.selectedElement) {
          offsetX = $('.workspace').offset().left;
          offsetY = $('.workspace').offset().top;
          return _this.selectedElement.css({
            left: Math.floor((e.pageX - offsetX) / _this.gridWidth) * _this.gridWidth,
            top: Math.floor((e.pageY - offsetY) / _this.gridHeight) * _this.gridHeight
          });
        }
      });
      return $('.workspace-wrapper').mousedown(function(e) {
        var x, y;
        $('.workspace-wrapper').off('mouseenter mousemove mousedown');
        if (_this.selectedElement) {
          x = Math.round(_this.selectedElement.position().left / _this.gridWidth);
          y = Math.round(_this.selectedElement.position().top / _this.gridHeight);
          if (_this.selectedActionId) {
            _this.applyActionToElement(_this.selectedActionId, x, y, 3, _this.incrementalIndex, _this.selectedElement);
            _this.incrementalIndex++;
          }
          _this.selectedElement = null;
          return _this.selectedActionId = _this.selectedActionType = _this.selectedActionName = null;
        }
      });
    };

    App.prototype.handleElementDrag = function(element) {
      var _this = this;
      $(element).find('.dragger').mousedown(function(e) {
        var editingElement;
        e.stopPropagation();
        e.preventDefault();
        editingElement = element;
        $(document).mousemove(function(e) {
          var offsetX;
          e.preventDefault();
          offsetX = $('.workspace').offset().left;
          return editingElement.css({
            width: Math.max(3, Math.floor((e.pageX - offsetX - editingElement.position().left) / _this.gridWidth)) * _this.gridWidth
          });
        });
        return $(document).mouseup(function(e) {
          var action;
          $(document).off('mousemove');
          action = _this.actions[editingElement.attr('data-index')];
          return action.width = Math.round(editingElement.width() / _this.gridWidth);
        });
      });
      return $(element).mousedown(function(e) {
        var editingElement;
        e.preventDefault();
        editingElement = element;
        $(document).mousemove(function(e) {
          var offsetX, offsetY;
          e.preventDefault();
          offsetX = $('.workspace').offset().left;
          offsetY = $('.workspace').offset().top;
          return editingElement.css({
            left: Math.floor((e.pageX - offsetX) / _this.gridWidth) * _this.gridWidth,
            top: Math.floor((e.pageY - offsetY) / _this.gridHeight) * _this.gridHeight
          });
        });
        return $(document).mouseup(function(e) {
          var action;
          $(document).off('mousemove');
          action = _this.actions[editingElement.attr('data-index')];
          action.x = Math.round(editingElement.position().left / _this.gridWidth);
          return action.y = Math.round(editingElement.position().top / _this.gridHeight);
        });
      });
    };

    App.prototype.handleElementClick = function(e, element) {
      this.selectedActionIndex = element.attr('data-index');
      $('.workspace .action').removeClass('selected');
      $(element).addClass('selected');
      if (this.shiftPressed) {
        return this.showParameters(e, this.actions[this.selectedActionIndex]);
      }
    };

    /*
        Parameters
    */


    App.prototype.showParameters = function(e, action) {
      var attributes, availableParameters, color, info, input, key, label, li, optKey, option, select, self, settingsUl, settingsWindow, val, value, _ref1, _results,
        _this = this;
      self = this;
      settingsWindow = $('.workspace-wrapper .parameters');
      settingsWindow.show().css({
        left: (action.x + action.width) * this.gridWidth + 10,
        top: action.y * this.gridHeight
      });
      settingsWindow.click(function(e) {
        return e.stopPropagation();
      });
      e.stopPropagation();
      $(document).click(function(e) {
        settingsWindow.hide();
        return $(document).off('click');
      });
      settingsUl = settingsWindow.find('ul');
      settingsUl.empty();
      availableParameters = action.availableParameters();
      _results = [];
      for (key in availableParameters) {
        info = availableParameters[key];
        switch (info.type) {
          case 'enum':
            li = $('<li>').appendTo(settingsUl);
            label = $('<div>').addClass('label').text((info.name || key) + ':').appendTo(li);
            select = $('<select>').appendTo(li);
            _ref1 = info.values;
            for (optKey in _ref1) {
              val = _ref1[optKey];
              option = $('<option>').attr({
                value: optKey
              }).text(val).appendTo(select);
              if (action.getParameter(key) === optKey) {
                option.attr('selected', 'selected');
              }
            }
            _results.push((function() {
              var _key;
              _key = key;
              return select.change(function() {
                action.setParameter(_key, select.val());
                return self.renderAll();
              });
            })());
            break;
          case 'number':
            li = $('<li>').appendTo(settingsUl);
            label = $('<div>').addClass('label').text((info.name || key) + ':').appendTo(li);
            attributes = {
              type: 'range',
              min: info.min || 0,
              max: info.max || 9999,
              value: action.getParameter(key) || info["default"],
              step: info.step || 1
            };
            input = $('<input>').attr(attributes).appendTo(li);
            value = $('<div>').addClass('value').text(attributes.value).appendTo(li);
            _results.push((function() {
              var _input, _key, _value;
              _input = input;
              _key = key;
              _value = value;
              return _input.change(function() {
                var newVal;
                newVal = _input.val();
                if (!!(newVal % 1)) {
                  newVal = parseFloat(newVal);
                } else {
                  newVal = parseInt(newVal);
                }
                action.setParameter(_key, newVal);
                _value.text(newVal);
                return self.renderAll();
              });
            })());
            break;
          case 'color':
            li = $('<li>').appendTo(settingsUl);
            label = $('<div>').addClass('label').text((info.name || key) + ':').appendTo(li);
            color = action.getParameter(key) || info["default"];
            input = $('<div>').addClass('colorpicker-control').css({
              backgroundColor: color
            }).appendTo(li);
            _results.push((function() {
              var _input, _key;
              _key = key;
              _input = input;
              return _input.ColorPicker({
                color: color,
                onChange: function(hsb, hex, rgb) {
                  color = "rgb(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ")";
                  _input.css({
                    backgroundColor: color
                  });
                  action.setParameter(_key, color);
                  return self.renderAll();
                }
              });
            })());
            break;
          default:
            _results.push(void 0);
        }
      }
      return _results;
    };

    App.prototype.deleteTree = function() {
      var action, index, _ref1, _results;
      _ref1 = this.actions;
      _results = [];
      for (index in _ref1) {
        action = _ref1[index];
        _results.push(action.deleteChildren());
      }
      return _results;
    };

    /*
        Helper functions for actions
    */


    App.prototype.getWidth = function() {
      return this.canvas.width;
    };

    App.prototype.getHeight = function() {
      return this.canvas.height;
    };

    /*
        Tree building / handling
    */


    App.prototype.buildTree = function() {
      var watchedAction;
      if (!this.watchedActionIndex) {
        return;
      }
      this.deleteTree();
      watchedAction = this.actions[this.watchedActionIndex];
      return this.findChildrenRecursively(watchedAction);
    };

    App.prototype.findChildrenRecursively = function(action) {
      var childIndex, children, possibleChildAction, _ref1;
      children = [];
      _ref1 = this.actions;
      for (childIndex in _ref1) {
        possibleChildAction = _ref1[childIndex];
        if (possibleChildAction === action) {
          continue;
        }
        if (possibleChildAction.y === action.y - 1) {
          if (!(possibleChildAction.x >= action.x + action.width || possibleChildAction.x + possibleChildAction.width <= action.x)) {
            children.push(possibleChildAction);
            this.findChildrenRecursively(possibleChildAction);
          }
        }
      }
      return action.children = children;
    };

    /*
        Rendering
    */


    App.prototype.renderAll = function() {
      var context, imageData, startTime, watchedAction;
      this.buildTree();
      watchedAction = this.actions[this.watchedActionIndex];
      if (watchedAction == null) {
        return false;
      }
      startTime = +new Date();
      if (context = this.render(watchedAction)) {
        imageData = context.getImageData(0, 0, this.getWidth(), this.getHeight());
        this.context.putImageData(imageData, 0, 0);
      }
      this.renderTime = +new Date() - startTime;
      return $('.debug').text('Texture rendered in ' + this.renderTime + 'ms');
    };

    App.prototype.render = function(action) {
      var child, children, context, contexts, startTime, _i, _len;
      if (action == null) {
        return false;
      }
      children = action.children;
      contexts = [];
      for (_i = 0, _len = children.length; _i < _len; _i++) {
        child = children[_i];
        context = this.render(child);
        contexts.push(context);
      }
      startTime = +new Date();
      context = action.render(contexts);
      action.renderTime = (+new Date()) - startTime;
      return context;
    };

    return App;

  })();

}).call(this);
