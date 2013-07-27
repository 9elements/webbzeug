guard 'coffeescript', :input => 'coffee', :output => 'js',  :bare => false
guard 'sass',         :input => 'sass',   :output => 'css', :load_paths => Dir.glob(File.join(Gem.dir, "gems", "compass*", "frameworks/blueprint/stylesheets")) + Dir.glob(File.join(Gem.dir, "gems", "compass*", "frameworks/compass/stylesheets"))

guard 'haml',         :input => '.',         :output => '.' do
  watch(/^.+\.html\.haml$/)
end

guard 'livereload', :apply_js_live => false do
  watch(%r{js/.+\.(css|js|html)})
  watch(%r{css/.+\.(css|js|html)})
end

notification :growl
