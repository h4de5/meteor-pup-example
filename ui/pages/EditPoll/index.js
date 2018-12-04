import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import PollEditor from '../../components/PollEditor';
import Loading from '../../components/Loading';
import NotFound from '../NotFound';
import { editPoll as editPollQuery } from '../../queries/Polls.gql';

const EditPoll = ({ data, history }) => (
	<React.Fragment>
		{!data.loading ? (
			<React.Fragment>
				{data.poll ? <PollEditor doc={data.poll} history={history} /> : <NotFound />}
			</React.Fragment>
		) : (
				<Loading />
			)}
	</React.Fragment>
);

EditPoll.propTypes = {
	data: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
};

export default graphql(editPollQuery, {
	options: ({ match }) => ({
		variables: {
			_id: match.params._id,
		},
	}),
})(EditPoll);
