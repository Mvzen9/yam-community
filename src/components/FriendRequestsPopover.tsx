import React, { useState } from 'react';
import { Check, X, Users } from 'lucide-react';
import useGetRecived from '../hooks/useGetRecived';
import useAcceptRequest from '../hooks/useAcceptRequest';
import RequestItem from './RequestItem';

const FriendRequestsPopover = ({
    isOpen,
    onClose,
    friendRequests = [],
    onAcceptRequest,
    onDeclineRequest
}) => {

    const recivedFriendRequests = useGetRecived();
    const [actionHappened, setactionHappened] = useState(false);

    // Mock data for demonstration - replace with your actual data

    if (isOpen) {

        if (recivedFriendRequests.isLoading) {
            return (

                <p>noooo</p>
            )
        }
        if (recivedFriendRequests.isSuccess) {

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
                                {recivedFriendRequests.data?.length > 0 && (
                                    <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded-full">
                                        {recivedFriendRequests.data?.length}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Requests List */}
                        <div className="max-h-96 overflow-y-auto">
                            {recivedFriendRequests.data?.length === 0 ? (
                                <div className="p-8 text-center">
                                    <p className="text-gray-500">No pending friend requests</p>
                                </div>
                            ) : (
                                recivedFriendRequests.data?.map((request) => (
                                    <RequestItem key={request.userId} userId={request.userId} email={request.senderEmail} useActionHappened={setactionHappened} actionHappened={actionHappened} />
                                ))
                            )}
                        </div>
                    </div>
                </>
            );
        };
    }
}
export default FriendRequestsPopover