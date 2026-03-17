import React from "react";

const SearchBar = ({input, onchange}) => {
    return (
        <div>
            <input 
            type="text"
            placeholder="Search here"
            value = {input}
            onChange={onChange}
            />
        </div>
    )
}