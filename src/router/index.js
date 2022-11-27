import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      shouldNotBeVisibleWhenLogIn : true
    },
  },
  {
    path: '/about',
    name: 'About',
    meta: {
      requiresAuth: true
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/petitions',
    name: 'Petitions',
    meta: {
      requiresAuth: true
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Petitions.vue')
  },
  {
    path: '/plan/:id',
    name: 'Plan Report',
    meta: {
      requiresAuth: true
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/PlanReport.vue')
  },
  {
    path: '/planner',
    name: 'Observation planner',
    meta: {
      requiresAuth: true
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/ObservationPlanner.vue')
  },
  {
    path: '/plans',
    name: 'Plan List',
    meta: {
      requiresAuth: true
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/PlanList.vue')
  },
  {
    path: '/optics',
    name: 'Telescope Optics',
    meta: {
      requiresAuth: true
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Optics.vue')
  },
  {
    path: '*', 
    name: 'Not Found',
    component: () => import(/* webpackChunkName: "about" */ '../views/PageNotFound.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  const shouldBeVisibleWhenLogIn = to.matched.some(x => x.meta.shouldBeVisibleWhenLogIn)
  const user = localStorage.getItem("user");
  document.title = "SCT - " + to.name;
  if (shouldBeVisibleWhenLogIn) {
    next({ name : "Home"})
  } else {
    if (requiresAuth && !user) {
      next({ name : "Login"})
    } else {
      next()
    }
  }
})

export default router
