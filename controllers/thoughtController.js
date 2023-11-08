const { thought, user } = require("../models");
const { populate } = require("../models/user");

const thoughtController = {

getAllThoughts(req, res) {
    thought.find().then((thought) => res.json(thought)).catch((err) => res.status(500).json(err));

},
createThought(req, res) {
   thought.create(req.body)
   .then((dbThoughtData) => {
       return user.findOneAndUpdate(
           {_id:req.body.userID},
           {$push:{ thoughts:dbThoughtData._id}},
           {new:true}
       )
    
   })
   .then(userData => res.json(userData))
   .catch((err) => res.status(500).json(err));
},
updateThought(req, res) {
    thought.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: req.body
    }, {
        runValidators: true,
        new: true
    }).then((thought) => {
        !thought ? res.status(404).json({message: 'No thought with that ID'}) : res.json(thought);

    }).catch((err) => res.status(500).json(err));


},

getThoughtById({ params }, res) {
    thought.findOne({ _id: params.id })
      .then((dbThoughtData) => {

        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought with that ID'});
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

deleteThought(req, res) {
    thought.findOneAndDelete({_id: req.params.id})
    .then((thought) => {
        if(!thought){
            res.status(404).json({message: 'No thought with that ID'}) 
        }      
        
        return user.findOneAndUpdate(
            {_id:req.body.userID},
            {$pull:{thoughts:thought._id}},
            {new:true}
        )
   }).then(() => res.json({message: 'This thought has been deleted.'})).catch((err) => res.status(500).json(err));
},
addReaction(req, res) {
    console.log('Logging your reaction:');
    console.log(req.body);
    thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body} },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: 'No thought with that ID' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

deleteReaction(req, res) {
  console.log(req.params)

    thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId} } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: 'No thought with that ID' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
}

module.exports = thoughtController;