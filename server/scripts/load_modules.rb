#!/usr/bin/ruby -w

module_list = {}

# get the modules
modules = system "ssh 128.206.234.6 'module avail -t -u adv' &> tmods.txt"
modules = `cat tmods.txt`
# split the modules into an array
modules = modules.split(/\n+/)
# loop through the modules
modules.each do |mod|  
	# ignore new cluster listing lines
	unless /^\/cluster/.match(mod)
		# look for the module's root name
		mod_name = /.*\//.match(mod).to_s.chomp('/')
		# add the root name to the list of modules
		unless module_list.key?(mod_name)
			module_list[mod_name] = { versions: [] }
		end
		# push only the version of the module into the list
		module_list[mod_name][:versions].push(mod[(mod_name.to_s.length + 1)..mod.length])
	end
end

print module_list
