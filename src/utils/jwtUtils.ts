import { jwtDecode } from 'jwt-decode';

/**
 * This interface exactly matches the claims your backend is sending.
 */
export interface DecodedAppToken {
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
    "user-id": string;
    "display-name": string;
    exp: number;
    iss: string;
    aud: string;
}

/**
 * Decodes the JWT from localStorage and returns a specific claim.
 * @param claimName The name of the claim you want to retrieve.
 * @returns The value of the claim, or null if the token or claim doesn't exist.
 */
export const getClaim = (claimName: keyof DecodedAppToken): string | number | null => {
    try {
        const token = localStorage.getItem("token"); // Use your token's key

        if (!token) {
            return null;
        }

        // Decode the token using your specific interface for type safety
        const decodedToken = jwtDecode<DecodedAppToken>(token);

        // Return the specific claim's value
        return decodedToken[claimName];

    } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
    }
};