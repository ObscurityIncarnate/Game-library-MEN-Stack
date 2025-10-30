import mongoose from "mongoose";
const reviews =  new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, res:"User"},
    rating: {type: Number},
    description: {type: String}
})
const games = new mongoose.Schema({
    name:{type: String, required: true},
    gameIcon:{type: String},
    backgroundImage:{type: String},
    reviews: {type: [reviews]},
    gallery: {type: [String]}
})

const Games =  mongoose.model("Games", games);
export default Games;