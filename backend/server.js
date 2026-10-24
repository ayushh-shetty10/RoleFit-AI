require("dotenv").config();
const app=require("./src/app.js");
const connectdb=require("./src/db/db.js");
const { GenerateReport } = require("./src/services/ai/ai.service.js");

require("./src/workers/report.worker");

connectdb();
//GenerateReport({selfDescription,jobDescription,resume});

app.listen(process.env.PORT || 3000,()=>{
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
})
