import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./lib/supabase";
import { useAuth } from "./hooks/useAuth";
import Login from "./hooks/Login";
import Signup from "./hooks/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import InputField from "./components/InputField";
import TodoList from "./components/TodoList";
import { Todo } from "./model";
import "./App.css";

const TodoApp: React.FC = () => {
  const { user, signOut } = useAuth();
  const [todo, setTodo] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  // Load todos from Supabase when user logs in
  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user]);

  const fetchTodos = async () => {
    try {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const transformedTodos: Todo[] = (data || []).map((item) => ({
        id: item.id,
        todo: item.todo,
        isDone: item.is_done,
      }));

      setTodos(transformedTodos);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!todo.trim() || !user) return;

    console.log("User object:", user);
    console.log("User ID:", user.id);

    try {
      const { data, error } = await supabase
        .from("todos")
        .insert([
          {
            user_id: user.id, // ← Now using REAL user ID!
            todo: todo,
            is_done: false,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setTodos([
        {
          id: data.id,
          todo: data.todo,
          isDone: data.is_done,
        },
        ...todos,
      ]);

      setTodo("");
    } catch (error) {
      console.error("Error adding todo:", error);
      alert("Failed to add todo. Please try again.");
    }
  };

  const handleLogout = async () => {
    await signOut();
    setTodos([]);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="app-header">
        <span className="heading">
          {"TASKIFY".split("").map((char, index) => (
            <span key={index} className="heading-char">
              {char}
            </span>
          ))}
        </span>
        <div className="user-info">
          <span className="user-email">{user?.email}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <InputField todo={todo} setTodo={setTodo} handleAdd={handleAdd} />
      <TodoList todos={todos} setTodos={setTodos} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <TodoApp />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
