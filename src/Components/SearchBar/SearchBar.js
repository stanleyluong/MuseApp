import React, { useState } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch }) {
    const [term, setTerm] = useState('');

    const handleSearch = (e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        onSearch(term, e);
    };

    return (
        <div className="SearchBar">
            <form onSubmit={handleSearch}>
                <input 
                    onChange={(e) => setTerm(e.target.value)} 
                    placeholder="Enter A Song, Album, or Artist"
                    value={term}
                />
                <button type='submit' className="SearchButton">SEARCH</button>
            </form> 
        </div>
    );
}

export default SearchBar;