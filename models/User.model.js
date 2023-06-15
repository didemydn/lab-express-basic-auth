const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const NewuserSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  password: String
}
);

const User = model("NewUser", NewuserSchema);

module.exports = User;
