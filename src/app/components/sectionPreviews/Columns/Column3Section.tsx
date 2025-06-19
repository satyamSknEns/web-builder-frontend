const Column3Section = () => (
  <div className="flex gap-2 p-2 border border-slate-400 rounded-md overflow-hidden shadow bg-white mb-4 w-full">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="w-1/2 h-24 text-xs rounded-md bg-gray-200 flex items-center justify-center"
      >
        Column {i}
      </div>
    ))}
  </div>
);
export default Column3Section;
