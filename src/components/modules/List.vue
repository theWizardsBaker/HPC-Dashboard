<template>
  <div class="hello">
  	<h2>Request</h2>
	<v-container class="pa-5">
		<v-text-field
				label="Module Search"
				hint="Find an installed module"
				single-line
				append-icon="search"
				/>
		<p>
			The following modules can be loaded when running your jobs. This gives your jobs access to the code in the modules.
		</p>
	</v-container>
    <v-expansion-panel expand>
	    <v-expansion-panel-content v-for="module in modules" :key="module">
	      <div slot="header">{{module}}</div>
	      <v-card>
	        <v-card-text>
	        	<v-list two-line subheader>
	        	 <v-list-tile avatar>
		            <v-list-tile-content>
			              <v-list-tile-title>Version 1.2.6</v-list-tile-title>
		              		<v-list-tile-sub-title>
		              			<p>A description of this version can be here.</p>
			                </v-list-tile-sub-title>
		            </v-list-tile-content>
		          </v-list-tile>
	        	 <v-list-tile avatar>
		            <v-list-tile-content>
			              <v-list-tile-title>Version 1.3.0</v-list-tile-title>
		              		<v-list-tile-sub-title>
		              			<p>A description of this version can be here.</p>
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
export default {
  name: 'List',
  data () {
    return {
    	modules: [
    		'ATK',
    		'BCFTools',
    		'BedTools',
    		'Beagle',
    		'Boost',
    		'Lammps',
    		'Misopy (Python)',
    	]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>