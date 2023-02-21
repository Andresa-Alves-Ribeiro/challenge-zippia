import React, { useState } from "react";
import { AiOutlineSortAscending } from "react-icons/ai";
import { InputGroup, Button, FormControl, Dropdown, DropdownButton } from 'react-bootstrap';

const JobFilters = ({ updateFilters, sorting, setSorting }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [postingDateRange, setPostingDateRange] = useState("7d");

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        updateFilters("companyName", e.target.value);
    };

    const handlePostingDateRangeChange = (e) => {
        const postingDateRange = e.target.value;
        setPostingDateRange(postingDateRange);
        updateFilters("postingDateRange", postingDateRange);
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Search by Company Name"
                value={searchTerm}
                onChange={handleSearch}
            />
            <button onClick={() => setSorting(!sorting)}>
                <strong>
                    <AiOutlineSortAscending />
                </strong>{" "}
                Ordenate By Company Name
            </button>
            <select value={postingDateRange} onChange={handlePostingDateRangeChange}>
                <option value="1d">Past Day</option>
                <option value="3d">Past 3 Days</option>
                <option value="7d">Past Week</option>
                <option value="30d">Past Month</option>
            </select>
        </div>
    );
};

export default JobFilters;
