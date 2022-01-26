import { Autocomplete, Box, Button, Card, CardContent, CardHeader, FormControl, TextField, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import moment from 'moment'
import { DataGrid } from '@mui/x-data-grid'
import projectApi from '../api/projectApi'
import { CustomDialog } from '.'
import { LoadingButton } from '@mui/lab'
import userApi from '../api/userApi'


const UserProject = ({user}) => {
    const [userProjects, setUserProjects] = useState(user.performed)
    const [projectList, setProjectList] = useState([])
    const [projectTasks, setProjectTasks] = useState([])
    const [selectedProject, setSelectedProject] = useState()
    const [selectedTask, setSelectedTask] = useState()
    const [showAddDialog, setShowAddDialog] = useState(false)
    const [onAddPerformed, setOnAddPerformed] = useState(false)

    useEffect(() => {
        const getProjects = async () => {
            try {
                const res = await projectApi.getAll()
                setProjectList(res)
            } catch(err) {
                console.log(err)
            }
        }
        getProjects()
    }, [])

    useEffect(() => {
        if (!selectedProject) {
            setProjectTasks([])
            setSelectedTask(null)
            return
        }
        setProjectTasks(selectedProject.projectTasks)
    }, [selectedProject])

    const tableHeader = [
        {
            field: 'project',
            headerName: 'project',
            width: 200,
            renderCell: (params) => <Button
                component={Link}
                to={`/project/${params.value.id}`}
                sx={{textTransform: 'none'}}
            >
                {params.value.name}
            </Button>
        },
        {
            field: 'projectTask', headerName: 'Task', width: 170,
            renderCell: (params) => params.value.name
        },

        {
            field: 'createdAt', headerName: 'Time', flex: 1,
            renderCell: (params) => moment(params.value).format('DD-MM-YYYY HH:mm:ss')
        }
    ]

    const closeAddDialog = () => {
        setSelectedProject(null)
        setShowAddDialog(false)
    }

    const addPerformed = async () => {
        if (onAddPerformed) return
        const err = [
            !selectedProject,
            !selectedTask
        ]

        if (!err.every(e => !e)) return
        setOnAddPerformed(true)

        const params = {
            userId: user.id,
            projectId: selectedProject.id,
            projectTaskId: selectedTask.id
        }

        try {
            const res = await userApi.performed(params)
            setUserProjects([res, ...userProjects])
            closeAddDialog()
        } catch(err) {
            console.log(err)
        } finally {
            setOnAddPerformed(false)
        }
    }

    return (
        <>
            <Card elevation={0}>
                <CardHeader
                    title={<Typography variant='h6'>
                        Performed information
                    </Typography>}
                    action={<Button
                        variant='contained'
                        disableElevation
                        onClick={() => setShowAddDialog(true)}
                    >
                        Add Performed
                    </Button>}
                />
                <CardContent>
                    <DataGrid
                        autoHeight
                        rows={userProjects}
                        columns={tableHeader}
                        pageSize={3}
                        rowsPerPageOptions={[3]}
                        density='comfortable'
                        showCellRightBorder
                        showColumnRightBorder
                    />
                        
                </CardContent>
            </Card>
            <CustomDialog
                open={showAddDialog}
                title='Add user Performed'
                content={<Box sx={{width: '400px'}}>
                    <FormControl fullWidth margin='normal'>
                        <Autocomplete
                            options={projectList}
                            getOptionLabel={(option) => option.name}
                            renderOption={(props, option) => <Box {...props} component='li'>
                                {option.name}
                            </Box>}
                            renderInput={(params) => <TextField
                                {...params}
                                label='project'
                                inputProps={{
                                    ...params.inputProps,
                                    autoComplete: 'new-password'
                                }}
                            />}
                            value={selectedProject}
                            onChange={(event, value) => setSelectedProject(value)}
                        />
                    </FormControl>
                    <FormControl fullWidth margin='normal'>
                        <Autocomplete
                            options={projectTasks}
                            getOptionLabel={(option) => option.name}
                            renderOption={(props, option) => <Box {...props} component='li'>
                                {option.name}
                            </Box>}
                            renderInput={(params) => <TextField
                                {...params}
                                label='project Task'
                                inputProps={{
                                    ...params.inputProps,
                                    autoComplete: 'new-password'
                                }}
                            />}
                            value={selectedTask}
                            onChange={(event, value) => setSelectedTask(value)}
                        />
                    </FormControl>
                </Box>}
                actions={<Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end'
                }} width='100%'>
                    <Button
                        variant='text'
                        onClick={closeAddDialog}
                        disabled={onAddPerformed}
                    >
                        Cancel
                    </Button>
                    <LoadingButton
                        variant='contained'
                        onClick={addPerformed}
                        loading={onAddPerformed}
                    >
                        Add
                    </LoadingButton>
                </Box>}
            />
        </>
    )
}

export default UserProject
