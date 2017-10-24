#!/usr/bin/ruby -w

require 'mongo'

association_list = []
# mongo log level
# Mongo::Logger.logger.level = ::Logger::FATAL
# get the modules
associations = `ssh 128.206.234.6 'sacctmgr show Association -P' &> /tmp/associate`
associations = `cat /tmp/associate`
# split the modules into an array
groups = associations.split(/\n+/)
# loop through the modules
groups.each.with_index do |group, ind|  
	# ignore new cluster listing lines
	unless ind == 0
		# look for the module's root name
		# look for the module's root name
		group_arr = group.split(/\|/)
		# add the root name to the list of modules
		grp_index = association_list.index { |mod_list| mod_list[:name] ==  group_arr[1] }
		# check if the HPC module exists
		if grp_index.nil?
			association_list.push({ name: group_arr[1], search_name: group_arr[1].downcase, users: [] })
		elsif 
			# push only the version of the module into the list
			association_list[grp_index][:users].push(group_arr[2])
		end
	end
end

# select the database
client = Mongo::Client.new([ "#{ARGV[0]}:27017" ], :database => ARGV[1], :connect => :direct, :user => "HPCUser", :password => "65201")
# print association_list
association_list.each do | assoc |
	begin
		client[:groups].update_one({ :name => assoc[:name] }, { :$set => assoc }, { :upsert => true })
	rescue Exception => e
		puts "Groups not updated: #{e.to_s}"
	end
end

client.close

