import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { compose, graphql } from 'react-apollo';
import { timeago } from '../../../modules/dates';
import BlankState from '../../components/BlankState';
import { StyledPolls, PollsList, Poll } from './styles';
import { polls } from '../../queries/Polls.gql';
import { addPoll } from '../../mutations/Polls.gql';

const Polls = ({ data, mutate }) => (
  <StyledPolls>
    <header className="clearfix">
      <Button bsStyle="success" onClick={mutate}>
        New Poll
      </Button>
    </header>
    {data.polls && data.polls.length ? (
      <PollsList>
        {data.polls.map(({ _id, isPublic, title, updatedAt }) => (
          <Poll key={_id}>
            <Link to={`/polls/${_id}/edit`} />
            <header>
              {isPublic ? (
                <span className="label label-success">Public</span>
              ) : (
                <span className="label label-default">Private</span>
              )}
              <h2>{title}</h2>
              <p>{timeago(updatedAt)}</p>
            </header>
          </Poll>
        ))}
      </PollsList>
    ) : (
      <BlankState
        icon={{ style: 'solid', symbol: 'file-alt' }}
        title="You're plum out of polls, friend!"
        subtitle="Add your first poll by clicking the button below."
        action={{
          style: 'success',
          onClick: mutate,
          label: 'Create Your First Poll',
        }}
      />
    )}
  </StyledPolls>
);

Polls.propTypes = {
  userId: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  mutate: PropTypes.func.isRequired,
};

export default compose(
  graphql(polls),
  graphql(addPoll, {
    options: ({ history }) => ({
      refetchQueries: [{ query: polls }],
      onCompleted: (mutation) => {
        history.push(`/polls/${mutation.addPoll._id}/edit`);
      },
    }),
  }),
)(Polls);
