import { Card, CardContent, FormControl, Grid, Stack, TextField, Autocomplete, Box, CardActions, Typography, Button,CardHeader } from '@mui/material'
import { useEffect, useState,useRef } from 'react'
import { useParams } from 'react-router-dom'
import userApi from '../api/userApi'
import { PageHeader, CustomDialog} from '../components'
import addressList from '../assets/dvhcvn.json'
import { LoadingButton } from '@mui/lab'
import QRCode from 'react-qr-code'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { DataGrid } from '@mui/x-data-grid'
import projectApi from '../api/projectApi'
import React from 'react'
import ReactToPrint from "react-to-print";

//projectlot
function UserSummary() {
    const linkToPrint = () => {
        return (
            <Button>Print this out!</Button>
        )
    }
    const componentRef = useRef();

    return (
        <div>
            <UserDescription ref ={componentRef}/>
            <ReactToPrint
          trigger={linkToPrint} content={() => componentRef.current}
        />
        </div>
    )
}

export default UserSummary









const  UserDescription = React.forwardRef((props, ref) => {
    const { id } = useParams()
    const [user, setUser] = useState()
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await userApi.getOne(id)
                console.log(res)
                setUser(res)
            } catch(err) {
                console.log(err)
            }
        }
        getUser()
    }, [])

    return (
        <>         
<div ref={ref}>


            <PageHeader title='Covid Passport'/>
            <Grid container spacing={4}>
                <Grid item xs={8}>
                    <Stack spacing={4}>
                        {
                            user && <UserInfo
                                user={user}

                            />
                        }
                        {
                            user && <UserProject user={user}/>
                        }
                    </Stack>
                </Grid>
                <Grid item xs={3}>
                    <Card elevation={0}>
                        <CardContent>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {
                                    user && <QRCode
                                        id='qrcode'  
                                        value={user._id}
                                        size={180}
                                        level='H'
                                    />
                                }
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid>
                </Grid>
            </Grid>
            </div>
        </>
    )
})


const UserInfo = ({user, onUpdateFalse, onUpdateSuccess}) => {
    const [onUpdate, setOnUpdate] = useState(false)
    const [name, setName] = useState(user.fullName)
    const [nameErr, setNameErr] = useState(false)
    const [phone, setPhone] = useState(user.phoneNumber)
    const [phoneErr, setPhoneErr] = useState(false)
    const [address, setAddress] = useState(addressList.data.find(e => e.name === user.address) || undefined)
    const [addressErr, setAddressErr] = useState(false)
    const [idCard, setIdCard] = useState(user.idNumber)
    const [idCardErr, setIdCardErr] = useState(false)

        const params = {
            phoneNumber: phone,
            fullName: name,
            idNumber: idCard,
            address: address.name
        }



    return (
        <Card elevation={0}>
            <CardContent>
                <Grid container spacing={4}>
                    <Grid item xs = {6}>
                        <FormControl fullWidth margin='normal'>
                            <TextField
                                label='Id card'
                                variant='outlined'
                                value={idCard}
                      
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs = {6}>
                        <FormControl fullWidth margin='normal'>
                            <TextField
                                label='Fullname'
                                variant='outlined'
                                value={name}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs = {6}>
                        <FormControl fullWidth margin='normal'>
                            <TextField
                                label='Phone'
                                variant='outlined'
                                type='number'
                                value={phone}

                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs = {6}>
                        <FormControl fullWidth margin='normal'>
                            <Autocomplete
                                options={addressList.data}
                                getOptionLabel={(option) => option.name}
                                renderOption={(props, option) => <Box {...props} component='li'>
                                    {option.name}
                                </Box>}
                                renderInput={(params) => <TextField
                                    {...params}
                                    label='Address'
                                    inputProps={{
                                        ...params.inputProps,
                                        autoComplete: 'new-password'
                                    }}
                                />}
                                value={address}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

const UserProject = ({user}) => {
    const [userProjects, setUserProjects] = useState(user.performed)
    const [projectList, setProjectList] = useState([])
    const [projectTasks, setProjectTasks] = useState([])
    const [selectedProject, setSelectedProject] = useState()
    const [selectedTask, setSelectedTask] = useState()


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
            width: 150,
            renderCell: (params) => params.value.name
            
        },
        {
            field: 'projectTask', headerName: 'Task', width: 150,
            renderCell: (params) => params.value.name
        },
        {
            field: 'createdAt', headerName: 'Time', flex: 1,width: 150,
            renderCell: (params) => moment(params.value).format('DD-MM-YYYY HH:mm:ss')
        }
    ]



    const Performed = async () => {


        const params = {
            userId: user.id,
            projectId: selectedProject.id,
            projectTaskId: selectedTask.id
        }

        try {
            const res = await userApi.performed(params)
            setUserProjects([res, ...userProjects])
        } catch(err) {
            console.log(err)
        } 
    }

    return (
        <>
            <Card elevation={0}>
                <CardHeader
                    title={<Typography variant='h6'>
                        Performed information
                    </Typography>}
                    
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

        </>
    )
}