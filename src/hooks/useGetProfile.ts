import axios from "axios"
import { useQuery, type UseQueryResult } from "@tanstack/react-query"

export interface ProfielResponseObject {
    userId: string;
    displayName: string;
    gender: string;
    bio: string;
    profilePictureUrl: string;
    email: string;
    username: string;
    joinedAt: string;
    friendsCount: number;
}

const getProfile = async (id: string): Promise<ProfielResponseObject> => {

    const token = localStorage.getItem("token");

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' // Assuming you're sending JSON data
    };
    const result = await axios.get<ProfielResponseObject>(`http://todo-app.polandcentral.cloudapp.azure.com:5004/api/Auth?userId=${id}`, { headers: headers })

    return result.data
}

const useGetProfile = (id: string): UseQueryResult<ProfielResponseObject> => {
    const query = useQuery({ queryKey: ["Profile", id], queryFn: () => getProfile(id), staleTime: 1000 * 10, enabled: !!id, })

    return query
}

export default useGetProfile