import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Dashboard from '@/components/Dashboard'
import JobMetrics from '@/components/jobs/Metrics'
import JobOverview from '@/components/jobs/Overview'
import NewJob from '@/components/jobs/New'
import JobDetails from '@/components/jobs/Details'
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
      component: JobOverview,
      children: [
        {
          path: 'new',
          name: 'newjob',
          component: NewJob,
          props: true,
        },
        {
          path: ':id',
          name: 'detailjob',
          component: JobDetails,
          props: true,
        },
      ]
    },
    {
      path: '/metrics',
      name: 'metrics',
      component: JobMetrics
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
