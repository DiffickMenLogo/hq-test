import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { User, requestUsers, requestUsersWithError } from './api';
import { randomInt } from './randomInt';

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(4);
  const [offset, setOffset] = useState(0);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  
  useEffect(() => {
    try {
      setIsLoading(true);
      if (randomInt(10) == 8) {
        requestUsersWithError({ limit, offset, name, age }).then((res) => {
          setUsers([]);
          setIsLoading(true);
        }).catch((e) => {
          console.log(e);
        })
      } else{
        requestUsers({limit, offset, name, age}).then((res) => {
        setUsers(res);
        setIsLoading(false);
      })
      }
      } catch (e) {
        console.log(e);
      }
  },[limit, offset, name, age])


  return (
    <div className="App">
      <div className="form">
        <div className="form_search">
          <input onChange={(e) => setName(e.target.value)} type="text" name="name" id="name" placeholder='name'/>
          <input onChange={(e) => setAge(e.target.value)} type="text" name="age" id="age" placeholder='age' />
        </div>
        <div className="form_info">
          {users.length === 0 && !isLoading && (
            <div>Users not found</div>
          )}
          {!isLoading ? users.map((user) => (
            <div key={user.id}>{user.name},{user.age}</div>
          )) : (<div>Loading...</div>)}
        </div>
        <div className="form_filters">
          <div className="form_filters_size">
            <div>Per page</div>
            <select name="select" defaultValue={limit} onChange={
              (e) => {
                setLimit(parseInt(e.target.value))
                setPage(1)
                setOffset(0)
              }
            } >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>
          <div className="form_filters_pagination">
            <button onClick={
              () => {
                setOffset(offset - limit)
                setPage(page - 1)
              }
            }>perv</button>
            <div>page { page }</div>
            <button onClick={
              () => {
                setOffset(offset + limit)
                setPage(page + 1)
              }
            }>next</button>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default App;
