
const RequestItem = () => {
    return (
        <li className="p-4 sm:p-5">
            <div className="flex items-center space-x-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    <img
                        className="h-12 w-12 rounded-full object-cover"
                        src={request.avatarUrl}
                        alt={`${request.name}'s avatar`}
                        onError={(e) => e.target.src = 'https://placehold.co/100x100?text=User'}
                    />
                </div>
                {/* User Info */}
                <div className="flex-1 min-w-0">
                    <p className="text-md font-semibold text-gray-900 truncate">
                        {request.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                        {request.message}
                    </p>
                </div>
                {/* Action Buttons */}
                <div className="flex-shrink-0 flex items-center space-x-3">
                    <button
                        onClick={() => onAccept(request.id)}
                        className="px-4 py-2 text-sm font-semibold text-white bg-[#c05621] rounded-md shadow-sm hover:bg-[#a1481b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c05621] transition-all">
                        Accept
                    </button>
                    <button
                        onClick={() => onReject(request.id)}
                        className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all">
                        Reject
                    </button>
                </div>
            </div>
        </li>
    )
}

export default RequestItem