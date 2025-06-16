
const NotificationCenter = () => {
    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen bg:rgba(255, 255, 255, 0.95) p-4">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                    <div className="p-5 border-b border-gray-200">
                        <h1 className="text-xl font-bold text-gray-800">Notification Center</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            You have no new notifications.
                        </p>
                    </div>
                    <div className="p-12 text-center">

                        <h3 className="mt-4 text-lg font-semibold text-gray-900">No new notifications</h3>
                        <p className="mt-1 text-sm text-gray-500">When you receive notifications, they will appear here.</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NotificationCenter