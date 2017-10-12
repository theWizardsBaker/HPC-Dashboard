<template>
    <v-dialog width="600px" v-model="showDialog" :lazy="true" :full-width="true" persistent>
      <v-card>
          <v-toolbar>
            <v-toolbar-side-icon><v-icon>fa-file-code-o</v-icon></v-toolbar-side-icon>
            <v-toolbar-title>Job {{job.job}}</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
        <v-card-text>
          <v-chip class="white--text" :class="status.color">
            <v-avatar>
              <v-icon>{{status.icon}}</v-icon>
            </v-avatar>
          {{job.state}}
        </v-chip>
          <p>
              Current job usage graph.
          </p>
          <v-btn error v-if="cancel">Cancel Job</v-btn>
        </v-card-text>
        <v-card-actions>
          <v-btn block outline @click="closeDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
export default {

  name: 'job-dialog',

  props: {
    
    job: {
      type: Object
    },

    show: {
      type: Boolean,
      default() {
        return false
      }
    },

    cancel: {
      type: Boolean,
      default() {
        return false
      }
    }

  },

  data(){
    return {
      
    }
  },

  computed: {

    showDialog() {
      return this.show
    },

    status(){
        switch(this.job.state.toLocaleLowerCase()){

          case "completed": 
            return {
              color: 'green',
              icon: 'fa-check'
            }
            break;

          case "failed":
            return {
              color: 'red',
              icon: 'fa-close'
            }
            break;

          case "pending":
            return {
              color: 'orange',
              icon: 'fa-clock-o'
            }
            break;

          case "cancelled":
            return {
              color: 'grey',
              icon: 'fa-ban'
            }
            break;
        }
    },
  },

  methods: {
      closeDialog() {
        this.$emit('close-dialog')
      }
  }

}
</script>

<style>

</style>
