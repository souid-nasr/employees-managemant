import { useEffect, useState } from 'react'
import projectApi from '../api/projectApi'
import { PageHeader, CustomDialog, ProjectTasks } from '../components'
import { useParams, useNavigate } from 'react-router-dom'
import { LoadingButton } from '@mui/lab'
import { Card, CardContent, Grid, FormControl, TextField, CardActions, Typography, Box, Button } from '@mui/material'
const ProjectDetail = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [project, setProject] = useState()
    const [name, setName] = useState('')
    const [nameErr, setNameErr] = useState(false)
    const [onSubmit, setOnSubmit] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogType, setDialogType] = useState('')
    const [dialogText, setDialogText] = useState('')
    const [onDelete, setOnDelete] = useState(false)

    useEffect(() => {
        const getProject = async () => {
            try {
                const res = await projectApi.getOne(id)
                setProject(res)
                setName(res.name)
            } catch(err) {
                console.log(err)
            }
        }
        getProject()
    }, [])

    const updateProject = async () => {
        if (onSubmit) return
        if (!name || name.trim().length === 0) {
            setNameErr(true)
            return
        }
        setNameErr(false)
        setOnSubmit(true)

        try {
            const res = await projectApi.update(id, {name})
            console.log(res)
            setDialogText('project updated')
            setDialogType('success')
        } catch(err) {
            console.log(err)
            setDialogText('project update fail')
            setDialogType('error')
        } finally {
            setOnSubmit(false)
            setDialogOpen(true)
        }
    }

    const deleteProject = async () => {
        if (onDelete) return
        setOnDelete(true)
        try {
            await projectApi.delete(id)
            setOnDelete(false)
            navigate('/project')
        } catch(err) {
            console.log(err)
            setOnDelete(false)
            setDialogText('Delete fail')
            setDialogType('error')
            setDialogOpen(true)
        }
    }
    const resetPage = async () => {
        try {
            const res = await projectApi.getOne(id)
            setProject(res)
            setName(res.name)
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <>
            <PageHeader
                title='project detail'
                rightContent={<LoadingButton
                    variant='text'
                    disableElevation
                    color='error'
                    loading={onDelete}
                    onClick={deleteProject}
                >
                    Delete
                </LoadingButton>}
            />
            <Grid container spacing={4}>
                <Grid item xs={4}>
                    <Card elevation={0}>
                        <CardContent>
                            <FormControl fullWidth margin='normal'>
                                <TextField
                                    label='project name'
                                    variant='outlined'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    error={nameErr}
                                />
                            </FormControl>
                            {
                                project && <>
                                    <FormControl fullWidth margin='normal'>
                                        <TextField
                                            label='Available'
                                            variant='outlined'
                                            value={project.quantity - project.performed}
                                            InputProps={{readOnly: true}}
                                        />
                                    </FormControl>
                                    <FormControl fullWidth margin='normal'>
                                        <TextField
                                            label='Quantity'
                                            variant='outlined'
                                            value={project.quantity}
                                            InputProps={{readOnly: true}}
                                        />
                                    </FormControl>
                                    <FormControl fullWidth margin='normal'>
                                        <TextField
                                            label='performed'
                                            variant='outlined'
                                            value={project.performed}
                                            InputProps={{readOnly: true}}
                                        />
                                    </FormControl>
                                </>
                            }
                        </CardContent>
                        <CardActions>
                            <LoadingButton
                                variant='contained'
                                loading={onSubmit}
                                disableElevation
                                onClick={updateProject}
                            >
                                Update
                            </LoadingButton>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={8}>
                    {
                        project && <ProjectTasks
                            project={project}
                            onTaskAdded={resetPage}
                            onTaskDeleted={resetPage}
                            onTaskUpdated={resetPage}
                        />
                    }
                </Grid>
            </Grid>
            <CustomDialog
                open={dialogOpen}
                type={dialogType}
                showIcon
                content={<Typography variant='subtitle1' textAlign='center'>
                    {dialogText}
                </Typography>}
                actions={<Box width='100%' sx={{display: 'flex', justifyContent: 'center'}}>
                    <Button variant='contained' onClick={() => setDialogOpen(false)}>
                        OK
                    </Button>
                </Box>}
            />
        </>
    )
}

export default ProjectDetail
