const {Schema, model} = require("mongoose");

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Incorrect Email. Please enter a valid email address",]
    },
    thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: "thought"
        },
    ],
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: "user"
        },
    ]
}, {
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
});

userSchema.virtual("friendCount").get(function () {
    return this.friends.length;
  });

const user = model("user", userSchema);
module.exports = user;