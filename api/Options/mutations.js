import Options from './Options';

export default {
	addOption(root, args, context) {
    if (!context.user) throw new Error('Sorry, you must be logged in to add a new option.');

    const date = new Date().toISOString();
    const optionToInsert = {
			pollId: args.pollId,
			value: args.value,
			userId: context.user._id,
			order: args.order,
      createdAt: date,
    };

    const optionId = Options.insert(optionToInsert);
    context.pubsub.publish('optionAdded', {
      optionAdded: { _id: optionId, ...optionToInsert },
    });

    return { _id: optionId, ...optionToInsert };
	},
	
  updateOption: (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to update a option.');
		if (!Options.findOne({ _id: args._id, userId: context.user._id }))
      throw new Error('Sorry, you need to be the owner of this option to update it.');
    Options.update(
      { _id: args._id },
      {
        $set: {
					...args,
          updatedAt: new Date().toISOString(),
        },
      },
    );
    const doc = Options.findOne(args._id);
    return doc;
	},

  removeOption: (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to remove a option.');
		if (!Options.findOne({ _id: args._id, userId: context.user._id }))
      throw new Error('Sorry, you need to be the owner of this option to remove it.');
    Options.remove(args);
    return args;
  },
};
