import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function getList(query) {
  return request({
    url: '/user/list',
    method: 'get',
    params: query
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function add(data) {
  return request({
    url: '/user',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/user/' + data.id,
    method: 'put',
    data
  })
}

export function roles(query) {
  return request({
    url: '/user/role/list/' + query.id,
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/user/role',
    method: 'post',
    data
  })
}

export function delRole(data) {
  return request({
    url: '/user/role/' + data.uid + '/' + data.role_id,
    method: 'delete'
  })
}

export function getMenus() {
  return request({
    url: '/user/menu/list',
    method: 'get'
  })
}
