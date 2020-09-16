# Redux まとめ(Todoアプリ)

Reduxは何度やっても分かりづらいので、
自分への学習用も兼ねて、アーキテクチャ作成しました。

## 🚀 Clone
　
```bash
$ git clone https://github.com/dai-570415/react-redux-todo.git
$ cd react-redux-todo
$ npm install
$ npm start
```

### [ module ]
- redux
- react-redux
- redux-persist (永続化のためのモジュール)

### [ file ]
- src/index.js (エントリーポイント)
- src/store/actions/todos.js (actionファイル)
- src/store/index.js (Reducerをまとめるファイル)
- src/store/reducers/todos.js (reducersファイル)
- src/components/todo/index.js (Todo コンポーネントまとめファイル)
- src/components/todo/AddTodo.js (コメント追加ファイル)
- src/components/todo/Active.js (タスク管理ボタンファイル)
- src/components/todo/Todolist.js (タスク管理リストファイル)
- src/App.js(共通コンポーネント)

### [ action ]の編集

```js
// src/store/actions/todos.js
export const ADD_TODO = 'ADD_TODO';
export const DEL_TODO = 'DEL_TODO';
export const TOGGLE_TODO = 'TOGGLE_TODO';
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER';

let nextTodoId = 1;

export const addTodo = (text) => ({
  type: ADD_TODO,
  id: nextTodoId++,
  text
});

export const delTodo = (id) => ({
  type: DEL_TODO,
  id
});

export const toggleTodo = (id) => ({
  type: TOGGLE_TODO,
  id
});

export const setVisibilityFilter = (filter) => ({
  type: SET_VISIBILITY_FILTER,
  filter
});

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
};
```

### [ reducer ]の編集

```js
// src/store/reducers/todos.js
import { ADD_TODO, DEL_TODO, TOGGLE_TODO, VisibilityFilters } from '../actions/todos';

export const todos = (state = [], action) => {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          id: action.id,
          text: action.text,
          completed: false
        }
      ];
    case DEL_TODO:
      return state.filter(todo => todo.id !== action.id);
    case TOGGLE_TODO:
      return state.map((todo) =>
        todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
      );
    default:
      return state;
  }
}

export const visibilityFilter = (state = VisibilityFilters.SHOW_ALL, action) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
}
```

### [ store ]の編集

```js
// src/store/index.js
import { createStore, combineReducers } from 'redux';
import { todos, visibilityFilter } from './reducers/todos';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root', // Storageに保存されるキー名を指定する
  storage, // 保存先としてlocalStorageがここで設定される
  whitelist: ['todos'] // Stateは`todos`のみStorageに保存する
  // blacklist: ['visibilityFilter'] // `visibilityFilter`は保存しない
}

const rootReducer = combineReducers({
  todos,
  visibilityFilter
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export const persistor = persistStore(store);
export default store;
```

### [ エントリーポイント ]の編集

```js
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

// Redux
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './store/';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
```

#### Todo コンポーネントまとめファイル

```js
// src/components/todo/index.js
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
```

#### コメント追加ファイル

```jsx
// src/components/todo/AddTodo.js
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
```

#### タスク管理ボタンファイル

```jsx
// src/components/todo/Active.js
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
```

#### タスク管理リストファイル

```jsx
// src/components/todo/Todolist.js
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
```

#### 共通コンポーネント

```jsx
// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Todo from './components/todo';
import './components/assets/css/App.css';

// head情報
const title = 'React.Redux.app | React雛形プロジェクト Redux編';
const description = 'React雛形プロジェクト Redux編です。';
document.title = title;
const headData = document.head.children;
for (let i = 0; i < headData.length; i++) {
    const nameVal = headData[i].getAttribute('name');
    if (nameVal !== null) {
        if (nameVal.indexOf('description') !== -1) {
            headData[i].setAttribute('content', description);
        }
        // OGP(twitter)の設定
        if (nameVal.indexOf('twitter:title') !== -1) {
            headData[i].setAttribute('content', title);
        }
        if (nameVal.indexOf('twitter:description') !== -1) {
            headData[i].setAttribute('content', description);
        }
    }
}
// ここまでhead情報

const App = () => (
  <div className="container">
    <Router>
      <Switch>
        <Route exact path="/todo" component={ Todo } />
      </Switch>
    </Router>
  </div>
);

export default App;
```

#### 最後に

凝集度と結合度を考慮してコンポーネント分割を考えて作りましたが、
もしこうした方が再利用性あると思う場合はなんでも構わないのでコメントください。