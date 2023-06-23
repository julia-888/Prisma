const express = require("express");
const app = express();
const cors = require("cors");
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient();

app.use(cors());

app.use(express.json());

app.get("/", async (req, res) => {
  const allUsers = prisma.user.findMany();
  res.json(allUsers);
});

app.post("/", async (req, res) => {
  const newUser = await prisma.user.create({ data: req.body });
  res.json(newUser);
});

app.put("/:id", async (req, res) => {
  const id = req.params.id;
  const newAge = req.body.age;
  const updatedUser = await prisma.user.update({ 
    where: { id: parseInt(id) },
    data: { age: newAge },
  });
  res.json(updatedUser);
});

app.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const deletedUser = await prisma.user.delete({ 
    where: { id: parseInt(id) },
  });
  res.json(deletedUser);
});

app.post("/house", async (req, res) => {
  const newHouse = await prisma.house.create({ data: req.body });
  res.json(newHouse);
});

app.get("/house", async (req, res) => {
  const address = req.params.address;
  const allHouses = await prisma.house.findUnique({
    where: {
      address,
    },
    include: {
      owner: true,
      builtBy: true,
    },
  });
  res.json(allHouses)
});

app.post("/house/many", async (req, res) => {
  const newHouses = await prisma.house.createMany({ data: req.body });
  res.json(newHouses);
})

app.get("/house/withFilters", async (req, res) => {
  const filteredHouses = await prisma.house.findMany({
    where: {
      wifiPassword: {
        not: null,
      },
      owner: {
        age: {
          gte: 22,
        },
      },
      orderBy: [
        {
          owner: {
            firstName,
          },
        },
      ],
      include: {
        owner: true,
        builtBy: true,
      },
    },
  });
  res.json(filteredHouses);
})

app.listen(3001, () => console.log(`Server is running on port ${3001}`));