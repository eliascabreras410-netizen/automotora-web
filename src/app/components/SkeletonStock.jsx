export default function SkeletonStock() {
  return (
    <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="overflow-hidden rounded-3xl bg-white shadow-xl animate-pulse">
          <div className="h-44 w-full bg-gray-200" />
          <div className="flex flex-col gap-3 p-5 md:p-6">
            <div className="h-6 w-3/4 rounded-xl bg-gray-200" />
            <div className="h-4 w-1/2 rounded-xl bg-gray-200" />
            <div className="h-5 w-1/3 rounded-xl bg-gray-200" />
            <div className="mt-2 h-11 w-full rounded-2xl bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  )
}