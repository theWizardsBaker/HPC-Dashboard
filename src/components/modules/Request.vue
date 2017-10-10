<template>
  <div class="hello">
    <h2>Request</h2>
	<form>
	<v-container grid-list-xl fluid>
		<v-layout row wrap>
	    	<v-flex xs12 sm6>
				<v-text-field
						label="Name"
						hint="Full name"
						single-line
						required
						/>

				<v-text-field
						type="email"
						label="Email"
						hint="Email address"
						single-line
						required
						/>

				<v-text-field
						label="Cluster"
						hint="The cluster to install to"
						single-line
						required
						/>
			</v-flex>	
	    	<v-flex xs12 sm6>
			
			<v-text-field
						label="Software Name"
						hint="The name of the software you would like install"
						single-line
						required
						/>

			<v-text-field
						label="Software Version"
						hint="The version of the software package"
						single-line
						/>

			<v-text-field
						label="Software URL"
						hint="The location of the software to install"
						single-line
						/>
			</v-flex>

		</v-layout>
		<v-layout row wrap>
			 <v-flex xs12>
				<v-text-field box multi-line label="Installation Notes" hint="Additional instructions for installation"/>
			</v-flex>
		</v-layout>
		<p class="text-xs-center">
		   <v-btn @click="submit" light>submit</v-btn>
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>