set :application,   "webbzeug"
set :domain,        "webbzeug.com"
set :user,          "webbzeug"
set :repository,    "gitolite@dev.9elements.de:webbzeug.git"
set :branch,        "master" unless exists?(:branch)
set :deploy_server, "webbzeug.com" unless exists?(:deploy_server)
set :env,           "production" unless exists?(:env)
set :deploy_to,     "/home/#{user}/#{env}"
set :port,          23222

set :normalize_asset_timestamps, false

set :use_sudo,    false

ssh_options[:forward_agent] = true
set :scm, :git
set :deploy_via, :remote_cache
set :git_enable_submodules, 1

role :app, domain
role :web, domain
role :db,  domain, :primary => true

namespace :deploy do
  task(:start,   :roles => :app) {}
  task(:stop,    :roles => :app) {}
  task(:restart, :roles => :app) {}
end
