import { hash } from "bcryptjs";

export async function hashPassword(email: string, password: string) {
    const b64 = btoa(email)
        .replace(/[+/]/g, (match) => (match === "+" ? "." : "/")) //replace + with .
        .replace(/=+$/, ""); //remove trailing equal signs

    const salt = b64
        .repeat(Math.ceil(22 / b64.length)) //repeat the b64 string to make it at least 22 characters long
        .slice(0, 22); //make it max 22 characters long

    const passwordHash = await hash(
        password,
        `$2a$10$${salt}` // bcryptjs requires the salt to be in the format $2a$10$salt
    );

    return passwordHash;
}
