import Comments from './Comments';

export default {
	comments: ({ _id }) => Comments.find({ documentId: _id }, { sort: { createdAt: 1 } }).fetch(),
	pollcomments: ({ _id }) => Comments.find({ pollId: _id }, { sort: { createdAt: 1 } }).fetch(),
};
