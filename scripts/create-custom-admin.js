const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local to avoid dependency issues
const envPath = path.join(process.cwd(), '.env.local');
let MONGODB_URI = '';
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/DATABASE_URL=["']?(.+?)["']?(\s|$)/);
    if (match) MONGODB_URI = match[1];
}

if (!MONGODB_URI) {
    MONGODB_URI = 'mongodb://localhost:27017/saudi_horizon';
}

async function createCustomAdmin() {
    if (!MONGODB_URI) {
        console.error('Error: DATABASE_URL not found in .env.local');
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const email = 'elite.admin@saudihost.com';
        const password = 'SaudiHorizonElite2025!';
        const name = 'Elite Operator';

        // Use the actual User schema if possible, otherwise define a compatible one
        const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
            email: { type: String, required: true, unique: true },
            password: { type: String, required: true },
            role: { type: String, default: 'user' },
            profile: { name: String },
            refreshToken: String
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

        console.log('\n--- Elite Admin Credentials ---');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log('-------------------------------\n');

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createCustomAdmin();
