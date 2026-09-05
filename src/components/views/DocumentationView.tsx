import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Edit3,
  Save,
  Layers,
  FileDown,
  Info
} from 'lucide-react';
import { Project, ProjectDocument, DocumentSection } from '../../types/index.js';
import { api } from '../../api.js';

interface DocumentationViewProps {
  project: Project;
}

export const DocumentationView: React.FC<DocumentationViewProps> = ({ project }) => {
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [activeDoc, setActiveDoc] = useState<ProjectDocument | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const getDocFullText = (doc: ProjectDocument): string => {
    return (doc?.sections || []).map(s => `## ${s.title}\n\n${s.content}`).join('\n\n');
  };

  useEffect(() => {
    loadDocuments();
  }, [project.id]);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const res = await api.getDocuments(project.id);
      setDocuments(res?.documents || []);
      if (res?.documents && res.documents.length > 0) {
        setActiveDoc(res.documents[0]);
        setEditContent(getDocFullText(res.documents[0]));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDoc = async () => {
    if (!activeDoc) return;
    setSaving(true);
    try {
      // Split edited text back into sections or single section
      const updatedSections: DocumentSection[] = [
        {
          id: `sec_custom_${Date.now()}`,
          title: 'Document Content (Edited)',
          content: editContent,
          isVerifiedFact: false,
          sourceAuthority: 'STUDENT_PROVIDED'
        }
      ];

      const updated: ProjectDocument = {
        ...activeDoc,
        sections: updatedSections,
        version: activeDoc.version + 1,
        lastUpdated: new Date().toISOString().split('T')[0]
      };

      await api.saveDocument(project.id, updated);
      setActiveDoc(updated);
      setDocuments(prev => prev.map(d => (d.id === updated.id ? updated : d)));
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = () => {
    if (!activeDoc) return;
    const text = isEditing ? editContent : getDocFullText(activeDoc);
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeDoc.title.replace(/[^a-zA-Z0-9]/g, '_')}_v${activeDoc.version}.md`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              <FileText className="h-4 w-4 text-indigo-500" />
              <span>Stage 9: Capstone Deliverables</span>
            </div>
            <h1 className="text-xl font-bold text-zinc-900">Academic Documentation Center</h1>
            <p className="mt-1 text-xs text-zinc-500">
              Standardized IEEE / University format SRS, Synopsis, and Architecture reports.
            </p>
          </div>

          {activeDoc && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (isEditing) handleSaveDoc();
                  else {
                    setEditContent(getDocFullText(activeDoc));
                    setIsEditing(true);
                  }
                }}
                disabled={saving}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-100 transition"
              >
                {isEditing ? (
                  <>
                    <Save className="h-3.5 w-3.5 text-indigo-600" />
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="h-3.5 w-3.5 text-zinc-500" />
                    <span>Edit Markdown</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 transition"
              >
                <FileDown className="h-3.5 w-3.5" />
                <span>Export (.md)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Document List & Document Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Document Selector Column */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider px-1">Deliverables Roster</h3>
          {(documents || []).map(doc => (
            <button
              key={doc.id}
              onClick={() => {
                setActiveDoc(doc);
                setEditContent(getDocFullText(doc));
                setIsEditing(false);
              }}
              className={`w-full rounded-xl border p-4 text-left text-xs transition ${
                activeDoc?.id === doc.id
                  ? 'border-indigo-600 bg-indigo-50/60 shadow-xs'
                  : 'border-zinc-200 bg-white hover:border-zinc-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-zinc-900">{doc.title}</span>
                <span className="text-[10px] font-mono text-zinc-400">v{doc.version}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                <span className="rounded bg-zinc-100 px-1.5 py-0.5">{doc.type}</span>
                <span>•</span>
                <span className="text-emerald-700 font-medium">{doc.sections?.length || 0} Sections</span>
              </div>
            </button>
          ))}
        </div>

        {/* Document Content Workspace */}
        {activeDoc && (
          <div className="lg:col-span-3 rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3">
              <div>
                <h2 className="font-bold text-base text-zinc-900">{activeDoc.title}</h2>
                <div className="text-[11px] text-zinc-500 mt-0.5">
                  Type: {activeDoc.type} • Version {activeDoc.version} • Last updated {activeDoc.lastUpdated}
                </div>
              </div>

              {/* Verified Facts Legend */}
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Verified Fact</span>
                </span>
                <span className="flex items-center gap-1 text-indigo-700 font-medium">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                  <span>AI Academic Narrative</span>
                </span>
              </div>
            </div>

            {/* Document Body */}
            {isEditing ? (
              <textarea
                rows={20}
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 p-4 font-mono text-xs text-zinc-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            ) : (
              <div className="space-y-4">
                {(activeDoc.sections || []).map(sec => (
                  <div
                    key={sec.id}
                    className={`rounded-xl border p-4 text-xs space-y-2 ${
                      sec.isVerifiedFact
                        ? 'border-emerald-200 bg-emerald-50/20'
                        : 'border-indigo-100 bg-indigo-50/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-zinc-900">{sec.title}</h3>
                      <span className={`rounded px-2 py-0.5 text-[9px] font-bold ${
                        sec.sourceAuthority === 'VERIFIED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : sec.sourceAuthority === 'APPROVED'
                          ? 'bg-blue-100 text-blue-800'
                          : sec.sourceAuthority === 'AI_GENERATED'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-zinc-100 text-zinc-700'
                      }`}>
                        {sec.sourceAuthority}
                      </span>
                    </div>
                    <p className="text-zinc-700 leading-relaxed whitespace-pre-wrap">{sec.content}</p>
                  </div>
                ))}

                {activeDoc.verifiedDataItems && activeDoc.verifiedDataItems.length > 0 && (
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs space-y-1.5">
                    <span className="font-bold text-zinc-900 block mb-1">Empirically Grounded Data Items:</span>
                    <ul className="space-y-1 text-zinc-600">
                      {(activeDoc.verifiedDataItems || []).map((item, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
