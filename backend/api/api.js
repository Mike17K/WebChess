import { validateUser, addUser, deleteUser } from '../models/mysql/db_functions.mjs';

export async function test(req, res) {
    console.log("test");
    res.json({
        res: "ok"
    });
}
