import seeder from '@cleverbeagle/seeder';
import { Meteor } from 'meteor/meteor';
import Documents from '../../api/Documents/Documents';
import Comments from '../../api/Comments/Comments';
import Polls from '../../api/Polls/Polls';
import Options from '../../api/Options/Options';

const commentsSeed = (userId, date, documentId) => {
  seeder(Comments, {
    seedIfExistingData: true,
    environments: ['development', 'staging'],
    data: {
      dynamic: {
        count: 3,
        seed(commentIteration, faker) {
          return {
            userId,
            documentId,
            comment: faker.hacker.phrase(),
            createdAt: date,
          };
        },
      },
    },
  });
};

const documentsSeed = (userId) => {
  seeder(Documents, {
    seedIfExistingData: true,
    environments: ['development', 'staging'],
    data: {
      dynamic: {
        count: 5,
        seed(iteration) {
          const date = new Date().toISOString();
          return {
            isPublic: false,
            createdAt: date,
            updatedAt: date,
            owner: userId,
            title: `Document #${iteration + 1}`,
            body: `This is the body of document #${iteration + 1}`,
            dependentData(documentId) {
              commentsSeed(userId, date, documentId);
            },
          };
        },
      },
    },
  });
};


const optionsSeed = (userId, date, pollId) => {
	seeder(Options, {
		seedIfExistingData: true,
		environments: ['development', 'staging'],
		data: {
			dynamic: {
				count: 5,
				seed(optionIteration, faker) {
					return {
						userId,
						pollId,
						value: faker.hacker.phrase(),
						order: `${optionIteration + 1}`,
						createdAt: date,
					};
				},
			},
		},
	});
};

const pollsSeed = (userId) => {
	seeder(Polls, {
		seedIfExistingData: true,
		environments: ['development', 'staging'],
		data: {
			dynamic: {
				count: 3,
				seed(iteration) {
					const date = new Date().toISOString();
					return {
						isPublic: false,
						createdAt: date,
						updatedAt: date,
						owner: userId,
						title: `Poll #${iteration + 1}`,
						description: `This is the description of poll #${iteration + 1}`,
						dependentData(pollId) {
							optionsSeed(userId, date, pollId);
							commentsSeed(userId, date, pollId);
						},
					};
				},
			},
		},
	});
};


seeder(Meteor.users, {
  seedIfExistingData: true,
  environments: ['development', 'staging'],
  data: {
    static: [
      {
        email: 'admin@admin.com',
        password: 'password',
        profile: {
          name: {
            first: 'Andy',
            last: 'Warhol',
          },
        },
        roles: ['admin'],
        dependentData(userId) {
					documentsSeed(userId);
					pollsSeed(userId);
				},
      },
    ],
    dynamic: {
      count: 5,
      seed(iteration, faker) {
        const userCount = iteration + 1;
        return {
          email: `user+${userCount}@test.com`,
          password: 'password',
          profile: {
            name: {
              first: faker.name.firstName(),
              last: faker.name.lastName(),
            },
          },
          roles: ['user'],
          dependentData(userId) {
            documentsSeed(userId);
					}
        };
      },
    },
  },
});
