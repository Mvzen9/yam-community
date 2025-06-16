import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

interface RequestData {
    email?: string;
}




const addFriend = async (data: RequestData): Promise<string> => {
    // Use the correct environment variable for your API endpoint
    const token = localStorage.getItem("token");

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' // Assuming you're sending JSON data
    };

    // const apiUrl = process.env.REACT_APP_API_URL as string; // For CRA
    const result = await axios.post("https://14f0-156-201-31-66.ngrok-free.app/api/Friend/request", data, { headers: headers });
    return result.data;
}
const useAddTask = (): UseMutationResult<string, AxiosError, RequestData> => {
    const client = useQueryClient()
    return useMutation({
        mutationFn: addFriend,
        onSuccess: () => {
            console.log("Request sent");


        }
    })
}

export default useAddTask;

