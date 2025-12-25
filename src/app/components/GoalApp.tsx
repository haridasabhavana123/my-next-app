"use client";

import React, { useEffect, useState } from "react";

type Goal = {
  id: string;
  title: string;
  dueDate: string; // ISO date
  completed: boolean;
};

const STORAGE_KEY = "goalz:data:v1";

function daysLeftFor(dateIso: string) {
  const today = new Date();
  const due = new Date(dateIso + "T00:00:00");
  const diff = due.getTime() - today.setHours(0, 0, 0, 0);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function GoalApp() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [toast, setToast] = useState<{message: string, action?: () => void, timeoutId: ReturnType<typeof setTimeout>} | null>(null);
  const [titleError, setTitleError] = useState("");
  const [dateError, setDateError] = useState("");
  const titleInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setGoals(JSON.parse(raw));
    } catch (e) {
      console.warn("Could not load goals", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    } catch (e) {
      console.warn("Could not save goals", e);
    }
  }, [goals]);

  useEffect(() => {
    if (showModal && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [showModal]);

  useEffect(() => {
    if (!showModal) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowModal(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [showModal]);

  function addGoal(e?: React.FormEvent) {
    e?.preventDefault();
    setTitleError("");
    setDateError("");
    if (!title.trim()) {
      setTitleError("Title is required");
      return;
    }
    if (!date) {
      setDateError("Due date is required");
      return;
    }
    const newGoal: Goal = {
      id: Date.now().toString(36),
      title: title.trim(),
      dueDate: date,
      completed: false,
    };
    setGoals((s) => [newGoal, ...s].sort((a, b) => a.dueDate.localeCompare(b.dueDate)));
    setTitle("");
    setDate("");
    setShowModal(false);
  }

  function toggleComplete(id: string) {
    setGoals((s) => s.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g)));
  }

  function deleteGoal(id: string) {
    const goal = goals.find((g) => g.id === id);
    if (!goal) return;

    // Remove from goals immediately
    setGoals((s) => s.filter((g) => g.id !== id));

    // Set timeout for permanent delete (10 seconds)
    const timeoutId = setTimeout(() => {
      setToast(null);
    }, 10000);

    setToast({
      message: `Deleted "${goal.title}"`,
      action: () => {
        // Undo: restore the goal
        setGoals((s) => {
          const newGoals = [goal, ...s];
          // Re-sort active and completed
          return newGoals.sort((a, b) => a.completed === b.completed ? a.dueDate.localeCompare(b.dueDate) : a.completed ? 1 : -1);
        });
        clearTimeout(timeoutId);
        setToast(null);
      },
      timeoutId,
    });
  }

  const active = goals.filter((g) => !g.completed).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const completed = goals.filter((g) => g.completed).sort((a, b) => b.dueDate.localeCompare(a.dueDate));

  return (
    <div className="goalz-root">
      <header className="goalz-header">
        <h1>Goalz</h1>
        <p className="muted">Track goals — finish on time, celebrate often.</p>
        <div>
          <button className="btn primary" onClick={() => setShowModal(true)}>
            + New Goal
          </button>
        </div>
      </header>

      <section className="goalz-columns">
        <div className="column">
          <h2>Current Goals</h2>
          {active.length === 0 && <p className="empty">No current goals — add one!</p>}
          <div className="list">
            {active.map((g) => {
              const days = daysLeftFor(g.dueDate);
              const isUrgent = days <= 2 && days >= 0;
              const isExpired = days < 0;
              return (
                <div key={g.id} className={`card ${isUrgent ? "urgent" : ""} ${isExpired ? "expired" : ""}`}>
                  <label className="card-left">
                    <input type="checkbox" checked={g.completed} onChange={() => toggleComplete(g.id)} />
                    <div className="card-title">{g.title}</div>
                  </label>
                  <div className="card-right">
                    <div className="days">{isExpired ? "Expired" : `${days}d left`}</div>
                    <button className="btn ghost" onClick={() => deleteGoal(g.id)} aria-label={`Delete ${g.title}`}>
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="column">
          <h2>Completed</h2>
          {completed.length === 0 && <p className="empty">No completed goals yet.</p>}
          <div className="list">
            {completed.map((g) => (
              <div key={g.id} className="card completed">
                <label className="card-left">
                  <input type="checkbox" checked={g.completed} onChange={() => toggleComplete(g.id)} />
                  <div className="card-title">{g.title}</div>
                </label>
                <div className="card-right">
                  <div className="days">{daysLeftFor(g.dueDate)}d</div>
                  <button className="btn ghost danger" onClick={() => deleteGoal(g.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {showModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal">
            <h3>New Goal</h3>
            <form onSubmit={addGoal}>
              <label className="form-row">
                <span>Title</span>
                <input ref={titleInputRef} value={title} onChange={(e) => { setTitle(e.target.value); setTitleError(""); }} required />
                {titleError && <div className="error">{titleError}</div>}
              </label>
              <label className="form-row">
                <span>Due date</span>
                <input type="date" value={date} onChange={(e) => { setDate(e.target.value); setDateError(""); }} required />
                {dateError && <div className="error">{dateError}</div>}
              </label>
              <div className="modal-actions">
                <button type="button" className="btn ghost" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn primary">
                  Add Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast">
          <span>{toast.message}</span>
          {toast.action && <button className="btn ghost small" onClick={toast.action}>Undo</button>}
        </div>
      )}
    </div>
  );
}
