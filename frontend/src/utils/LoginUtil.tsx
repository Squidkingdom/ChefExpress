/**
 * Name: LoginUtil.tsx
 * Description:  
 * This utility module provides a function `hashPassword` that takes an email and password as input, 
 * processes the email into a base64 string to generate a salt, and hashes the password using the bcryptjs 
 * library. It returns the hashed password which can be used for secure password storage.
 * 
 * Programmer's name: Brady
 * Date the code was created: 11/20/24
 * Date the code was revised: 12/8/24
 * 
 * Preconditions:
 *   - The `email` and `password` arguments must be valid strings.
 *   - The `email` should be in a valid format (though it's not strictly validated in this function).
 * 
 * Acceptable input values or types:
 *   - `email`: String, the user's email address.
 *   - `password`: String, the user's password to be hashed.
 * 
 * Postconditions:
 *   - The function returns a hashed version of the password, generated using bcryptjs with a salt derived 
 *     from the email.
 * 
 * Return values or types:
 *   - Returns a promise that resolves to a hashed password (string).
 * 
 * Error and exception condition values:
 *   - If `bcryptjs.hash` fails, the function may throw an error.
 *   - Invalid inputs like empty strings may lead to incorrect behavior but are not explicitly handled.
 * 
 * Side effects:
 *   - The function relies on the bcryptjs library to perform the hashing operation.
 *   - The base64 encoding and salt generation are side effects for creating a secure bcrypt salt.
 * 
 * Invariants:
 *   - The function will always return a valid bcrypt hash if inputs are correct and the `bcryptjs` library works as expected.
 * 
 * Known faults:
 *   - No known faults identified at this time.
 */


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