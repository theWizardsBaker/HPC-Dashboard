import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Dashboard from '@/components/Dashboard'
import JobMetrics from '@/components/jobs/Metrics'
import JobOverview from '@/components/jobs/Overview'
import NewJob from '@/components/jobs/New'
import ModuleList from '@/components/modules/List'
import ModuleRequest from '@/components/modules/Request'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/jobs',
      name: 'jobs',
      component: JobOverview
    },
    {
      path: '/metrics',
      name: 'metrics',
      component: JobMetrics
    },
    {
      path: '/newjob',
      name: 'newjob',
      component: NewJob
    },
    {
      path: '/modules',
      name: 'modules',
      component: ModuleList
    },
    {
      path: '/request',
      name: 'request',
      component: ModuleRequest
    }
  ]
})
