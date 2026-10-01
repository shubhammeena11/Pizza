import mongoose from "mongoose";
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name : { type : String, required: true, min: 3, max: 30 },
    email : { type : String, required: true, unique: true },
    password : { type : String, required: true, min: 6, max: 30 },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    role : { type : String, default: "customer"}
},{timestamps: true})

export default mongoose.model("User", userSchema);