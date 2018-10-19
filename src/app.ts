import express from 'express';
import * as availability from './availability';

const app = express();
app.get('/availability', availability.get);

app.listen(80, () => {
  console.log('app started');
});
