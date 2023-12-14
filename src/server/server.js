import express from 'express';
// import SerialPort from 'serialport';
// import Readline from '@serialport/parser-readline';
import productsRouter from './routes/products.js';
import inventoryRouter from './routes/inventory.js'
import transactionsRouter from './routes/transactions.js'
import categoryInventoryRouter from './routes/categoryInventory.js'
import cors from 'cors';

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * TODO: api/transactions not being used at the moment. 
 * * /api/products and /api/inventory used initially but actual inventory tracking is done with categoryInventory
 */
app.use('/api/products', productsRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/categoryInventory', categoryInventoryRouter);

app.use('*', (req, res) => {
    res.status(404).send('CatchAll Error');
});

app.use((err, req, res) => {
    const defaultError = {
      log: 'Express error handler caught unknown middleware error',
      status: 500,
      message: { err: 'An error occurred.' },
    };
    const errorObj = { ...defaultError, ...err };
    console.log(errorObj.log);
    return res.status(errorObj.status).json(errorObj.message);
});

/**
 * * Connect to serial port for scale
 * TODO: Need to get specific data for Vendor Id and baudRate
 * @param VENDOR_ID Input scale VENDOR_ID into .env
 * @param BAUD_RATE Set to BAUD_RATE into .env
 * !Require Testing
 */
// const findAndConnectToScale = async () => {

//     const baudRate = parseInt(process.env.BAUD_RATE);
//     try {
//       const ports = await SerialPort.list();
//       let scalePortInfo = ports.find(port => port.vendorId === process.env.VENDOR_ID); // <--- Vendor Id in .env

//       if (scalePortInfo) {
//           console.log(`Scale found on port: ${scalePortInfo.path}`);
//           const scaleSerialPort = new SerialPort(scalePortInfo.path, { baudRate }); // <--- baudRate in .env
//           const parser = scaleSerialPort.pipe(new Readline({ delimiter: '\r\n' }));

//           parser.on('data', (data) => {
//               console.log('Data:', data.toString());
//           });
//       } else {
//           console.log('Scale not found. Please check the connection.');
//       }
//     } catch (err) {
//       console.error('Error finding scale:', err);
//     }
// };

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
//   findAndConnectToScale();
});


