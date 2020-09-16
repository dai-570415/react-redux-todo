import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { VisibilityFilters, setVisibilityFilter } from '../../store/actions/todos';

const Button = ({ children, filter }) => {
  const active = useSelector((state) => filter === state.visibilityFilter);
  const dispatch = useDispatch();
  const onClick = () => dispatch(setVisibilityFilter(filter));
  
  return (
    <button
      onClick={onClick}
      disabled={active}
    >
      {children}
    </button>
  );
};
Button.propTypes = {
  children: PropTypes.node.isRequired,
  filter: PropTypes.string.isRequired
};

const Active = () => (
  <div>
    <Button filter={VisibilityFilters.SHOW_ALL}>All</Button>
    <Button filter={VisibilityFilters.SHOW_ACTIVE}>Active</Button>
    <Button filter={VisibilityFilters.SHOW_COMPLETED}>Completed</Button>
  </div>
);

export default Active;
