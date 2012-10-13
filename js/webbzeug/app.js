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
      this.handleMultipleSelection();
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
      this.actionsArr = [];
      this.incrementalIndex = 0;
      this.watchedAction = null;
      this.watchedActionIndex = null;
      this.selectedElement = null;
      this.selectedElements = [];
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
        if (e.keyCode === 8) {
          if (_this.selectedElements.length > 0) {
            e.preventDefault();
            _this.removeElements(_this.selectedElements);
          }
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


    App.prototype.removeElements = function(elements) {
      var action, element, _i, _j, _len, _len1;
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        element = elements[_i];
        action = this.actions[element.attr('data-index')];
        delete this.actions[action.index];
        this.actionsArr = _.without(this.actionsArr, action);
        if (element.attr('data-index') === this.selectedActionIndex) {
          this.selectedActionIndex = null;
        }
      }
      for (_j = 0, _len1 = elements.length; _j < _len1; _j++) {
        element = elements[_j];
        $(element).remove();
      }
      return this.selectedElements = [];
    };

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
      action.element = element;
      this.actions[index] = action;
      this.actionsArr.push(action);
      this.handleElementClick(null, element);
      element.click(function(e) {
        return _this.handleElementClick(e, element);
      });
      this.handleElementDrag(element);
      element.on('mouseenter', function() {
        if (action.renderTime) {
          return $('.debug').text(action.constructor.name + ': rendered in ' + action.renderTime + 'ms');
        }
      });
      element.on('mouseleave', function() {
        if (_this.renderTime) {
          return $('.debug').text('rendered in ' + _this.renderTime + 'ms');
        }
      });
      return action;
    };

    App.prototype.handleWorkspaceClick = function() {
      var onMouseDown, onMouseEnter, onMouseMove,
        _this = this;
      onMouseEnter = function(e) {
        var el;
        if (!_this.selectedElement && _this.selectedActionId) {
          el = _this.newActionElement(e.pageX, e.pageY, _this.selectedActionName, 3, _this.selectedActionType);
          return _this.selectedElement = el;
        }
      };
      onMouseMove = function(e) {
        var offsetX, offsetY;
        if (_this.selectedElement) {
          offsetX = $('.workspace').offset().left;
          offsetY = $('.workspace').offset().top;
          return _this.selectedElement.css({
            left: Math.floor((e.pageX - offsetX) / _this.gridWidth) * _this.gridWidth,
            top: Math.floor((e.pageY - offsetY) / _this.gridHeight) * _this.gridHeight
          });
        }
      };
      onMouseDown = function(e) {
        var x, y;
        $('.workspace-wrapper').off('mouseenter', onMouseEnter);
        $('.workspace-wrapper').off('mousemove', onMouseMove);
        $('.workspace-wrapper').off('mousedown', onMouseDown);
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
      };
      $('.workspace-wrapper').mouseenter(onMouseEnter);
      $('.workspace-wrapper').mousemove(onMouseMove);
      return $('.workspace-wrapper').mousedown(onMouseDown);
    };

    App.prototype.handleMultipleSelection = function(element) {
      var selectionRectEl,
        _this = this;
      selectionRectEl = $('.selection');
      return this.workspace.mousedown(function(e) {
        var handleMouseMove, selectionRect;
        e.preventDefault();
        selectionRect = {};
        selectionRect.x = e.pageX;
        selectionRect.y = e.pageY;
        selectionRectEl.css({
          left: selectionRect.x,
          top: selectionRect.y
        });
        handleMouseMove = function(e) {
          selectionRect.width = e.pageX - selectionRect.x;
          selectionRect.height = e.pageY - selectionRect.y;
          if (Math.abs(selectionRect.width) >= 5 || Math.abs(selectionRect.height) >= 5) {
            selectionRectEl.stop().show();
          }
          return selectionRectEl.css({
            left: selectionRect.width > 0 ? selectionRect.x : selectionRect.x + selectionRect.width,
            top: selectionRect.height > 0 ? selectionRect.y : selectionRect.y + selectionRect.height,
            width: Math.abs(selectionRect.width),
            height: Math.abs(selectionRect.height)
          });
        };
        $(document).mousemove(handleMouseMove);
        return $(document).one('mouseup', function(e) {
          var action, intersectingActions, offsetX, offsetY, r1, r2, selectedElements, _i, _len, _ref1;
          $(document).off('mousemove', handleMouseMove);
          selectionRectEl.fadeOut('fast');
          /*
                    Selection done
          */

          intersectingActions = [];
          offsetX = _this.workspace.offset().left;
          offsetY = _this.workspace.offset().top;
          r2 = {
            left: selectionRect.x,
            top: selectionRect.y,
            width: Math.abs(selectionRect.width),
            height: Math.abs(selectionRect.height)
          };
          if (selectionRect.width < 0) {
            r2.left = r2.left + selectionRect.width;
          }
          if (selectionRect.height < 0) {
            r2.top = r2.top + selectionRect.height;
          }
          _this.workspace.find('.action').removeClass('selected');
          _this.selectedElements = [];
          if (r2.width > 0 || r2.height > 0) {
            selectedElements = [];
            _ref1 = _this.actionsArr;
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              action = _ref1[_i];
              r1 = {
                left: action.x * _this.gridWidth + offsetX,
                top: action.y * _this.gridHeight + offsetY,
                width: action.width * _this.gridWidth,
                height: _this.gridHeight
              };
              if (!(r2.left > r1.left + r1.width || r2.left + r2.width < r1.left || r2.top > r1.top + r1.height || r2.top + r2.height < r1.top)) {
                action.element.addClass('selected');
                selectedElements.push(action.element);
              }
            }
            if (selectedElements.length > 0) {
              return _this.selectedElements = selectedElements;
            }
          }
        });
      });
    };

    App.prototype.handleElementDrag = function(element) {
      var _this = this;
      $(element).mousedown(function(e) {
        return e.stopPropagation();
      });
      $(element).find('.dragger').mousedown(function(e) {
        var editingElement, handleMouseMove;
        e.stopPropagation();
        e.preventDefault();
        editingElement = element;
        handleMouseMove = function(e) {
          var offsetX;
          e.preventDefault();
          offsetX = $('.workspace').offset().left;
          return editingElement.css({
            width: Math.max(3, Math.floor((e.pageX - offsetX - editingElement.position().left) / _this.gridWidth)) * _this.gridWidth
          });
        };
        $(document).mousemove(handleMouseMove);
        return $(document).mouseup(function(e) {
          var action;
          $(document).off('mousemove', handleMouseMove);
          action = _this.actions[editingElement.attr('data-index')];
          return action.width = Math.round(editingElement.width() / _this.gridWidth);
        });
      });
      return $(element).mousedown(function(e) {
        var handleMouseMove, initMousePos, initPosHash, _i, _len, _ref1;
        e.preventDefault();
        initMousePos = {
          x: e.pageX,
          y: e.pageY
        };
        initPosHash = {};
        _ref1 = _this.selectedElements;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          element = _ref1[_i];
          initPosHash[element.attr('data-index')] = {
            x: element.position().left,
            y: element.position().top
          };
        }
        handleMouseMove = function(e) {
          var distPos, newLeft, newTop, offsetX, offsetY, _j, _len1, _ref2, _results;
          e.preventDefault();
          offsetX = $('.workspace').offset().left;
          offsetY = $('.workspace').offset().top;
          distPos = {
            x: e.pageX - initMousePos.x,
            y: e.pageY - initMousePos.y
          };
          _ref2 = _this.selectedElements;
          _results = [];
          for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
            element = _ref2[_j];
            newLeft = initPosHash[element.attr('data-index')].x + distPos.x;
            newTop = initPosHash[element.attr('data-index')].y + distPos.y;
            _results.push(element.css({
              left: Math.floor(newLeft / _this.gridWidth) * _this.gridWidth,
              top: Math.floor(newTop / _this.gridHeight) * _this.gridHeight
            }));
          }
          return _results;
        };
        $(document).mousemove(handleMouseMove);
        return $(document).mouseup(function(e) {
          var action, _j, _len1, _ref2, _results;
          $(document).off('mousemove', handleMouseMove);
          _ref2 = _this.selectedElements;
          _results = [];
          for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
            element = _ref2[_j];
            action = _this.actions[element.attr('data-index')];
            action.x = Math.round(element.position().left / _this.gridWidth);
            _results.push(action.y = Math.round(element.position().top / _this.gridHeight));
          }
          return _results;
        });
      });
    };

    App.prototype.handleElementClick = function(e, element) {
      this.selectedActionIndex = element.attr('data-index');
      this.selectedElements = [element];
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
      var attributes, availableParameters, color, info, input, key, label, li, optKey, option, select, self, settingsUl, val, value, _ref1, _results,
        _this = this;
      self = this;
      this.settingsWindow = $('.workspace-wrapper .parameters');
      this.settingsWindow.show().css({
        left: (action.x + action.width) * this.gridWidth + 10,
        top: action.y * this.gridHeight
      });
      this.settingsWindow.click(function(e) {
        return e.stopPropagation();
      });
      e.stopPropagation();
      $(document).click(function(e) {
        _this.settingsWindow.hide();
        return $(document).off('click');
      });
      settingsUl = this.settingsWindow.find('ul');
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
      this.actionsArr.sort(this.actionsSorter);
      watchedAction = this.actions[this.watchedActionIndex];
      return this.findChildrenRecursively(watchedAction);
    };

    App.prototype.actionsSorter = function(a, b) {
      if (a.x > b.x) {
        return 1;
      } else if (a.x < b.x) {
        return -1;
      } else {
        return 0;
      }
    };

    App.prototype.findChildrenRecursively = function(action) {
      var children, possibleChildAction, _i, _len, _ref1;
      children = [];
      _ref1 = this.actionsArr;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        possibleChildAction = _ref1[_i];
        if (possibleChildAction === action) {
          continue;
        }
        if (possibleChildAction.y === action.y - 1) {
          if (!(possibleChildAction.x >= action.x + action.width || possibleChildAction.x + possibleChildAction.width <= action.x)) {
            children.push(possibleChildAction);
            possibleChildAction.parent = action;
            this.findChildrenRecursively(possibleChildAction);
          }
        }
      }
      return action.children = children;
    };

    App.prototype.updateParentsRecursively = function(action) {
      if (action.parent != null) {
        action.parent.updatedAt = +new Date();
        return this.updateParentsRecursively(action.parent);
      }
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
      return $('.debug').text('rendered in ' + this.renderTime + 'ms');
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
      context = action.doRender(contexts);
      action.renderTime = (+new Date()) - startTime;
      return context;
    };

    return App;

  })();

}).call(this);
