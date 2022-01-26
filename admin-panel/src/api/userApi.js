import axiosClient from './axiosClient'

const userEndpoint = 'user'

const userApi = {
    getAll: () => axiosClient.get(userEndpoint),
    create: (params) => axiosClient.post(userEndpoint, params),
    getOne: (id) => axiosClient.get(`${userEndpoint}/${id}`),
    update: (id, params) => axiosClient.put(`${userEndpoint}/${id}`, params),
    performed: (params) => axiosClient.post(`${userEndpoint}/performed`, params)
}

export default userApi