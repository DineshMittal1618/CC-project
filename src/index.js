const express=require('express');
const path =require('path');
const hbs=require('hbs');
const fs=require('fs');
const session=require('express-session');
var bodyParser = require('body-parser');
const user=require('../src/models/user.js');
var multer = require('multer');
const formidable=require('formidable');
require('./db/mongoose.js');

const app=express();
var upload = multer();
const pathName=path.join(__dirname,'../public');
const viewsPath=path.join(__dirname,"../templates/views");
const partialPath=path.join(__dirname,'../templates/partials')


app.use(express.json());

app.use(express.static(pathName));
app.use(session({secret:"dineshmittal",resave:false,saveUninitialized:true}));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 



app.set('view engine','ejs');
app.set('views',viewsPath);


hbs.registerPartials(partialPath);

const port=process.env.MON || 3000;


app.get('',(req,res)=>{
    res.render('index',{Title:'Login',name:'Dinesh Mittal'});
})


app.get('/login',(req,res)=>{
    res.render('login',{Title:'Login',name:'Dinesh Mittal'});
})

app.post('/login',(req,res)=>{

    var name=req.body.username;
    var pass=req.body.password;
    
    user.findOne({username:name,password:pass},(err,user)=>{
        if(err){
            console.log(err);
            return res.status(500).send();
        }
        if(!user){
            console.log(user);
            
            return res.status(400).send("my love");
        }
        req.session.user=user;
        res.render('dashboard',{Title:'Dashboard',name:'Dinesh Mittal'});
    })
})


app.get('/signup',(req,res)=>{
    res.render('signup',{Title:'Signup',name:'Dinesh Mittal'});
})


 app.post('/signup',(req,res)=>{

    const newUser=new user(req.body);
    console.log(req.body);
     newUser.save().then(()=>
    { 
        if(!newUser)
        {
            return res.status(404).send()
        }
        res.render('login',{Title:'Dashboard',name:'Dinesh Mittal'});
    }).catch((err)=>
    {
        res.status(400).send(err);        
    })
})


app.get('/dashboard',(req,res)=>{
    if(!req.session.user){
        return res.render('login')   
    }
    res.render('dashboard',{Title:'Dashboard',name:'Dinesh Mittal'})
    
    })


app.get('/upload',(req,res)=>{
    if(!req.session.user){
        return res.render('login') 
      }
    res.render('upload',{Title:'Upload',name:'Dinesh Mittal'})
})


app.post('/upload',(req,res)=>{
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.filetoupload.path;
      console.log(files.filetoupload.name);
      var newpath = 'C:/Users/Lenovo/Desktop/Learn Node/File Manager/Public/uploads/'+ files.filetoupload.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        res.render("dashboard",{Title:'dashboard',name:'Dinesh Mittal',success:'true'});
        
      })
})})


app.get('/view',(req,res)=>{
    if(!req.session.user){
        return res.render('login',{Title:'Dashboard',name:'Dinesh Mittal'})
     }
    console.log(req.session.user);
    const dirPath=path.join(__dirname,'../public/uploads');
    fs.readdir(dirPath,(err,ls)=>{
        console.log(ls);
        
        res.render('view',{Title:'View',name:'Dinesh Mittal',data:ls})    
    })
})

app.get('/display',(req,res)=>{
    const data=req.query.data;
    const filepath=path.join(__dirname,"../public/uploads/"+data);
    console.log(filepath);
    var dataToBeSend =fs.readFileSync(filepath);
    res.download(filepath);
})

app.get('/delete',(req,res)=>{
    if(!req.session.user){
        return res.render('login',{Title:'Dashboard',name:'Dinesh Mittal'})
     }
    console.log(req.session.user);
    const dirPath=path.join(__dirname,'../public/uploads');
    fs.readdir(dirPath,(err,ls)=>{
        res.render('delete',{Title:'Delete',name:'Dinesh Mittal',data:ls})    
    })
})

app.get('/deleteSelected',(req,res)=>{
    const data=req.query.data;
    const filepath=path.join(__dirname,"../public/uploads/"+data);
    console.log('hi');

    fs.unlink(filepath,(err)=>{
        if(err)
        return console.log('err');
        
        res.redirect('/dashboard');
        
    });

})



app.listen(port,()=>{
    console.log('The server is connected to port '+port);
    
})