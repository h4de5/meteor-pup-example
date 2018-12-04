import sanitizeHtml from 'sanitize-html';
import Polls from './Polls';

export default {
  addPoll: (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to add a new Poll.');
    const date = new Date().toISOString();
		const pollId = Polls.insert({
      isPublic: args.isPublic || false,
      title:
        args.title ||
        `Untitled Poll #${Polls.find({ owner: context.user._id }).count() + 1}`,
			owner: context.user._id,
			description: sanitizeHtml(args.description),
      createdAt: date,
      updatedAt: date,
    });
    const doc = Polls.findOne(pollId);
    return doc;
  },
  updatePoll: (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to update a poll.');
    if (!Polls.findOne({ _id: args._id, owner: context.user._id }))
      throw new Error('Sorry, you need to be the owner of this poll to update it.');
    Polls.update(
      { _id: args._id },
      {
        $set: {
					...args,
					description: sanitizeHtml(args.description),
          updatedAt: new Date().toISOString(),
        },
      },
    );
    const doc = Polls.findOne(args._id);
    return doc;
  },
  removePoll: (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to remove a poll.');
    if (!Polls.findOne({ _id: args._id, owner: context.user._id }))
      throw new Error('Sorry, you need to be the owner of this poll to remove it.');
		Polls.remove(args);
		// TODO remove options? comments?
    return args;
  },
};
