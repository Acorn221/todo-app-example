import React, {useEffect, useState} from 'react';

import API, {GraphQLResult, graphqlOperation} from '@aws-amplify/api';
import {listTodos, getTodo} from '@/graphql/queries';
import {createTodo, updateTodo, deleteTodo} from '@/graphql/mutations';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import * as APIt from './API';
import { WithAuthenticatorOptions } from '@aws-amplify/ui-react/dist/types/components/Authenticator/withAuthenticator';
import AutosizeInput from 'react-input-autosize';

type Todo = APIt.GetTodoQuery['getTodo'];

type CreateTodoType = {
  name: string;
  description: string;
}

const createTodoMethod = async ({name, description}: CreateTodoType) => {
  const createI: APIt.CreateTodoInput = {
    name: name,
    description: description,
  };
  const createMV: APIt.CreateTodoMutationVariables = {
    input: createI,
  };
  const createR: GraphQLResult<APIt.CreateTodoMutation> = await API.graphql(
    graphqlOperation(createTodo, createMV),
  ) as GraphQLResult<APIt.CreateTodoMutation>;
  if (createR.data) {
    const createTM: APIt.CreateTodoMutation = createR.data;
    if (createTM.createTodo) {
      const todo: Todo = createTM.createTodo;
      console.log('CreateTodo', todo);
      return todo;
    }
  } else {
    throw new Error(`CreateTodo failed, ${createR}`);
  }
};

const getManyTodosMethod = async () => {
  const listQV: APIt.ListTodosQueryVariables = {};
  const listGQL: GraphQLResult<APIt.ListTodosQuery> = await API.graphql(
    graphqlOperation(listTodos, listQV),
  ) as GraphQLResult<APIt.ListTodosQuery>;
  if (listGQL.data) {
    const listQ: APIt.ListTodosQuery = listGQL.data;
    if (listQ.listTodos && listQ.listTodos.items) {
      return listQ.listTodos.items.filter(t => t !== null).sort((a, b) => {
        if(!a || !b) return 0;
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }) as Todo[];
    }
  } else {
    throw new Error(`ListTodos failed, ${listGQL}`);
  }
}

async function accessAPI() {
  console.log("api");
  const todos = await getManyTodosMethod();
  if(todos){
    todos.forEach((item) => {
      if (item) {
        const todo: Todo = item;
        console.log('ListTodo:', todo);
      }
    });
  }
  
  /*  let id: string = '';
  // Create GraphQL Mutation
  const createI: APIt.CreateTodoInput = {
    name: 'create name',
    description: 'create description',
  };
  const createMV: APIt.CreateTodoMutationVariables = {
    input: createI,
  };
  const createR: GraphQLResult<APIt.CreateTodoMutation> = await API.graphql(
    graphqlOperation(createTodo, createMV),
  ) as GraphQLResult<APIt.CreateTodoMutation>;
  if (createR.data) {
    const createTM: APIt.CreateTodoMutation = createR.data;
    if (createTM.createTodo) {
      const todo: Todo = createTM.createTodo;
      console.log('CreateTodo', todo);
      id = createTM.createTodo.id;
    }
  }
  // Update GraphQL Mutation
  const updateI: APIt.UpdateTodoInput = {id, description: 'update description'};
  const updateMV: APIt.UpdateTodoMutationVariables = {
    input: updateI,
  };
  const updateR: GraphQLResult<APIt.UpdateTodoMutation> = await API.graphql(
    graphqlOperation(updateTodo, updateMV),
  ) as GraphQLResult<APIt.UpdateTodoMutation>;
  if (updateR.data) {
    const updateTM: APIt.UpdateTodoMutation = updateR.data;
    if (updateTM.updateTodo) {
      const todo: Todo = updateTM.updateTodo;
      console.log('UpdateTodo:', todo);
    }
  }
  // Get GraphQL Query
  const getQV: APIt.GetTodoQueryVariables = {id};
  const getGQL: GraphQLResult<APIt.GetTodoQuery> = await API.graphql(
    graphqlOperation(getTodo, getQV),
  ) as GraphQLResult<APIt.GetTodoQuery> ;
  if (getGQL.data) {
    const getQ: APIt.GetTodoQuery = getGQL.data;
    if (getQ.getTodo) {
      const todo: Todo = getQ.getTodo;
      console.log('GetTodo:', todo);
    }
  }
  // List GraphQL Query
  const listQV: APIt.ListTodosQueryVariables = {};
  const listGQL: GraphQLResult<APIt.ListTodosQuery> = await API.graphql(
    graphqlOperation(listTodos, listQV),
  ) as GraphQLResult<APIt.ListTodosQuery>;
  if (listGQL.data) {
    const listQ: APIt.ListTodosQuery = listGQL.data;
    if (listQ.listTodos && listQ.listTodos.items) {
      listQ.listTodos.items.forEach((item: Todo | null) => {
        if (item) {
          const todo: Todo = item;
          console.log('ListTodo:', todo);
        }
      });
    }
  }
  // Delete GraphQL Mutation
  const deleteI: APIt.DeleteTodoInput = {id};
  const deleteMV: APIt.DeleteTodoMutationVariables = {
    input: deleteI,
  };
  const deleteR: GraphQLResult<APIt.DeleteTodoMutation> = await API.graphql(
    graphqlOperation(deleteTodo, deleteMV),
  ) as GraphQLResult<APIt.DeleteTodoMutation>;
  if (deleteR.data) {
    const deleteTM: APIt.DeleteTodoMutation = deleteR.data;
    if (deleteTM.deleteTodo) {
      const todo: Todo = deleteTM.deleteTodo;
      console.log('DeleteTodo:', todo);
    }
  }*/
}


type AppInterface = {
  user: any;
  signOut: () => void;
};

const App = ({ signOut, user }: AppInterface | any) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoName, setTodoName] = useState<string>('');
  const [todoDescription, setTodoDescription] = useState<string>('');

  useEffect(() => {
    getManyTodosMethod().then(t => {
      if(t){
        setTodos(t);
      }
    });
        
  }, []);
  return (
    <div className='bg-slate-800 w-screen h-screen flex'>
        <div className=' text-white m-auto'>
          <div className='flex'>
            <div className='text-5xl flex-1'>
              TODO App
            </div>
            <div className='flex-1 bg-slate-700 p-2 rounded-2xl'>
              <h1>Hello {user.attributes.email}</h1>
              <button onClick={signOut}>Sign out</button>
            </div>
          </div>
          <div className='flex'>
          <AutosizeInput 
              placeholder="Name"
              className='flex-1 m-2 text-black' 
              minWidth={100}
              value={todoName}
              onChange={(e) => setTodoName(e.target.value)} 
              />
            <AutosizeInput 
              placeholder="Description"
              className='flex-1 m-2 text-black' 
              minWidth={400}
              value={todoDescription}
              onChange={(e) => setTodoDescription(e.target.value)} 
              />
            <button 
              className='flex-2 w-1/3 m-2 p-3 rounded-2xl hover:bg-slate-600 bg-slate-700'
              onClick={
                () => createTodoMethod({name: todoName, description: todoDescription}).then(t => setTodos([...todos, t]))
              }
            >
              Submit
            </button>
          </div>
          <div className='text-center grid grid-cols-5 gap-5 m-5'>
          {
            todos.map((todo: Todo) => {
              return (
                <div key={todo?.id} className='bg-slate-700 p-2 rounded-lg'>
                  <div>{todo?.name}</div>
                  <hr />
                  <div>{todo?.description}</div>
                </div>
              )
            })
          }
        </div>
        </div>
    </div>
  );
}

export default withAuthenticator(App);
