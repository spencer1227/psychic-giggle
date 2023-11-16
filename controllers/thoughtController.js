// const { thought, user } = require("../models");
// const { populate } = require("../models/user");

// const thoughtController = {

// async getAllThoughts(req, res) {
//   try{
//   const thoughts = await thought.find()
//   console.log(thoughts)
//   res.json(thoughts)
//   } catch(err) {res.status(500).json(err)};


// },
// createThought(req, res) {
//    thought.create(req.body)
//    .then((dbThoughtData) => {

//       console.log(dbThoughtData)
//        res.json(dbThoughtData)
    
//    })
//    .then(userData => res.json(userData))
//    .catch((err) => res.status(500).json(err));
// },
// updateThought(req, res) {
//     thought.findOneAndUpdate({
//         _id: req.params.id
//     }, {
//         $set: req.body
//     }, {
//         runValidators: true,
//         new: true
//     }).then((thought) => {
//         !thought ? res.status(404).json({message: 'No thought with that ID'}) : res.json(thought);

//     }).catch((err) => res.status(500).json(err));


// },

// getThoughtById({ params }, res) {
//     thought.findOne({ _id: params.id })
//       .then((dbThoughtData) => {

//         if (!dbThoughtData) {
//           res.status(404).json({ message: 'No thought with that ID'});
//           return;
//         }
//         res.json(dbThoughtData);
//       })
//       .catch((err) => {
//         console.log(err);
//         res.status(400).json(err);
//       });
//   },

// deleteThought(req, res) {
//     thought.findOneAndDelete({_id: req.params.id})
//     .then((thought) => {
//         if(!thought){
//             res.status(404).json({message: 'No thought with that ID'}) 
//         }      
        
//         return user.findOneAndUpdate(
//             {_id:req.body.userID},
//             {$pull:{thoughts:thought._id}},
//             {new:true}
//         )
//    }).then(() => res.json({message: 'This thought has been deleted.'})).catch((err) => res.status(500).json(err));
// },
// addReaction(req, res) {
//     console.log('Logging your reaction:');
//     console.log(req.body);
//     thought.findOneAndUpdate(
//       { _id: req.params.thoughtId },
//       { $addToSet: { reactions: req.body} },
//       { runValidators: true, new: true }
//     )
//       .then((thought) =>
//         !thought
//           ? res
//               .status(404)
//               .json({ message: 'No thought with that ID' })
//           : res.json(thought)
//       )
//       .catch((err) => res.status(500).json(err));
//   },

// deleteReaction(req, res) {
//   console.log(req.params)

//     thought.findOneAndUpdate(
//       { _id: req.params.thoughtId },
//       { $pull: { reactions: { reactionId: req.params.reactionId} } },
//       { runValidators: true, new: true }
//     )
//       .then((thought) =>
//         !thought
//           ? res
//               .status(404)
//               .json({ message: 'No thought with that ID' })
//           : res.json(thought)
//       )
//       .catch((err) => res.status(500).json(err));
//   },
// }

// module.exports = thoughtController;


const { thought, user } = require('../models');

const thoughtController = {
  // get all thoughts
  async getThoughts(req, res) {
    try {
      const dbThoughtData = await thought.find()
        .sort({ createdAt: -1 });

      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // get single thought by id
  async getSingleThought(req, res) {
    try {
      const dbThoughtData = await thought.findOne({ _id: req.params.thoughtId });

      if (!dbThoughtData) {
        return res.status(404).json({ message: 'No thought with this id!' });
      }

      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // create a thought
  async createThought(req, res) {
    try {
      const dbThoughtData = await thought.create(req.body);

      // const dbUserData = await user.findOneAndUpdate(
      //   { _id: req.body.userId },
      //   { $push: { thoughts: dbThoughtData._id } },
      //   { new: true }
      // );

      // if (!dbUserData) {
      //   return res.status(404).json({ message: 'Thought created but no user with this id!' });
      // }

      res.json({ message: 'Thought successfully created!' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // update thought
  async updateThought(req, res) {
    const dbThoughtData = await thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $set: req.body }, { runValidators: true, new: true });

    if (!dbThoughtData) {
      return res.status(404).json({ message: 'No thought with this id!' });
    }

    res.json(dbThoughtData);

    // console.log(err);
    // res.status(500).json(err);
  },

  // delete thought
  deleteThought(req, res) {
    thought.findOneAndDelete({_id: req.params.thoughtId})
    .then((thought) => {
        if(!thought){
            res.status(404).json({message: 'No thought with that ID'}) 
        }      
        
        return user.findOneAndUpdate(
            {_id:req.body.userID},
            {$pull:{thoughts:thought._id}},
            {new:true}
        )
   }).then(() => res.json({message: 'This thought has been deleted.'})).catch((err) => res.status(500));
  },

  // add a reaction to a thought
  async addReaction(req, res) {
    try {
      const dbThoughtData = await thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );

      if (!dbThoughtData) {
        return res.status(404).json({ message: 'No thought with this id!' });
      }

      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // remove reaction from a thought
  async removeReaction(req, res) {
    try {
      const dbThoughtData = await thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );

      if (!dbThoughtData) {
        return res.status(404).json({ message: 'No thought with this id!' });
      }

      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
};

module.exports = thoughtController;
