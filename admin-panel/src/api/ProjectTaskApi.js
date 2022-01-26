import axiosClient from './axiosClient'

const projectTaskEndpoint = 'project/Tasks'

const projectTaskApi = {
    create: (params) => axiosClient.post(projectTaskEndpoint, params),
    getOne: (id) => axiosClient.get(`${projectTaskEndpoint}/${id}`),
    update: (id, params) => axiosClient.put(`${projectTaskEndpoint}/${id}`, params),
    delete: (id) => axiosClient.delete(`${projectTaskEndpoint}/${id}`)
}

export default projectTaskApi