const express = require('express')
const cors = require('cors');
const dotenv = require("dotenv")
const mongoose = require('mongoose')
const bodyParser = require("body-parser")
const app = express()
const productRouter = require('./routes/productRoute')
const authRouter = require('./routes/authRoute')
const userRouter = require('./routes/userRoute')
const cartRouter = require('./routes/cartRoute')
const ordersRouter = require('./routes/ordersRoute')
const favoriteRouter = require('./routes/favRoute');
const paymentRoutes = require("./routes/paymentRoute");
const orderRoutes = require("./routes/ordersRoute")
const imageRoutes = require("./routes/imageRoute")
const port = 3000

const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Set the destination directory for uploads

dotenv.config()
mongoose.connect(process.env.MONGO_URL).then(() => console.log("DB Connected")).catch((err) => console.log(err))

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }))

app.use('/api/products', productRouter)
app.use('/api/user', authRouter)
app.use('/api/useroperations', userRouter)
app.use('/api/cart', cartRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/favorites', favoriteRouter);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/search", imageRoutes)


app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${process.env.PORT}!`))
