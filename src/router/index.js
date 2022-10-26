import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Welcome from '@/components/Welcome'
import Users from '@/components/user/Users'
import Rights from '@/components/power/Rights'
import Roles from '@/components/power/Roles'
import Cate from '@/components/goods/Cate'
import Params from '@/components/goods/Params'
import Parent from '@/components/test1/Parent'
import GoodsList from '@/components/goods/List'
import GoodsAdd from '@/components/goods/Add'

Vue.use(VueRouter)
Vue.filter('dateFormat', function (oringinVal) {
  const dt = new Date(oringinVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + '').padStart('2', 0)
  const d = (dt.getDay() + '').padStart('2', 0)

  const hh = (dt.getHours() + '').padStart('2', 0)
  const mm = (dt.getMinutes() + '').padStart('2', 0)
  const ss = (dt.getSeconds() + '').padStart('2', 0)

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

const routes = [
  // /parent为测试用
  {
    path: '/parent',
    component: Parent
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Cate
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: GoodsList
      },
      {
        path: '/goods/add',
        component: GoodsAdd
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenstr = sessionStorage.getItem('TOKEN')
  if (!tokenstr) return next('/login')
  next()
})

export default router
