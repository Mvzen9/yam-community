import React from 'react';
import { Check, X, Users } from 'lucide-react';

const FriendRequestsPopover = ({
    isOpen,
    onClose,
    friendRequests = [],
    onAcceptRequest,
    onDeclineRequest
}) => {
    // Mock data for demonstration - replace with your actual data
    const mockFriendRequests = [
        {
            id: 1,
            username: 'john_doe',
            displayName: 'John Doe',
            avatar: null,
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            mutualFriends: 5
        },
        {
            id: 2,
            username: 'sarah_wilson',
            displayName: 'Sarah Wilson',
            avatar: null,
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
            mutualFriends: 12
        },
        {
            id: 3,
            username: 'mike_chen',
            displayName: 'Mike Chen',
            avatar: null,
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
            mutualFriends: 3
        }
    ];

    const requests = friendRequests.length > 0 ? friendRequests : mockFriendRequests;

    const handleAccept = (requestId, username) => {
        if (onAcceptRequest) {
            onAcceptRequest(requestId, username);
        }
        console.log(`Accepted friend request from ${username}`);
    };

    const handleDecline = (requestId, username) => {
        if (onDeclineRequest) {
            onDeclineRequest(requestId, username);
        }
        console.log(`Declined friend request from ${username}`);
    };

    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const diff = now - timestamp;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days}d ago`;
        } else if (hours > 0) {
            return `${hours}h ago`;
        } else {
            return 'Just now';
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Invisible backdrop for closing when clicking outside */}
            <div
                className="fixed inset-0 z-40"
                onClick={onClose}
                style={{ background: 'transparent' }}
            />

            {/* Popover */}
            <div
                className="fixed top-16 right-4 bg-white rounded-lg shadow-2xl border  min-w-96 max-w-md z-50"
                style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 30px rgba(155, 79, 43, 0.15)',
                    border: '1px solid #723A20'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 pb-2 border-b border-orange-100">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-orange-600" />
                        <h3 className="text-lg font-semibold text-gray-800">Friend Requests</h3>
                        {requests.length > 0 && (
                            <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded-full">
                                {requests.length}
                            </span>
                        )}
                    </div>
                </div>

                {/* Requests List */}
                <div className="max-h-96 overflow-y-auto">
                    {requests.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-gray-500">No pending friend requests</p>
                        </div>
                    ) : (
                        requests.map((request, index) => (
                            <div
                                key={request.id}
                                className="p-4 hover:bg-orange-50 transition-colors duration-200 border-b border-orange-50 last:border-b-0"
                            >
                                <div className="flex items-start gap-3">
                                    {/* Avatar */}
                                    <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center flex-shrink-0">
                                        {request.avatar ? (
                                            <img
                                                src={request.avatar}
                                                alt={request.displayName}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-orange-800 font-semibold text-lg">
                                                {request.displayName.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="mb-1">
                                            <h4 className="font-semibold text-gray-900 truncate">
                                                {request.displayName}
                                            </h4>
                                            <p className="text-sm text-gray-600 truncate">
                                                @{request.username}
                                            </p>
                                        </div>

                                        <p className="text-xs text-gray-500 mb-3">
                                            {request.mutualFriends} mutual friends • {formatTimeAgo(request.timestamp)}
                                        </p>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleAccept(request.id, request.username)}
                                                className="flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 flex items-center justify-center gap-1"
                                                style={{
                                                    backgroundColor: '#723A20',
                                                    color: 'white',
                                                    border: 'none'
                                                }}
                                                onMouseEnter={(e) => e.target.style.backgroundColor = '#c2410c'}
                                                onMouseLeave={(e) => e.target.style.backgroundColor = '#723A20'}
                                            >
                                                <Check className="w-4 h-4" />
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleDecline(request.id, request.username)}
                                                className="flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 flex items-center justify-center gap-1"
                                                style={{
                                                    backgroundColor: 'transparent',
                                                    color: '#c2410c',
                                                    border: '1px solid #fed7aa'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.backgroundColor = '#fff7ed';
                                                    e.target.style.borderColor = '#fdba74';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.backgroundColor = 'transparent';
                                                    e.target.style.borderColor = '#fed7aa';
                                                }}
                                            >
                                                <X className="w-4 h-4" />
                                                Decline
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default FriendRequestsPopover;