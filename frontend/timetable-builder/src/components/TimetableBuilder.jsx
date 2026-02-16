import React, { useEffect, useState, useContext } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import TimetableColumn from "./TimetableColumn";
import * as api from "../api/timetable";
import { AuthContext } from "../../../auth/src/context/AuthContext"; // adjust path depending on repo layout
import { v4 as uuidv4 } from "uuid";

export default function TimetableBuilder() {
  const { user } = useContext(AuthContext);
  const [timetables, setTimetables] = useState([]);
  const [active, setActive] = useState(null);
  const [columns, setColumns] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const defaultDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  useEffect(() => {
    loadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function initEmptyColumns() {
    return defaultDays.map((d) => ({ day: d, items: [] }));
  }

  async function loadList() {
    setLoading(true);
    try {
      const res = await api.listTimetables();
      setTimetables(res.timetables || []);
    } catch (err) {
      setError(err.message || "Failed to load timetables");
    } finally {
      setLoading(false);
    }
  }

  function newTimetable() {
    setActive(null);
    setName("My Timetable");
    setColumns(initEmptyColumns());
  }

  async function loadTimetable(id) {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getTimetable(id);
      setActive(res.timetable._id);
      setName(res.timetable.name);
      setColumns(res.timetable.columns);
    } catch (err) {
      setError(err.message || "Failed to load timetable");
    } finally {
      setLoading(false);
    }
  }

  function onDragEnd(result) {
    const { source, destination } = result;
    if (!destination) return;

    const srcIdx = Number(source.droppableId.replace("col-", ""));
    const destIdx = Number(destination.droppableId.replace("col-", ""));

    const sourceCol = Array.from(columns[srcIdx].items);
    const [moved] = sourceCol.splice(source.index, 1);

    if (srcIdx === destIdx) {
      // reorder within same column
      sourceCol.splice(destination.index, 0, moved);
      const newCols = Array.from(columns);
      newCols[srcIdx] = { ...columns[srcIdx], items: sourceCol };
      setColumns(newCols);
    } else {
      // move between columns
      const destCol = Array.from(columns[destIdx].items);
      destCol.splice(destination.index, 0, moved);
      const newCols = Array.from(columns);
      newCols[srcIdx] = { ...columns[srcIdx], items: sourceCol };
      newCols[destIdx] = { ...columns[destIdx], items: destCol };
      setColumns(newCols);
    }
  }

  function addItemToColumn(colIdx) {
    const title = prompt("Class / Session title");
    if (!title) return;
    const start = prompt("Start time (e.g., 09:00)", "09:00");
    const end = prompt("End time (e.g., 10:00)", "10:50");
    const color = prompt("Color (hex)", "#60a5fa") || "#60a5fa";
    const loc = prompt("Location (optional)", "");
    const item = {
      id: uuidv4(),
      title,
      start,
      end,
      location: loc,
      color,
    };
    const newCols = Array.from(columns);
    newCols[colIdx] = {
      ...newCols[colIdx],
      items: [...newCols[colIdx].items, item],
    };
    setColumns(newCols);
  }

  function removeTimetable(id) {
    if (!confirm("Delete timetable?")) return;
    setLoading(true);
    api
      .deleteTimetable(id)
      .then(() => loadList())
      .catch((err) => setError(err.message || "Delete failed"))
      .finally(() => setLoading(false));
  }

  async function saveTimetable() {
    if (!name.trim()) {
      setError("Name required");
      return;
    }
    setSaving(true);
    setError(null);
    const payload = { name, columns };
    try {
      if (active) {
        await api.updateTimetable(active, payload);
      } else {
        const res = await api.createTimetable(payload);
        setActive(res.timetable._id);
      }
      await loadList();
      alert("Saved");
    } catch (err) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="body-bg p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Timetable Builder</h1>
            <p className="text-sm text-slate-600">
              Drag and drop items between days. Save to your account.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded border" onClick={newTimetable}>
              New
            </button>
            <button
              className="px-3 py-1 rounded bg-sky-600 text-white"
              onClick={saveTimetable}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="card">
            <h3 className="font-semibold">Your Timetables</h3>
            {loading ? (
              <div className="text-sm text-slate-500">Loading...</div>
            ) : (
              <ul className="space-y-2 mt-3">
                {timetables.map((t) => (
                  <li key={t._id} className="flex items-center justify-between">
                    <div>
                      <button
                        className="text-left"
                        onClick={() => loadTimetable(t._id)}
                      >
                        <div className="font-medium">{t.name}</div>
                        <div className="text-xs text-slate-500">
                          {new Date(t.updatedAt).toLocaleString()}
                        </div>
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="text-red-500 text-sm"
                        onClick={() => removeTimetable(t._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
                {timetables.length === 0 && (
                  <li className="text-sm text-slate-500">No timetables yet</li>
                )}
              </ul>
            )}
          </div>

          <div className="card col-span-2">
            <div className="mb-3">
              <input
                className="w-full border rounded px-2 py-1"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Timetable name"
              />
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
              <div className="overflow-x-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-3">
                  {columns.map((col, i) => (
                    <div key={col.day} className="flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{col.day}</h4>
                        <button
                          className="text-xs text-slate-500"
                          onClick={() => addItemToColumn(i)}
                        >
                          + Add
                        </button>
                      </div>
                      <TimetableColumn column={col} index={i} />
                    </div>
                  ))}
                </div>
              </div>
            </DragDropContext>

            {error && <div className="text-red-500 mt-3">{error}</div>}
          </div>
        </div>

        {!user && (
          <div className="text-sm text-slate-500">
            Please login to save timetables
          </div>
        )}
      </div>
    </div>
  );
}
