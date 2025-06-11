"use client";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { useState, useMemo, useEffect } from "react";
import { useSession } from "next-auth/react";
import { PlusIcon, MagnifyingGlassIcon, TrashIcon, PencilIcon, CalendarIcon, BellIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

const DEFAULT_CATEGORIES = ["Work", "Personal", "Study","Shopping", "General"];
const PRIORITIES = ["High", "Medium", "Low"];
const STATUS_OPTIONS = ["All", "Completed", "Pending", "Overdue"];
const DUE_OPTIONS = ["All", "Today", "This Week"];

function getPriorityColor(priority) {
  if (priority === "High") return "bg-red-100 text-red-700";
  if (priority === "Medium") return "bg-orange-100 text-orange-700";
  return "bg-green-100 text-green-700";
}

function isOverdue(task) {
  if (task.completed) return false;
  const due = new Date(task.dueDate);
  const now = new Date();
  now.setHours(23, 59, 59, 999); 
  return due < now;
}


export default function Dashboard() {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    category: "All",
    status: "All",
    priority: "All",
    due: "All",
  });
  const [showModal, setShowModal] = useState(false);

 
  useEffect(() => {
    if (status === "loading") return; 
    
    if (status === "unauthenticated") {
      setLoading(false);
      setError("Please sign in to view your tasks");
      return;
    }

    if (status === "authenticated") {
      fetchTasks();
    }
  }, [status]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await fetch('/api/tasks', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTasks(data.map(task => ({
        ...task,
        id: task._id, 
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      })));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Add task function
  const handleAddTask = async (taskData) => {
    try {
      setError("");
      
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: taskData.title,
          description: taskData.description || "",
          category: taskData.category,
          dueDate: new Date(taskData.dueDate),
          reminder: taskData.reminderTime ? new Date(`${taskData.dueDate}T${taskData.reminderTime}`) : null,
          priority: taskData.priority,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const newTask = await response.json();
      setTasks(prev => [{
        ...newTask,
        id: newTask._id,
        dueDate: new Date(newTask.dueDate).toISOString().split('T')[0]
      }, ...prev]);
      
      setShowModal(false);
    } catch (error) {
      console.error('Error adding task:', error);
      setError('Failed to add task. Please try again.');
    }
  };

  // Toggle task completion
  const handleToggleComplete = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    try {
      setError("");
      
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: !task.completed
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await response.json();
      setTasks(prev => prev.map(t => 
        t.id === id ? { 
          ...updatedTask, 
          id: updatedTask._id,
          dueDate: new Date(updatedTask.dueDate).toISOString().split('T')[0]
        } : t
      ));
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task. Please try again.');
    }
  };

  // Delete task function
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      setError("");
      
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task. Please try again.');
    }
  };

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Search
      if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase()) &&
          !task.description?.toLowerCase().includes(filters.search.toLowerCase()))
        return false;
      // Category
      if (filters.category !== "All" && task.category !== filters.category)
        return false;
      // Priority
      if (filters.priority !== "All" && task.priority !== filters.priority)
        return false;
      // Status
      if (filters.status === "Completed" && !task.completed) return false;
      if (filters.status === "Pending" && (task.completed || isOverdue(task))) return false;
      if (filters.status === "Overdue" && !isOverdue(task)) return false;
      // Due date
      const today = new Date();
      if (filters.due === "Today" && new Date(task.dueDate).toDateString() !== today.toDateString())
        return false;
      if (filters.due === "This Week") {
        const weekFromNow = new Date(today);
        weekFromNow.setDate(today.getDate() + 7);
        if (new Date(task.dueDate) > weekFromNow) return false;
      }
      return true;
    });
  }, [tasks, filters]);

  // Statistics
  const completedCount = tasks.filter(t => t.completed).length;
  const todayCount = tasks.filter(t => new Date(t.dueDate).toDateString() === new Date().toDateString()).length;
  const overdueCount = tasks.filter(t => isOverdue(t)).length;
  const totalTasks = tasks.length;

  // Get categories from tasks
  const availableCategories = [...new Set(tasks.map(t => t.category))];
  const tasksByCategory = DEFAULT_CATEGORIES.map(cat => ({
    category: cat,
    count: tasks.filter(t => t.category === cat).length,
  })).filter(item => item.count > 0);

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg">Loading your tasks...</div>
        </div>
      </div>
    );
  }

  // Authentication check
  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <div className="text-lg text-gray-600">Please sign in to view your tasks</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar/Filters */}
      <aside className="w-full max-w-xs bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-6 hidden md:block">
        <h2 className="text-lg font-bold mb-4">Filters</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">🔍 Search</label>
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-2 top-2.5 text-gray-400" />
            <input
              type="text"
              value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
              className="pl-8 pr-2 py-2 border border-gray-300 dark:border-gray-700 rounded w-full bg-gray-50 dark:bg-gray-800"
              placeholder="Search tasks"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">📂 Category</label>
          <select
            value={filters.category}
            onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
            className="w-full border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800 py-2 px-3"
          >
            <option value="All">All</option>
            {DEFAULT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">✅ Status</label>
          <select
            value={filters.status}
            onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
            className="w-full border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800 py-2 px-3"
          >
            {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">🔴 Priority</label>
          <select
            value={filters.priority}
            onChange={e => setFilters(f => ({ ...f, priority: e.target.value }))}
            className="w-full border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800 py-2 px-3"
          >
            <option value="All">All</option>
            {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">📅 Due Date</label>
          <select
            value={filters.due}
            onChange={e => setFilters(f => ({ ...f, due: e.target.value }))}
            className="w-full border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800 py-2 px-3"
          >
            {DUE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
            Welcome, {session?.user?.name}
          </h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" /> Add Task
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Statistics Widget */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 flex items-center gap-3 shadow">
            <CheckCircleIcon className="h-6 w-6 text-green-500" />
            <div>
              <div className="text-lg font-semibold">{completedCount}</div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 flex items-center gap-3 shadow">
            <CalendarIcon className="h-6 w-6 text-blue-500" />
            <div>
              <div className="text-lg font-semibold">{todayCount}</div>
              <div className="text-xs text-gray-500">Due Today</div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 flex items-center gap-3 shadow">
            <BellIcon className="h-6 w-6 text-red-500" />
            <div>
              <div className="text-lg font-semibold">{overdueCount}</div>
              <div className="text-xs text-gray-500">Overdue</div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 flex items-center gap-3 shadow">
            <div className="text-2xl">📊</div>
            <div>
              <div className="text-lg font-semibold">{totalTasks}</div>
              <div className="text-xs text-gray-500">Total Tasks</div>
            </div>
          </div>
        </section>

        {/* Category Breakdown */}
        {tasksByCategory.length > 0 && (
          <section className="mb-8">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow">
              <div className="font-semibold text-sm text-gray-500 mb-2">Tasks by Category</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {tasksByCategory.map(({ category, count }) => (
                  <div key={category} className="flex items-center gap-2 text-sm">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-400"></span>
                    {category}: <span className="font-bold">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Task List */}
        <section>
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-6xl mb-4">📝</div>
              <div>
                {tasks.length === 0 
                  ? "No tasks yet. Click 'Add Task' to get started!" 
                  : "No tasks match your filters. Try adjusting them."
                }
              </div>
            </div>
          ) : (
            <ul className="space-y-4">
              {filteredTasks.map(task => (
                <li key={task.id} className="bg-white dark:bg-gray-900 rounded-lg p-4 flex items-center justify-between shadow hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleComplete(task.id)}
                      className="h-5 w-5 text-blue-600 rounded"
                    />
                    <div className="flex-1">
                      <div className={`font-semibold text-lg ${task.completed ? "line-through text-gray-400" : "text-gray-900 dark:text-white"}`}>
                        {task.title}
                      </div>
                      {task.description && (
                        <div className={`text-sm mt-1 ${task.completed ? "text-gray-400" : "text-gray-600 dark:text-gray-300"}`}>
                          {task.description}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2 text-xs">
                        <span className={`px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
                          🚩 {task.priority}
                        </span>
                        <span className="px-2 py-1 rounded bg-blue-100 text-blue-700">
                          📂 {task.category}
                        </span>
                        <span className="flex items-center gap-1 px-2 py-1 rounded bg-gray-100 text-gray-700">
                          <CalendarIcon className="h-4 w-4" />
                          {new Date(task.dueDate).toLocaleDateString()}
                          {isOverdue(task) && !task.completed && (
                            <span className="ml-2 text-red-500 font-semibold">⚠️ Overdue</span>
                          )}
                        </span>
                        {task.reminder && (
                          <span className="flex items-center gap-1 px-2 py-1 rounded bg-yellow-100 text-yellow-700">
                            <BellIcon className="h-4 w-4" /> 
                            {new Date(task.reminder).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button 
                      onClick={() => handleDelete(task.id)} 
                      className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                      title="Delete task"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      {/* Add Task Modal */}
      {showModal && (
        <AddTaskModal
          onClose={() => setShowModal(false)}
          onAdd={handleAddTask}
          categories={DEFAULT_CATEGORIES}
        />
      )}
    </div>
  );
}

// Updated Modal component
function AddTaskModal({ onClose, onAdd, categories }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: categories[0],
    dueDate: new Date().toISOString().slice(0, 10),
    reminderTime: "",
    priority: "Medium",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      await onAdd(form);
      onClose();
    } catch (error) {
      setError("Failed to add task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-8 w-full max-w-md shadow-xl">
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Add New Task</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Task title *"
              required
              disabled={loading}
            />
          </div>
          <div>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Description (optional)"
              rows="3"
              disabled={loading}
            />
          </div>
          <div className="flex gap-2">
            <select 
              name="category" 
              value={form.category} 
              onChange={handleChange} 
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <select 
              name="priority" 
              value={form.priority} 
              onChange={handleChange} 
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            >
              {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <input
              name="dueDate"
              type="date"
              value={form.dueDate}
              onChange={handleChange}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <input
              name="reminderTime"
              type="time"
              value={form.reminderTime}
              onChange={handleChange}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Reminder"
              disabled={loading}
            />
          </div>
          {error && <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</div>}
          <div className="flex justify-end gap-2 pt-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                'Save Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
