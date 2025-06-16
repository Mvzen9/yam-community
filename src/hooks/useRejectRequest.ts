import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios"

interface requestObject {
    email: string;
}

const rejectRequest = async (data: requestObject): Promise<string> => {

    const token = localStorage.getItem("token");

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' // Assuming you're sending JSON data
    };


    const result = await axios.post("https://9925-156-201-31-66.ngrok-free.app/api/Friend/reject", data, { headers: headers });

    return result.data;
}

const userejectRequest = (): UseMutationResult<string, AxiosError, requestObject> => {
    const queryClient = useQueryClient()
    return useMutation(
        {
            mutationFn: rejectRequest
            , onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["requests"] })

            }
        })


}

export default userejectRequest