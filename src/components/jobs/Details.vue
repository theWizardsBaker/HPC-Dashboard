<template>
  <div class="hello">
  	<v-container grid-list-xs>
  		<v-layout row wrap>
	  		<v-flex>
			    <h3>{{job.name}}</h3>
			    <p>
				    {{job.job_id}}
				    <v-chip label :class="statusColor(job.status)">
				    	<strong>Status</strong>
				    	<span class="pl-3">{{job.status | capitalize}}</span> 
				    	<span class="pl-1">({{job.status_reason}})</span>
				    </v-chip>
				    <v-chip label>
				    	<strong>Created</strong> 
				    	<span class="pl-3">{{formatDate(job.submitted)}}</span>
				    </v-chip>
				</p>
			</v-flex>
		</v-layout>
		<v-layout row wrap>
			<v-flex>
				<h4>Job Settings</h4>
				<table>
					<tbody>
						<tr>
							<th>Partition</th>
					    	<td>{{job.partition}}</td>
					    </tr>
						<tr>
							<th>Account</th>
					    	<td>{{job.account}}</td>
					    </tr>
					    <tr>
							<th>CPUs</th>
					    	<td>{{job.cpus}}</td>
					    </tr>
						<tr>
							<th>Memory</th>
					    	<td>{{job.memory}}GB</td>
					    </tr>
					    <template v-if="job.advanced_settings">
							<tr>
								<th>Nodes</th>
						    	<td>{{job.nodes}}</td>
						    </tr>
							<tr>
								<th>Tasks</th>
						    	<td>{{job.tasks}}</td>
						    </tr>
						    <tr>
								<th>Tasks per Node</th>
						    	<td>{{job.taks_per_node}}</td>
						    </tr>
							<tr>
								<th>Memory</th>
						    	<td>{{job.memory}}GB</td>
						    </tr>
					    </template>
						<tr>
							<th>Max Runtime</th>
					    	<td>
					    		<template v-if="job.runtime[0] > 0">
						    		{{job.runtime[0]}}
						    		{{ 'Day' | pluralize(job.runtime[0]) }}
					    		</template>
					    		<template v-if="job.runtime[1] > 0">
						    		{{job.runtime[1]}}
						    		{{ 'Hour' | pluralize(job.runtime[1]) }}
					    		</template>
					    		<template v-if="job.runtime[2] > 0">
						    		{{job.runtime[2]}}
						    		{{ 'Minute' | pluralize(job.runtime[2]) }}
					    		</template>
					    	</td>
					    </tr>
					    <template v-if="job.email">
							<tr>
								<th>Status Email</th>
						    	<td>{{job.email}}</td>
						    </tr>
							<tr>
								<th>Email Events</th>
						    	<td>{{job.email_events.join(', ')}}</td>
						    </tr>
						</template>
						<tr>
							<th>Output File</th>
					    	<td>{{job.output_file}}</td>
					    </tr>
					    <tr>
					    	<th>Modules</th>
					    	<td>
					    		<ul>
					    			<li v-for="module in job.modules">
					    				{{module}}
					    			</li>
					    		</ul>
					    	</td>
					    </tr>
					</tbody>
				</table>
			</v-flex>
			<v-flex>
			    <code>
				    {{job.file_text}}
				</code>
			</v-flex>
		</v-layout>
		<v-layout>

		</v-layout>
	</v-container>
  </div>
</template>

<script>

import Moment from 'moment'

export default {
  name: 'job-details',

  props: ['id', 'job'],

  data () {
    return {

    }
  },
  
  methods: {

	statusColor(status){
		switch(status.toLocaleLowerCase()){
			case "completed": 
				return 'green'; break;
			case "failed":
				return 'red'; break;
			case "pending":
				return 'yellow'; break;
			case "cancelled":
				return 'grey'; break;
		}
	},


	formatDate(date){
		if(date){
			return Moment(new Date(date)).format('MMM DD YYYY')
		}
	}
  },


  filters: {
	capitalize(value) {
	  if (!value) return ''
	  value = value.toString()
	  return value.charAt(0).toUpperCase() + value.slice(1)
    },
    pluralize (string, value) {
  		return string + (value == 1 ? '' : 's')
	}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
	
	table {
		text-align: left;
		border-collapse: collapse;

		th {
			border-right: 1px solid;
			padding: 10px
		}

		td {
			padding-left: 10px;
		}
	}

	code {
		padding: 10px;
		overflow: auto;
	}
</style>