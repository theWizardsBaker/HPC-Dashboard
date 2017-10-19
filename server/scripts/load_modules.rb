#!/usr/bin/ruby -w

require 'mongo'

module_list = []
# mongo log level
# Mongo::Logger.logger.level = ::Logger::FATAL
# get the modules
modules = `ssh 128.206.234.6 'module avail -t -u adv' &> /tmp/modavail`
modules = `cat /tmp/modavail`
# split the modules into an array
modules = modules.split(/\n+/)
# loop through the modules
modules.each do |mod|  
	# ignore new cluster listing lines
	unless /^\/cluster/.match(mod)
		# look for the module's root name
		mod_name = /.*\//.match(mod).to_s.chomp('/')
		# get only the version 
		version = mod[(mod_name.to_s.length + 1)..mod.length]
		# add the root name to the list of modules
		mod_index = module_list.index { |mod_list| mod_list[:name] == mod_name }
		# check if the HPC module exists
		if mod_index.nil?
			module_list.push({ name: mod_name, search_name: mod_name.downcase, versions: [ version ], description: '' })
		else
			# push only the version of the module into the list
			module_list[mod_index][:versions].push(version)
		end
	end
end

# select the database
client = Mongo::Client.new([ "#{ARGV[0]}:27017" ], :database => ARGV[1], :connect => :direct, :user => "HPCUser", :password => "65201")
# print module_list
module_list.each do | mod |
	begin
		# client[:modules].bulk_write([{ :update_many => { :filter => {}, :update => module_list, :upsert => true } }], :ordered => false)
		# client[:modules].update_one({module_list)
		client[:modules].update_one({ :name => mod[:name] }, { :$set => mod }, { :upsert => true })
	rescue Exception => e
		puts "Modules not updated: #{e.to_s}"
	end
end

client.close

