const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const cors = require("cors");
const csrf = require("csurf");
const app = express();

const bodyParser = require("body-parser")
var passport = require('passport');
var session = require('express-session');
const port= process.env.PORT || 4000;
const authRoutes = require("./routes/auth");
const taskRouter = require("./routes/task");
const csrfProtection = csrf({cookie:true});

//DB connection using mongoose
const dburl = "mongodb+srv://vikas:vikas123@cluster0.jtijy.mongodb.net/todoApp?retryWrites=true&w=majority"
mongoose.connect(dburl,{
    useNewUrlParser: true,
    useUnifiedTopology:true,
    useFindAndModify:false
}
).then(()=>{
    console.log("DB CONNECTED....")
})

//DB connection using sequelize
// const db = require("./config/database");
// db.authenticate()
//   .then(()=>console.log("postgresql db connected..."))
//   .catch((err)=>console.log(err));



app.use(session({
  secret: 's3cr3t',
  resave: true,
  saveUninitialized: true,
  cookie:{
  	maxAge:1000*60*2,
  }
}));


app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());



app.use(bodyParser.urlencoded({extended:false}))
// app.use(bodyParser.json())
app.set('view engine','ejs');
app.get("/",csrfProtection,(req,res)=>{
  res.cookie('csrfToken',req.csrfToken());
  res.redirect("/auth/login")
})

app.use(cors())
app.get("/",(req,res)=>{
  res.redirect("/task/create")
})


//for prevention of csrf attack                                                                                                                                                                                                                                                                                     
app.use("/task",csrfProtection,taskRouter)
app.use("/auth",csrfProtection,authRoutes);

// app.use("/task",taskRouter)
// app.use("/auth",authRoutes);

//Routes for sequlize version
// app.use("/seq/task",require("./routes/seqTask"));

app.listen(port,()=>{
	console.log(`Server is running at ${port}`);
})