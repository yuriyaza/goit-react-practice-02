import { Component } from 'react';
import { nanoid } from 'nanoid';
import { Grid, GridItem, SearchForm, EditForm, Text, Todo } from 'components';

const TODOS_KEY = 'todos' 

export class Todos extends Component {
  state = {
    todos: [],
  };
  
  componentDidMount = () => { 
    const todos = JSON.parse(localStorage.getItem(TODOS_KEY));
    if (todos) { 
      this.setState ({todos})
    }
  }

  componentDidUpdate = (_, prevState) => { 
    const { todos } = this.state;
    if (prevState.todos !== todos) { 
      localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
    }
  }

  handleSubmit = text => {
    const todo = { text, id: nanoid() };
    this.setState(prevState => ({
      todos: [...prevState.todos, todo],
    }));
  };

  handleDeleteTodo = (id) => { 
    const { todos } = this.state;
    const newTodos = todos.filter(todo => todo.id !== id);
    this.setState ({todos: newTodos})
  }

  render() {
    const { todos } = this.state;
    return (
      <>
        <SearchForm onSubmit={this.handleSubmit} />
        <Grid>
          {todos.map(({ text, id }, index) => {
            return (
              <GridItem key={id}>
                <Todo
                  text={text}
                  counter={index + 1}
                  id={id}
                  onDeleteTodo={this.handleDeleteTodo}
                />
              </GridItem>
            );
          })}
        </Grid>
      </>
    );
  }
}
