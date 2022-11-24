import React from 'react';
import PropTypes from 'prop-types';
import {Text} from 'react-native';

function Question({content}) {
  return <Text>{content}</Text>;
}

Question.propTypes = {
  content: PropTypes.string.isRequired,
};

export default Question;
