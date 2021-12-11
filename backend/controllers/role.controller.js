const Role = require('../models/Role')

module.exports = {
   create: async (req, res, next) => {
    Role?.exists({name:req.body.name}).then(async(result)=>{
        if(!result){
            try {
                const role = new Role({...req.body})
                await role.save().then(result=>res.status(201).send(result))
                .catch(err=>res.status(409).send(err))
                console.log(req.body)
            } catch (error) {
                console.log(error)
            }
        } else {
            res.status(409).json({
                message: "Resource Exist"
            })
        }
        
    }).catch(err=>console.error(err))
    },

    getAll: async (req, res, next) => {
        await Role.find({}).lean().then(result=>res.status(200).send(result))
            .catch(err=>res.status(503).send(err))     
    },

    getOne: async(req,res) => {
        await Role.findOne({_id:req.params.id}).lean()
            .then(result=>res.status(200).send(result))
            .catch(err=>res.status(404).json({
                ...err,
                message: "Not found"
            }))
    },

    deleteOne: async(req,res) =>{
        await Role.deleteOne({_id:req.params.id})
            .then(result=>res.status(200).send(result))
            .catch(err=>res.status(404).json({
                ...err,
                message: "Not found"
            }))
    },

    deleteAll: async(req,res) =>{
        await Role.deleteMany({})
            .then(result=>{
                Role.deleteMany({}).then(r=>console.log(r)).catch(err=>console.log(err))
                res.status(200).send({...result, info:"deleted all Roles. Associated Roles also deleted"})
            })
            .catch(err=>res.status(404).json({
                ...err,
                message: "Not found"
            }))
    },

    update: async(req,res) =>{
        Role?.exists({_id:req.params.id}).then(async(result)=>{
            if(result){
                try {
                    await Role.updateOne({_id:req.params.id},{
                        $set: req.body
                    }).then(result=>res.status(201).send({
                        ...result,
                        info: "successfully updated Role"
                    }))
                    .catch(err=>res.status(501).send(err))
                } catch (error) {
                    console.log(error)
                }
            } else {
                res.status(404).json({
                    message: "Resource Doesn't Exist"
                })
            }
            
        }).catch(err=>console.error(err))
    }

}
