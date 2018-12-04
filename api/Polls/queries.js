
import Polls from './Polls';

export default {
	polls: (parent, args, context) =>
		context.user && context.user._id ? Polls.find({ owner: context.user._id }).fetch() : [],
	poll: (parent, args, context) =>
		Polls.findOne({
			$or: [
				{ _id: args._id, owner: context.user && context.user._id ? context.user._id : null },
				{ _id: args._id, isPublic: true },
			],
		}),
};
