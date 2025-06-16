const FriendRequestsPage = () => {
    // State to manage the list of friend requests
    const [requests, setRequests] = useState(initialRequests);

    // Handler to accept a friend request
    const handleAccept = (requestId) => {
        console.log(`Accepted request: ${requestId}`);
        // Remove the request from the list
        setRequests(currentRequests => currentRequests.filter(req => req.id !== requestId));
    };

    // Handler to reject a friend request
    const handleReject = (requestId) => {
        console.log(`Rejected request: ${requestId}`);
        // Remove the request from the list
        setRequests(currentRequests => currentRequests.filter(req => req.id !== requestId));
    };

    return (
        // This container would be placed inside the main content area of your application
        <div className="p-4 font-sans">
            {/* Main Container for Friend Requests */}
            <div className="bg-white rounded-lg border border-gray-200">

                {/* Header */}
                <div className="p-5 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-gray-800">Friend Requests</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        You have <span className="font-semibold text-brand-primary">{requests.length}</span> pending requests.
                    </p>
                </div>

                {/* Conditional Rendering: Show requests or empty state */}
                {requests.length > 0 ? (
                    // List of Friend Requests
                    <ul className="divide-y divide-gray-200">
                        {requests.map(request => (
                            <RequestItem
                                key={request.id}
                                request={request}
                                onAccept={handleAccept}
                                onReject={handleReject}
                            />
                        ))}
                    </ul>
                ) : (
                    // Empty State
                    <div className="p-12 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197" />
                        </svg>
                        <h3 className="mt-4 text-lg font-semibold text-gray-900">No pending friend requests</h3>
                        <p className="mt-1 text-sm text-gray-500">When someone sends you a friend request, it will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FriendRequestsPage;