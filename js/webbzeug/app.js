(function() {
  var App, _ref;

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  window.Webbzeug.Version = '0.0.2';

  window.Webbzeug.App = App = (function() {
    var _this = this;

    App.prototype.textureSize = 256;

    App.prototype.gridHeight = 28;

    App.prototype.gridWidth = 112 / 3;

    App.prototype.shiftPressed = false;

    function App(container) {
      var size;
      this.container = container;
      this.workspace = $('.workspace');
      this.initRenderer();
      this.initRenderToTextureStuff();
      this.buildGrid();
      this.reset();
      this.loadSamples();
      this.loadSaveHandler = new Webbzeug.LoadSaveHandler(this, $('.save-link'), $('input#file'), $('.export-link'));
      this.handleNavigation();
      this.handleMultipleSelection();
      this.handleKeyboardInput();
      size = $(window).width();
      this.resizeWindow();
    }

    App.prototype.loadSamples = function() {
      var samplesSelect,
        _this = this;
      samplesSelect = $('select.samples');
      $.getJSON('/samples.json', function(samples) {
        var sample, _i, _len;
        for (_i = 0, _len = samples.length; _i < _len; _i++) {
          sample = samples[_i];
          $('<option>').attr({
            value: sample.file
          }).text(sample.name + ' (' + sample.file + ')').appendTo(samplesSelect);
        }
        return samplesSelect.removeAttr('disabled');
      });
      return samplesSelect.change(function() {
        var value;
        value = samplesSelect.val();
        return $.get('/samples/' + value, function(data) {
          _this.loadSaveHandler.openData(data);
          return samplesSelect.val('');
        });
      });
    };

    /*
        ------------------------------------------------------------- Setup
    */


    /*
        initializes the THREE.js renderer
    */


    App.prototype.initRenderer = function() {
      this.renderer = new THREE.WebGLRenderer({
        antialias: false,
        preserveDrawingBuffer: true
      });
      this.renderer.setSize(this.textureSize, this.textureSize);
      this.renderer.autoClear = false;
      this.container.append(this.renderer.domElement);
      this.canvas = this.renderer.domElement;
      this.width = this.canvas.width;
      return this.height = this.canvas.height;
    };

    App.prototype.initRenderToTextureStuff = function() {
      this.renderToTextureCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      this.copyMaterial = new THREE.ShaderMaterial(THREE.CopyShader);
      this.screenAlignedQuadMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.copyMaterial);
      this.renderToTextureScene = new THREE.Scene();
      return this.renderToTextureScene.add(this.screenAlignedQuadMesh);
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
      this.workspace.css({
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
        var tag;
        tag = e.target.tagName.toLowerCase();
        if (e.keyCode === 16) {
          _this.shiftPressed = true;
        }
        if (tag === "input" || tag === "textarea") {
          return;
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
      var action, actionLi, actions, actionsUl, dropdownImg, name, navigationWrapper, self, type, typeLi, types, _i, _len, _name, _ref1, _ref2;
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
        dropdownImg = $('<img>').addClass('arrow').attr({
          src: '/images/dropdown-arrow.png'
        }).appendTo(typeLi);
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
        if ((self.selectedElement != null) || (typeof selectedElements !== "undefined" && selectedElements !== null)) {
          return;
        }
        self.handleWorkspaceClick();
        self.selectedActionId = $(this).attr('data-id');
        self.selectedActionName = $(this).text();
        return self.selectedActionType = $(this).attr('data-type');
      });
    };

    /*
        Action creation / handling / dragging / resizing
    */


    App.prototype.displayWarnings = function(action, warnings) {
      action.element.data('warnings', warnings);
      return action.element.addClass('warning');
    };

    App.prototype.removeWarnings = function(action) {
      action.element.removeData('warnings');
      return action.element.removeClass('warning');
    };

    App.prototype.displayErrors = function(action, errors) {
      action.element.data('errors', errors);
      return action.element.addClass('error');
    };

    App.prototype.removeErrors = function(action) {
      action.element.removeData('errors');
      return action.element.removeClass('error');
    };

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
      action.setCaption();
      this.actions[index] = action;
      this.actionsArr.push(action);
      this.handleElementClick(null, element);
      element.click(function(e) {
        return _this.handleElementClick(e, element);
      });
      this.handleElementDrag(element);
      element.on('mouseenter', function() {
        var error, errors, errorsUl, li, popup, warning, warnings, warningsUl, _i, _j, _len, _len1;
        if (action.renderTime) {
          $('.debug').text(action.constructor.name + ': rendered in ' + action.renderTime + 'ms');
        }
        if (warnings = action.element.data('warnings')) {
          popup = _this.workspace.parent().find('.popup');
          popup.removeClass('errors').addClass('warnings').html("");
          warningsUl = $('<ul>').appendTo(popup);
          for (_i = 0, _len = warnings.length; _i < _len; _i++) {
            warning = warnings[_i];
            li = $('<li>').text(warning).appendTo(warningsUl);
          }
          popup.css({
            left: element.position().left,
            top: element.position().top + _this.gridHeight
          });
          popup.stop().fadeIn('fast');
        }
        if (errors = action.element.data('errors')) {
          popup = _this.workspace.parent().find('.popup');
          popup.addClass('errors').removeClass('warnings').html("");
          errorsUl = $('<ul>').appendTo(popup);
          for (_j = 0, _len1 = errors.length; _j < _len1; _j++) {
            error = errors[_j];
            li = $('<li>').text(error).appendTo(errorsUl);
          }
          popup.css({
            left: element.position().left,
            top: element.position().top + _this.gridHeight
          });
          return popup.stop().fadeIn('fast');
        }
      });
      element.on('mouseleave', function() {
        var popup;
        if (_this.renderTime) {
          $('.debug').text('rendered in ' + _this.renderTime + 'ms');
        }
        popup = _this.workspace.parent().find('.popup');
        return popup.stop().fadeOut('fast');
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
        var watchedAction, x, y;
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
          _this.selectedActionId = _this.selectedActionType = _this.selectedActionName = null;
          watchedAction = _this.actions[_this.watchedActionIndex];
          _this.updateAllActions();
          return _this.renderAll();
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
          $(document).off('mousemove', handleMouseMove);
          selectionRectEl.fadeOut('fast');
          _this.handleSelectIntersection(selectionRect);
        });
      });
    };

    App.prototype.handleSelectIntersection = function(selectionRect) {
      var action, intersectingActions, offsetX, offsetY, r1, r2, selectedElements, _i, _len, _ref1;
      intersectingActions = [];
      offsetX = this.workspace.offset().left;
      offsetY = this.workspace.offset().top;
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
      this.workspace.find('.action').removeClass('selected');
      this.selectedElements = [];
      if (r2.width > 0 || r2.height > 0) {
        selectedElements = [];
        _ref1 = this.actionsArr;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          action = _ref1[_i];
          r1 = {
            left: action.x * this.gridWidth + offsetX,
            top: action.y * this.gridHeight + offsetY,
            width: action.width * this.gridWidth,
            height: this.gridHeight
          };
          if (!(r2.left > r1.left + r1.width || r2.left + r2.width < r1.left || r2.top > r1.top + r1.height || r2.top + r2.height < r1.top)) {
            action.element.addClass('selected');
            selectedElements.push(action.element);
          }
        }
        if (selectedElements.length > 0) {
          return this.selectedElements = selectedElements;
        }
      }
    };

    App.prototype.handleElementDrag = function(element) {
      var _this = this;
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
            width: Math.max(3, Math.round((e.pageX - offsetX - editingElement.position().left) / _this.gridWidth)) * _this.gridWidth
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
        var handleMouseMove, initMousePos, initPosHash, otherElement, _i, _j, _len, _len1, _ref1, _ref2;
        e.stopPropagation();
        if (!$(element).hasClass('selected')) {
          _ref1 = _this.selectedElements;
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            otherElement = _ref1[_i];
            $(otherElement).removeClass('selected');
          }
          _this.selectedElements = [element];
          $(element).addClass('selected');
        }
        initMousePos = {
          x: e.pageX,
          y: e.pageY
        };
        initPosHash = {};
        _ref2 = _this.selectedElements;
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          element = _ref2[_j];
          initPosHash[element.attr('data-index')] = {
            x: element.position().left,
            y: element.position().top
          };
        }
        handleMouseMove = function(e) {
          var distPos, newLeft, newTop, offsetX, offsetY, _k, _len2, _ref3;
          e.preventDefault();
          offsetX = $('.workspace').offset().left;
          offsetY = $('.workspace').offset().top;
          distPos = {
            x: e.pageX - initMousePos.x,
            y: e.pageY - initMousePos.y
          };
          _ref3 = _this.selectedElements;
          for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
            element = _ref3[_k];
            newLeft = initPosHash[element.attr('data-index')].x + distPos.x;
            newTop = initPosHash[element.attr('data-index')].y + distPos.y;
            element.css({
              left: Math.round(newLeft / _this.gridWidth) * _this.gridWidth,
              top: Math.round(newTop / _this.gridHeight) * _this.gridHeight
            });
          }
        };
        $(document).mousemove(handleMouseMove);
        $(document).mouseup(function(e) {
          $(document).off('mousemove', handleMouseMove);
          $(document).off('mouseup');
          _this.updateElementPositions();
        });
      });
    };

    App.prototype.updateAllActions = function() {
      var action, _i, _len, _ref1, _results;
      _ref1 = this.actionsArr;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        action = _ref1[_i];
        _results.push(action != null ? action.needsUpdate = true : void 0);
      }
      return _results;
    };

    App.prototype.updateElementPositions = function() {
      var action, element, _i, _len, _ref1;
      _ref1 = this.selectedElements;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        element = _ref1[_i];
        action = this.actions[element.attr('data-index')];
        action.x = Math.round(element.position().left / this.gridWidth);
        action.y = Math.round(element.position().top / this.gridHeight);
      }
      this.updateAllActions();
      if (this.selectedElements != null) {
        if (this.selectedElements.length > 0) {
          return this.renderAll();
        }
      }
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
      var attributes, availableParameters, color, info, input, key, label, li, optKey, option, select, self, settingsUl, val, _ref1, _results,
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
                _this.updateAllActions();
                return self.renderAll();
              });
            })());
            break;
          case 'integer':
          case 'float':
            li = $('<li>').appendTo(settingsUl);
            label = $('<div>').addClass('label').text((info.name || key) + ':').appendTo(li);
            attributes = {
              type: 'text',
              value: action.getParameter(key) || info["default"]
            };
            input = $('<input>').attr(attributes).appendTo(li);
            $(input).draggableInput({
              type: info.type,
              min: info.min,
              max: info.max,
              precision: info.precision,
              scrollPrecision: info.scrollPrecision
            });
            _results.push((function() {
              var _input, _key;
              _input = input;
              _key = key;
              return _input.change(function() {
                var newVal;
                newVal = _input.val();
                if (!!(newVal % 1)) {
                  newVal = parseFloat(newVal);
                } else {
                  newVal = parseInt(newVal);
                }
                action.setParameter(_key, newVal);
                _this.updateAllActions();
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
                  _this.updateAllActions();
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

    App.prototype.getWebGLContext = function() {
      return this.gl;
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
      var possibleChildAction, _i, _j, _len, _len1, _ref1, _ref2, _results;
      action.children = [];
      if (action.type === 'load') {
        _ref1 = this.actionsArr;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          possibleChildAction = _ref1[_i];
          if (possibleChildAction.type === 'save') {
            if (possibleChildAction.getParameter(0) === action.getParameter(0)) {
              action.children.push(possibleChildAction);
              possibleChildAction.parent = action;
              this.findChildrenRecursively(possibleChildAction);
              return;
            }
          }
        }
        return;
      }
      _ref2 = this.actionsArr;
      _results = [];
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        possibleChildAction = _ref2[_j];
        if (possibleChildAction === action) {
          continue;
        }
        if (possibleChildAction.y === action.y - 1) {
          if (!(possibleChildAction.x >= action.x + action.width || possibleChildAction.x + possibleChildAction.width <= action.x)) {
            action.children.push(possibleChildAction);
            possibleChildAction.parent = action;
            _results.push(this.findChildrenRecursively(possibleChildAction));
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    App.prototype.updateParentsRecursively = function(action) {
      action.needsUpdate = true;
      if (action.parent != null) {
        return this.updateParentsRecursively(action.parent);
      }
    };

    App.prototype.setFramebuffer = function(fbo, width, height) {
      return this.gl.viewport(0, 0, width, height);
    };

    /*
        Rendering
    */


    App.prototype.renderAll = function() {
      var startTime, textur, watchedAction;
      this.buildTree();
      watchedAction = this.actions[this.watchedActionIndex];
      if (watchedAction == null) {
        return false;
      }
      startTime = +new Date();
      this.renderer.setClearColorHex(0x400000, 1);
      this.renderer.clear();
      if (textur = this.renderAction(watchedAction)) {
        this.copyMaterial.uniforms['tDiffuse'].value = textur;
        this.renderer.render(this.renderToTextureScene, this.renderToTextureCamera);
      } else {
        console.log("fail");
      }
      this.renderTime = +new Date() - startTime;
      return $('.debug').text('rendered in ' + this.renderTime + 'ms');
    };

    $(window).resize(function() {
      var height, width;
      width = $(window).width();
      if (width < 600) {
        width = 600;
      }
      $('div.workspace-wrapper, div.workspace').css({
        width: width - 280
      });
      height = $(window).height();
      if (height < 600) {
        height = 600;
      }
      return $('div.workspace-wrapper, div.workspace').css({
        height: height - 115
      });
    });

    App.prototype.resizeWindow = function() {
      var height, width;
      width = $(window).width();
      if (width < 600) {
        width = 600;
      }
      $('div.workspace-wrapper, div.workspace').css({
        width: width - 280
      });
      height = $(window).height();
      if (height < 600) {
        height = 600;
      }
      return $('div.workspace-wrapper, div.workspace').css({
        height: height - 115
      });
    };

    App.prototype.renderAction = function(action) {
      var child, children, startTime, texture, textures, _i, _len;
      if (action == null) {
        return false;
      }
      children = action.children;
      textures = [];
      for (_i = 0, _len = children.length; _i < _len; _i++) {
        child = children[_i];
        texture = this.renderAction(child);
        textures.push(texture);
      }
      startTime = +new Date();
      texture = action.doRender(textures);
      action.renderTime = (+new Date()) - startTime;
      return texture;
    };

    return App;

  }).call(this);

}).call(this);
