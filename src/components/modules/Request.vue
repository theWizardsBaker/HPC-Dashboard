<template>
  <div class="hello">
    <h2>Request</h2>
	<form>
	<v-container grid-list-xl fluid>
		<v-layout row wrap>
	    	<v-flex xs12 sm6>
				<v-text-field
						v-model="requestForm.name"
						label="Name"
						hint="Full name"
						single-line
						required
						/>

				<v-text-field
						v-model="requestForm.email"
						type="email"
						label="Email"
						hint="Email address"
						single-line
						required
						/>

				<v-text-field
						v-model="requestForm.cluster"
						label="Cluster"
						hint="The cluster to install to"
						single-line
						required
						/>
			</v-flex>	
	    	<v-flex xs12 sm6>
			
			<v-text-field
						v-model="requestForm.softwareName"
						label="Software Name"
						hint="The name of the software you would like install"
						single-line
						required
						/>

			<v-text-field
						v-model="requestForm.softwareVersion"
						label="Software Version"
						hint="The version of the software package"
						single-line
						/>

			<v-text-field
						v-model="requestForm.softwareURL"
						label="Software URL"
						hint="The location of the software to install"
						single-line
						/>
			</v-flex>

		</v-layout>
		<v-layout row wrap>
			 <v-flex xs12>
				<v-text-field box 
							  v-model="requestForm.notes"
							  multi-line 
							  textarea
							  label="Installation Notes" 
							  hint="Additional instructions for installation"
							  />
			</v-flex>
		</v-layout>
		<p class="text-xs-center">
		   <v-btn @click="submit" :disabled="!validForm" light>submit</v-btn>
		</p>
	</v-container>
	</form>
  </div>
</template>

<script>
export default {

  name: 'request',
  
  data () {
    return {
    	requestForm: {
    		name: '',
    		email: '',
    		cluster: '',
    		softwareName: '',
    		softwareVersion: '',
    		softwareURL: '',
    		notes: ''
    	},
    }
  },

  computed: {
  	
  	validForm(){
  		return ['name', 'email', 'cluster', 'softwareName'].reduce((prev, cur) => {
  			return prev && this.requestForm[cur].length > 0
  		})
  	},

  },

  methods: {

  	submit(){

  	}

  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>