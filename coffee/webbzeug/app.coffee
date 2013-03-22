window.Webbzeug ?= {}
window.Webbzeug.Version = '0.0.2'
window.Webbzeug.App = class App
  textureSize: 256
  gridHeight: 28
  gridWidth:  112 / 3
  shiftPressed: false
  constructor: (@container) ->
    @workspace = $('.workspace')
    @initRenderer()
    @initRenderToTextureStuff()
    @buildGrid()
    @reset()

    @loadSamples()

    @loadSaveHandler = new Webbzeug.LoadSaveHandler this, $('.save-link'), $('input#file'), $('.export-link')

    @handleNavigation()
    @handleMultipleSelection()
    @handleKeyboardInput()

  loadSamples: ->
    samplesSelect = $('select.samples')
    $.getJSON '/samples.json', (samples) =>
      for sample in samples
        $('<option>').attr(value: sample.file).text(sample.name + ' (' + sample.file + ')').appendTo samplesSelect

      samplesSelect.removeAttr 'disabled'

    samplesSelect.change =>
      value = samplesSelect.val()
      $.get '/samples/' + value, (data) =>
        @loadSaveHandler.openData data

        samplesSelect.val('')

  ###
    ------------------------------------------------------------- Setup
  ###
  ###
    initializes the THREE.js renderer
  ###
  initRenderer: ->
    console.log "init renderer"
    @renderer = new THREE.WebGLRenderer antialias: false, preserveDrawingBuffer: true
    @renderer.setSize @textureSize, @textureSize
    @renderer.autoClear = false
    console.log @renderer
    console.log @container

    @container.append @renderer.domElement

    @canvas = @renderer.domElement
    @width = @canvas.width
    @height = @canvas.height

  initRenderToTextureStuff: ->
    @renderToTextureCamera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );
    @copyMaterial = new THREE.ShaderMaterial (THREE.CopyShader)

    @screenAlignedQuadMesh = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), @copyMaterial)
    @renderToTextureScene = new THREE.Scene();
    @renderToTextureScene.add( @screenAlignedQuadMesh );


  ###
  setupCanvas: ->
    console.log @canvas
    @gl = @canvas.getContext("experimental-webgl")
    if (!@gl)
      console.log "Can't init WebGl context braw"
    else
      console.log "WebGL init works"
    @width = @canvas.width
    @height = @canvas.height
  ###

  buildGrid: ->
    rows = 30
    cols = 50

    grid = @workspace.parent().find '.grid'

    grid.css
      width: (cols + 1) * @gridWidth
      height: (rows + 1) * @gridHeight

    @workspace.css
      width: (cols + 1) * @gridWidth
      height: (rows + 1) * @gridHeight

    for r in [0...rows]
      rowDiv = $('<div>').addClass('grid-row').css(height: @gridHeight - 1).appendTo grid

    for c in [0...cols]
      colDiv = $('<div>').addClass('grid-col').css(width: @gridWidth, height: grid.height(), left: @gridWidth * c).appendTo grid

  reset: ->
    @memory = []
    @actions = {}
    @actionsArr = []
    @incrementalIndex = 0
    @watchedAction = null
    @watchedActionIndex = null
    @selectedElement = null
    @selectedElements = []
    @selectedActionIndex = @selectedActionId = @selectedActionName = @selectedActionType = null

    # Remove all action divs
    @workspace.find('.action').remove()

  ###
    Keyboard input
  ###
  handleKeyboardInput: ->
    $(document).keyup (e) =>
      if e.keyCode is 16
        @shiftPressed = false

    $(document).keydown (e) =>
      if e.keyCode is 16
        @shiftPressed = true
      if e.keyCode is 8
        if @selectedElements.length > 0
          e.preventDefault()

          @removeElements @selectedElements

      if e.keyCode is 32
        e.preventDefault()
        if @selectedActionIndex
          $('.workspace .action').removeClass('watched')
          $('.workspace .action[data-index=' + @selectedActionIndex + ']').addClass('watched')

          @watchedActionIndex = @selectedActionIndex

          @renderAll()

  ###
    Navigation
  ###
  handleNavigation: ->
    # Setup
    types = {}
    for name, action of Webbzeug.ClassMap
      types[action.type] ?= []

      action.id = name
      types[action.type].push action

    navigationWrapper = $('.navigation')

    for type, actions of types
      typeLi = $('<li>').addClass('type ' + type).text(_.str.classify(type)).appendTo navigationWrapper
      dropdownImg = $('<img>').addClass('arrow').attr(src: '/images/dropdown-arrow.png').appendTo typeLi

      actionsUl = $('<ul>').addClass('types ' + type).appendTo typeLi
      for action in actions
        actionLi = $('<li>').attr('data-id': action.id, 'data-type': type).text(action.name).appendTo actionsUl

    # Handle clicks
    self = this
    $('.navigation li ul li').click (e) ->
      e.preventDefault()

      self.handleWorkspaceClick()

      self.selectedActionId = $(this).attr('data-id')
      self.selectedActionName = $(this).text()
      self.selectedActionType = $(this).attr('data-type')

  ###
    Action creation / handling / dragging / resizing
  ###
  displayWarnings: (action, warnings) ->
    action.element.data 'warnings', warnings
    action.element.addClass 'warning'
  removeWarnings: (action) ->
    action.element.removeData 'warnings'
    action.element.removeClass 'warning'

  displayErrors: (action, errors) ->
    action.element.data 'errors', errors
    action.element.addClass 'error'
  removeErrors: (action) ->
    action.element.removeData 'errors'
    action.element.removeClass 'error'

  removeElements: (elements) ->
    for element in elements
      action = @actions[element.attr('data-index')]
      delete @actions[action.index]
      @actionsArr = _.without(@actionsArr, action)

      if element.attr('data-index') is @selectedActionIndex
        @selectedActionIndex = null

    for element in elements
      $(element).remove()

    @selectedElements = []

  newActionElement: (x, y, actionName, width, actionType) ->
    el = $('<div>').addClass('action')

    el.addClass(actionType + ' ' + actionType).css
      left: x
      top: y
      width: width * @gridWidth

    wrapper     = $('<div>').addClass('wrapper').text(actionName).appendTo el
    watchedIcon = $('<div>').addClass('watched-icon').appendTo wrapper
    draggerIcon = $('<div>').addClass('dragger').appendTo wrapper

    @workspace.append el

    return el

  applyActionToElement: (actionId, x, y, width, index, element) ->
    action = new Webbzeug.ClassMap[actionId].class this, x, y, width, index

    element.attr 'data-index': index

    action.element = element

    action.setCaption()

    @actions[index] = action
    @actionsArr.push action

    @handleElementClick null, element
    element.click (e) =>
      @handleElementClick e, element

    @handleElementDrag element

    element.on 'mouseenter', =>
      if action.renderTime
        $('.debug').text action.constructor.name + ': rendered in ' + action.renderTime + 'ms'

      if warnings = action.element.data 'warnings'
        popup = @workspace.parent().find('.popup')
        popup.removeClass('errors').addClass('warnings').html ""

        warningsUl = $('<ul>').appendTo popup
        for warning in warnings
          li = $('<li>').text(warning).appendTo warningsUl

        popup.css
          left: element.position().left
          top:  element.position().top + @gridHeight

        popup.stop().fadeIn 'fast'

      if errors = action.element.data 'errors'
        popup = @workspace.parent().find('.popup')
        popup.addClass('errors').removeClass('warnings').html ""

        errorsUl = $('<ul>').appendTo popup
        for error in errors
          li = $('<li>').text(error).appendTo errorsUl

        popup.css
          left: element.position().left
          top:  element.position().top + @gridHeight

        popup.stop().fadeIn 'fast'

    element.on 'mouseleave', =>
      if @renderTime
        $('.debug').text 'rendered in ' + @renderTime + 'ms'

      popup = @workspace.parent().find('.popup')
      popup.stop().fadeOut 'fast'

    return action

  handleWorkspaceClick: ->
    onMouseEnter = (e) =>
      if not @selectedElement and @selectedActionId
        el = @newActionElement e.pageX, e.pageY, @selectedActionName, 3, @selectedActionType

        @selectedElement = el

    onMouseMove = (e) =>
      if @selectedElement
        offsetX = $('.workspace').offset().left
        offsetY = $('.workspace').offset().top

        @selectedElement.css
          left: Math.floor((e.pageX - offsetX) / @gridWidth) * @gridWidth
          top:  Math.floor((e.pageY - offsetY) / @gridHeight) * @gridHeight

    onMouseDown = (e) =>
      $('.workspace-wrapper').off 'mouseenter', onMouseEnter
      $('.workspace-wrapper').off 'mousemove', onMouseMove
      $('.workspace-wrapper').off 'mousedown', onMouseDown
      if @selectedElement
        x = Math.round(@selectedElement.position().left / @gridWidth)
        y = Math.round(@selectedElement.position().top  / @gridHeight)

        if @selectedActionId
          @applyActionToElement @selectedActionId, x, y, 3, @incrementalIndex, @selectedElement

          @incrementalIndex++

        @selectedElement = null
        @selectedActionId = @selectedActionType = @selectedActionName = null

    $('.workspace-wrapper').mouseenter onMouseEnter
    $('.workspace-wrapper').mousemove  onMouseMove
    $('.workspace-wrapper').mousedown  onMouseDown

  handleMultipleSelection: (element) ->
    selectionRectEl = $('.selection')
    @workspace.mousedown (e) =>
      e.preventDefault()

      selectionRect = {}

      selectionRect.x = e.pageX
      selectionRect.y = e.pageY

      selectionRectEl.css
        left: selectionRect.x
        top: selectionRect.y

      handleMouseMove = (e) =>
        selectionRect.width = e.pageX - selectionRect.x
        selectionRect.height = e.pageY - selectionRect.y

        if Math.abs(selectionRect.width) >= 5 or Math.abs(selectionRect.height) >= 5
          selectionRectEl.stop().show()

        selectionRectEl.css
          left: if selectionRect.width > 0 then selectionRect.x else selectionRect.x + selectionRect.width
          top: if selectionRect.height > 0 then selectionRect.y else selectionRect.y + selectionRect.height
          width: Math.abs(selectionRect.width)
          height: Math.abs(selectionRect.height)

      $(document).mousemove handleMouseMove

      $(document).one 'mouseup', (e) =>
        $(document).off 'mousemove', handleMouseMove
        selectionRectEl.fadeOut 'fast'

        @handleSelectIntersection selectionRect

        return

  handleSelectIntersection: (selectionRect) ->
    intersectingActions = []

    offsetX = @workspace.offset().left
    offsetY = @workspace.offset().top

    r2 =
      left:   selectionRect.x
      top:    selectionRect.y
      width:  Math.abs(selectionRect.width)
      height: Math.abs(selectionRect.height)

    if selectionRect.width < 0
      r2.left = r2.left + selectionRect.width
    if selectionRect.height < 0
      r2.top = r2.top + selectionRect.height

    @workspace.find('.action').removeClass('selected')
    @selectedElements = []

    if r2.width > 0 or r2.height > 0
      selectedElements = []
      for action in @actionsArr
        # rectangular intersection test
        r1 =
          left:   action.x * @gridWidth + offsetX
          top:    action.y * @gridHeight + offsetY
          width:  action.width * @gridWidth
          height: @gridHeight

        unless r2.left > r1.left + r1.width or
          r2.left + r2.width < r1.left or
          r2.top > r1.top + r1.height or
          r2.top + r2.height < r1.top
            action.element.addClass('selected')
            selectedElements.push action.element

      if selectedElements.length > 0
        @selectedElements = selectedElements

  handleElementDrag: (element) ->
    $(element).find('.dragger').mousedown (e) =>
      e.stopPropagation()
      e.preventDefault()

      editingElement = element

      handleMouseMove = (e) =>
        e.preventDefault()

        offsetX = $('.workspace').offset().left

        editingElement.css
          width: Math.max(3, Math.round((e.pageX - offsetX - editingElement.position().left) / @gridWidth)) * @gridWidth

      $(document).mousemove handleMouseMove

      $(document).mouseup (e) =>
        $(document).off 'mousemove', handleMouseMove

        action = @actions[editingElement.attr('data-index')]
        action.width = Math.round(editingElement.width() / @gridWidth)

    # Move drag
    $(element).mousedown (e) =>
      e.stopPropagation()

      unless $(element).hasClass('selected')

        for otherElement in @selectedElements
          $(otherElement).removeClass 'selected'

        @selectedElements = [element]
        $(element).addClass 'selected'

      initMousePos = { x: e.pageX, y: e.pageY }

      # Bulk move
      initPosHash = {}
      for element in @selectedElements
        initPosHash[element.attr('data-index')] = { x: element.position().left, y: element.position().top }

      handleMouseMove = (e) =>
        e.preventDefault()

        offsetX = $('.workspace').offset().left
        offsetY = $('.workspace').offset().top

        distPos = { x: e.pageX - initMousePos.x , y: e.pageY - initMousePos.y }

        for element in @selectedElements
          newLeft = initPosHash[element.attr('data-index')].x + distPos.x
          newTop  = initPosHash[element.attr('data-index')].y + distPos.y
          element.css
            left: Math.round(newLeft / @gridWidth) * @gridWidth
            top:  Math.round(newTop / @gridHeight) * @gridHeight

        return

      $(document).mousemove handleMouseMove

      $(document).mouseup (e) =>
        $(document).off 'mousemove', handleMouseMove
        @updateElementPositions()
        return
      return

  updateElementPositions: ->
    for element in @selectedElements
      action = @actions[element.attr('data-index')]
      action.x = Math.round(element.position().left / @gridWidth)
      action.y = Math.round(element.position().top  / @gridHeight)

      action.updatedAt = +new Date()
      @updateParentsRecursively action

  handleElementClick: (e, element) ->
    @selectedActionIndex = element.attr('data-index')
    @selectedElements = [element]

    $('.workspace .action').removeClass('selected')
    $(element).addClass('selected')

    if @shiftPressed
      @showParameters e, @actions[@selectedActionIndex]

  ###
    Parameters
  ###
  showParameters: (e, action) ->
    self = this

    @settingsWindow = $('.workspace-wrapper .parameters')

    @settingsWindow.show().css
      left: (action.x + action.width) * @gridWidth + 10
      top: action.y * @gridHeight

    @settingsWindow.click (e) => e.stopPropagation()

    e.stopPropagation()
    $(document).click (e) =>
      @settingsWindow.hide()
      $(document).off 'click'

    settingsUl = @settingsWindow.find('ul')
    settingsUl.empty()

    # Build settings
    availableParameters = action.availableParameters()

    for key, info of availableParameters
      switch info.type
        when 'enum'
          li = $('<li>').appendTo settingsUl
          label = $('<div>').addClass('label').text((info.name || key) + ':').appendTo li

          select = $('<select>').appendTo li
          for optKey, val of info.values
            option = $('<option>').attr(value: optKey).text(val).appendTo select
            if action.getParameter(key) is optKey
              option.attr 'selected', 'selected'

          (->
            _key = key
            select.change ->
              action.setParameter _key, select.val()

              self.renderAll()
          )()

        when 'integer', 'float'
          li = $('<li>').appendTo settingsUl
          label = $('<div>').addClass('label').text((info.name || key) + ':').appendTo li

          attributes =
            type: 'text'
            value: action.getParameter(key) or info.default

          input = $('<input>').attr(attributes).appendTo li

          $(input).draggableInput
            type: info.type
            min: info.min
            max: info.max
            precision: info.precision
            scrollPrecision: info.scrollPrecision

          (=>
            _input = input
            _key   = key
            _input.change ->
              newVal = _input.val()

              if !!(newVal % 1)
                newVal = parseFloat(newVal)
              else
                newVal = parseInt(newVal)

              action.setParameter _key, newVal

              self.renderAll()
          )()

        when 'color'
          li = $('<li>').appendTo settingsUl
          label = $('<div>').addClass('label').text((info.name || key) + ':').appendTo li

          color = action.getParameter(key) or info.default

          input = $('<div>').addClass('colorpicker-control').css(backgroundColor: color).appendTo li

          (=>
            _key   = key
            _input = input
            _input.ColorPicker
              color: color
              onChange: (hsb, hex, rgb) ->
                color = "rgb(#{rgb.r}, #{rgb.g}, #{rgb.b})"

                _input.css
                  backgroundColor: color

                action.setParameter _key, color

                self.renderAll()
          )()

  deleteTree: ->
    for index, action of @actions
      action.deleteChildren()

  ###
    Helper functions for actions
  ###
  getWidth: -> @canvas.width
  getHeight: -> @canvas.height
  getWebGLContext: ->  @gl
  ###
    Tree building / handling
  ###
  buildTree: ->
    unless @watchedActionIndex
      return

    @deleteTree()

    @actionsArr.sort @actionsSorter

    watchedAction = @actions[@watchedActionIndex]
    @findChildrenRecursively watchedAction

  actionsSorter: (a, b) ->
    if a.x > b.x
      return 1
    else if a.x < b.x
      return -1
    else
      return 0


  findChildrenRecursively: (action) ->
    action.children = []
    # if we deal with a load action we must find its save and go on there with recursion
    if action.type is 'load'
      for possibleChildAction in @actionsArr
        if possibleChildAction.type is 'save'
          if possibleChildAction.getParameter(0) is action.getParameter(0)
            action.children.push possibleChildAction
            @findChildrenRecursively possibleChildAction
            return
      return


    # otherwise we find children useing postions
    for possibleChildAction in @actionsArr
      if possibleChildAction is action
        continue

      if possibleChildAction.y is action.y - 1
        if !(possibleChildAction.x >= action.x + action.width or possibleChildAction.x + possibleChildAction.width <= action.x)
          action.children.push possibleChildAction
          possibleChildAction.parent = action

          @findChildrenRecursively possibleChildAction

  updateParentsRecursively: (action) ->
    if action.parent?
      action.parent.updatedAt = +new Date()
      @updateParentsRecursively action.parent

  setFramebuffer: (fbo, width, height) ->
    #// make this the framebuffer we are rendering to.
    #@gl.bindFramebuffer(@gl.FRAMEBUFFER, fbo);

    #// Tell webgl the viewport setting needed for framebuffer.
    @gl.viewport(0, 0, width, height);

  ###
    Rendering
  ###
  renderAll: ->
    @buildTree()

    watchedAction = @actions[@watchedActionIndex]

    unless watchedAction?
      return false

    startTime = +new Date()

    ## present final result
    @renderer.setClearColorHex 0x400000, 1
    @renderer.clear()

    if textur = @renderAction watchedAction
      @copyMaterial.uniforms['tDiffuse'].value = textur

      @renderer.render @renderToTextureScene, @renderToTextureCamera

    else
      console.log "fail"

    @renderTime = (+new Date() - startTime)

    $('.debug').text 'rendered in ' + @renderTime + 'ms'


  renderAction: (action) ->
    unless action?
      return false

    children = action.children

    textures = []
    for child in children
      texture = @renderAction child
      textures.push texture

    startTime = +new Date()
    texture = action.doRender(textures)
    action.renderTime = (+new Date()) - startTime
    return texture