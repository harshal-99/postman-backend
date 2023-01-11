import app from "./src/app.js";
import http from "http";
import {PORT} from "./src/utils/config.js";


http.createServer(app).listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
})
