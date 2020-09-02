import { getMenus } from '@/api/user'
import { constantRoutes } from '@/router'

const state = {
  routes: [],
  addRoutes: []
}

const componentMap = {
  layout: () => import('@/layout'),
  dashboard: () => import('@/views/dashboard/index'),
  user_list: () => import('@/views/user/list'),
  role_list: () => import('@/views/role/list')
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
    console.log(constantRoutes.concat(routes))
  }
}

const actions = {
  getMenus({ commit }) {
    return new Promise(
      (resolve, reject) => {
        getMenus()
          .then(response => {
            const { data, code, message } = response
            if (!data && !code) {
              resolve(message)
            }

            for (const key in data) {
              const ele = data[key]
              data[key]['component'] =
                                componentMap[ele['component']]

              if (ele['children'] != null &&
                                ele['children'].length > 0) {
                for (const k in ele['children']) {
                  const e = ele['children'][k]
                  data[key]['children'][k]['component'] =
                                        componentMap[e['component']]
                }
              }
            }

            commit('SET_ROUTES', data)
            resolve(data)
          })
          .catch(error => { reject(error) })
      })
  }
}

export default {
  namespaced: true, state, mutations, actions
}
