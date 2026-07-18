export default function Loading() {
  return (
    <div className="w-full h-[70vh] flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-4 h-4 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-4 h-4 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <div className="px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold tracking-wide animate-pulse">
          Loading Data...
        </div>
      </div>
    </div>
  );
}
