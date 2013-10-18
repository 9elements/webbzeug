window.after = (t,f) -> setTimeout f, t
window.every = (t,f) -> setInterval f, t

$ ->
  base = 'https://github.com/saschagehlich/webbzeug/blob/master/'
  $('.source').each (index, el) ->
    $el = $(el)

    $el.attr href: base + $el.attr('data-file')