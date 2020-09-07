import { getList, add, edit, getCategoryList, addCategory, editCategory } from '@/api/article'

const actions = {
  // get user list
  getList({ commit }, query) {
    return new Promise((resolve, reject) => {
      getList(query).then(response => {
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

  // add 添加用户
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

  // edit 编辑用户
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

  // get article category list
  getCategoryList({ commit }, query) {
    return new Promise((resolve, reject) => {
      getCategoryList(query).then(response => {
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

  // add 添加分类
  addCategory({ commit }, params) {
    return new Promise((resolve, reject) => {
      addCategory(params).then((response) => {
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

  // edit 编辑分类
  editCategory({ commit }, params) {
    return new Promise((resolve, reject) => {
      editCategory(params).then((response) => {
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

