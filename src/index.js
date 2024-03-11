const { default: axios } = require("axios");
const server = require("./app.js");
const { conn } = require("./database.js");
require("dotenv").config();

const port = process.env.PORT || 3001;

conn.sync({ force: false }).then(() => {
  server.listen(port, async () => {
    try {
      //______________________________________________________________
      // Carga de datos cuando levanta el servidor
      const superAdminData = require("./superAdmin.json");
      for (const superAdmin of superAdminData) {
        await axios.post(`http://localhost:${port}/users`, superAdmin);
      }
      //______________________________________________________________

      console.log(`Server listening on port: ${port}`);
    } catch (error) {
      console.error(`Error on port: ${port}`, error);
    }
  });
});
