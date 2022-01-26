import { LoadingButton } from '@mui/lab'
import { Box, Button, Card, CardContent, CardHeader, FormControl, Typography,TextField } from '@mui/material'
import moment from 'moment'
import { useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined'
import { CustomDialog } from '.'
import projectTaskApi from '../api/ProjectTaskApi'
//vaccine

const ProjectTasks = ({project, onTaskAdded, onTaskDeleted,onTaskUpdated}) => {
    const [pageSize, setPageSize] = useState(5)
    const [showAddDialog, setShowAddDialog] = useState(false)
    const [onSubmit, setOnSubmit] = useState(false)
    const [taskNumber, setTaskNumber] = useState('')
    const [taskNumberErr, setTaskNumberErr] = useState(false)
    const [quantity, setQuantity] = useState('')
    const [quantityErr, setQuantityErr] = useState(false)
    const [onDelete, setOnDelete] = useState(false)
    const [showUpdateDialog, setShowUpdateDialog] = useState(false)
    const [onUpdate, setOnUpdate] = useState(false)
    const [selectedTask, setSelectedTask] = useState()

    const tableHeader = [
        {
            field: 'name', headerName: 'Task Name', width: 100
        },
        {
            field: 'quantity', headerName: 'Quantity', width: 100, align: 'right',
            renderCell: (params) => params.value.toLocaleString('de-dE')
        },
        {
            field: 'performed', headerName: 'Performed', width: 100, align: 'right',
            renderCell: (params) => params.value.toLocaleString('de-dE')
        },
        {
            field: 'id', headerName: 'Availabe', width: 100, align: 'right',
            renderCell: (params) => (params.row.quantity - params.row.performed).toLocaleString('de-dE')
        },
        {
            field: 'createdAt', headerName: 'Time', flex: 1,
            renderCell: (params) => moment(params.value).format('DD-MM-YYYY HH:mm:ss')
        },
        {
            field: '_id',
            headerName: 'Actions',
            flex: 1,
            renderCell: (params) => (
                <>
                    <LoadingButton
                        color='error'
                        disableElevation
                        startIcon={<DeleteOutlineOutlinedIcon/>}
                        loading={onDelete}
                        onClick={() => deleteTask(params.row.id)}
                    >
                        Delete
                    </LoadingButton>
                    <Button
                        disableElevation
                        startIcon={<ModeEditOutlineOutlinedIcon/>}
                        onClick={() => selectTask(params.row)}
                    >
                        Edit
                    </Button>
                </>
            )
        }
    ]

    const createTask = async () => {
        if (onSubmit) return
        const err = [!taskNumber, !quantity]
        setTaskNumberErr(!taskNumber)
        setQuantityErr(!quantity)
        if (!err.every(e => !e)) return
        setOnSubmit(true)
        const params = {
            projectId: project.id,
            name: taskNumber,
            quantity
        }
        try {
            await projectTaskApi.create(params)
            setQuantity('')
            setTaskNumber('')
            setShowAddDialog(false)
            onTaskAdded()
        } catch(err) {
            setOnSubmit(false)
            console.log(err)
        } finally {
            setOnSubmit(false)
        }
    }

    const deleteTask = async (taskId) => {
        if (onDelete) return
        setOnDelete(true)
        try {
            await projectTaskApi.delete(taskId)
            onTaskDeleted()
        } catch(err) {
            console.log(err)
        } finally {
            setOnDelete(false)
        }
    }

    const selectTask = (task) => {
        setTaskNumber(task.name)
        setQuantity(task.quantity)
        setSelectedTask(task)
        setShowUpdateDialog(true)
    }

    const hideUpdateDialog = () => {
        setTaskNumber('')
        setQuantity('')
        setSelectedTask(undefined)
        setShowUpdateDialog(false)
    }
    
    const updateTask = async () => {
        if (onUpdate) return
        const err = [!taskNumber, !quantity]
        setTaskNumberErr(!taskNumber)
        setQuantityErr(!quantity)
        if (!err.every(e => !e)) return
        setOnUpdate(true)
        const params = {
            name: taskNumber,
            quantity
        }
        try {
            await projectTaskApi.update(selectedTask.id, params)
            setQuantity('')
            setTaskNumber('')
            setShowUpdateDialog(false)
            onTaskUpdated()
        } catch(err) {
            console.log(err)
        } finally {
            setOnUpdate(false)
        }
    }

    return (
        <>
            <Card elevation={0}>
                <CardHeader
                    title={<Typography variant='h6'>
                        tasks information
                    </Typography>}
                    action={<Button
                        variant='contained'
                        disableElevation
                        onClick={() => setShowAddDialog(true)}
                    >
                        Add task
                    </Button>}
                />
                <CardContent>
                    <DataGrid
                        autoHeight
                        rows={project.projectTasks}
                        columns={tableHeader}
                        pageSize={pageSize}
                        rowsPerPageOptions={[5, 10, 50]}
                        onPageSizeChange={(size) => setPageSize(size)}
                        density='comfortable'
                        showCellRightBorder
                        showColumnRightBorder
                        disableSelectionOnClick
                    />
                </CardContent>
            </Card>
            <CustomDialog
                open={showAddDialog}
                title='Add project task'
                content={<Box sx={{width: '400px'}}>
                    <FormControl fullWidth margin='normal'>
                        <TextField
                            label='task number'
                            variant='outlined'
                            value={taskNumber}
                            onChange={(e) => setTaskNumber(e.target.value)}
                            error={taskNumberErr}
                        />
                    </FormControl>
                    <FormControl fullWidth margin='normal'>
                        <TextField
                            label='Quantity'
                            variant='outlined'
                            type='number'
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            error={quantityErr}
                        />
                    </FormControl>
                </Box>}
                actions={<Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end'
                }} width='100%'>
                    <Button
                        variant='text'
                        onClick={() => setShowAddDialog(false)}
                        disable={onSubmit}
                    >
                        Cancel
                    </Button>
                    <LoadingButton
                        variant='contained'
                        disableElevation
                        loading={onSubmit}
                        onClick={createTask}
                    >
                        Save
                    </LoadingButton>
                </Box>}
            />
            <CustomDialog
                open={showUpdateDialog}
                title='Update project task'
                content={<Box sx={{width: '400px'}}>
                    <FormControl fullWidth margin='normal'>
                        <TextField
                            label='task number'
                            variant='outlined'
                            value={taskNumber}
                            onChange={(e) => setTaskNumber(e.target.value)}
                            error={taskNumberErr}
                        />
                    </FormControl>
                    <FormControl fullWidth margin='normal'>
                        <TextField
                            label='Quantity'
                            variant='outlined'
                            type='number'
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            error={quantityErr}
                        />
                    </FormControl>
                </Box>}
                actions={<Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end'
                }} width='100%'>
                    <Button
                        variant='text'
                        onClick={hideUpdateDialog}
                        disable={onUpdate}
                    >
                        Cancel
                    </Button>
                    <LoadingButton
                        variant='contained'
                        disableElevation
                        loading={onUpdate}
                        onClick={updateTask}
                    >
                        Update
                    </LoadingButton>
                </Box>}
            />
        </>
    )
}

export default ProjectTasks
