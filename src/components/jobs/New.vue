<template>
	<div class="job">
		<!-- <h2>New Job</h2> -->
		<form>
			<v-container grid-list-xl fluid>
				<v-layout row wrap>
					<v-flex xs12 sm6>
						<v-text-field label="Job Name"
									  hint="A unique name to identify this job"
									  v-model="job.name"
									  required
									  />
					</v-flex>
					<v-flex xs12 sm6>
						<v-select label="Account"
								  :items="available.accounts"
								  item-text="name"
								  item-value="name"
								  v-model="job.account"
								  hint="Select the account to charge Job time to"
								  persistent-hint
								  autocomplete
								  required
								  />
					</v-flex>
				</v-layout>				
				<v-layout row wrap>
					<v-flex xs12 sm6>
						<v-text-field type="email"
									  label="Email Address"
									  hint="Recieve an email when job completes (optional)"
									  v-model="job.email"
									  />
					</v-flex>
					<v-flex xs12 sm6>
						<v-select label="Email Events"
								  :items="available.emailEvents"
								  v-model="job.emailEvents"
								  autocomplete
								  multiple
								  chips
								  hint="Select which events will generate an email"
								  persistent-hint
								  clearable
								  />
					</v-flex>
				</v-layout>
				<v-layout row wrap>
					<v-flex xs12>
						<h5 class="form-title">Partitions</h5>
						<p>Select a partition from the list below</p>
						<partition-list :partitions="available.partitions" 
										:selected="job.partition"
										@selected-partition="setSelectedPartition"
										/>

					</v-flex>
				</v-layout>
				 <v-layout row wrap>
					<v-flex xs12 sm6>
						<v-switch label="Advanced Settings" 
								  v-model="job.advancedSettings"
								  hint="Toggle for parallelization parameters"
								  :color="job.advancedSettings ? 'white' : ''"
								  persistent-hint
								  />
					</v-flex>
				 </v-layout>
				 <!-- lewis general biocompute GPU   | get node usage of lewis -->

				 <v-layout row wrap v-show="!job.advancedSettings">
					<v-alert info value="true">
						To run a multithreaded job on a single node, specify below the number of cores you want to allocate. Make sure that you set your program's parallel option to the same value.
					</v-alert>
					<v-flex xs12 sm4 class="pa-2">
							<v-text-field
								v-model="job.cpus"
								type="number"
								label="CPU / Cores"
								hint="Number of cores to run on each node"
								:rules="[ 
									(val) => { return checkPartField(val, 'cpus') },
									(val) => { return checkNotZero(val) },
								]"
								required
								/>
					</v-flex>
					<v-flex xs12 sm4 class="pa-2">
							<v-text-field
								v-model="job.memory"
								type="number"
								label="Memory / RAM"
								suffix="GB"
								hint="Memory (in Gigabytes) to accocate to your job"
								:rules="[ 
									(val) => { return checkPartField(val, 'memory') },
									(val) => { return checkNotZero(val) },
								]"
								required
								/>
					</v-flex>
					<v-flex xs12 sm4 class="pa-2">
						<v-layout row>
							<v-flex xs4 md3 offset-md2>
								<v-text-field type="number"
											  label="Days"
											  required
											  v-model="job.runtime[0]"
											  :error-messages="invalidTime"
											  :error="!validTime"
											  min="0"
											  hint="Estimated Run Time"
											  />
							</v-flex>
							<v-flex xs4 md3>
								<v-text-field type="number"
											  label="Hours"
											  required
											  v-model="job.runtime[1]"
											  :error="!validTime"
											  hint="Estimated Run Time"
											  min="0"
											  />
							</v-flex>
							<v-flex xs4 md3>
								<v-text-field type="number"
											  label="Minutes"
											  required
											  v-model="job.runtime[2]"
											  :error="!validTime"
											  hint="Estimated Run Time"
											  min="0"
											  />
							</v-flex>
						</v-layout>
					</v-flex>
				</v-layout>
				<v-layout row wrap v-show="job.advancedSettings">
					<v-alert error value="true">
						Do not use tasks to ask for multiple cpus except for MPI programs. Other than MPI, there are almost no cases where this does what you want.
					</v-alert>
					<v-alert info value="true" class="my-3">
						Programs that are either sequential, using only one cpu, or multi-threaded, using multiple cpus, can only run on a single node. Allocating cpus on multiple nodes will not speed up programs that can't make use of them. Unless you know that your program has been architected to use multiple nodes (e.g. MPI), don't allocate multiple nodes.
					</v-alert>
					<v-flex xs12 sm6>
						<div class="pa-2">
							<v-text-field
								type="number"
								label="Nodes"
								v-model="job.nodes"
								hint="Number of nodes (machines) this job will run on"
								:rules="[ (val) => { return checkNotZero(val) } ]"
								required
								/>
						</div>
						<div class="pa-2">
							<v-text-field
								type="number"
								label="Tasks per Node"
								v-model="job.tasks"
								hint="The number of instance your command is executed"
								:rules="[ (val) => { return checkNotZero(val) } ]"
								required
								/>
						</div>
						<div class="pa-2">
							<v-text-field
								type="number"
								label="CPUs per Node"
								v-model="job.tasksPerNode"
								hint="Number of Tasks to run on each Node"
								:rules="[ (val) => { return checkNotZero(val) } ]"
								required
								/>
						</div>
					</v-flex>
					<v-flex xs12 sm6>
						<div class="pa-2">
							<v-text-field
								type="number"
								label="CPU / Cores per Task"
								v-model="job.cpus"
								hint="Number of cores to run in each Task"
								:rules="[ 
									(val) => { return checkPartField(val, 'cpus') },
									(val) => { return checkNotZero(val) },
								]"
								required
								/>
						</div>
						<div class="pa-2">
							<v-text-field
								type="number"
								label="Memory / RAM Per CPU"
								v-model="job.memory"
								suffix="GB"
								hint="Memory (in Gigabytes) to accocate to each CPU"
								:rules="[ 
									(val) => { return checkPartField(val, 'memory') },
									(val) => { return checkNotZero(val) },
								]"
								required
								/>
						</div>
						<div class="pa-2">
							<v-layout>
								<v-flex xs4 md3 offset-md2>
									<v-text-field type="number"
												  label="Days"
												  required
												  v-model="job.runtime[0]"
												  :error-messages="invalidTime"
												  :error="!validTime"
												  hint="Estimated Run Time"
												  />
								</v-flex>
								<v-flex xs4 md3>
									<v-text-field type="number"
												  label="Hours"
												  required
												  v-model="job.runtime[1]"
												  :error="!validTime"
												  hint="Estimated Run Time"
												  />
								</v-flex>
								<v-flex xs4 md3>
									<v-text-field type="number"
												  label="Minutes"
												  required
												  v-model="job.runtime[2]"
												  :error="!validTime"
												  hint="Estimated Run Time"
												  />
								</v-flex>
							</v-layout>
						</div>
					</v-flex>
				</v-layout>
				<v-layout row wrap>
					<v-flex xs12>
						<v-select label="Modules to Load"
								  hint="Select the modules (software dependancies) needed to run your job"
								  :items="available.modules"
								  v-model="job.modules"
								  autocomplete
								  multiple
								  chips
								  persistent-hint
								  clearable
								  />
					</v-flex>
					<v-flex xs12 md8>
						<p>Enter commands to run. Existing scripts can be coppied or drag-and-dropped into the box below.</p>
					</v-flex>
					<v-flex xs12 md4>
						<v-select label="Markup Editor"
								  :items="editorLang"
								  v-model="editorOptions.keyMap"
								  />
					</v-flex>
				</v-layout>
				<v-layout row wrap>
					<v-flex xs12>
						<codemirror v-model="job.code" :options="editorOptions" />
					</v-flex>
				</v-layout>
			</v-container>
			<v-layout row wrap>
				<v-flex>
					<p class="text-xs-center">
						<v-btn light :disabled="!validForm || submitting" @click="submitNew">Submit Job</v-btn>
					</p>
				</v-flex>
			</v-layout>
		</form>
	</div>
</template>


<script>

// 
// 
// Slurm -- check reserved items.
// 
import { codemirror, CodeMirror } from 'vue-codemirror'
import Partitions from '@/components/Partitions'
require('codemirror/keymap/sublime.js')
require('codemirror/keymap/vim.js')
require('codemirror/keymap/emacs.js')
require('codemirror/addon/edit/matchbrackets.js')
require('codemirror/addon/dialog/dialog.js')
import('codemirror/addon/dialog/dialog.css')

export default {
  
  name: 'new-job',

  components: {
	codemirror,
	'partition-list': Partitions
  },

  created() {
	this.$http.get('api/groups/all').then( response => {
		this.available.accounts = response.data.groups
	})

	this.$http.get('api/partitions/all').then( response => {
		this.available.partitions = response.data.partitions
	})

	this.$http.get('api/modules/all').then( response => {
		response.data.modules.forEach( (mod, index) => {
			if(index > 0) this.available.modules.push({ divider: true })
			this.available.modules.push({ header: mod.name })
			mod.versions.forEach( version => {
				this.available.modules.push({ text: version, value: `${mod.name}/${version}` })
			})
		})
	})
  },

  data () {
	return {

		available: {
			partitions: [],
			accounts: [],
			modules: [],
			emailEvents: ['BEGIN', 'END', 'FAIL', 'REQUEUE', 'TIME_LIMIT']
		},

		job: {
			account: '',
			modules: [],
			partition: 'General',
			code: '',
			// mail-user
			email: '',
			// mail-type
			emailEvents: [],
			// job-name
			name: '',
			// cpus-per-task
			cpus: 1,
			// mem / mem-per-cpu
			memory: 2,
			// time
			runtime: ['0', '2', '0'],
			// nodes
			nodes: 1,
			// ntasks
			tasks: 1,
			// ntasks-per-node
			tasksPerNode: 1,
			// 
			advancedSettings: false,
		},

		module: {
			query: null,
			loading: false,
		},

		editorLang: ['sublime', 'vim', 'emacs'],

		editorOptions: {
			tabSize: 4,
			mode: 'application/x-sh',
			theme: 'base16-dark',
			lineNumbers: true,
			line: true,
			showCursorWhenSelecting: true,
			keyMap: "sublime",
			foldGutter: true,
			gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
			styleSelectedText: true,
			highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
			matchBrackets: true,
		},

		submitting: false,

	}
  },

  computed: {

  	invalidTime(){
  		return (this.validTime) ? [] : [`Exceeds max time on ${this.partition.name}`]
  	},

  	validTime(){
  		return (0 < this.job.runtime.reduce((sum, value) => { return sum + value })) && this.checkTime()
  	},

  	validForm(){
  		// filter all the string values
  		let req_strings = ['name', 'account', 'partition', 'code'].reduce((prev, val) => prev && !!this.job[val].trim() , true)
  		// filter all the integer values
		let req_ints = ['cpus', 'memory']
  		if(this.job.advancedSettings) req_ints.concat(['nodes', 'tasks', 'cpus-per-task'])
  		// 
  		req_ints = req_ints.reduce((prev, cur) => { return prev && (this.job[cur] > 0)}, true)

  		return req_strings && req_ints && this.validTime
  	},

  	partition(){
		
		let partition = Object.assign({}, this.available.partitions.find( part => { if(part.name === this.job.partition) return part }))

		if(this.job.advancedSettings){
			partition.memory = Math.floor(partition.memory / this.job.cpus)
		} 

		return (partition || { 
								cpus: 20,
								groups: "all",
								memory: 100,
								name: "default",
								nodes: 10,
								time_limit: "00"
							})
  	},

  	partitionTime(){

  		let [days, time, hours, minutes, seconds] = [ 0, 0, 0, 0, 0 ]

  		if(this.partition !== undefined && this.partition.hasOwnProperty('time_limit')){

	  		let findDays = this.partition.time_limit.split(/-/)

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
					seconds = [2]
				break;
	  		}
  		}

  		return [days, hours, minutes, seconds]
  	}

  },

  methods: {

  	checkTime(){

  		let part = [], 
  			job = [], 
  			toMinutes = [1440, 60, 1]

  		toMinutes.forEach( (conversion, index) => {
  			part[index] = this.partitionTime[index] * conversion
  			job[index] = this.job.runtime[index] * conversion
  		})

  		part = part.reduce((a, b) => a + b, 0)
	  	job = job.reduce((a, b) => a + b, 0)

	  	return job <= part

  	},

  	checkNotZero(val){
  		return (val > 0) || `A value greater than 0 is required`
  	},

  	checkPartField(val, field){
  		return (val <= parseInt(this.partition[field])) || `A maximum of ${this.partition[field]} can be specified for ${this.partition.name}`
  	},

	setSelectedPartition(partition){
		this.job.partition = partition
	},

	getUsagePercent(total, used){
		return parseInt((used / total) * 100)
	},

	submitNew(){
		this.submitting = true

		this.$http.post('api/jobs/new', this.job ).then( response => {
			if(response.data.success){
				this.$emit('submit-new-job')
				// this.$router.push({ path: '/jobs' })
			}
		}).catch((error) => {
			this.submitting = false
		})
	},

	close(){
		this.$emit('submit-new-job')
	}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

	h4.page-title {
		text-align: right;
		font-style: italic;
		font-size: 2em;
		color: gray;
		padding-bottom: 10px;
	}

	fieldset {
		border: 1px solid #35689a;
		border-radius: 20px;
	}

	div.input-group__messages div.input-group__hint{
		color: lightslategray;
	}
</style>