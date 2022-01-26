import { CardContent, Grid, Stack, Card, Typography, CardHeader, colors, Button } from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import adminApi from '../api/adminApi'
import AddModeratorOutlinedIcon from '@mui/icons-material/AddModeratorOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined'
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined'
import { ArcElement, Chart as ChartJS, Legend, Tooltip} from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { DataGrid } from '@mui/x-data-grid'
import moment from 'moment'
import { Link } from 'react-router-dom'
const Dashboard = () => {
    const [summaryData, setSummaryData] = useState()

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await adminApi.getSummary()
                console.log(res)
                setSummaryData(res)
            } catch(err) {
                console.log(err)
            }
        }
        getData()
    }, [])

    return (
        <Stack spacing={4}>
            <div>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <Card elevation={0}>
                            <CardContent>
                                {
                                    summaryData && <SummaryInfo
                                        title='Total user'
                                        number={summaryData.totalUser.toLocaleString('de-DE')}
                                        icon={<PersonOutlineOutlinedIcon
                                            sx={{ fontSize: '3rem' }}
                                            color='warning'
                                        />}
                                    />
                                }
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={3}>
                        <Card elevation={0}>
                            <CardContent>
                                {
                                    summaryData && <SummaryInfo
                                        title='User Performed'
                                        number={summaryData.userPerformed.toLocaleString('de-DE')}
                                        icon={<VerifiedUserOutlinedIcon
                                            sx={{ fontSize: '3rem' }}
                                            color='success'
                                        />}
                                    />
                                }
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={3}>
                        <Card elevation={0}>
                            <CardContent>
                                {
                                    summaryData && <SummaryInfo
                                        title='Availabe Project Hour'
                                        number={summaryData.availableProjectHour.toLocaleString('de-DE')}
                                        icon={<AddModeratorOutlinedIcon
                                            sx={{ fontSize: '3rem' }}
                                            color='primary'
                                        />}
                                    />
                                }
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={3}>
                        <Card elevation={0}>
                            <CardContent>
                                {
                                    summaryData && <SummaryInfo
                                        title='Total places'
                                        number={summaryData.totalPlace.toLocaleString('de-DE')}
                                        icon={<RoomOutlinedIcon
                                            sx={{ fontSize: '3rem' }}
                                            color='error'
                                        />}
                                    />
                                }
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </div>
            <div>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <Card elevation={0}>
                            <CardHeader
                                title={<Typography variant="h6">
                                    Performed analyst
                                </Typography>}
                            />
                            <CardContent>
                                {
                                    summaryData && <PerformedChart chartData={summaryData.userPerformedAnalyst}/>
                                }
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={8}>
                        <Card elevation={0}>
                            <CardHeader
                                title={<Typography variant="h6">
                                    Latest Project Tasks
                                </Typography>}
                                action={<Button
                                    variant='text'
                                    disableElevation
                                    component={Link}
                                    to='/project'
                                >
                                    Manage Project
                                </Button>}
                            />
                            <CardContent>
                                {
                                    summaryData && <LatestProjectTaskTable list={summaryData.latestProjectTask}/>
                                }
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        </Stack>
    )
}

export default Dashboard

const SummaryInfo = ({title, number, icon}) => {
    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        }}>
            <Stack spacing={2}>
                <Typography variant='body2' fontWeight='600'>
                    {title}
                </Typography>
                <Typography variant='h4' fontWeight='600'>
                    {number}
                </Typography>
            </Stack>
            <div>
                {icon}
            </div>         
        </Box>
    )
}
const PerformedChart = ({chartData}) => {
    console.log(chartData)
    ChartJS.register(ArcElement, Tooltip, Legend)

    const data = {
        labels: [
            `Less 3  Tasks ${Math.floor(chartData.userWithLeave / chartData.totalUser * 100)}%`,
            `Upper 4  Tasks ${Math.floor(chartData.userWithoutLeave / chartData.totalUser * 100)}%`,
            `0 Hour ${Math.floor(chartData.userWithZeroHour / chartData.totalUser * 100)}%`
        ],
        datasets: [
            {
                label: 'Performed analyst',
                data: [
                    chartData.userWithLeave,
                    chartData.userWithoutLeave,
                    chartData.userWithZeroHour
                ],
                backgroundColor: [
                    colors.yellow['700'],
                    colors.green['700'],
                    colors.red['700']
                ],
                borderColor: [
                    colors.yellow['700'],
                    colors.green['700'],
                    colors.red['700']
                ],
                borderWidth: 1
            }
        ]
    }
    return <Pie
        data={data}
        options={{
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }}
    />
}

const LatestProjectTaskTable = ({list}) => {
    const tableHeader = [
        {
            field: 'name', headerName: 'Task number', width: 200
        },
        {
            field: 'Project', headerName: 'Project', width: 200,
            renderCell: (params) => params.value.name
        },
        {
            field: 'quantity', headerName: 'Quantity', width: 150, align: 'right',
            renderCell: (params) => params.value.toLocaleString('de-DE')
        },
        {
            field: 'createdAt', headerName: 'time', flex: 1,
            renderCell: (params) => moment(params.value).format('DD-MM-YYYY HH:mm:ss')
        }
    ]
    return <DataGrid
        autoHeight
        rows={list}
        columns={tableHeader}
        hideFooter
        density='comfortable'
        showCellRightBorder
        showColumnRightBorder
        disableSelectionOnClick
    />
}