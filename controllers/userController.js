const req = require("express/lib/request");
const { thought, user } = require("../models");

const userController = {
    getAllUsers(req, res) {
        user.find()
        .then((users) => res.json(users)).catch((err) => res.status(500).json(err));
    },

    createUser(req, res) {
        user.create(req.body).then((dbUserData) => res.json(dbUserData)).catch((err) => res.status(500).json(err));
    },

    updateUser(req, res) {
        user.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: req.body
        }, {
            runValidators: true,
            new: true
        }).then((user) => {
            !user ? res.status(404).json({ message: 'No user with that ID' }) : res.json(user);

        }).catch((err) => res.status(500).json(err));


    },

    deleteUser(req, res) {
        user.findOneAndDelete({ _id: req.params.id }).then((user) => !user ? res.status(404).json({ message: 'No user with that ID' }) : thought.deleteMany({
            _id: {
                $in: user.thoughts
            }
        })).then(() => res.json({ message: 'This user has been deleted' })).catch((err) => res.status(500).json(err));
    },

    getUserById(req, res) {
        user.findOne({ _id: req.params.id }).then((user) => !user ? res.status(404).json({ message: 'No user with that ID' }) : res.json(user)).catch((err) => res.status(500).json(err));
    },

    addFriend(req, res) {
        console.log('You are adding a friend');
        console.log(req.body);
        user.findOneAndUpdate({
            _id: req.params.id
        }, {
            $addToSet: {
                friends: req.params.friendsId
            }
        }, {
            runValidators: true,
            new: true
        }).then((user) => !user ? res.status(404).json({ message: 'No user with that ID' }) : res.json(user)).catch((err) => res.status(500).json(err));
    },

    removeFriend(req, res) {
        user.findOneAndUpdate({
            _id: req.params.id
        }, {
            $pull: {
                friends: req.params.friendsId
            }
        }, {
            runValidators: true,
            new: true
        }).then((user) => !user ? res.status(404).json({ message: 'No user with that ID' }) : res.json(user)).catch((err) => res.status(500).json(err));
    }
};

module.exports = userController;