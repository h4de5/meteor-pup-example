export default `
  type Poll {
    _id: String
    isPublic: Boolean
    title: String
    createdAt: String
    updatedAt: String
    options: [Option]
		owner: String
		description: String
    comments: [Comment]
  }
`;
