import React from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../../store/actions/todos';

const AddTodo = () => {
  const dispatch = useDispatch();
  let input;

  return (
    <div>
      <form
        onSubmit={event => {
          event.preventDefault();
          const text = input.value.trim();
          input.value = '';
          if (!text) {
            return;
          }
          dispatch(addTodo(text));
        }}
      >
        <input ref={element => (input = element)} placeholder="何か入力してね" />
        <button type="submit">Add Todo</button>
      </form>
    </div>
  );
};

export default AddTodo;
