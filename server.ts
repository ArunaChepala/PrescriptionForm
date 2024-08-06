import express, { Request, Response } from 'express';
import mysql, { Pool, PoolConnection } from 'mysql2';
import cors from 'cors';

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Enable CORS for all origins (you can configure as needed)

const pool: Pool = mysql.createPool({        
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '', // Add your MySQL password here
  database: 'hospital',
  port: 3306,
});

// Connect to MySQL database
pool.getConnection((err, connection: PoolConnection) => {         //methodobjs
  if (err) {
    console.error('Error connecting to the database:', err);
    throw err; // Ensure to handle or throw the error appropriately
  }
  console.log('Connected to the database');
  connection.release(); // Release the connection
});

// POST endpoint for submitting form data
app.post('/submit', (req: Request, res: Response) => {
  const { Firstname, Lastname, Contactnumber, Issue1, Issue2, n2, Date, Physiciansignature } = req.body as {
    Firstname: string;
    Lastname: string;
    Contactnumber: string;
    Issue1: string;
    Issue2: string;
    n2: string;
    Date: string;
    Physiciansignature: string;
  };

  if (!Firstname || !Lastname || !Contactnumber || !Date || !Physiciansignature) {
    return res.status(400).send('Missing required fields');
  }

  const query = 'INSERT INTO prescriptionform (Firstname, Lastname, Contactnumber, Issue1, Issue2, n2, Date, Physiciansignature) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  pool.query(query, [Firstname, Lastname, Contactnumber, Issue1, Issue2, n2, Date, Physiciansignature], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send('Error storing data');
    }
    console.log('Form data submitted successfully!');
    res.send('Form data submitted successfully!');
  });
});

// PUT endpoint for updating form data
app.put('/update/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { Firstname, Lastname, Contactnumber, Issue1, Issue2, n2, Date, Physiciansignature } = req.body;

  const query = 'UPDATE prescriptionform SET Firstname=?, Lastname=?, Contactnumber=?, Issue1=?, Issue2=?, n2=?, Date=?, Physiciansignature=? WHERE id=?';
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting MySQL connection:', err);
      return res.status(500).send('Error updating data');
    }

    connection.query(query, [Firstname, Lastname, Contactnumber, Issue1, Issue2, n2, Date, Physiciansignature, id], (err, result) => {
      connection.release(); // Release the connection
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).send('Error updating data');
      }
      console.log('Form data updated successfully!');
      res.send('Form data updated successfully!');
    });
  });
});

// DELETE endpoint for deleting form data
app.delete('/delete/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  const query = 'DELETE FROM prescriptionform WHERE id=?';
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting MySQL connection:', err);
      return res.status(500).send('Error deleting data');
    }

    connection.query(query, [id], (err, result) => {
      connection.release(); // Release the connection
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).send('Error deleting data');
      }
      console.log('Form data deleted successfully!');
      res.status(200).send('Form data deleted successfully');
    });
  });
});

// GET endpoint to retrieve all form data
app.get('/data', (req: Request, res: Response) => {
  const query = 'SELECT * FROM prescriptionform';
  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send('Error retrieving data');
    }
    res.json(results);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Node API app running on port ${PORT}`);
});
