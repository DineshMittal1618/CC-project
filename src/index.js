const express=require('express');
const path =require('path');
const hbs=require('hbs');
const fs=require('fs');
const session=require('express-session');
var bodyParser = require('body-parser');
const user=require('../src/models/user.js');
const formidable=require('formidable');
require('./db/mongoose.js');

const app=express();
const pathName=path.join(__dirname,'../Public');
const viewsPath=path.join(__dirname,"../templates/views");


app.use(express.json());
app.use(express.static(pathName));
app.use(session({secret:"dineshmittal",resave:false,saveUninitialized:true}));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 



app.set('view engine','ejs');
app.set('views',viewsPath);


const port=process.env.PORT;


app.get('',(req,res)=>{
    res.render('index',{Title:'Login',name:'CC-Group12'});
})


app.get('/login',(req,res)=>{
    res.render('login',{Title:'Login',name:'CC-Group12'});
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
        res.redirect('dashboard');
    })
})


app.get('/signup',(req,res)=>{
    res.render('signup',{Title:'Signup',name:'CC-Group12'});
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
        res.redirect('login');
    }).catch((err)=>
    {
        res.status(400).send(err);        
    })
})


app.get('/dashboard',(req,res)=>{
    if(!req.session.user){
        return res.redirect('login') 
    }
    res.render('dashboard',{Title:'Dashboard',name:'CC-Group12'})
    
    })


app.get('/upload',(req,res)=>{
    if(!req.session.user){
        return res.redirect('login') 
      }
    res.render('upload',{Title:'Upload',name:'CC-Group12'})
})


app.post('/upload',(req,res)=>{
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {

      var oldpath = files.filetoupload.path;
      newdirpath=path.join(__dirname,'../Public/uploads/'+req.session.user.username);
      if(!fs.existsSync(newdirpath))
      {
          fs.mkdirSync(newdirpath);
      }
      var newpath=path.join(__dirname,'../Public/uploads/'+req.session.user.username+'/'+ files.filetoupload.name)
      fs.readFile(oldpath, function (err, data) {
        if (err) throw err;
        console.log('File read!');

        console.log(req.session.user._id);
        
        // Write the file
        fs.writeFile(newpath, data, function (err) {
            if (err) throw err;
            res.redirect('/dashboard');
            res.end();
            console.log('File written!');
        });

        // Delete the file
        fs.unlink(oldpath, function (err) {
            if (err) throw err;
            console.log('File deleted!');
        });
    });
})})


app.get('/view',(req,res)=>{
    if(!req.session.user){
        return res.redirect('login')
     }
    const dirPath=path.join(__dirname,'../Public/uploads/'+req.session.user.username);
    console.log(dirPath);
    
    fs.readdir(dirPath,(err,ls)=>{
        console.log(ls);
        
        res.render('view',{Title:'View',name:'CC-Group12',data:ls})    
    })
})

app.get('/display',(req,res)=>{
    const data=req.query.data;
    const filepath=path.join(__dirname,"../Public/uploads/"+req.session.user.username+'/'+data);
    console.log(filepath);
    res.sendFile(filepath);
})

app.get('/delete',(req,res)=>{
    if(!req.session.user){
        return res.redirect('login')
     }
    console.log(req.session.user);
    const dirPath=path.join(__dirname,'../Public/uploads/'+req.session.user.username);
    fs.readdir(dirPath,(err,ls)=>{
        res.render('delete',{Title:'Delete',name:'CC-Group12',data:ls})    
    })
})

app.get('/deleteSelected',(req,res)=>{
    const data=req.query.data;
    const filepath=path.join(__dirname,"../Public/uploads/"+req.session.user.username+'/'+data);
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