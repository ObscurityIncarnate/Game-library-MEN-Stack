import mongoose from "mongoose";

const profiles = new mongoose.Schema({
    preferredName: {type: String},
    pronouns: {type: String},
    wishlistedGames:{type: [mongoose.Schema.Types.ObjectId], ref: "Games"},
    imageCaptures: {type: [String]},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
})

const Profiles =  mongoose.model("Profiles", profiles);
export default Profiles;