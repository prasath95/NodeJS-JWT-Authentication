const express=require('express');
const app=express();
const morgan=require('morgan'); //see the incoming request
const bodyParser=require('body-parser'); //easy to read json,url encoded
const mongoose=require('mongoose');

const userRoutes=require('./routes/user');
const config = require('config');

mongoose.connect('mongodb+srv://'+config.get('App.database.username')+':'+config.get('App.database.password')+'@mongodbdeno.qk1xz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(()=>console.log('Database Connected')
).catch(err=>{
    console.log(err);
});

mongoose.Promise=global.Promise;
mongoose.set('useNewUrlParser',true);
mongoose.set('useFindAndModify',false);
mongoose.set('useCreateIndex',true);
mongoose.set('useUnifiedTopology',true);

app.use(morgan('dev'));
// app.use(bodyParser.urlencoded({extended:false}));
// app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req,res,next)=>
{
    res.header('Access-Control-Allow-Origin','*');
    res.header(
        'Access-Control-Allow-headers',
        'Origin,X-Requested-With,Content-Type,Accept,Authorization'
        );

        if(req.method==='OPTIONS')
        {
            res.header('Accept-Control-Methods','PUT,POST,PATCH,DELETE,GET');
            return res.status(200).json({

            })
        }
        next();
});

app.use('/user',userRoutes);

app.use((req,res,next)=>
{
    const error=new Error('Not found');
    next(error);
});

app.use((error,req,res,next)=>
{
    res.status(error.status||500);
    res.json({
        error:{
            message: error.message
        }
    })
});

module.exports=app;