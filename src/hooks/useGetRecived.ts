import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios from "axios"


interface ResponseObject {
    senderEmail: string,
    userId: string,
    status: string
}

const getReceivedRequests = async (): Promise<ResponseObject[]> => {
    const token = localStorage.getItem("token");

    const headers = {
        'ngrok-skip-browser-warning': 'true',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' // Assuming you're sending JSON data
    };

    const result = await axios.get<ResponseObject[]>("https://9925-156-201-31-66.ngrok-free.app/api/Friend/requests/received", { headers: headers })
    return result.data
}

const useGetRecived = (): UseQueryResult<ResponseObject[]> => {
    var query = useQuery({ queryKey: ["requests"], queryFn: getReceivedRequests, staleTime: 1000 })
    return query
}

export default useGetRecived