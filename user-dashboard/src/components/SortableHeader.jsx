import React from "react";

export default function SortableHeader({ title, onSort, active, dir }) {
  return (
    <th>
      <button onClick={onSort} className="sort-btn">
        {title}
        {active ? (dir === "asc" ? " ▲" : " ▼") : " ↕"}
      </button>
    </th>
  );
}