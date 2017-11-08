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
					  :overlay="false"
					  >
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
								Job Info
							</span>
						</v-toolbar-title>
					</v-toolbar>
					<router-view @submit-new-job="closeJob()" :job="selectedJob"></router-view>
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
			<v-data-table :headers="jobTable.headers"
						  :items="jobTable.rows"
						  :search="search"
						  class="elevation-1"
						  no-data-text="No Jobs to Display"
						  >
				<template slot="items" scope="props">
					<!-- <tr :active="props.selected" @click="props.selected = !props.selected"> -->
					<tr>
						<td class="text-xs-right">
							<v-btn flat small primary class="job-link white--text" @click.stop="showJob(props.index)">
								{{ props.item.job || 'pending' }}
							</v-btn>
						</td>
						<td class="text-xs-right">{{ props.item.name }}</td>
						<td class="text-xs-right">{{ props.item.account }}</td>
						<td class="text-xs-right">{{ props.item.partition }}</td>
						<td class="text-xs-right" :class="statusColor(props.item.status)">{{ props.item.status }}</td>
						<td class="text-xs-right">{{ props.item.status_reason }}</td>
						<td class="text-xs-right">{{ formatDate(props.item.submitted) }}</td>
						<td class="text-xs-right">{{ formatDate(props.item.start) }}</td>
						<td class="text-xs-right">{{ formatDate(props.item.elapsed) }}</td>
					</tr>
				</template>
			</v-data-table>
		</v-card>
	</div>
</template>

<script>
	
	import Moment from 'moment'

	export default {

		name: 'jobs-overview',

		created(){
			this.$http.get('api/jobs/all').then( response => {
				this.jobTable.rows = response.data.jobs
				if(this.currentRoute === 'detailjob'){
					// this.showJob(this.$route.params.id)
					this.selectedJob = this.jobTable.rows.filter( row => { if(row._id === this.$route.params.id) return row })[0]
					this.showJobDialog = true
				} else if(this.currentRoute === 'newjob'){
					// this.newJob()
					this.showJobDialog = true
				}
			})
		},

		data() {
			return {
				
				search: '',

				showJobDialog: false,

				selectedJob: null,

				jobTable: {

					headers: [
						{ text: 'Job Id', value: '_id' },
						{ text: 'Name', value: 'name' },
						{ text: 'Account', value: 'account' },
						{ text: 'HPC Partition', value: 'partition' },
						{ text: 'Completed Status', value: 'status' },
						{ text: 'Status Reason', value: 'status_reason' },
						{ text: 'Submited', value: 'submitted' },
						{ text: 'Started', value: 'start' },
						{ text: 'Run Time', value: 'elapsed' },
					],

					rows: []
				}
			}
		},

		computed: {

			currentRoute() {
				return this.$route.name
			}

		},

		watch: {
			'$route' : 'routeChange'
		},

		methods: {

			routeChange(){
				this.$http.get('api/jobs/all').then( response => {
					this.jobTable.rows = response.data.jobs
				})
			},

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


			showJob(index){
				this.showJobDialog = true
				this.selectedJob = this.jobTable.rows[index]
				this.$router.push({ name: 'detailjob', params: { id: this.selectedJob._id } })
			},

			closeJob(){
				this.showJobDialog = false
				this.$router.push({ name: 'jobs' })
			},

			formatDate(date){
				if(date){
					return Moment(new Date(date)).format('MM-DD-YYYY')
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
	.job-link {
		text-decoration: underline;
		color: white;
	}
</style>