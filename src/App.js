import React, { useState, useEffect, useRef } from 'react';
import debounce from "./helpers";
import './App.css';

function App() {
  let [userList, setuserList] = useState([]);
  let [searchResults, setSearchResults] = useState([]);
  let [searchTerm, setSearchTerm] = useState("");
  let [selected, setSelected] = useState(null);
  let [focus, setFocus] = useState(false);

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
      if (temp.length === 0) {
        setSelected(null);
      }
    } else {
      setSearchResults([]);
      setSelected(null);
    }
  }, [searchTerm]);

  const delayedSearch = useRef(debounce(q => setSearchTerm(q), 500)).current;

  const searchHandler = (e) => {
    let searchText = e.target.value || "";
    delayedSearch(searchText);
  };

  const keyHandler = (e) => {
    if (e.keyCode === 40 && (!selected || selected < searchResults.length - 1)) {
      let t = (selected >= 0 && selected !== null && selected !== undefined) ? selected + 1 : 0;
      setSelected(t);
    } else if (e.keyCode === 38 && ((selected || selected === 0) && selected >= 0)) {
      let t = selected === 0 ? null : selected - 1;
      setSelected(t);
    }
  }

  const blurHandler = (e) => {
    setFocus(false);
  }

  const focusHandler = (e) => {
    setFocus(true);
  }

  return (
    <div className="container">
      <div className="search-box">
        <input type="text" placeholder="Search users by ID, address, name .... "
          onChange={searchHandler}
          onKeyDown={keyHandler}
          onBlur={blurHandler}
          onFocus={focusHandler} />
        <div className={focus ? "search-card" : "search-card hidden"}>
          {
            searchResults.map((x, i) => {
              return (
                <div key={x.id} className={i === selected ? "highlight item" : "item"}>
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
