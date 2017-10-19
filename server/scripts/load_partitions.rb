#!/usr/bin/ruby -w
require 'filesize'
require 'mongo'

PARTITION_NAMES = %w{Bonus Gpu General HTC BioCompute Lewis RC}
partition_list = []

# get the partitions
partitions = `ssh 128.206.234.6 'sinfo -a -O partitionname,cpus,memory,time,groups,nodes' &> /tmp/partitoinAvail`
partitions = `cat /tmp/partitoinAvail`
# split the partitions into an array
partitions = partitions.split(/\n+/)
# loop through the partitions
partitions.each_with_index do |partition, index|  
	columns = partition.split(/\s+/)
	PARTITION_NAMES.each do |part_name|
		if part_name.match(columns[0])
			partition_list.push({
				name: columns[0],
				cpus: columns[1].chomp('+'),
				memory: (Filesize.from("#{columns[2].chomp('+')} MB").to_f('GB').to_i).to_s,
				time_limit: columns[3],
				groups: columns[4],
				nodes: columns[5]
			})
		end
	end
end

client = Mongo::Client.new([ "#{ARGV[0]}:27017" ], :database => ARGV[1], :connect => :direct, :user => "HPCUser", :password => "65201")
# print partition_list
partition_list.each do | part |
	begin
		# client[:modules].bulk_write([{ :update_many => { :filter => {}, :update => partition_list, :upsert => true } }], :ordered => false)
		# client[:modules].update_one({partition_list)
		client[:partitions].update_one({ :name => part[:name] }, { :$set => part }, { :upsert => true })
	rescue Exception => e
		puts "Modules not updated: #{e.to_s}"
	end
end