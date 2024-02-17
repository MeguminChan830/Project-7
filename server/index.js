const experss = require("express")
const colors = require("colors")
const cors= require("cors")
require("dotenv").config()
const {graphqlHTTP} = require('express-graphql')
const schema= require('./schema/schema');
const connectDB= require('./config/db')
const port = process.env.PORT|| 5000

const app= express()

connectDB()
app.use(cors())
app.use('/graph',graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV==='development'
}))
app.listen(port, console.log(`Server of Megumin Starting on Port ${port}`))