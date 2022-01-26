import axiosClient from './axiosClient'

const projectEndpoint = 'project'

const projectApi = {
    getAll: () => axiosClient.get(projectEndpoint),
    create: (params) => axiosClient.post(projectEndpoint, params),
    getOne: (id) => axiosClient.get(`${projectEndpoint}/${id}`),
    update: (id, params) => axiosClient.put(`${projectEndpoint}/${id}`, params),
    delete: (id) => axiosClient.delete(`${projectEndpoint}/${id}`)
}

export default projectApi