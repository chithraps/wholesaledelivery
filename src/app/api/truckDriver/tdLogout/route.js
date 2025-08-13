import { STATUS_CODES } from "@/Constants/codeStatus";


export async function POST(req, res) {
    try {
        console.log("sucessfully loggedout")
        return new Response(JSON.stringify({ message: "Logged out successfully" }), {
            status: STATUS_CODES.OK,
            headers: {
                "Set-Cookie": "tdAuth=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict",
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Logout failed" }), {
            status: STATUS_CODES.INTERNAL_SERVER_ERROR,
            headers: { "Content-Type": "application/json" },
        });
    }
}