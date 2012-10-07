window.Webbzeug ?= {}
window.Webbzeug.Version = '0.0.1'
window.Webbzeug.App = class App
  gridHeight: 27
  gridWidth:  112 / 3
  shiftPressed: false
  constructor: (@canvas) ->
    @workspace = $('.workspace')
    @setupCanvas()
    @reset()

    @loadSaveHandler = new Webbzeug.LoadSaveHandler $('.save-link'), $('input#file')

    @handleNavigation()
    @handleKeyboardInput()

  ###
    Setup
  ###

  setupCanvas: ->
    @context = @canvas.getContext '2d'
    @width = @context.canvas.width
    @height = @context.canvas.height

  reset: ->
    @memory = []
    @actions = {}
    @incrementalIndex = 0
    @watchedAction = null
    @watchedActionIndex = null
    @selectedElement = null
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
    self = this
    $('.navigation li').click (e) ->
      e.preventDefault()

      self.handleWorkspaceClick()

      $(this).parent().find('li').removeClass('active')
      $(this).addClass('active')

      self.selectedActionId = $(this).attr('data-id')
      self.selectedActionName = $(this).text()
      self.selectedActionType = $(this).attr('data-type')

  ###
    Action creation / handling / dragging / resizing
  ###
  newActionElement: (x, y, actionName, width, actionType) ->
    el = $('<div>').addClass('action')

    el.text(actionName).addClass(actionType).css
      left: x
      top: y
      width: width * @gridWidth - 12

    dragger = $('<div>').addClass('dragger').appendTo el
    $('.workspace').append el

    return el

  applyActionToElement: (actionId, x, y, width, index, element) ->
    action = new Webbzeug.ClassMap[actionId].class this, x, y, width, index

    element.attr 'data-index': index

    @actions[index] = action

    @handleElementClick null, element
    element.click (e) =>
      @handleElementClick e, element

    @handleElementDrag element

    element.on 'mouseenter', =>
      if action.renderTime
        $('.debug').text action.constructor.name + ' rendered in ' + action.renderTime + 'ms'
    element.on 'mouseleave', =>
      if @renderTime
        $('.debug').text 'Texture rendered in ' + @renderTime + 'ms'

    return action

  handleWorkspaceClick: ->
    $('.workspace').mouseenter (e) =>
      if not @selectedElement and @selectedActionId
        el = @newActionElement e.pageX, e.pageY, @selectedActionName, 3, @selectedActionType

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
          @applyActionToElement @selectedActionId, x, y, 3, @incrementalIndex, @selectedElement

          @incrementalIndex++

        @selectedElement = null
        @selectedActionId = @selectedActionType = @selectedActionName = null

  handleElementDrag: (element) ->
    # Resize drag
    $(element).find('.dragger').mousedown (e) =>
      e.stopPropagation()

      editingElement = element
      $('.workspace').mousemove (e) =>
        offsetX = $('.workspace').offset().left

        editingElement.css
          width: Math.floor((e.pageX - offsetX - editingElement.position().left) / @gridWidth) * @gridWidth - 12

      $(document).mouseup (e) =>
        $('.workspace').off 'mousemove'

        action = @actions[editingElement.attr('data-index')]
        action.width = Math.round(editingElement.width() / @gridWidth)

    # Move drag
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

  handleElementClick: (e, element) ->
    @selectedActionIndex = element.attr('data-index')

    $('.workspace .action').removeClass('selected')
    $(element).addClass('selected')
    
    if @shiftPressed
      @showParameters e, @actions[@selectedActionIndex]

  ###
    Parameters
  ###
  showParameters: (e, action) ->
    self = this

    settingsWindow = $('.workspace-wrapper .parameters')

    settingsWindow.show().css
      left: (action.x + action.width + 1) * @gridWidth #+ $('.workspace-wrapper').offset().left
      top: (action.y + 1) * @gridHeight #+ $('.workspace-wrapper').offset().top

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

        when 'number'
          li = $('<li>').appendTo settingsUl
          label = $('<div>').addClass('label').text((info.name || key) + ':').appendTo li

          attributes = 
            type: 'range'
            min: info.min or 0
            max: info.max or 9999
            value: action.getParameter(key) or info.default
            step: info.step or 1

          input = $('<input>').attr(attributes).appendTo li

          value = $('<div>').addClass('value').text(attributes.value).appendTo li

          (=>
            _input = input
            _key   = key
            _value = value
            _input.change ->
              newVal = _input.val()

              if !!(newVal % 1)
                newVal = parseFloat(newVal)
              else
                newVal = parseInt(newVal)

              action.setParameter _key, newVal
              _value.text newVal

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
    for childIndex, possibleChildAction of @actions
      if possibleChildAction is action
        continue

      # console.log possibleChildAction.x, action.x + action.width, "///", action.x + action.width, possibleChildAction.x
      if possibleChildAction.y is action.y - 1
        if !(possibleChildAction.x >= action.x + action.width or possibleChildAction.x + possibleChildAction.width <= action.x)
          children.push possibleChildAction

          @findChildrenRecursively possibleChildAction

    action.children = children

  ###
    Rendering
  ###
  renderAll: ->
    @buildTree()

    watchedAction = @actions[@watchedActionIndex]

    unless watchedAction?
      return false

    startTime = +new Date()
    if context = @render watchedAction
      imageData = context.getImageData 0, 0, @getWidth(), @getHeight()
      @context.putImageData imageData, 0, 0
    @renderTime = (+new Date() - startTime)

    $('.debug').text 'Texture rendered in ' + @renderTime + 'ms'

  render: (action) ->
    unless action?
      return false

    children = action.children

    contexts = []
    for child in children
      context = @render child
      contexts.push context

    startTime = +new Date()
    context = action.render(contexts)
    action.renderTime = (+new Date()) - startTime
    return context