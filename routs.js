import express from "express";
import pool from "./db.js";

const userRouter = express.Router();

userRouter.get("/users",async (req,res)=>{
    try{
        const result = await pool.query(
            "SELECT * FROM users"
        );
        res.status(200).json(result.rows);
    }catch(err){
        throw new Error(`Error ${err}`);
    }
});

userRouter.post("/users", async (req, res) => {
  const { name, surname } = req.body;
  try {
    const checker = await pool.query(
        `SELECT * FROM users WHERE name =$1 AND surname =$2`,[name,surname]
    )
    if(checker.rowCount > 0){
        return res.status(409).json({error: "User already exist"})
    }
    const result = await pool.query(
      "INSERT INTO users (name, surname) VALUES ($1, $2) RETURNING *",
      [name, surname]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});



userRouter.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, surname } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users SET name = $1, surname = $2 WHERE id = $3 RETURNING *`,
      [name, surname, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json( {message : `User with ID ${id} updated successfully`});
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


userRouter.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM users WHERE id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default userRouter;