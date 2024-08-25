import express from 'express';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import jsonServer from 'json-server';


const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();
const port = 3001;


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();
app.use('/api', jsonServer.rewriter({ '/api/*': '/$1' }));
app.use('/api', middlewares);
app.use('/api', router);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
