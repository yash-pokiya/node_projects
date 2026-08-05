import React, { useState, useEffect } from "react";
import { getTodos, createTodo, logoutUser, deleteTodo } from "../utils/api";
import Navbar from "./Navbar";
import TodoCard from "./TodoCard";
import TodoDetailsModal from "./TodoDetailsModal";
import TodoEditModal from "./TodoEditModal";
import { PlusCircle, Search, FolderOpen, Terminal, ArrowUpDown, X, Loader2, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const Dashboard = ({ user, onLogout }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  // New todo form
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  // Form Validations
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, alpha
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Details Modal State
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Edit Modal State
  const [selectedEditTodo, setSelectedEditTodo] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Delete Confirm Modal State
  const [selectedDeleteTodo, setSelectedDeleteTodo] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Mobile drawer sidebar state
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleOpenEdit = (todo) => {
    setSelectedEditTodo(todo);
    setIsEditOpen(true);
  };

  const handleUpdateSuccess = (updatedTodo) => {
    setTodos((prevTodos) =>
      prevTodos.map((t) => (t._id === updatedTodo._id ? updatedTodo : t))
    );
  };

  const handleOpenDelete = (todo) => {
    setSelectedDeleteTodo(todo);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDeleteTodo) return;
    setDeleteLoading(true);
    const loadId = toast.loading("Deleting note...");
    try {
      await deleteTodo(selectedDeleteTodo._id);
      setTodos((prevTodos) => prevTodos.filter((t) => t._id !== selectedDeleteTodo._id));
      toast.success("Note deleted successfully!", { id: loadId });
      setIsDeleteConfirmOpen(false);
      setSelectedDeleteTodo(null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Failed to delete note. Try again.", { id: loadId });
    } finally {
      setDeleteLoading(false);
    }
  };

  const fetchUserTodos = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const data = await getTodos();
      setTodos(data.todos || []);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        toast.error("Session expired. Logging out...");
        onLogout();
      } else {
        toast.error("Failed to load notes. Please refresh the page.");
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserTodos();
  }, []);

  const handleCreateTodo = async (e) => {
    e.preventDefault();
    setTitleError("");
    setContentError("");

    // Validate inputs
    let hasError = false;
    if (!title.trim()) {
      setTitleError("A title is required");
      hasError = true;
    } else if (title.length > 50) {
      setTitleError("Title cannot exceed 50 characters");
      hasError = true;
    }

    if (!content.trim()) {
      setContentError("Details/content is required");
      hasError = true;
    } else if (content.length > 2000) {
      setContentError("Content cannot exceed 2000 characters");
      hasError = true;
    }

    if (hasError) return;

    setCreateLoading(true);
    const loadId = toast.loading("Adding note...");

    try {
      const data = await createTodo(title.trim(), content.trim());
      if (data.todo) {
        setTodos((prevTodos) => [data.todo, ...prevTodos]);
        toast.success("Note created successfully!", { id: loadId });
      } else {
        fetchUserTodos(true);
        toast.success("Note created!", { id: loadId });
      }
      setTitle("");
      setContent("");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Failed to create note. Try again.", { id: loadId });
    } finally {
      setCreateLoading(false);
    }
  };

  const handleLogoutClick = async () => {
    const loadId = toast.loading("Logging out...");
    try {
      await logoutUser();
      toast.success("Logged out successfully.", { id: loadId });
    } catch (err) {
      console.error("Logout failed on server:", err);
      toast.dismiss(loadId);
    } finally {
      onLogout();
    }
  };

  const handleOpenDetails = (todo) => {
    setSelectedTodo(todo);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setSelectedTodo(null);
    setIsDetailsOpen(false);
  };

  // Filter and Sort Notes
  const filteredTodos = todos.filter((todo) => {
    const term = searchQuery.toLowerCase();
    return (
      (todo.title && todo.title.toLowerCase().includes(term)) ||
      (todo.content && todo.content.toLowerCase().includes(term))
    );
  });

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortBy === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    if (sortBy === "alpha") {
      return (a.title || "").localeCompare(b.title || "");
    }
    return 0;
  });

  return (
    <div className="flex min-h-screen bg-app-bg text-app-text transition-colors duration-300">
      {/* Expandable Desktop Sidebar & Mobile Drawer */}
      <Navbar
        user={user}
        onLogout={handleLogoutClick}
        todosCount={todos.length}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area (Right pane) */}
      <div className="grow flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <header className="md:hidden flex items-center justify-between px-5 py-4 bg-app-card border-b border-app-border sticky top-0 z-30 transition-colors duration-300">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-1.5 rounded-lg hover:bg-app-bg-secondary text-app-text-secondary hover:text-app-text cursor-pointer transition-colors"
              aria-label="Open Menu"
            >
              <Menu size={18} />
            </button>
            <span className="text-sm font-bold tracking-tight text-app-text">SyncNotes</span>
          </div>
          <div className="w-7 h-7 rounded-lg bg-app-accent text-white flex items-center justify-center font-bold text-xs select-none shadow-sm">
            {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
          </div>
        </header>

        {/* Dashboard Grid */}
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 flex-1">
          {/* Creator panel */}
          <aside className="lg:sticky lg:top-8 h-fit z-20">
            <div className="p-6 bg-app-card border border-app-border rounded-2xl shadow-xs transition-colors duration-300">
              <h3 className="text-base font-bold text-app-text mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-app-accent"></span>
                Create New Note
              </h3>

              <form onSubmit={handleCreateTodo} className="space-y-4">
                <div>
                  <label
                    className="block text-[10px] font-bold uppercase tracking-wider text-app-text-secondary mb-1.5"
                    htmlFor="todo-title"
                  >
                    Title
                  </label>
                  <div className="relative flex items-center">
                    <Terminal
                      size={15}
                      className="absolute left-3.5 text-app-text-secondary pointer-events-none"
                    />
                    <input
                      id="todo-title"
                      type="text"
                      required
                      maxLength={50}
                      className={`custom-input ${
                        titleError ? "border-app-danger/50 focus:ring-app-danger/10" : ""
                      }`}
                      placeholder="Note heading..."
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        if (titleError) setTitleError("");
                      }}
                      disabled={createLoading}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    {titleError ? (
                      <span className="text-[11px] text-app-danger font-medium">{titleError}</span>
                    ) : (
                      <span />
                    )}
                    <span className="text-[10px] text-app-text-secondary font-medium">
                      {title.length}/50
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    className="block text-[10px] font-bold uppercase tracking-wider text-app-text-secondary mb-1.5"
                    htmlFor="todo-content"
                  >
                    Details
                  </label>
                  <textarea
                    id="todo-content"
                    required
                    maxLength={2000}
                    className={`custom-textarea ${
                      contentError ? "border-app-danger/50 focus:ring-app-danger/10" : ""
                    }`}
                    placeholder="Write details of your note..."
                    rows={6}
                    value={content}
                    onChange={(e) => {
                      setContent(e.target.value);
                      if (contentError) setContentError("");
                    }}
                    disabled={createLoading}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {contentError ? (
                      <span className="text-[11px] text-app-danger font-medium">{contentError}</span>
                    ) : (
                      <span />
                    )}
                    <span className="text-[10px] text-app-text-secondary font-medium">
                      {content.length}/2000
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-app-accent text-white font-bold text-sm rounded-xl shadow-md hover:opacity-90 active:scale-98 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  disabled={createLoading}
                >
                  {createLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <PlusCircle size={15} /> Add Note
                    </>
                  )}
                </button>
              </form>
            </div>
          </aside>

          {/* Notes list and search panel */}
          <section className="flex flex-col">
            {/* Controls: Search, Sort */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-app-text-secondary pointer-events-none"
                />
                <input
                  type="text"
                  className="custom-input pl-10 pr-9 py-2"
                  placeholder="Search notes by title or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-app-text-secondary hover:text-app-text"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Sort options */}
              <div className="relative flex items-center gap-2 self-end sm:self-auto">
                <ArrowUpDown size={14} className="text-app-text-secondary" />
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="flex items-center gap-1.5 py-2 px-3 text-xs font-bold bg-app-card border border-app-border rounded-xl text-app-text-secondary hover:text-app-text transition-all cursor-pointer min-w-[130px] justify-between shadow-xs"
                  >
                    <span>
                      {sortBy === "newest" && "Newest First"}
                      {sortBy === "oldest" && "Oldest First"}
                      {sortBy === "alpha" && "Alphabetical"}
                    </span>
                    <span className="text-[10px] opacity-60">▼</span>
                  </button>
                  
                  <AnimatePresence>
                    {isSortOpen && (
                      <>
                        {/* Invisible click-away overlay */}
                        <div 
                          className="fixed inset-0 z-30" 
                          onClick={() => setIsSortOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 5, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 5, scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-1.5 w-[140px] bg-app-card border border-app-border rounded-xl shadow-lg py-1.5 z-40"
                        >
                          {[
                            { value: "newest", label: "Newest First" },
                            { value: "oldest", label: "Oldest First" },
                            { value: "alpha", label: "Alphabetical" }
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => {
                                setSortBy(opt.value);
                                setIsSortOpen(false);
                              }}
                              className={`w-full text-left px-3 py-1.5 text-xs font-bold hover:bg-app-bg-secondary transition-colors flex items-center justify-between cursor-pointer ${
                                sortBy === opt.value
                                  ? "text-app-accent"
                                  : "text-app-text-secondary"
                              }`}
                            >
                              <span>{opt.label}</span>
                              {sortBy === opt.value && (
                                <span className="w-1.5 h-1.5 rounded-full bg-app-accent" />
                              )}
                            </button>
                          ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Notes display */}
            <div className="flex-1">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div
                      key={n}
                      className="p-5 bg-app-card border border-app-border rounded-2xl animate-pulse h-[210px] flex flex-col justify-between"
                    >
                      <div>
                        <div className="h-5 bg-app-bg-secondary rounded-md w-3/4 mb-4" />
                        <div className="h-3 bg-app-bg-secondary/60 rounded-md w-full mb-2" />
                        <div className="h-3 bg-app-bg-secondary/60 rounded-md w-full mb-2" />
                        <div className="h-3 bg-app-bg-secondary/60 rounded-md w-5/6 mb-2" />
                      </div>
                      <div className="h-4 bg-app-bg-secondary/60 rounded-md w-1/3 mt-4" />
                    </div>
                  ))}
                </div>
              ) : sortedTodos.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center p-12 py-20 text-center border border-dashed border-app-border rounded-2xl bg-app-card/40"
                >
                  <div className="w-12 h-12 rounded-xl bg-app-bg-secondary flex items-center justify-center text-app-text-secondary mb-4">
                    <FolderOpen size={22} />
                  </div>
                  <p className="text-sm font-bold text-app-text">
                    {searchQuery ? "No search results match" : "No notes found"}
                  </p>
                  <p className="text-xs text-app-text-secondary mt-1 max-w-[280px]">
                    {searchQuery
                      ? "Try adjusting your query or clearing search text."
                      : "Create a note using the left panel to begin cloud synchronization."}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
                >
                  {sortedTodos.map((todo, idx) => (
                    <TodoCard
                      key={todo._id}
                      todo={todo}
                      index={idx}
                      onClick={() => handleOpenDetails(todo)}
                      onEdit={handleOpenEdit}
                      onDelete={handleOpenDelete}
                    />
                  ))}
                </motion.div>
              )}
            </div>
          </section>
        </main>
      </div>

      {/* Details Dialog */}
      <TodoDetailsModal
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        todo={selectedTodo}
      />

      {/* Edit Modal Dialog */}
      <TodoEditModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        todo={selectedEditTodo}
        onUpdateSuccess={handleUpdateSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {isDeleteConfirmOpen && selectedDeleteTodo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteConfirmOpen(false)}
              className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs"
            />
            {/* Confirmation Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative w-full max-w-md bg-app-card border border-app-border rounded-2xl shadow-2xl p-6 z-10 flex flex-col gap-4 text-left"
            >
              <h3 className="text-base font-bold text-app-text">Delete Note</h3>
              <p className="text-xs text-app-text-secondary leading-relaxed">
                Are you sure you want to delete <strong className="text-app-text">"{selectedDeleteTodo.title}"</strong>? This action will permanently remove this note from your cloud database and cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-3 mt-2">
                <button
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  disabled={deleteLoading}
                  className="px-4 py-2 text-xs font-bold border border-app-border text-app-text-secondary hover:text-app-text hover:bg-app-bg-secondary rounded-xl transition-all cursor-pointer bg-transparent"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleteLoading}
                  className="px-4 py-2 text-xs font-bold bg-app-danger hover:opacity-90 text-white rounded-xl shadow-md flex items-center gap-1.5 active:scale-98 transition-all cursor-pointer border-0"
                >
                  {deleteLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    "Delete Permanently"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
