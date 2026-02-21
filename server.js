const express = require("express");
const fileHandler = require("./modules/filehandler");

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  const employees = await fileHandler.read();
  res.render("index", { employees });
});

app.get("/add", (req, res) => {
  res.render("add");
});

app.post("/add", async (req, res) => {
  const { name, department, salary } = req.body;

  if (!name || salary < 0) {
    return res.send("Invalid Data!");
  }

  const employees = await fileHandler.read();

  const newEmployee = {
    id: Date.now(),
    name,
    department,
    salary: Number(salary)
  };

  employees.push(newEmployee);
  await fileHandler.write(employees);

  res.redirect("/");
});

app.get("/delete/:id", async (req, res) => {
  const id = Number(req.params.id);
  let employees = await fileHandler.read();

  employees = employees.filter(emp => emp.id !== id);

  await fileHandler.write(employees);
  res.redirect("/");
});

app.get("/edit/:id", async (req, res) => {
  const id = Number(req.params.id);
  const employees = await fileHandler.read();

  const employee = employees.find(emp => emp.id === id);
  res.render("edit", { employee });
});

app.post("/edit/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { name, department, salary } = req.body;

  if (!name || salary < 0) {
    return res.send("Invalid Data!");
  }

  let employees = await fileHandler.read();

  employees = employees.map(emp =>
    emp.id === id
      ? { ...emp, name, department, salary: Number(salary) }
      : emp
  );

  await fileHandler.write(employees);
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
