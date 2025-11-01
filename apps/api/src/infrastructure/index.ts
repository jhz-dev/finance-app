import { createServer } from "./server";

const port = process.env.PORT || 3000;

const app = createServer();

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
