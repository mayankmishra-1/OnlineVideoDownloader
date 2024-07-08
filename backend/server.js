import express, { Router } from 'express';
import routes from './routes/routes.js'

const app=express();

app.get('/',(req,res)=>{
    res.send('Server started on port 8000')
})

app.use('/',routes)

const port=8000
app.listen(port, () => {
  console.log(`Server start on Port:${port}`);
});