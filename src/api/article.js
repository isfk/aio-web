import request from '@/utils/request'

export function getList(query) {
  return request({
    url: '/article/list',
    method: 'get',
    params: query
  })
}

export function add(data) {
  return request({
    url: '/article',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/article/' + data.id,
    method: 'put',
    data
  })
}

export function getCategoryList(query) {
  return request({
    url: '/article/category/list',
    method: 'get',
    params: query
  })
}

export function addCategory(data) {
  return request({
    url: '/article/category',
    method: 'post',
    data
  })
}

export function editCategory(data) {
  return request({
    url: '/article/category/' + data.id,
    method: 'put',
    data
  })
}
