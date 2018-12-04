import gql from 'graphql-tag';

import UserTypes from '../../api/Users/types';
import UserQueries from '../../api/Users/queries';
import UserMutations from '../../api/Users/mutations';

import UserSettingsTypes from '../../api/UserSettings/types';
import UserSettingsQueries from '../../api/UserSettings/queries';
import UserSettingsMutations from '../../api/UserSettings/mutations';

import DocumentTypes from '../../api/Documents/types';
import DocumentQueries from '../../api/Documents/queries';
import DocumentMutations from '../../api/Documents/mutations';

import CommentTypes from '../../api/Comments/types';
import CommentQueries from '../../api/Comments/queries';
import CommentMutations from '../../api/Comments/mutations';
import CommentSubscriptions from '../../api/Comments/subscriptions';

import PollTypes from '../../api/Polls/types';
import PollQueries from '../../api/Polls/queries';
import PollMutations from '../../api/Polls/mutations';

import OptionTypes from '../../api/Options/types';
import OptionQueries from '../../api/Options/queries';
import OptionMutations from '../../api/Options/mutations';

import OAuthQueries from '../../api/OAuth/queries';

import '../../api/Documents/server/indexes';
import '../../api/webhooks';

const schema = {
  typeDefs: gql`
    ${UserTypes}
    ${DocumentTypes}
    ${CommentTypes}
		${UserSettingsTypes}
		${PollTypes}
		${OptionTypes}

    type Query {
      documents: [Document]
      document(_id: String): Document
      user(_id: String): User
      users(currentPage: Int, perPage: Int, search: String): Users
      userSettings: [UserSetting]
      exportUserData: UserDataExport
			oAuthServices(services: [String]): [String]
			polls: [Poll]
      poll(_id: String): Poll
    }

    type Mutation {
      addDocument(title: String, body: String): Document
      updateDocument(_id: String!, title: String, body: String, isPublic: Boolean): Document
      removeDocument(_id: String!): Document
      addComment(documentId: String!, comment: String!): Comment
      removeComment(commentId: String!): Comment
      updateUser(user: UserInput): User
      removeUser(_id: String): User
      addUserSetting(setting: UserSettingInput): UserSetting
      updateUserSetting(setting: UserSettingInput): UserSetting
      removeUserSetting(_id: String!): UserSetting
      sendVerificationEmail: User
			sendWelcomeEmail: User
			addPoll(title: String, description: String): Poll
			updatePoll(_id: String!, title: String, description: String, isPublic: Boolean): Poll
			removePoll(_id: String!): Poll
			addOption(pollId: String!, value: String!, order: Int): Option
			updateOption(_id: String!, value: String!, order: Int): Option
			removeOption(_id: String!): Option
			addPollComment(documentId: String!, comment: String!): Comment
    }

    type Subscription {
			commentAdded(documentId: String!): Comment
			pollcommentAdded(pollId: String!): Comment
    }
  `,
  resolvers: {
    Query: {
      ...DocumentQueries,
      ...UserQueries,
      ...UserSettingsQueries,
			...OAuthQueries,
			...PollQueries,
    },
    Mutation: {
      ...DocumentMutations,
      ...CommentMutations,
      ...UserMutations,
			...UserSettingsMutations,
			...PollMutations,
			...OptionMutations,
    },
    Subscription: {
      ...CommentSubscriptions,
    },
    Document: {
      comments: CommentQueries.comments,
		},
		Poll: {
			options: OptionQueries.options,
			comments: CommentQueries.pollcomments,
		},
    Comment: {
      user: UserQueries.user,
    },
  },
};

export default schema;
