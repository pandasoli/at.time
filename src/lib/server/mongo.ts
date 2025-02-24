import mongoose from 'mongoose'


const uri = Bun.env.MONGODB_URI || 'mongodb://localhost:27017'


export const connectDb = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri)
    console.log('Connected to MongoDB with Mongoose')
  }

  return mongoose.connection
}
