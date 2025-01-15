import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        // Load environment variables
        const mongoURI = process.env.MONGO_URI

        // Connect to MongoDB
        await mongoose.connect(mongoURI)
        console.log('MongoDB connected...')
    } catch (error) {
        console.error('Database connection error:', error.message)
        process.exit(1)
    }
}

export default connectDB