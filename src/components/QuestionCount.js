import React from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native';

function QuestionCount({props}) {
  return (
    <View className="questionCount">
      Question <span>{props.counter}</span> of <span>{props.total}</span>
    </View>
  );
}

QuestionCount.propTypes = {
  counter: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

export default QuestionCount;
