import React from 'react';
import AddTodo from './AddTodo';
import TodoList from './TodoList';
import Active from './Active';

const Index = () => {
    return (
        <>
            <AddTodo />
            <Active />
            <TodoList />
        </>
    );
}

export default Index;