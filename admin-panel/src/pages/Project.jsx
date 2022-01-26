import { Box, Button, FormControl, Paper, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import projectApi from '../api/projectApi'
import { PageHeader, CustomDialog } from '../components'
import moment from 'moment'
import { DataGrid } from '@mui/x-data-grid'
import { LoadingButton } from '@mui/lab'

const Project = () => {
    const [projectList, setProjectList] = useState([])
    const [pageSize, setPageSize] = useState(9)
    const [showCreateModal, setShowCreateModal] = useState(false)

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

    const tableHeader = [
        {
            field: 'name', headerName: 'Name', width: 170,
            renderCell: (params) => <Button
                variant='text'
                component={Link}
                to={`/project/${params.row.id}`}
            >
                {params.value}
            </Button>
        },
        {
            field: 'quantity', headerName: 'Quantity', align: 'right', width: 170,
            renderCell: (params) => params.value.toLocaleString('de-DE')
        },
        {
            field: 'performed', headerName: 'Performed', align: 'right', width: 170,
            renderCell: (params) => params.value.toLocaleString('de-DE')
        },
        {
            field: 'id', headerName: 'Available', align: 'right', width: 170,
            renderCell: (params) => (params.row.quantity - params.row.performed).toLocaleString('de-DE')
        },
        {
            field: 'projectTasks', headerName: 'Tasks', width: 170,
            renderCell: (params) => params.value.length
        },
        {
            field: 'createdAt', headerName: 'Created at', flex: 1,
            renderCell: (params) => moment(params.value).format('DD-MM-YYYY HH:mm:ss')
        }
    ]

    const onCreateSuccess = (newProject) => {
        setProjectList([newProject, ...projectList])
        setShowCreateModal(false)
    }

    return (
        <>
            <PageHeader
                title='Project list'
                rightContent={<Button
                    variant='contained'
                    disableElevation
                    onClick={() => setShowCreateModal(true)}
                >
                    Create
                </Button>}
            />
            <Paper elevation={0}>
                <DataGrid
                    autoHeight
                    rows={projectList}
                    columns={tableHeader}
                    pageSize={pageSize}
                    rowsPerPageOptions={[9, 50, 100]}
                    onPageSizeChange={(size) => setPageSize(size)}
                    density='comfortable'
                    showColumnRightBorder
                    showCellRightBorder
                    disableSelectionOnClick
                />
            </Paper>
            <ProjectCreateModal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={onCreateSuccess}
            />
        </>
    )
}

export default Project

const ProjectCreateModal = ({show, onClose, onSuccess}) => {
    const [name, setName] = useState('')
    const [nameErr, setNameErr] = useState(false)
    const [onSubmit, setOnSubmit] = useState(false)

    const createProject = async () => {
        if (onSubmit) return
        if (!name || name.trim().length === 0) {
            setNameErr(true)
            return
        }
        setNameErr(false)
        setOnSubmit(true)

        try {
            const res = await projectApi.create({name})
            setName('')
            onSuccess(res)
        } catch(err) {
            console.log(err)
        } finally {
            setOnSubmit(false)
        }
    }

    return (
        <CustomDialog
            open={show}
            title='Add Project'
            content={<Box padding='5px 0'>
                <FormControl>
                    <TextField
                        label='Project name'
                        variant='outlined'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={nameErr}
                    />
                </FormControl>
            </Box>}
            actions={<Box width='100%' sx={{
                display: 'flex',
                justifyContent: 'flex-end'
            }}>
                <Button
                    variant='text'
                    onClick={() => onClose()}
                >
                    Cancel
                </Button>
                <LoadingButton
                    variant='contained'
                    onClick={createProject}
                    loading={onSubmit}
                >
                    Create
                </LoadingButton>
            </Box>}
        />
    )
}