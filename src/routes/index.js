const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const { Users } = require('../database.js');
const router = Router();
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
router.use(cookieParser());
const { createTokens, validateToken } = require('../JWT.js')

router.post('/register', async (req, res) => {
        
    try{
        const { name, email, password } = req.body
        const hash = await bcrypt.hash(password, 10)
        const newUser = await Users.create({
            name: name,
            email: email,
            password: hash
        })
        res.json("USER REGISTERED")
        return newUser

    }catch(error){
        res.status(400).json({error: error})
    }
       
})

router.post('/login', async (req, res) => {
    try{
        const { email, password } = req.body
        const user = await Users.findOne({where: {email : email}})
        if(!user) res.status(400).json({error: "User Doesn't Exist!"})

        const dbPassword = user.password
        bcrypt.compare(password, dbPassword).then((match) =>{
            if(!match){
                res.status(400).json({error: "Wrong Username and Password combination!"})
            }else{
                const accessToken = createTokens(user)
                console.log("aqui", accessToken)
                res.cookie("access-token", accessToken, {
                    maxAge: 60 * 10 * 1000, httpOnly: true,
                })
                console.log("user", user)
                res.json("LOGGED IN!")
            }
        })
    }catch(error){
        res.status(400).json({error: error})
    }
})

router.post('/user', async (req, res) => {
    try{
        const { email, password } = req.body
        const user = await Users.findOne({where: {email : email}})
        if(!user) res.status(400).json({error: "User Doesn't Exist!"})

        const dbPassword = user.password
        bcrypt.compare(password, dbPassword).then((match) =>{
            if(!match){
                res.status(400).json({error: "Wrong Username and Password combination!"})
            }else{
                
                console.log("user", user)
                res.json({user})
            }
        })
    }catch(error){
        res.status(400).json({error: error})
    }
})

router.put('/favourites/:id', async (req, res) => {
    const  favourites  = req.body;
    const { id } = req.params;
    console.log("datos", favourites, id)
    try{
        var update = await Users.update(

            {
                favourites: favourites,
            },
            { where: { id } })
          return res.json("Favourite added!");
    }catch(error){
        res.status(400).json({error: error})
    }
    res.json(update)
})
router.put('/favouritesdel/:id', async (req, res) => {
    const  favourites  = req.body;
    const { id } = req.params;
    console.log("datos", favourites, id)
    try{
        var update = await Users.update(

            {
                favourites: favourites,
            },
            { where: { id } })
          return res.json("Favourite deleted!");
    }catch(error){
        res.status(400).json({error: error})
    }
    res.json(update)
})
router.get('/user/:id', async (req, res)=>{   
  
    try{
        const {id} = req.params;
        var user = await Users.findByPk(id)
        return res.send(user)
        }
    catch(error){
        console.log(error)
    }
    })
router.get('/user/:id', async (req, res)=>{   
  
    try{
        const {id} = req.params;
        var user = await Users.findByPk(id)
        return res.send(user)
        }
    catch(error){
        console.log(error)
    }
    })

router.get('/favourites/:id', async (req, res)=>{   
  
      try{
          const {id} = req.params;
            var user = await Users.findByPk(id)
            return res.send(user)
            }
      catch(error){
           console.log(error)
      }
    })    
module.exports = router;