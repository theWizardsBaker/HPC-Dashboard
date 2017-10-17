#!/usr/bin/ruby -w
require 'filesize'

partition_list = {}

# get the partitions
partitions = `ssh 128.206.234.6 'sinfo -a -O partitionname,cpus,memory,time,groups,nodes'`
# partitions = `cat tpartion.txt`
partition_names = %w{Bonus Gpu General HTC BioCompute Lewis RC}
# split the partitions into an array
partitions = partitions.split(/\n+/)
# loop through the partitions
partitions.each_with_index do |partition, index|  
	columns = partition.split(/\s+/)
	partition_names.each do |part_name|
		if part_name.match(columns[0])
			partition_list[columns[0]] = {
				cpus: columns[1].chomp('+'),
				memory: Filesize.from("#{columns[2].chomp('+')} MB").to_f('GB').to_i,
				time_limit: columns[3],
				groups: columns[4],
				nodes: columns[5]
			}
		end
	end
end
print partition_list