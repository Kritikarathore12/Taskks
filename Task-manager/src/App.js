import React, { useState } from "react";
import "./App.css";

function App() {
    const [tasks, setTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [task, setTask] = useState("");
    const [priority, setPriority] = useState("Top");
    const [deadline, setDeadline] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editTaskId, setEditTaskId] = useState(null);

    const [filterPriority, setFilterPriority] = useState("All");
    const [filterDeadline, setFilterDeadline] = useState("");
    const [activeTab, setActiveTab] = useState("upcoming");

    const handleTaskChange = (e) => setTask(e.target.value);
    const handlePriorityChange = (e) => setPriority(e.target.value);
    const handleDeadlineChange = (e) => setDeadline(e.target.value);

    const handleFilterPriorityChange = (e) => setFilterPriority(e.target.value);
    const handleFilterDeadlineChange = (e) => setFilterDeadline(e.target.value);

    const addTask = () => {
        if (task.trim() === "" || deadline === "") {
            alert("Please enter a task and select a valid deadline.");
            return;
        }

        const selectedDate = new Date(deadline);
        const currentDate = new Date();

        if (selectedDate <= currentDate) {
            alert("Please select a future date for the deadline.");
            return;
        }

        if (isEditing) {
            const updatedTasks = tasks.map((t) =>
                t.id === editTaskId ? { ...t, task, priority, deadline } : t
            );
            setTasks(updatedTasks);
            setIsEditing(false);
            setEditTaskId(null);
        } else {
            const newTask = {
                id: tasks.length + 1,
                task,
                priority,
                deadline,
                done: false,
            };
            setTasks([...tasks, newTask]);
        }

        setTask("");
        setPriority("Top");
        setDeadline("");
    };

    const markDone = (id) => {
        const updatedTasks = tasks.map((t) =>
            t.id === id ? { ...t, done: true } : t
        );
        setTasks(updatedTasks);

        const completedTask = tasks.find((t) => t.id === id);
        if (completedTask) {
            setCompletedTasks([...completedTasks, completedTask]);
        }
    };

    const markUndone = (id) => {
        const undoneTask = completedTasks.find((t) => t.id === id);
        if (undoneTask) {
            const updatedTask = { ...undoneTask, done: false };
            setTasks([...tasks, updatedTask]);
            setCompletedTasks(completedTasks.filter((t) => t.id !== id));
        }
    };

    const Delete = (id) => {
        const updatedTasks = tasks.filter((t) => t.id !== id);
        setTasks(updatedTasks);
    };

    const Delete_ct = (id) => {
        const updatedTasks = completedTasks.filter((t) => t.id !== id);
        setCompletedTasks(updatedTasks);
    };

    const editTask = (task) => {
        setTask(task.task);
        setPriority(task.priority);
        setDeadline(task.deadline);
        setIsEditing(true);
        setEditTaskId(task.id);
    };

    const upcomingTasks = tasks.filter((t) => !t.done);
    const filteredTasks = upcomingTasks.filter((t) => {
        const priorityMatch =
            filterPriority === "All" ||
            t.priority.toLowerCase() === filterPriority.toLowerCase();

        const deadlineMatch =
            !filterDeadline || new Date(t.deadline) <= new Date(filterDeadline);

        return priorityMatch && deadlineMatch;
    });

    return (
        <div className="App">
            <header>
                <h1>🗓️ Task Scheduler</h1>
            </header>

            <div className="tabs">
                <button
                    className={activeTab === "upcoming" ? "active" : ""}
                    onClick={() => setActiveTab("upcoming")}
                >
                    Upcoming Tasks
                </button>
                <button
                    className={activeTab === "completed" ? "active" : ""}
                    onClick={() => setActiveTab("completed")}
                >
                    Completed Tasks
                </button>
            </div>

            <main>
                <div className="task-form">
                    <input
                        type="text"
                        placeholder="Enter task..."
                        value={task}
                        onChange={handleTaskChange}
                    />
                    <select value={priority} onChange={handlePriorityChange}>
                        <option value="Top">Top Priority</option>
                        <option value="Middle">Middle Priority</option>
                        <option value="Less">Less Priority</option>
                    </select>
                    <input
                        type="date"
                        value={deadline}
                        onChange={handleDeadlineChange}
                    />
                    <button onClick={addTask}>
                        {isEditing ? "Update Task" : "Add Task"}
                    </button>
                </div>

                {activeTab === "upcoming" && (
                    <>
                        <div className="filters">
                            <label>Filter by Priority:</label>
                            <select value={filterPriority} onChange={handleFilterPriorityChange}>
                                <option value="All">All</option>
                                <option value="Top">Top</option>
                                <option value="Middle">Middle</option>
                                <option value="Less">Less</option>
                            </select>

                            <label>Filter by Deadline:</label>
                            <input
                                type="date"
                                value={filterDeadline}
                                onChange={handleFilterDeadlineChange}
                            />
                        </div>

                        <table>
                            <thead>
                                <tr>
                                    <th>Task</th>
                                    <th>Priority</th>
                                    <th>Deadline</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTasks.map((t) => (
                                    <tr key={t.id}>
                                        <td>{t.task}</td>
                                        <td>{t.priority}</td>
                                        <td>{t.deadline}</td>
                                        <td>
                                            <button onClick={() => markDone(t.id)}>✅</button>
                                            <button onClick={() => editTask(t)}>✏️</button>
                                            <button onClick={() => Delete(t.id)}>🗑️</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}

                {activeTab === "completed" && (
                    <table>
                        <thead>
                            <tr>
                                <th>Task</th>
                                <th>Priority</th>
                                <th>Deadline</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {completedTasks.map((ct) => (
                                <tr key={ct.id}>
                                    <td>{ct.task}</td>
                                    <td>{ct.priority}</td>
                                    <td>{ct.deadline}</td>
                                    <td>
                                        <button id="undo" onClick={() => markUndone(ct.id)}>↩️</button>
                                        <button id="del" onClick={() => Delete_ct(ct.id)}>🗑️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </main>
        </div>
    );
}

export default App;
