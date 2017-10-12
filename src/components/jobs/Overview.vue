<template>
	<div class="jobs">
		
		<h2>Overview</h2>

		<v-layout row>

  			<v-btn class="green" @click.stop="newJob" dark> 
				<v-icon dark left>fa-plus</v-icon> New Job
			</v-btn>

			<v-dialog v-model="showJobDialog" 
					  :lazy="true" 
					  fullscreen 
					  transition="dialog-bottom-transition" 
					  :hide-overlay="true" 
					  :overlay="false">
				<v-card>
					<v-toolbar>
						<v-btn @click.native="closeJob()" icon dark>
							<v-icon>close</v-icon>
						</v-btn>
						<v-toolbar-title>
							<span v-if="currentRoute === 'newjob'">
								New Job
							</span>
							<span v-else>
								Job {{selectedJob}} Info
							</span>

						</v-toolbar-title>
					</v-toolbar>
					<router-view></router-view>
				</v-card>
			</v-dialog>
		</v-layout>

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
					<!-- <tr :active="props.selected" @click="props.selected = !props.selected"> -->
					<tr>
						<td class="text-xs-right">
							<v-btn flat small primary class="job-link white--text" @click.stop="showJob(props.index)">
								{{ props.item.job }}
							</v-btn>
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
	import JobDialog from '@/components/dialogs/Job'

	export default {

		name: 'jobs-overview',

		components: {
			jobDialog: JobDialog
		},

		updated() {
			if(this.currentRoute === 'detailjob'){
				this.showJob(this.$route.params.id)
			}
			if(this.currentRoute === 'newjob'){
				this.newJob()
			}
		},

		data() {
			return {
				
				search: '',

				showJobDialog: false,

				selectedJob: 0,

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
							job: '3002530',
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

		computed: {

			currentRoute() {
				return this.$route.name
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
			},

			newJob(){
				this.showJobDialog = true
				this.$router.push({ name: 'newjob' })
			},


			showJob(job){
				this.showJobDialog = true
				this.selectedJob = job
				this.$router.push({ name: 'detailjob', params: { id: job } })
			},

			closeJob(){
				this.showJobDialog = false
				this.$router.push({ name: 'jobs' })
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.table__overflow {
		border-top: 1px solid rgb(128, 128, 128);
	}
	.job-link {
		text-decoration: underline;
		color: white;
	}
</style>