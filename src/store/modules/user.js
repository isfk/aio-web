import { login, logout, getInfo, getList, add, edit, roles, addRole, delRole } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data, code, message } = response
        if (!data && !code) {
          resolve(message)
        }
        // const { nickname, avatar } = data
        const { nickname } = data

        commit('SET_NAME', nickname)
        commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

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

  // roles 用户角色
  roles({ commit }, query) {
    return new Promise((resolve, reject) => {
      roles(query).then(response => {
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

  // addRole 添加角色
  addRole({ commit }, params) {
    return new Promise((resolve, reject) => {
      addRole(params).then(response => {
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

  // delRole 角色
  delRole({ commit }, params) {
    return new Promise((resolve, reject) => {
      delRole(params).then(response => {
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

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

