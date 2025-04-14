import pg from 'pg';
import prompt from 'prompt';

const { Client } = pg;
const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_0pgwJMCOrht1@ep-frosty-fire-a94nhe0n-pooler.gwc.azure.neon.tech/neondb?sslmode=require'
});

async function insertStudent({ first_name, last_name, mark, email, phone_number }) {
  try {
    await client.connect();

    const query = `
      INSERT INTO students (first_name, last_name, mark, email, phone_number)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const values = [first_name, last_name, mark, email, phone_number];
    const result = await client.query(query, values);
    console.log("Student added:", result.rows[0]);

    await client.end();
  } catch (err) {
    console.error("Error inserting student:", err.message);
    await client.end();
  }
}

prompt.start();
prompt.get([
  { name: "first_name" },
  { name: "last_name" },
  { name: "mark", type: "number" },
  { name: "email" },
  { name: "phone_number" }
], (err, result) => {
  if (err) {
    console.error("Input error:", err);
    return;
  }

  insertStudent(result);
});
