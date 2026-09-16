import { useState, useEffect } from "react";
import {
  FaSave,
  FaRedo,
  FaChevronDown,
  FaChevronUp,
  FaPlus,
  FaTrash,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useContent } from "../../context/ContentContext";
import type { AboutContent } from "../../api/content.service";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const inputCls =
  "w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-blue-500 focus:bg-white focus:outline-none text-sm transition-all";
const textareaCls = `${inputCls} resize-none`;

const Field = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">
      {label}
    </label>
    {children}
    {hint && <p className="text-[10px] text-gray-400 font-medium">{hint}</p>}
  </div>
);

// ─── Accordion Section wrapper ────────────────────────────────────────────────

const Section = ({
  title,
  badge,
  children,
  defaultOpen = true,
}: {
  title: string;
  badge?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <h3 className="text-base font-black uppercase tracking-tighter text-gray-900">
            {title}
          </h3>
          {badge && (
            <span className="text-[9px] font-black uppercase tracking-widest bg-blue-100 text-blue-600 px-2.5 py-1 rounded-full">
              {badge}
            </span>
          )}
        </div>
        {open ? (
          <FaChevronUp size={13} className="text-gray-400" />
        ) : (
          <FaChevronDown size={13} className="text-gray-400" />
        )}
      </button>
      {open && <div className="px-8 py-8 space-y-6">{children}</div>}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const ManageAbout = () => {
  const { aboutContent, updateAboutContent, resetAboutContent } = useContent();

  // Deep-clone to local state for editing
  const [draft, setDraft] = useState<AboutContent>(() =>
    JSON.parse(JSON.stringify(aboutContent))
  );
  const [saving, setSaving] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // Keep draft in sync if context resets externally
  useEffect(() => {
    setDraft(JSON.parse(JSON.stringify(aboutContent)));
  }, [aboutContent]);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      updateAboutContent(draft);
      setSaving(false);
      showToast("About page updated successfully!");
    }, 600);
  };

  const handleReset = () => {
    resetAboutContent();
    setResetConfirm(false);
    showToast("About page reset to defaults.");
  };

  // ── Draft helpers ──────────────────────────────────────────────────────────

  const setHero = (key: keyof typeof draft.hero, val: string) =>
    setDraft((d) => ({ ...d, hero: { ...d.hero, [key]: val } }));

  const setStat = (idx: number, key: "value" | "label", val: string) =>
    setDraft((d) => {
      const stats = [...d.stats];
      stats[idx] = { ...stats[idx], [key]: val };
      return { ...d, stats };
    });

  const setValueCard = (idx: number, key: "title" | "desc", val: string) =>
    setDraft((d) => {
      const values = [...d.values];
      values[idx] = { ...values[idx], [key]: val };
      return { ...d, values };
    });

  const setTeamMember = (
    idx: number,
    key: "name" | "role" | "image",
    val: string
  ) =>
    setDraft((d) => {
      const team = [...d.team];
      team[idx] = { ...team[idx], [key]: val };
      return { ...d, team };
    });

  const addTeamMember = () =>
    setDraft((d) => ({
      ...d,
      team: [...d.team, { name: "", role: "", image: "" }],
    }));

  const removeTeamMember = (idx: number) =>
    setDraft((d) => ({
      ...d,
      team: d.team.filter((_, i) => i !== idx),
    }));

  const setWhyItem = (idx: number, key: "title" | "desc", val: string) =>
    setDraft((d) => {
      const whyItems = [...d.whyItems];
      whyItems[idx] = { ...whyItems[idx], [key]: val };
      return { ...d, whyItems };
    });

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-10 pb-20 relative max-w-4xl">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-sm font-black uppercase tracking-widest ${
            toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-1">
            About Page
          </h2>
          <p className="text-gray-400 font-medium italic">
            Edit all sections of the public About page. Changes are reflected immediately after saving.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={() => setResetConfirm(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-500 hover:border-red-400 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-all"
          >
            <FaRedo size={11} /> Reset
          </button>
          <button
            type="submit"
            form="about-form"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-black text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 disabled:opacity-60"
          >
            <FaSave size={11} />
            {saving ? "Saving…" : "Save All Changes"}
          </button>
        </div>
      </div>

      <form id="about-form" onSubmit={handleSave} className="space-y-8">

        {/* ── Hero Section ────────────────────────────────────────────────── */}
        <Section title="Hero Section" badge="Top of page">
          <Field label="Tag Line (small italic text above headline)">
            <input
              value={draft.hero.tag}
              onChange={(e) => setHero("tag", e.target.value)}
              placeholder="e.g. Born to Move Faster"
              className={inputCls}
            />
          </Field>
          <Field label="Main Headline">
            <input
              value={draft.hero.headline}
              onChange={(e) => setHero("headline", e.target.value)}
              placeholder="e.g. Curating Fashion Trends Since 2015"
              className={inputCls}
            />
          </Field>
          <Field label="Paragraph 1">
            <textarea
              rows={3}
              value={draft.hero.paragraph1}
              onChange={(e) => setHero("paragraph1", e.target.value)}
              className={textareaCls}
            />
          </Field>
          <Field label="Paragraph 2">
            <textarea
              rows={3}
              value={draft.hero.paragraph2}
              onChange={(e) => setHero("paragraph2", e.target.value)}
              className={textareaCls}
            />
          </Field>
        </Section>

        {/* ── Stats Banner ─────────────────────────────────────────────────── */}
        <Section title="Stats Banner" badge={`${draft.stats.length} stats`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {draft.stats.map((stat, i) => (
              <div
                key={i}
                className="p-6 bg-gray-50 rounded-2xl border-2 border-gray-100 space-y-4"
              >
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                  Stat {i + 1}
                </p>
                <Field label="Value (e.g. 10K+)">
                  <input
                    value={stat.value}
                    onChange={(e) => setStat(i, "value", e.target.value)}
                    placeholder="10K+"
                    className={inputCls}
                  />
                </Field>
                <Field label="Label">
                  <input
                    value={stat.label}
                    onChange={(e) => setStat(i, "label", e.target.value)}
                    placeholder="Happy Customers"
                    className={inputCls}
                  />
                </Field>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Core Values ──────────────────────────────────────────────────── */}
        <Section title="Core Values" badge={`${draft.values.length} values`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {draft.values.map((v, i) => (
              <div
                key={i}
                className="p-6 bg-gray-50 rounded-2xl border-2 border-gray-100 space-y-4"
              >
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                  Value {i + 1}
                </p>
                <Field label="Title">
                  <input
                    value={v.title}
                    onChange={(e) => setValueCard(i, "title", e.target.value)}
                    placeholder="e.g. Our Mission"
                    className={inputCls}
                  />
                </Field>
                <Field label="Description">
                  <textarea
                    rows={3}
                    value={v.desc}
                    onChange={(e) => setValueCard(i, "desc", e.target.value)}
                    className={textareaCls}
                  />
                </Field>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Team Members ─────────────────────────────────────────────────── */}
        <Section title="Team Members" badge={`${draft.team.length} members`}>
          <div className="space-y-6">
            {draft.team.map((member, i) => (
              <div
                key={i}
                className="p-6 bg-gray-50 rounded-2xl border-2 border-gray-100 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                    Team Member {i + 1}
                  </p>
                  {draft.team.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTeamMember(i)}
                      className="w-7 h-7 rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all"
                    >
                      <FaTrash size={10} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Full Name">
                    <input
                      value={member.name}
                      onChange={(e) => setTeamMember(i, "name", e.target.value)}
                      placeholder="e.g. Amara Diallo"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Role / Title">
                    <input
                      value={member.role}
                      onChange={(e) => setTeamMember(i, "role", e.target.value)}
                      placeholder="e.g. Founder & Creative Director"
                      className={inputCls}
                    />
                  </Field>
                </div>
                <Field
                  label="Photo URL"
                  hint="Paste a direct image URL (e.g. from Unsplash)"
                >
                  <input
                    type="url"
                    value={member.image}
                    onChange={(e) => setTeamMember(i, "image", e.target.value)}
                    placeholder="https://..."
                    className={inputCls}
                  />
                </Field>
                {member.image && (
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-200 border-2 border-gray-200">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) =>
                        ((e.target as HTMLImageElement).style.display = "none")
                      }
                    />
                  </div>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addTeamMember}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-blue-400 hover:text-blue-500 text-xs font-black uppercase tracking-widest transition-all"
            >
              <FaPlus size={11} /> Add Team Member
            </button>
          </div>
        </Section>

        {/* ── Why GuraFaster ───────────────────────────────────────────────── */}
        <Section title="Why GuraFaster" badge={`${draft.whyItems.length} points`} defaultOpen={false}>
          <div className="space-y-6">
            {draft.whyItems.map((item, i) => (
              <div
                key={i}
                className="p-6 bg-gray-50 rounded-2xl border-2 border-gray-100 space-y-4"
              >
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                  Point {i + 1}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Title">
                    <input
                      value={item.title}
                      onChange={(e) => setWhyItem(i, "title", e.target.value)}
                      placeholder="e.g. Fast Delivery"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Description">
                    <input
                      value={item.desc}
                      onChange={(e) => setWhyItem(i, "desc", e.target.value)}
                      placeholder="e.g. Same-day shipping available"
                      className={inputCls}
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Sticky Save Bar */}
        <div className="sticky bottom-0 bg-white/90 backdrop-blur-sm border-t border-gray-100 py-4 flex items-center justify-between gap-4 -mx-4 px-4 sm:-mx-8 sm:px-8 rounded-t-3xl shadow-lg">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Remember to save before leaving this page.
          </p>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 text-white hover:bg-black text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 disabled:opacity-60"
          >
            <FaSave size={11} />
            {saving ? "Saving…" : "Save All Changes"}
          </button>
        </div>
      </form>

      {/* ── Reset Confirm Modal ──────────────────────────────────────────── */}
      {resetConfirm && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-3xl p-10 max-w-sm w-full shadow-2xl text-center space-y-6">
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto">
                <FaExclamationTriangle className="text-orange-500 text-2xl" />
              </div>
              <div>
                <h4 className="text-xl font-black uppercase tracking-tight text-gray-900">
                  Reset About Page?
                </h4>
                <p className="text-sm text-gray-400 mt-2 font-medium">
                  All your customisations will be lost and the page will return
                  to its default content.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 rounded-xl bg-orange-500 text-white font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition-all"
                >
                  Yes, Reset
                </button>
                <button
                  onClick={() => setResetConfirm(false)}
                  className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-black uppercase tracking-widest text-xs hover:border-gray-400 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageAbout;
