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
								  v-model="job.account"
								  hint="Select the account to charge Job time to"
								  persistent-hint
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
								type="number"
								label="CPU / Cores"
								hint="Number of cores to run on each node"
								required
								/>
					</v-flex>
					<v-flex xs12 sm4 class="pa-2">
							<v-text-field
								type="number"
								label="Memory / RAM"
								suffix="GB"
								hint="Memory (in Gigabytes) to accocate to your job"
								required
								/>
					</v-flex>
					<v-flex xs12 sm4 class="pa-2">
						<v-layout>
							<v-flex xs4 md3>
								Estimated Run Time
							</v-flex>
							<v-flex xs4 md3>
								<v-text-field type="number"
											  label="Days"
											  value="0"
											  required
											  />
							</v-flex>
							<v-flex xs4 md3>
								<v-text-field type="number"
											  label="Hours"
											  value="2"
											  required
											  />
							</v-flex>
							<v-flex xs4 md3>
								<v-text-field type="number"
											  label="Minutes"
											  value="0"
											  max="60"
											  required
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
								value="1"
								hint="Number of nodes (machines) this job will run on"
								required
								/>
						</div>
						<div class="pa-2">
							<v-text-field
								type="number"
								label="Tasks per Node"
								value="1"
								hint="The number of instance your command is executed"
								required
								/>
						</div>
						<div class="pa-2">
							<v-text-field
								type="number"
								label="CPUs per Task"
								value="1"
								hint="Number of CPUs for each Task"
								required
								/>
						</div>
					</v-flex>
					<v-flex xs12 sm6>
						<div class="pa-2">
							<v-text-field
								type="number"
								label="CPU / Cores"
								value="1"
								hint="Number of cores to run on each node"
								required
								/>
						</div>
						<div class="pa-2">
							<v-text-field
								type="number"
								label="Memory / RAM"
								value="2"
								suffix="GB"
								hint="Memory (in Gigabytes) to accocate to your job"
								required
								/>
						</div>
						<div class="pa-2">
							<v-layout>
								<v-flex xs4 md3 offset-md1>
									<v-text-field type="number"
												  label="Days"
												  value="0"
												  required
												  />
								</v-flex>
								<v-flex xs4 md3>
									<v-text-field type="number"
												  label="Hours"
												  value="2"
												  required
												  />
								</v-flex>
								<v-flex xs4 md3>
									<v-text-field type="number"
												  label="Minutes"
												  value="0"
												  max="60"
												  required
												  />
								</v-flex>
							</v-layout>
						</div>
					</v-flex>
				</v-layout>
				<v-layout row wrap>
					<v-flex xs12>
						<v-select
								label="Modules to Load"
								hint="Select the modules (software dependancies) needed to run your job"
								:items="available.modules"
								v-model="job.modules"
								:async-loading="module.loading"
								:search-input.sync="module.query"
								debounce-search="500"
								autocomplete
								cache-items
								multiple
								chips
								persistent-hint
								clearable
								item-text="name"
								item-value="val"
								>
							<template slot="item" scope="data">
								<template  v-if="data.item.hasOwnProperty('header')">
									<v-list-tile-content v-text="data.item.header" />
								</template>
								<template v-else>
										<v-list-tile-content>
						                    <v-list-tile-title v-text="data.item.name" />
						                </v-list-tile-content>
								</template>
							</template>
						</v-select>
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
			<v-layout>
				<v-btn light disabled>Submit Job</v-btn>
			</v-layout>
		</form>
	</div>
</template>


<script>
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
	this.$http.get('api/partitions/all').then( response => {
		this.available.partitions = response.data.partitions
	})
  },

  data () {
	return {

		available: {
			partitions: [],
			accounts: [ 'General', 'elsiklab', 'spencer' ],
			modules: [],
			emailEvents: ['BEGIN', 'END', 'FAIL', 'REQUEUE', 'TIME_LIMIT']
		},

		job: {
			account: '',
			modules: [],
			partition: '',
			code: '',
			email: false,
			// mail-user
			emailAddr: '',
			// mail-type
			emailEvents: '',
			// job-name
			name: '',
			// cpus-per-task
			cpus: 1,
			// mem / mem-per-cpu
			memory: 2,
			// time
			runtime: ['0', '0', '0'],
			// nodes
			nodes: 1,
			// ntasks
			tasks: 1,
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
		}

	}
  },

  watch: {
	'module.query'(val){
		this.getModules(val)
	}
  },

  methods: {
	setSelectedPartition(partition){
		this.job.partition = partition
	},
	getUsagePercent(total, used){
		return parseInt((used / total) * 100)
	},
	getModules(searchFor){
		if(!searchFor) return ""
		this.$http.get(`api/modules/find/${searchFor}`).then( response => {
			let modules = []
			response.data.modules.forEach( mod => {
				modules.push({ header: mod.name })
				mod.versions.forEach( version => {
					modules.push({ name: version, val: `${mod.name}/${version}` })
				})
			})
			this.available.modules = modules
			// this.available.modules = response.data.modules
		})
	},
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