import React, { useMemo, useState } from "react";
import SortableHeader from "./SortableHeader";
import Pagination from "./Pagination";

export default function UsersTable({ initialData }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [expandedId, setExpandedId] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // 🔍 Filter
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return initialData;
    return initialData.filter((u) =>
      [u.name, u.email, u.phone, u.company?.name, u.address?.city]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [initialData, query]);

  // ↕ Sort
  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const get = (u) => {
        switch (sortKey) {
          case "name":
            return u.name || "";
          case "email":
            return u.email || "";
          case "phone":
            return u.phone || "";
          case "company":
            return u.company?.name || "";
          case "city":
            return u.address?.city || "";
          default:
            return "";
        }
      };
      const va = get(a).toLowerCase();
      const vb = get(b).toLowerCase();
      if (va === vb) return 0;
      return sortDir === "asc" ? (va > vb ? 1 : -1) : va > vb ? -1 : 1;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  // 📄 Pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = sorted.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  }

  function toggleExpand(id) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <div>
      {/* Search */}
      <div className="controls">
        <input
          placeholder="Search users..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
        <span>{sorted.length} results</span>
      </div>

      {/* Table */}
      <table className="users-table">
        <thead>
          <tr>
            <SortableHeader
              title="Name"
              onSort={() => toggleSort("name")}
              active={sortKey === "name"}
              dir={sortDir}
            />
            <SortableHeader
              title="Email"
              onSort={() => toggleSort("email")}
              active={sortKey === "email"}
              dir={sortDir}
            />
            <SortableHeader
              title="Phone"
              onSort={() => toggleSort("phone")}
              active={sortKey === "phone"}
              dir={sortDir}
            />
            <SortableHeader
              title="Company"
              onSort={() => toggleSort("company")}
              active={sortKey === "company"}
              dir={sortDir}
            />
            <SortableHeader
              title="City"
              onSort={() => toggleSort("city")}
              active={sortKey === "city"}
              dir={sortDir}
            />
            <th></th>
          </tr>
        </thead>

        <tbody>
          {pageItems.map((u) => (
            <React.Fragment key={u.id}>
              <tr onClick={() => toggleExpand(u.id)} className="row">
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>{u.company?.name}</td>
                <td>{u.address?.city}</td>
                <td>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(u.id);
                    }}
                  >
                    {expandedId === u.id ? "Hide" : "Details"}
                  </button>
                </td>
              </tr>

              {expandedId === u.id && (
                <tr className="expanded">
                  <td colSpan={6}>
                    <strong>Address:</strong>{" "}
                    {u.address.street}, {u.address.city} <br />
                    <strong>Website:</strong> {u.website} <br />
                    <strong>Company:</strong> {u.company.catchPhrase}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
          {pageItems.length === 0 && (
            <tr>
              <td colSpan={6}>No results</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <Pagination page={currentPage} totalPages={totalPages} onPage={setPage} />
    </div>
  );
}