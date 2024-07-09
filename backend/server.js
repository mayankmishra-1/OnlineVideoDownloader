import express, { Router } from 'express';
import routes from './routes/routes.js'
import cors from 'cors'

const app=express();

app.use(express.json());
app.use(
  cors({
    exposedHeaders: ["Content-Disposition"],
  })
);

app.get('/',(req,res)=>{
    res.send('Server started on port 8000')
})

app.use('/',routes)

const port=8000
app.listen(port, () => {
  console.log(`Server start on Port:${port}`);
});