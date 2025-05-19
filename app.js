const express = require("express");
const app = express();
const port = 3001;
const mongoose = require("mongoose");
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));
const User = require("./models/userSchema")
app.set('view engine','ejs')


app.get("/", (req, res) => {

  res.render("LoginPage/login.ejs", { root: __dirname });
});

app.get("/AdminPage/Admin.ejs",(req,res)=>{
    User.find()
    .then((result)=>{
        console.log(result)
        res.render("AdminPage/Admin.ejs",{arr:result})
    })
    .catch(err=>{
        console.log(err);
    })

})

app.post("/user/add.html",(req,res)=>{
    const user = new User(req.body);
    user.save()
    .then(result => {
        res.redirect("/");
    })
    .catch(err =>{
        console.log(err);
    })
})


mongoose
  .connect(
    "mongodb+srv://abdulkader2307019:sh121212@cluster0.cpspzvf.mongodb.net/all-data?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`http://localhost:${port}/`);
    });
  })
  .catch((err) => {
    console.log(err);
  });