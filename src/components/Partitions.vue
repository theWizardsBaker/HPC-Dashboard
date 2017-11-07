<template>
	<v-container class="partitions" fluid grid-list-xs>
	    <v-layout row wrap>
			<v-flex xs12 sm4 md4 lg3 v-for="partition in partitions" :key="partition.id">
				<v-card :class="{ 'selected-card' : partition.name == selected }" 
						class="partition-card" 
						@click="setSelectedPartition(partition.name)"
						>
					<v-card-title primary-title >
						<v-icon v-if="partition.name == selected" class="green--text">fa-check-circle-o</v-icon>
						<v-icon v-else>fa-circle-o</v-icon>
						<h5 class="pa-0 ma-0 ml-4">{{partition.name}}</h5>
					</v-card-title>
					<v-container fluid>
						<v-layout row class="px-3 py-1">
							<p class="text-xs-center">Total Nodes: {{partition.nodes}}</p>
						</v-layout>
						<v-layout row class="px-3 py-1">
							<p class="text-xs-center">Max Run Time: {{formatTime(partition.time_limit)}}</p>
						</v-layout>
					</v-container>
					<div class="px-3 py-1">
						<div>
							{{partition.cpus}} CPUs
							<v-progress-linear height="10"
											   :value="100"
											   error
											   />
							<!--
							<div v-tooltip:top="{ html: `${100 -partition.cpuUsage}% Free` }">
							</div>
							-->
						</div>
						<div>						
							{{partition.memory}} GB Memory
							<v-progress-linear height="10"
											   :value="100"
											   error
											   />
							<!--
							<div v-tooltip:top="{ html: `${100 - getUsagePercent(partition.memCount, partition.memUsage)}% Free` }">
							</div>
							-->
						</div>
					</div>
				</v-card>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
export default {

  name: 'partitions',

  props: ['partitions', 'selected'],

  data() {
    return {

    }
  },

  methods: {

  	formatTime(timestamp){

  		let [days, time, hours, minutes, seconds] = [ 0, 0, 0, 0, 0]

  		let findDays = timestamp.split(/-/)
  		// D-HH:MM:SS
  		// D-HH
  		if(findDays.length > 1){
	  		// set the days
	  		days = findDays[0]
	  		// the hours / minutes 
	  		time = findDays[1]
  		} else {
  			days = 0
  			time = findDays[0]
  		}

  		let findTime = time.split(/\D+/g)
  		switch(findTime.length){
  			case 1:
  				// D-HH
  				if(findDays.length > 1){
	  				hours = findTime[0]
	  				minutes = 0
  					seconds = 0
  				} else {
  				// MM
  					hours = 0
  					minutes = findTime[0]
  					seconds = 0
  				}
  			break;
  			case 2: 
  				// D-HH:MM
  				if(findDays.length > 1){
  					hours = findTime[0]
  					minutes = findTime[1]
  					seconds = 0
  				} else {
  				// MM:SS
  					hours = 0
  					minutes = findTime[0]
  					seconds = findTime[1]
  				}
  			break;
  			case 3: 
				hours = findTime[0]
				minutes = findTime[1]
				seconds = findTime[2]
			break;
  		}

		let timeLabel = ['Days', 'Hours', 'Minutes', 'Seconds']

		// get the time split by delimiter 
		let timeString = [days, hours, minutes, seconds].map( (time, ind) => {
			if(time > 0){
				return `${time} ${timeLabel[ind]}`
			} else {
				return ''
			}
		})

		// return our time string
		return timeString.join(' ')
  	},

  	setSelectedPartition(partition_name){
  		this.$emit('selected-partition', partition_name)
  	}

  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

	.partition-card {
		border: 2px solid rgba(0,0,0, 0);
		cursor: pointer;
	}

	.selected-card {
		border: 2px solid rgba(76, 175, 80, 1);
	}
</style>