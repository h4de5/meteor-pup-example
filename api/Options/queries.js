import Options from './Options';

// export default {
//   documents: (parent, args, context) =>
// 		context.user && context.user._id ? Options.find({ owner: context.user._id }).fetch() : [],
//   document: (parent, args, context) =>
//     Polls.findOne({
//       $or: [
//         { _id: args._id, owner: context.user && context.user._id ? context.user._id : null },
//         { _id: args._id, isPublic: true },
//       ],
//     }),
// };

export default {
	options: ({ _id }) => Options.find({ pollId: _id }, { sort: { order: 1 } }).fetch(),
};

