import React, { useState, useEffect, useRef } from 'react';
import debounce from "./helpers";
import './App.css';

function App() {
  let [userList, setuserList] = useState([]);
  let [searchResults, setSearchResults] = useState([]);
  let [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchData() {
      userList = await fetch("http://www.mocky.io/v2/5ba8efb23100007200c2750c").then(res => res.json());
      setuserList(userList);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      console.log(searchTerm);
      let searchText = searchTerm.toLowerCase();
      let temp = userList.filter(x => {
        return x.name.toLowerCase().includes(searchText)
          || x.id.toLowerCase().includes(searchText)
          || x.address.toLowerCase().includes(searchText)
          || x.pincode.toLowerCase().includes(searchText)
          || x.items.join("|").toLowerCase().includes(searchText);
      });
      setSearchResults(temp);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const delayedSearch = useRef(debounce(q => setSearchTerm(q), 500)).current;

  const searchHandler = (e) => {
    let searchText = e.target.value || "";
    delayedSearch(searchText);
  };

  const keyHandler = (e) => {
    console.log(e.keyCode);
  }

  return (
    <div className="container">
      <div className="search-box">
        <input type="text" placeholder="Search users by ID, address, name .... " onChange={searchHandler} onKeyDown={keyHandler} />
        <div className="search-card">
          {
            searchResults.map(x => {
              return (
                <div key={x.id} className="item">
                  <div>{x.id}</div>
                  <div>{x.name}</div>
                  <div>{x.address}</div>
                </div>
              )
            })
          }

          <div tabIndex={0} onKeyDown={keyHandler} className={searchResults.length === 0 && searchTerm != "" ? "item" : "hidden"}> No User Found </div>
        </div>
      </div>
    </div>
  );
}

export default App;
