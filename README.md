backend/
├── controllers/
│   └── coordinadorController.js
│   └── paxController.js
│   └── hotelController.js
│   └── ... (uno por entidad)
├── models/
│   └── db.js              # conexión a la base
│   └── coordinadorModel.js
│   └── paxModel.js
├── routes/
│   └── coordinadorRoutes.js
│   └── paxRoutes.js
│   └── ...
├── middlewares/
│   └── errorHandler.js
├── app.js                 # configura express, middlewares, rutas
├── index.js               # arranca el servidor
├── .env                   # config sensible como contraseña DB
└── package.json
