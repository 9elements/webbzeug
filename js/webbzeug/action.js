(function() {
  var Action, _ref;

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  window.Webbzeug.Action = Action = (function() {

    Action.prototype.width = 3;

    function Action(app, x, y, width, index) {
      var info, parameter, _ref1;
      this.app = app;
      this.x = x;
      this.y = y;
      this.width = width;
      this.index = index;
      this.children = [];
      this.parent = null;
      this.updatedAt = +new Date();
      this.renderedAt = 0;
      this.parameters = {};
      _ref1 = this.availableParameters();
      for (parameter in _ref1) {
        info = _ref1[parameter];
        this.parameters[parameter] = info["default"];
      }
      this.createTextureAndFramebufferObject;
    }

    Action.prototype.createTextureAndFramebufferObject = function() {
      this.texture = this.gl.createTexture();
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.app.getWidth(), this.app.getHeight(), 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
      this.fbo = this.gl.createFramebuffer();
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fbo);
      return this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.texture, 0);
    };

    Action.prototype.availableParameters = function() {
      return {};
    };

    Action.prototype.validations = function() {
      return {};
    };

    Action.prototype.copyRendered = function(contexts) {
      var imageData;
      if (contexts.length === 0) {
        this.context.fillStyle = 'black';
        return this.context.fillRect(0, 0, this.app.getWidth(), this.app.getHeight());
      } else {
        imageData = contexts[0].getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
        return this.context.putImageData(imageData, 0, 0);
      }
    };

    Action.prototype.doRender = function(textures) {
      var valid, _ref1, _ref2;
      valid = this.validations(textures);
      if (((_ref1 = valid.warnings) != null ? _ref1.length : void 0) > 0) {
        this.app.displayWarnings(this, valid.warnings);
      } else {
        this.app.removeWarnings(this);
      }
      if (((_ref2 = valid.errors) != null ? _ref2.length : void 0) > 0) {
        this.app.displayErrors(this, valid.errors);
        return false;
      } else {
        this.app.removeErrors(this);
      }
      if (this.willRender()) {
        this.render(textures);
      }
      return this.texture;
    };

    Action.prototype.render = function(textures) {
      return this.renderedAt = +new Date();
    };

    Action.prototype.willRender = function() {
      return this.updatedAt > this.renderedAt;
    };

    Action.prototype.deleteChildren = function() {
      return this.children = [];
    };

    Action.prototype.addChild = function(child) {
      return this.children.push(child);
    };

    Action.prototype.getParameter = function(parameter) {
      return this.parameters[parameter];
    };

    Action.prototype.setParameter = function(parameter, value) {
      this.parameters[parameter] = value;
      this.updatedAt = +new Date();
      this.app.buildTree();
      this.app.updateParentsRecursively(this);
      return this.setCaption(this.caption());
    };

    Action.prototype.setCaption = function(caption) {
      return this.element.find('.wrapper').contents().first().get(0).data = caption || this.caption();
    };

    Action.prototype.caption = function() {
      return this.name;
    };

    Action.prototype.loadShader = function(gl, shaderSource, shaderType) {
      var compiled, lastError, shader;
      shader = gl.createShader(shaderType);
      gl.shaderSource(shader, shaderSource);
      gl.compileShader(shader);
      compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
      if (!compiled) {
        lastError = gl.getShaderInfoLog(shader);
        console.log("*** Error compiling shader '" + shader + "':" + lastError);
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    return Action;

  })();

}).call(this);
