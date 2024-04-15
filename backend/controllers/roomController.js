const Room =require('../models/Room')
const {verifyToken,verifyTokenAdmin}=require('../middlewares/verifyToken')

const roomController = require ('express').Router()

//get all room max 50 
roomController.get('/',async(req,res)=>{
    try{ 
        const type =req.query.type
        let rooms
        if(type){
            rooms=await Room.find({type:type}).limit(50)//nmbre max de chambre

        }else{
            rooms=await Room.find({}).limit(50)

        }
        return res.status(200).json(rooms)

    }catch(error){
        console.error(error.message)
    }

})
//get one room
roomController.get('/find/:id',verifyToken , async(req,res)=>{
    try {
        const id =req.params.id
        const room= await Room.findById(id)

        return res.status(200).json(room)

    } catch (error) {
        console.error(error.message)
        
    }
})
/////////////////apres frontenttypes
roomController.get('/find/types', async (req, res) => {
    try {
      const apartment = await Room.find({ type: 'apartment' }).countDocuments();
      const villa = await Room.find({ type: 'villa' }).countDocuments();
      const hotel = await Room.find({ type: 'hotel' }).countDocuments();
      const penthouse = await Room.find({ type: 'penthouse' }).countDocuments(); // Correction de la clé 'penthouse'
      const Bungalow = await Room.find({ type: 'Bungalow' }).countDocuments();
  
      return res.status(200).json({ apartment, villa, hotel, penthouse, Bungalow }); // Correction de la clé 'penthouse'
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

//create
roomController.post('/',verifyTokenAdmin ,async(req,res)=>{
    try {
        const createdRoom = await Room.create(req.body)
         return res.status(200).json(createdRoom)
        
    } catch (error) {
        console.error(error.message)
        
    }

})
//update
roomController.put('/:id',verifyTokenAdmin,async(req,res)=>{
    try {
        const updateRoom = await Room.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
         
         return res.status(200).json(updateRoom)
    } catch (error) {
        console.error(error.message)
         
    }
})

// delete
roomController.delete("/:id", verifyTokenAdmin, async (req, res) => {
    try {
        await Room.findByIdAndDelete(req.params.id); // Correction de la méthode
        return res.status(200).json({ msg: "Room has been successfully deleted" });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});



//book
roomController.put('/bookRoom/:id',async(req,res) =>{
    try {
        const {unavailableDates}=req.body
        const room =await Room.findById(req.params.id)
        room.unavailableDates= room.unavailableDates.concat(unavailableDates)
        await room.save()
        return res.status(200).json(room)
        
    } catch (error) {
        console.error(error.message)
        
        
    }
})

module.exports=roomController