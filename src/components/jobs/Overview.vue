<template>
	<div class="jobs">
		<h2>Overview</h2>
		<div>
			<v-btn class="green" :to="'newjob'" dark> 
				<v-icon dark left>fa-plus</v-icon> New Job
			</v-btn>
		</div>
		<v-card class="mb-0">
			<v-card-title class="my-1">
				<v-layout row>
					<v-flex xs8 md9>
					<h5 class="mb-0 pt-3">Job History</h5>
					</v-flex>
					<v-flex xs4 md3>
						<v-text-field 
							append-icon="search"
							label="Search"
							single-line
							hide-details
							v-model="search"
							/>
					</v-flex>
				</v-layout>
			</v-card-title>
			<v-data-table   
				:headers="data.headers"
				:items="data.rows"
				:search="search"
				class="elevation-1"
				>
			<template slot="items" scope="props">
				<tr :active="props.selected" @click="props.selected = !props.selected">
					<td class="text-xs-right">
						{{ props.item.job }}
					</td>
					<td class="text-xs-right">{{ props.item.name }}</td>
					<td class="text-xs-right">{{ props.item.group }}</td>
					<td class="text-xs-right">{{ props.item.partition }}</td>
					<td class="text-xs-right" :class="statusColor(props.item.state)">{{ props.item.state }}</td>
					<td class="text-xs-right">{{ props.item.reason }}</td>
					<td class="text-xs-right">{{ props.item.maxcpus }}</td>
					<td class="text-xs-right">{{ props.item.maxram }}</td>
					<td class="text-xs-right">{{ props.item.submitted }}</td>
					<td class="text-xs-right">{{ props.item.start }}</td>
					<td class="text-xs-right">{{ props.item.elapsed }}</td>
				</tr>
			</template>
			</v-data-table>
		</v-card>
	</div>
</template>

<script>
	export default {
		name: 'jobs-overview',
		data () {
			return {
				
				search: '',

				data: {
					headers: [
						{ text: 'Job Id', value: 'job' },
						{ text: 'Name', value: 'name' },
						{ text: 'Group', value: 'group' },
						{ text: 'HPC Partition', value: 'partition' },
						{ text: 'Completed Status', value: 'state' },
						{ text: 'Status Reason', value: 'reason' },
						{ text: 'Max CPU', value: 'maxcpus' },
						{ text: 'Max Ram', value: 'maxram' },
						{ text: 'Submited', value: 'submitted' },
						{ text: 'Started', value: 'start' },
						{ text: 'Run Time', value: 'elapsed' },
					],

					rows: [

						{
							job: '3002538',
							name: 'Job 1',
							group: 'elsiklab',
							partition: 'Lewis',
							state: 'PENDING',
							maxcpus: '10',
							maxram: '20G',
							reason: 'PartitionTimeLimit',
							submitted: 'August 15 2017 3:17pm',
							start: 'Unknown',
							elapsed: 'Unknown',
						},
						{
							job: '3023438',
							name: 'Job 2',
							group: 'spencer',
							partition: 'BioCompute',
							state: 'COMPLETED',
							maxcpus: '30',
							maxram: '28G',
							reason: '',
							submitted: 'July 2 2017 4:00pm',
							start: 'Unknown',
							elapsed: 'Unknown',
						},
						{
							job: '3112538',
							name: 'Job 3',
							group: 'general',
							partition: 'General',
							state: 'CANCELLED',
							maxcpus: '2',
							maxram: '200G',
							reason: 'PartitionTimeLimit',
							submitted: 'Sep 9 2017 2:12pm',
							start: 'Unknown',
							elapsed: 'Unknown',
						},
						{
							job: '3002538',
							name: 'Job 5',
							group: 'elsiklab',
							partition: 'General',
							state: 'FAILED',
							maxcpus: '10',
							maxram: '8G',
							reason: 'PartitionTimeLimit',
							submitted: 'Sep 9 2017 10:30am',
							start: 'Unknown',
							elapsed: 'Unknown',
						},

					]
				}
			}
		},
		methods: {
			statusColor(status){
				switch(status.toLocaleLowerCase()){
					case "completed": 
						return 'green--text'; break;
					case "failed":
						return 'red--text'; break;
					case "pending":
						return 'yellow--text'; break;
					case "cancelled":
						return 'grey--text'; break;
				}
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.table__overflow {
		border-top: 1px solid rgb(128, 128, 128);
	}
</style>