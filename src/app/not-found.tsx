import Link from "next/link";

const NotFound = ()=> {
  return (
    <div className="h-screen">
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white">404</h1>
          <p className="text-2xl font-semibold text-white">Page Not Found</p>
          <p className="mt-4 text-lg text-white">
            Sorry, the page you are looking for might be in another castle.
          </p>
          <Link
            href="/"
            className="w-[120px] p-2 m-2 bg-white text-black hover:text-blue-700 inline-block mt-4 shadow-md border border-red-600 rounded-md"
          >
            HOME
            <span className="bg"></span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;