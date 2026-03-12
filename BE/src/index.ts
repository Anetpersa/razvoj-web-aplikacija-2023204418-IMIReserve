import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { AppDataSource } from './db'
import { CategoryRoute } from './routes/category.route'
import { FacilityRoute } from './routes/facility.route'
import { InstrumentRoute } from './routes/instrument.route'
import { ResearchGroupRoute } from './routes/research-group.route'
import { ResearcherRoute } from './routes/researcher.route'
import { ReservationRoute } from './routes/reservation.route'

const app = express()
app.use(express.json())
app.use(morgan('short'))
app.use(cors())

app.use('/api/category', CategoryRoute)
app.use('/api/facility', FacilityRoute)
app.use('/api/instrument', InstrumentRoute)
app.use('/api/research-group', ResearchGroupRoute)
app.use('/api/researcher', ResearcherRoute)
app.use('/api/reservation', ReservationRoute)

AppDataSource.initialize()
.then(() => {
    const port = process.env.SERVER_PORT || 3000
    console.log("Povezan sa bazom")
    app.listen(port, () => console.log(`Listening on port ${port}`))
}).catch(e => console.log(e))