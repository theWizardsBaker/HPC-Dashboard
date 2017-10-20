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
					<div class="px-3 py-1">
						<p class="text-xs-center">Total Nodes: {{partition.nodes}}</p>
					</div>
					<div class="px-3 py-1">
						<p class="text-xs-center">Max Run Time: {{formatTime(partition.time_limit)}}</p>
					</div>
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
  	  let time_post = ['Days', '', 'Hours', '', 'Minutes', '', 'Seconds']
  	  // get the time split by delimiter 
  	  let time = timestamp.split(/(\-|\:)/g).map( (time, ind) => {
  	  	if(time > 0){
  	  		return `${time} ${time_post[ind]}`
  	  	} else {
  	  		return ''
  	  	}
  	  })
  	  // return our time string
  	  return time.join(' ')
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