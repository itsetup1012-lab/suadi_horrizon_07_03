const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/saudi_horizon';

async function createAdmin() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const email = 'admin@saudihost.com';
        const password = 'AdminPassword2025!';
        const name = 'Saudi Horizon Admin';

        // Check if user exists
        const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
            email: { type: String, required: true, unique: true },
            password: { type: String, required: true },
            role: { type: String, default: 'user' },
            profile: { name: String }
        }, { timestamps: true }));

        const existingUser = await User.findOne({ email });
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (existingUser) {
            existingUser.password = hashedPassword;
            existingUser.role = 'admin';
            existingUser.profile = { name };
            await existingUser.save();
            console.log('Admin user updated successfully');
        } else {
            const newAdmin = new User({
                email,
                password: hashedPassword,
                role: 'admin',
                profile: { name }
            });
            await newAdmin.save();
            console.log('Admin user created successfully');
        }

        console.log('\n--- Admin Credentials ---');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log('-------------------------\n');

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createAdmin();
