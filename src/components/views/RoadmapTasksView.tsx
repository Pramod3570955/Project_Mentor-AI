import React, { useState, useEffect } from 'react';
import {
  KanbanSquare,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  Search,
  Filter,
  ArrowRight,
  MoreVertical,
  X,
  Sparkles
} from 'lucide-react';
import { Project, DevelopmentPhase, Task, TaskStatus, PriorityLevel } from '../../types/index.js';
import { api } from '../../api.js';

interface RoadmapTasksViewProps {
  project: Project;
}

export const RoadmapTasksView: React.FC<RoadmapTasksViewProps> = ({ project }) => {
  const [phases, setPhases] = useState<DevelopmentPhase[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // New task modal
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<PriorityLevel>('MEDIUM');
  const [newTaskTech, setNewTaskTech] = useState('Core');
  const [newTaskHours, setNewTaskHours] = useState(8);

  useEffect(() => {
    loadRoadmap();
  }, [project.id]);

  const loadRoadmap = async () => {
    setLoading(true);
    try {
      const [phRes, tRes] = await Promise.all([
        api.getPhases(project.id),
        api.getTasks(project.id)
      ]);
      setPhases(phRes?.phases || []);
      setTasks(tRes?.tasks || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await api.updateTask(project.id, taskId, { status: newStatus });
      setTasks(prev =>
        (prev || []).map(t => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const res = await api.createTask(project.id, {
        title: newTaskTitle,
        description: newTaskDesc,
        priority: newTaskPriority,
        technologyTag: newTaskTech,
        estimateHours: newTaskHours,
        status: 'TODO'
      });
      if (res?.task) {
        setTasks(prev => [...(prev || []), res.task]);
      }
      setShowNewTaskModal(false);
      setNewTaskTitle('');
      setNewTaskDesc('');
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTasks = (tasks || []).filter(t => {
    if (filterPriority !== 'ALL' && t.priority !== filterPriority) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.technologyTag.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const columns: { status: TaskStatus; title: string; color: string }[] = [
    { status: 'TODO', title: 'Planned Backlog', color: 'border-zinc-300' },
    { status: 'IN_PROGRESS', title: 'In Active Development', color: 'border-indigo-400' },
    { status: 'BLOCKED', title: 'Blocked / Needs Attention', color: 'border-rose-400' },
    { status: 'COMPLETED', title: 'Verified Completed', color: 'border-emerald-400' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              <KanbanSquare className="h-4 w-4 text-indigo-500" />
              <span>Stage 4: Execution Engine</span>
            </div>
            <h1 className="text-xl font-bold text-zinc-900">Roadmap Phases & Kanban Board</h1>
            <p className="mt-1 text-xs text-zinc-500">
              Phase → Milestone → Task breakdown with acceptance criteria and blocker alerts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNewTaskModal(true)}
              className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-zinc-800 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* Filters and search bar */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-zinc-100 pt-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="h-3.5 w-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Filter tasks..."
                className="rounded-lg border border-zinc-200 bg-zinc-50 pl-8 pr-3 py-1.5 text-xs text-zinc-800 placeholder:text-zinc-400 focus:bg-white focus:outline-hidden"
              />
            </div>

            <select
              value={filterPriority}
              onChange={e => setFilterPriority(e.target.value)}
              className="rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-xs text-zinc-700"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <div className="text-[11px] text-zinc-500">
            Showing <strong>{filteredTasks.length}</strong> of {tasks.length} total tasks
          </div>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {columns.map(col => {
          const colTasks = filteredTasks.filter(t => t.status === col.status);
          return (
            <div
              key={col.status}
              className={`rounded-2xl border-t-4 ${col.color} border-x border-b border-zinc-200 bg-zinc-50/70 p-3 shadow-2xs flex flex-col min-h-[420px]`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-1 mb-3">
                <span className="font-bold text-zinc-800 text-xs">{col.title}</span>
                <span className="rounded-full bg-zinc-200/80 px-2 py-0.5 text-[10px] font-bold text-zinc-700">
                  {colTasks.length}
                </span>
              </div>

              {/* Task Cards Container */}
              <div className="space-y-3 flex-1">
                {colTasks.map(task => (
                  <div
                    key={task.id}
                    className="rounded-xl border border-zinc-200 bg-white p-3.5 shadow-2xs space-y-2.5 text-xs transition hover:border-zinc-300 hover:shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="font-bold text-zinc-900 leading-snug">{task.title}</span>
                      <span className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold ${
                        task.priority === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800'
                          : task.priority === 'HIGH'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-zinc-100 text-zinc-600'
                      }`}>
                        {task.priority}
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-600 leading-relaxed">{task.description}</p>

                    {task.notes && (
                      <div className="rounded-lg bg-amber-50 border border-amber-200 p-2 text-[10px] font-medium text-amber-900">
                        {task.notes}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-zinc-100">
                      <span className="font-mono bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-700">
                        {task.technologyTag}
                      </span>
                      <span>{task.estimateHours} hrs</span>
                    </div>

                    {/* Status Transitions */}
                    <div className="flex items-center gap-1 pt-1">
                      {col.status !== 'TODO' && (
                        <button
                          onClick={() => handleStatusChange(task.id, 'TODO')}
                          className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-600 hover:bg-zinc-200"
                        >
                          ← Todo
                        </button>
                      )}
                      {col.status !== 'IN_PROGRESS' && (
                        <button
                          onClick={() => handleStatusChange(task.id, 'IN_PROGRESS')}
                          className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-700 hover:bg-indigo-100"
                        >
                          In Progress
                        </button>
                      )}
                      {col.status !== 'BLOCKED' && (
                        <button
                          onClick={() => handleStatusChange(task.id, 'BLOCKED')}
                          className="rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700 hover:bg-rose-100"
                        >
                          Block
                        </button>
                      )}
                      {col.status !== 'COMPLETED' && (
                        <button
                          onClick={() => handleStatusChange(task.id, 'COMPLETED')}
                          className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-100"
                        >
                          Complete ✓
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="font-bold text-sm text-zinc-900">Add Milestone Deliverable Task</h3>
              <button
                onClick={() => setShowNewTaskModal(false)}
                className="rounded p-1 text-zinc-400 hover:text-zinc-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Implement SpO2 Emergency Bypass WebSocket"
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Description & Acceptance Criteria</label>
                <textarea
                  rows={3}
                  value={newTaskDesc}
                  onChange={e => setNewTaskDesc(e.target.value)}
                  placeholder="Describe functional goals and pass/fail conditions..."
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={e => setNewTaskPriority(e.target.value as any)}
                    className="w-full rounded-lg border border-zinc-300 px-2 py-1.5"
                  >
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Tech Tag</label>
                  <input
                    type="text"
                    value={newTaskTech}
                    onChange={e => setNewTaskTech(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 px-2 py-1.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Estimate (Hrs)</label>
                  <input
                    type="number"
                    value={newTaskHours}
                    onChange={e => setNewTaskHours(Number(e.target.value))}
                    className="w-full rounded-lg border border-zinc-300 px-2 py-1.5"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="rounded-lg px-3 py-1.5 text-zinc-600 hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-zinc-900 px-4 py-1.5 font-semibold text-white hover:bg-zinc-800"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
