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
      this.createRenderTarget();
    }

    Action.prototype.createRenderTarget = function() {
      var height, parameters, width;
      width = this.app.textureSize || 1;
      height = this.app.textureSize || 1;
      parameters = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat,
        stencilBuffer: false
      };
      this.renderTarget = new THREE.WebGLRenderTarget(width, height, parameters);
      this.screenAlignedQuadMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), null);
      this.renderToTextureScene = new THREE.Scene();
      return this.renderToTextureScene.add(this.screenAlignedQuadMesh);
    };

    /*
      createTextureAndFramebufferObject: ->
        @texture = @gl.createTexture()
        @gl.bindTexture( @gl.TEXTURE_2D, @texture)
    
        # Set up texture so we can render any size image and so we are
        # working with pixels.
        @gl.texParameteri(@gl.TEXTURE_2D, @gl.TEXTURE_WRAP_S, @gl.CLAMP_TO_EDGE)
        @gl.texParameteri(@gl.TEXTURE_2D, @gl.TEXTURE_WRAP_T, @gl.CLAMP_TO_EDGE)
        @gl.texParameteri(@gl.TEXTURE_2D, @gl.TEXTURE_MIN_FILTER, @gl.NEAREST)
        @gl.texParameteri(@gl.TEXTURE_2D, @gl.TEXTURE_MAG_FILTER, @gl.NEAREST)
        #// make the texture the same size as the image
        @gl.texImage2D(
            @gl.TEXTURE_2D, 0, @gl.RGBA, @app.getWidth(), @app.getHeight(), 0,
            @gl.RGBA, @gl.UNSIGNED_BYTE, null)
    
        #// Create a framebuffer
        @fbo = @gl.createFramebuffer()
        @gl.bindFramebuffer(@gl.FRAMEBUFFER, @fbo)
    
        #// Attach a texture to it.
        @gl.framebufferTexture2D( @gl.FRAMEBUFFER, @gl.COLOR_ATTACHMENT0, @gl.TEXTURE_2D, @texture, 0)
    */


    Action.prototype.availableParameters = function() {
      return {};
    };

    Action.prototype.validations = function() {
      return {};
    };

    Action.prototype.copyRendered = function(contexts) {
      return console.log("someone called me");
      /*
          if contexts.length is 0
            @context.fillStyle = 'black'
            @context.fillRect 0, 0, @app.getWidth(), @app.getHeight()
          else
            imageData = contexts[0].getImageData 0, 0, @app.getWidth(), @app.getHeight()
            @context.putImageData imageData, 0, 0
      */

    };

    /*
      this is called from the tree renderer
    */


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
      return this.renderTarget;
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

    /*
      loadShader: (gl, shaderSource, shaderType) ->
    
        # Create the shader object
        shader = gl.createShader(shaderType)
    
        # Load the shader source
        gl.shaderSource(shader, shaderSource)
    
        # Compile the shader
        gl.compileShader(shader)
    
        # Check the compile status
        compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
        if (!compiled)
          # Something went wrong during compilation; get the error
          lastError = gl.getShaderInfoLog(shader);
          console.log("*** Error compiling shader '" + shader + "':" + lastError);
          gl.deleteShader(shader);
          return null
        return shader
    */


    return Action;

  })();

}).call(this);
