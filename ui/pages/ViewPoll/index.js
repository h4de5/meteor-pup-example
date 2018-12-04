import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { Meteor } from 'meteor/meteor';
import SEO from '../../components/SEO';
import BlankState from '../../components/BlankState';
import Comments from '../../components/Comments';
import { poll as pollQuery } from '../../queries/Polls.gql';
import commentAdded from '../../subscriptions/Comments.gql';
import pollcommentAdded from '../../subscriptions/PollComments.gql';
import parseMarkdown from '../../../modules/parseMarkdown';

import { StyledViewPoll, PollBody } from './styles';

class ViewPoll extends React.Component {
  componentWillMount() {
    const { data } = this.props;
    if (Meteor.isClient && Meteor.userId()) data.refetch();
  }

  render() {
    const { data } = this.props;

    if (!data.loading && data.poll) {
      return (
        <React.Fragment>
          <StyledViewPoll>
            <SEO
              title={data.poll && data.poll.title}
              description={data.poll && data.poll.body}
              url={`polls/${data.poll && data.poll._id}`}
              contentType="article"
              published={data.poll && data.poll.createdAt}
              updated={data.poll && data.poll.updatedAt}
              twitter="clvrbgl"
            />
            <React.Fragment>
              <h1>{data.poll && data.poll.title}</h1>
              <PollBody
                dangerouslySetInnerHTML={{
                  __html: parseMarkdown(data.poll && data.poll.body),
                }}
              />
            </React.Fragment>
          </StyledViewPoll>
          <Comments
            subscribeToNewComments={() =>
              data.subscribeToMore({
                poll: commentAdded,
                variables: {
                  pollId: data.poll && data.poll._id,
                },
                updateQuery: (existingData, { subscriptionData }) => {
                  if (!subscriptionData.data) return existingData;
                  const newComment = subscriptionData.data.commentAdded;
                  return {
                    poll: {
                      ...existingData.poll,
                      comments: [...existingData.poll.comments, newComment],
                    },
                  };
                },
              })
            }
            pollId={data.poll && data.poll._id}
            comments={data.poll && data.poll.comments}
          />
        </React.Fragment>
      );
    }

    if (!data.loading && !data.poll) {
      return (
        <BlankState
          icon={{ style: 'solid', symbol: 'file-alt' }}
          title="No poll here, friend!"
          subtitle="Make sure to double check the URL! If it's correct, this is probably a private poll."
        />
      );
    }

    return null;
  }
}

ViewPoll.propTypes = {
  data: PropTypes.object.isRequired,
};

export default graphql(pollQuery, {
  options: ({ match }) => ({
    variables: {
      _id: match.params._id,
    },
  }),
})(ViewPoll);
