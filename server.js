const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 5000; // You can change this to your desired port

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB setup (replace 'your-mongodb-connection-string' with your actual MongoDB connection string)
mongoose.connect('mongodb+srv://root:root@cluster0.eax6izi.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.log('Error connecting to MongoDB:', err));

// Employee Schema with more details
const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
});

const Employee = mongoose.model('Employee', employeeSchema);

// API endpoints
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch employees.' });
  }
});

app.post('/api/employees', async (req, res) => {
  try {
    const { name, position, email, phone, address } = req.body;
    const newEmployee = new Employee({ name, position, email, phone, address });
    await newEmployee.save();
    res.json(newEmployee);
  } catch (err) {
    res.status(500).json({ error: 'Unable to add employee.' });
  }
});

app.put('/api/employees/:id', async (req, res) => {
  try {
    const { name, position, email, phone, address } = req.body;
    const employee = await Employee.findByIdAndUpdate(req.params.id, { name, position, email, phone, address }, { new: true });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: 'Unable to update employee.' });
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  try {
    await Employee.findByIdAndRemove(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Unable to delete employee.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
