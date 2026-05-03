const mongoose = require("mongoose");

/**
 * Schema for the report
 * -userDescription - string
 * -resume content - string
 * -jobDescription - string
 * 
 * -matchScore - Number(0-100)
 * 
 * -TechnicalQNAs - [{
 *      question - string,
 *      intention - string,
 *      answer - string,
 * }]
 * -BehaviouralQNAs - [{
 *      question - string,
 *      intention - string,
 *      answer - string,
 * }] 
 * -SkillGap - [{
 *      skill - string,
 *      severety - string,enum["low","medium","high"]
 * }]
 * -PreparationPlan - [{
 *      day - number,
 *      focus - string,
 *      tasks - [strings]
 * }]
 */

const QNASchema = new mongoose.Schema({
    question:{
        type:String,
        required:true,
    },
    intention:{
        type:String,
        require:true,
    },
    answer:{
        type:String,
        required:true,
    }
},{
    _id:false,
})

const SkilGapSchema = new mongoose.Schema({
    skill:{
        type:String,
        required:true,
    },
    severity:{
        type:String,
        required:true,
        enum:["low","medium","high"],
    }
},{
    _id:false,
})

const PreparationPlanSchema = new mongoose.Schema({
    day:{
        type:Number,
        required:true,
    },
    focus:{
        type:String,
        required:true,
    },
    tasks:[{
        type:String,
        required:true,
    }]  
},{
    _id:false,
})

const ResumeReportSchema = new mongoose.Schema({
    userDescription:{
        type:String,
        required:true,
    },
    resumeContent:{
        type:String,
        required:true,
    },
    jobDescription:{
        type:String,
        required:true,
    },
    matchScore:{
        type:Number,
        required:true,
    },
    technicalQNAs:[QNASchema],
    behaviouralQNAs:[QNASchema],
    skillGap:[SkilGapSchema],
    preparationPlan:[PreparationPlanSchema],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    },
    title:{
        type:String,
        required:true,
    }
},{
    timestamps:true,
});

const ResumeReportModel = mongoose.model("ResumeReport",ResumeReportSchema);

module.exports = {ResumeReportModel};
