require("dotenv").config();
const app=require("./src/app.js");
const connectdb=require("./src/db/db.js");
const { GenerateReport } = require("./src/services/ai.service.js");
const {selfDescription,jobDescription,resume} = require("./src/services/description.js")

connectdb();
//GenerateReport({selfDescription,jobDescription,resume});

app.listen(process.env.PORT,()=>{
    console.log("Server is running on port 3000");
})
