export default function Topbar({ title }) {
  return (
    <header className="h-14 flex items-center px-6 border-b border-slate-800 bg-slate-900 flex-shrink-0">
      <h1 className="text-sm font-semibold text-slate-200">{title}</h1>
    </header>
  );
}
