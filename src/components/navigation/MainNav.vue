<template>
	<v-navigation-drawer v-model="showDrawer"
						 class="pb-0"
						 height="100%"
						 persistent
						 clipped
						 disable-route-watcher
						 floating
						 >
		<v-list dense>
			<v-list-group v-for="route in routes" :key="route.location">
				<v-list-tile slot="item">
					<v-list-tile-action>
						<v-icon>
							{{route.icon}}
						</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>
							{{route.title}}
						</v-list-tile-title>
					</v-list-tile-content>
					<v-list-tile-action v-if="route.subroutes.length > 0">
						<v-icon>
							keyboard_arrow_down
						</v-icon>
					</v-list-tile-action>
				</v-list-tile>
				<v-list-tile v-for="subroute in route.subroutes" 
							 :key="subroute.path" 
							 :to="{ name: subroute.path }"
							 >
					<v-list-tile-action>
						<v-icon>
							{{subroute.icon}}
						</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title class="white--text">
							{{subroute.title}}
						</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
			</v-list-group>
		</v-list>
	</v-navigation-drawer>
</template>

<script>
	export default {

		name: 'navigation',

		props: ['showDrawer'],

		data() {
			return {
				routes: [
					{
						title: 'Dashboard',
						icon: 'fa-list-alt',
						location: 'dashboard',
						subroutes: [
							{
								title: 'Jobs',
								icon: 'fa-file-code-o',
								path: 'jobs'
							},
							{
								title: 'Metrics',
								icon: 'fa-bar-chart',
								path: 'metrics'
							}
						]
					},
					{
						title: 'Modules',
						icon: 'fa-database',
						location: 'dashboard',
						subroutes: [
							{
								title: 'Available',
								icon: 'fa-folder-open-o',
								path: 'modules'
							},
							{
								title: 'Request Module',
								icon: 'fa-file-text-o',
								path: 'request'
							}
						]
					},
				]
			}
		},

		methods: {
			navigateTo(path){
				this.$router.replace({ path: path })
			}
		}
	}
</script>

<style lang="scss">

</style>