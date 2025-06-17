const Gallery5Images = () => (
  <div className="flex gap-2 p-4 bg-white rounded border">
    {[1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        className="w-1/2 h-32 bg-gray-200 flex items-center justify-center"
      >
        Image {i}
      </div>
    ))}
  </div>
);
export default Gallery5Images;
