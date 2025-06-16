import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios from "axios"
import { getClaim } from "../utils/jwtUtils";

interface RequestBody {
    username: string;
}

interface ResponseBody {
    relationship: "friend" | "none" | "request"
}

const getStatus = async (data: RequestBody): Promise<ResponseBody> => {

    const token = localStorage.getItem("token");

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' // Assuming you're sending JSON data
    };

    const result = await axios.post("https://9925-156-201-31-66.ngrok-free.app/api/Friend/relationship",
        data,
        { headers: headers }
    )
    return result.data
}
const useGetRelationStatus = (): UseQueryResult<ResponseBody> => {
    var user_id = getClaim("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")

    var data: RequestBody = {
        username: user_id as string
    }

    console.log(user_id);

    var query = useQuery({ queryKey: ["RelationStatus", data.username], queryFn: () => getStatus(data) })

    return query
}

export default useGetRelationStatus