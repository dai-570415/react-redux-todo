import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTodo, delTodo, VisibilityFilters } from '../../store/actions/todos';

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case VisibilityFilters.SHOW_ALL:
      return todos;
    case VisibilityFilters.SHOW_COMPLETED:
      return todos.filter(todo => todo.completed);
    case VisibilityFilters.SHOW_ACTIVE:
      return todos.filter(todo => !todo.completed);
    default:
      throw new Error('Unknown filter: ' + filter);
  }
};

const Todo = ({ onClick, completed, text }) => (
  <span
    onClick={onClick}
  >
    {completed ? '👌' : '👋'} <span>{text}</span>
  </span>
);
Todo.propTypes = {
  onClick: PropTypes.func.isRequired,
  completed: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired
};

const TodoList = () => {
  const todos = useSelector(state =>
    getVisibleTodos(state.todos, state.visibilityFilter)
  );
  
  const dispatch = useDispatch();

  return (
    <>
      {todos.map(todo => (
        <div key={todo.id}>
          <Todo
            {...todo}
            onClick={() => dispatch(toggleTodo(todo.id))}
          />
          <button onClick={() => dispatch(delTodo(todo.id))}>Delete</button>
        </div>
      ))}
    </>
  );
};

export default TodoList;
