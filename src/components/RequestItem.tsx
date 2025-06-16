import { Check, X } from "lucide-react";
import useAcceptRequest from "../hooks/useAcceptRequest";
import useAddTask from "../hooks/useAddFriend";
import useGetProfile from "../hooks/useGetProfile";
import userejectRequest from "../hooks/useRejectRequest";
import { useState } from "react";

interface Props {
    email: string,
    userId: string;
    actionHappened: boolean;
    useActionHappened: (value: boolean) => void;
}

const RequestItem = (props: Props) => {

    const getProfile = useGetProfile(props.userId);
    const acceptRequest = useAcceptRequest()
    const rejectedRequest = userejectRequest();

    const handleAccept = () => {
        acceptRequest.mutate({ email: props.email });
        props.useActionHappened(!props.actionHappened)
    }
    const handleReject = () => {
        rejectedRequest.mutate({ email: props.email })
        props.useActionHappened(!props.actionHappened)
    }
    return (
        <>
            <div
                key={getProfile.data?.userId}
                className="p-4 hover:bg-orange-50 transition-colors duration-200 border-b border-orange-50 last:border-b-0"
            >
                <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center flex-shrink-0">
                        {getProfile.data?.profilePictureUrl ? (
                            <img

                                src={getProfile.data?.profilePictureUrl}
                                alt={getProfile.data?.displayName}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        ) : (
                            <span className="text-orange-800 font-semibold text-lg">
                                {getProfile.data?.displayName.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="mb-1">
                            <h4 className="font-semibold text-gray-900 truncate">
                                {getProfile.data?.displayName}
                            </h4>
                            <p className="text-sm text-gray-600 truncate">
                                @{getProfile.data?.username}
                            </p>
                        </div>



                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleAccept()}
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
                                onClick={() => handleReject()}
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
        </>
    )
}

export default RequestItem