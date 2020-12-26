import express from 'express';
import cors from 'cors'
import routes from './routes';

const app = express()
app.use(cors())
app.use(express.json())
app.use(routes)

app.listen(1917, ()=>{
  console.log('🚀️ Started Server on Pont 1917')
})