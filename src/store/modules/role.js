import { getList, add, edit, getRuleList, getRules, addRules, getMenuList, getMenus, addMenus } from '@/api/role'

const actions = {
  // get user list
  getList({ commit, state }) {
    return new Promise((resolve, reject) => {
      getList().then(response => {
        const { data, code, message } = response
        if (!data && !code) {
          resolve(message)
        }
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // addUser 添加
  add({ commit }, params) {
    return new Promise((resolve, reject) => {
      add(params).then((response) => {
        const { data, code, message } = response
        if (!data && !code) {
          resolve(message)
        }
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // edit 编辑
  edit({ commit }, params) {
    return new Promise((resolve, reject) => {
      edit(params).then((response) => {
        const { data, code, message } = response
        if (!data && !code) {
          resolve(message)
        }
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // getRuleList
  getRuleList({ commit }) {
    return new Promise((resolve, reject) => {
      getRuleList().then(response => {
        const { data, code, message } = response
        if (!data && !code) {
          resolve(message)
        }
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // getRules
  getRules({ commit }, query) {
    return new Promise((resolve, reject) => {
      getRules(query).then(response => {
        const { data, code, message } = response
        if (!data && !code) {
          resolve(message)
        }
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // addRules
  addRules({ commit }, params) {
    return new Promise((resolve, reject) => {
      addRules(params).then(response => {
        const { data, code, message } = response
        if (!data && !code) {
          resolve(message)
        }
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // getMenuList
  getMenuList({ commit }) {
    return new Promise((resolve, reject) => {
      getMenuList().then(response => {
        const { data, code, message } = response
        if (!data && !code) {
          resolve(message)
        }
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // getMenus
  getMenus({ commit }, query) {
    return new Promise((resolve, reject) => {
      getMenus(query).then(response => {
        const { data, code, message } = response
        if (!data && !code) {
          resolve(message)
        }
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // addMenus
  addMenus({ commit }, params) {
    return new Promise((resolve, reject) => {
      addMenus(params).then(response => {
        const { data, code, message } = response
        if (!data && !code) {
          resolve(message)
        }
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }

}

export default {
  namespaced: true,
  actions
}

