import { Button, Box, Typography, Paper } from '@mui/material'
import { useEffect, useState } from 'react'
import { PageHeader } from '../components'
import { Link } from 'react-router-dom'
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined'
import userApi from '../api/userApi'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'
import { DataGrid } from '@mui/x-data-grid'

const User = () => {
    const [userList, setUserList] = useState([])
    const [pageSize, setPageSize] = useState(9)

    useEffect(() => {
        const getUsers = async () => {
            try {
                const res = await userApi.getAll()
                setUserList(res)
            } catch(err) {
                console.log(err)
            }
        }
        getUsers()
    }, [])

    const tableHeader =[
        {
            field: 'idNumber',
            headerName: 'ID card',
            renderCell: (params) => <Button
                variant='text'
                component={Link}
                to={`/user/${params.row.id}`}
            >
                {params.value}
            </Button>,
            width: 170
        },
        { field: 'fullName', headerName: 'FullName', width: 150 },
        { field: 'phoneNumber', headerName: 'Phone', width: 150 },
        {
            field: 'project',
            headerName: 'Performed',
            width: 250,
            renderCell: (params) => <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center'
                }}
                color={params.value.length >= 5 ? 'green' : params.value.length <= 2 ? 'red' : 'orange'}
            >
                {
                    params.value.length >= 5 && <VerifiedUserIcon/>
                }
                {
                   5>params.value.length>=3 && <ShieldOutlinedIcon/>
                }
                {
                    params.value.length <=2 && <ErrorOutlineOutlinedIcon/>
                }
                <Typography
                    variant='body2'
                    sx={{
                        marginLeft: '10px',
                        fontWeight: '500'
                    }}
                >
                    Performed with {params.value.length} Tasks {params.value.length >= 5 && 's'}
                </Typography>
            </Box>
        },
        { field: 'address', headerName: 'Address',width: 150 },
        {
            field: 'id',
            headerName: 'Actions',
            width: 315,
            renderCell: (params) => {return (<Box>
            <Button
                variant='text'
                component={Link}
                to={`/user/${params.value}`}
                startIcon={<OpenInNewOutlinedIcon/>}
            >
                Detail
            </Button>
            <Button
                variant='text'
                component={Link}
                to={`/user/${params.value}/summary`}
                startIcon={<OpenInNewOutlinedIcon/>}
            >
                Get summary
            </Button>
            </Box>)}
        },

    ]

    return (
        <>
            <PageHeader
                title='User list'
                rightContent={<Button
                    variant='contained'
                    component={Link}
                    to='/user/create'
                    startIcon={<PersonAddOutlinedIcon/>}
                >
                    Create
                </Button>}
            />
            <Paper elevation={0}>
                <DataGrid
                    autoHeight
                    rows={userList}
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
        </>
    )
}

export default User
