import request from '@/utils/request'

export function getList(query) {
  return request({
    url: '/role/list',
    method: 'get',
    params: query
  })
}

export function add(data) {
  return request({
    url: '/role',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/role/' + data.id,
    method: 'put',
    data
  })
}

export function getRuleList() {
  return request({
    url: '/role/rule/list',
    method: 'get'
  })
}

export function getRules(query) {
  return request({
    url: '/role/rules/' + query.id,
    method: 'get'
  })
}

export function addRules(data) {
  return request({
    url: '/role/rules',
    method: 'post',
    data
  })
}

export function getMenuList() {
  return request({
    url: '/role/menu/list',
    method: 'get'
  })
}

export function getMenus(query) {
  return request({
    url: '/role/menus/' + query.id,
    method: 'get'
  })
}

export function addMenus(data) {
  return request({
    url: '/role/menus',
    method: 'post',
    data
  })
}
