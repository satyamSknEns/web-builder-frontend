const Gallery4Images = () => (
  <div className="flex gap-2 p-4 border border-slate-400 rounded-md overflow-hidden shadow bg-white mb-4">
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="w-1/2 h-32 bg-gray-200 flex items-center justify-center"
      >
        Image {i}
      </div>
    ))}
  </div>
);
export default Gallery4Images;
