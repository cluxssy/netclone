const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = mongoose.Schema({
    name : {type : String, required : true},
    email : {type: String, required : true},
    mobile: String,
    age : Number,
    password : {type: String, required: true}
})

UserSchema.pre("save", async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

const UserModel = mongoose.model("User",UserSchema);

module.exports = UserModel;