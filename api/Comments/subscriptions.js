import { withFilter } from 'apollo-server';

export default {
  commentAdded: {
    subscribe: withFilter(
      (root, args, context) => context.pubsub.asyncIterator('commentAdded'),
      (payload, variables) => payload.commentAdded.documentId === variables.documentId,
    ),
	},
	pollcommentAdded: {
		subscribe: withFilter(
			(root, args, context) => context.pubsub.asyncIterator('pollcommentAdded'),
			(payload, variables) => payload.pollcommentAdded.documentId === variables.pollId,
		),
	},
};
