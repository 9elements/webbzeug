window.Webbzeug ?= {}
window.Webbzeug.App = class App
  gridHeight: 27
  gridWidth:  112 / 3
  classMap: 
    rectangle: Webbzeug.Actions.Rectangle
    circle: Webbzeug.Actions.Circle
    fractal: Webbzeug.Actions.Fractal
    pixels: Webbzeug.Actions.Pixels
    flat: Webbzeug.Actions.Flat

    combine: Webbzeug.Actions.Combine
    invert: Webbzeug.Actions.Invert
    contbri: Webbzeug.Actions.ContrastBrightness
    blur: Webbzeug.Actions.Blur
    rotozoom: Webbzeug.Actions.RotoZoom
    light: Webbzeug.Actions.Light
    mirror: Webbzeug.Actions.Mirror

  constructor: (@canvas) ->
    @context = @canvas.getContext '2d'

    @shiftPressed = false

    @incrementalIndex = 0
    @actions = []

    @width = @context.canvas.width
    @height = @context.canvas.height

    @handleNavigation()
    @handleWorkspaceKeyboard()

    @watchedActionIndex  = null
    @selectedActionIndex = null

    # every 1000 / 60, =>
    #   @render()

  handleNavigation: ->
    self = this
    $('.navigation li').click (e) ->
      e.preventDefault()

      self.handleWorkspaceClick()

      $(this).parent().find('li').removeClass('active')
      $(this).addClass('active')

      self.selectedActionId = $(this).attr('data-id')
      self.selectedActionName = $(this).text()
      self.selectedActionType = $(this).attr('data-type')

  # When workspace is clicked, create new element
  handleWorkspaceClick: ->
    $('.workspace').mouseenter (e) =>
      if not @selectedElement and @selectedActionId
        el = $('<div>').addClass('action')

        x = e.pageX
        y = e.pageY

        el.text(@selectedActionName).addClass(@selectedActionType).css
          left: x
          top: y

        $('.workspace').append el

        @selectedElement = el

    $('.workspace').mousemove (e) =>
      if @selectedElement
        offsetX = $('.workspace').offset().left
        offsetY = $('.workspace').offset().top

        @selectedElement.css
          left: Math.floor((e.pageX - offsetX) / @gridWidth) * @gridWidth
          top:  Math.floor((e.pageY - offsetY) / @gridHeight) * @gridHeight

    $('.workspace').mousedown (e) =>
      $('.workspace').off('mouseenter mousemove mousedown')
      if @selectedElement
        x = Math.round(@selectedElement.position().left / @gridWidth)
        y = Math.round(@selectedElement.position().top  / @gridHeight)

        if @selectedActionId
          action = new @classMap[@selectedActionId] this, x, y, @incrementalIndex

          @selectedElement.attr 'data-index': @incrementalIndex
          @incrementalIndex++

          @actions.push action

          element = @selectedElement
          @handleElementClick null, element
          @selectedElement.click (e) =>
            @handleElementClick e, element

          @handleElementDrag element

        @selectedElement = null
        @selectedActionId = @selectedActionType = @selectedActionName = null

  handleElementDrag: (element) ->
    $(element).mousedown (e) =>
      editingElement = element

      $('.workspace').mousemove (e) =>
        offsetX = $('.workspace').offset().left
        offsetY = $('.workspace').offset().top

        editingElement.css
          left: Math.floor((e.pageX - offsetX) / @gridWidth) * @gridWidth
          top:  Math.floor((e.pageY - offsetY) / @gridHeight) * @gridHeight

      $(document).mouseup (e) =>
        $('.workspace').off('mousemove')

        action = @actions[editingElement.attr('data-index')]
        action.x = Math.round(editingElement.position().left / @gridWidth)
        action.y = Math.round(editingElement.position().top  / @gridHeight)

  handleWorkspaceKeyboard: ->
    $(document).keyup (e) =>
      if e.keyCode is 16
        @shiftPressed = false

    $(document).keydown (e) =>
      if e.keyCode is 16
        @shiftPressed = true
      if e.keyCode is 32
        e.preventDefault()
        if @selectedActionIndex
          $('.workspace .action').removeClass('watched')
          $('.workspace .action[data-index=' + @selectedActionIndex + ']').addClass('watched')

          @watchedActionIndex = @selectedActionIndex

          @buildTree()

          watchedAction = @actions[@watchedActionIndex]
          context = @render watchedAction

          imageData = context.getImageData 0, 0, @getWidth(), @getHeight()
          @context.putImageData imageData, 0, 0


  handleElementClick: (e, element) ->
    unless @shiftPressed
      @selectedActionIndex = element.attr('data-index')

      $('.workspace .action').removeClass('selected')
      $(element).addClass('selected')
    else
      @showParameters e, @actions[@selectedActionIndex]

  showParameters: (e, action) ->
    settingsWindow = $('.workspace-wrapper .parameters')

    settingsWindow.show().css
      left: (action.x + action.width + 1) * @gridWidth + $('.workspace-wrapper').offset().left
      top: (action.y + 1) * @gridHeight + $('.workspace-wrapper').offset().top

    settingsWindow.click (e) => e.stopPropagation()

    e.stopPropagation()
    $(document).click (e) ->
      settingsWindow.hide()
      $(document).off 'click'

    settingsUl = settingsWindow.find('ul')
    settingsUl.empty()

    # Build settings
    availableParameters = action.availableParameters()

    for key, info of availableParameters
      switch info.type
        when 'number'
          li = $('<li>').appendTo settingsUl
          label = $('<div>').addClass('label').text((info.name || key) + ':').appendTo li

          attributes = 
            type: 'range'
            min: info.min or 0
            max: info.max or 9999
            value: action.getParameter(key) or info.default

          input = $('<input>').attr(attributes).appendTo li

          value = $('<div>').addClass('value').text(attributes.value).appendTo li

          (=>
            _input = input
            _key   = key
            _value = value
            _input.change ->
              newVal = _input.val()
              action.setParameter _key, newVal
              _value.text newVal
          )()

  deleteTree: ->
    for action in @actions
      action.deleteChildren()
  
  ###
    Helper functions for actions
  ###
  getWidth: -> @canvas.width
  getHeight: -> @canvas.height


  ###
    Tree building / handling
  ###
  buildTree: ->
    unless @watchedActionIndex
      return

    @deleteTree()

    watchedAction = @actions[@watchedActionIndex]
    @findChildrenRecursively watchedAction

  findChildrenRecursively: (action) ->
    children = []
    for possibleChildAction in @actions
      if possibleChildAction is action
        continue

      # console.log possibleChildAction.x, action.x + action.width, "///", action.x + action.width, possibleChildAction.x
      if possibleChildAction.y is action.y - 1
        if !(possibleChildAction.x >= action.x + action.width or possibleChildAction.x + possibleChildAction.width <= action.x)
          children.push possibleChildAction

          @findChildrenRecursively possibleChildAction

    action.children = children

  render: (action) ->
    children = action.children

    contexts = []
    for child in children
      context = @render child
      contexts.push context

    context = action.render(contexts)
    return context