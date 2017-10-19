<template>
  <div class="hello">
  	<h2>Request</h2>
	<v-container class="pa-5">
		<v-text-field
				label="Module Search"
				hint="Find an installed module"
				single-line
				append-icon="search"
				v-model="searchFor"
				/>
		<p>
			The following modules can be loaded when running your jobs. This gives your jobs access to the code in the modules.
		</p>
	</v-container>
    <v-expansion-panel expand>
	    <v-expansion-panel-content v-for="module in modules" :key="module.name">
	      <div slot="header">{{module.name}}</div>
	      <v-card>
	        <v-card-text>
	        	<v-list two-line subheader>
	        		<!-- <v-list-title>Versions:</v-list-title> -->
	        		<v-list-tile avatar v-for="version in module.versions" :key="version">
			            <v-list-tile-content>
				            <v-list-tile-title>{{version}}</v-list-tile-title>
			              	<v-list-tile-sub-title>
			              		<!-- <p>A description of this version can be here.</p> -->
				            </v-list-tile-sub-title>
			            </v-list-tile-content>
		        	</v-list-tile>
		        </v-list>
	        </v-card-text>
	      </v-card>
	    </v-expansion-panel-content>
	</v-expansion-panel>
  </div>
</template>

<script>

import debounce from  'debounce'

export default {
  
  name: 'List',

  created(){
  	this.$http.get('api/modules/all').then( response => {
  		this.modules = response.data.modules
  	})
  },

  data () {
    return {
    	searchFor: '',
    	modules: [],
    }
  },

  watch: {
    // whenever question changes, this function will run
    searchFor(newQuestion) {
      this.getModule()
    }
  },

  methods: {
  	getModule: debounce(function (){
  		let searchURL = this.searchFor ? `api/modules/find/${this.searchFor}` : 'api/modules/all'
  		this.$http.get(searchURL).then( response => {
  			this.modules = response.data.modules
  		})
  	}, 500)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>