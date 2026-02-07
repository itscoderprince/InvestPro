import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple .env.local parser to avoid 'dotenv' dependency
const loadEnv = () => {
    const envPath = path.resolve(__dirname, '../.env.local');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
            if (match) {
                const key = match[1];
                let value = match[2] || '';
                if (value.length > 0 && value.startsWith('"') && value.endsWith('"')) {
                    value = value.substring(1, value.length - 1);
                }
                process.env[key] = value;
            }
        });
        console.log('📝 Loaded environment variables from .env.local');
    }
};

loadEnv();

import User from '../models/User.js';
import Index from '../models/Index.js';
import PlatformSettings from '../models/PlatformSettings.js';
import ActivityLog from '../models/ActivityLog.js';
import Ticket from '../models/Ticket.js';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env.local');
    process.exit(1);
}

const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

const seedData = async () => {
    try {
        console.log('⏳ Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // 1. Clear existing data
        console.log('🧹 Clearing existing data...');
        await User.deleteMany({});
        await Index.deleteMany({});
        await PlatformSettings.deleteMany({});
        await ActivityLog.deleteMany({});
        await Ticket.deleteMany({});

        // 2. Seed Platform Settings
        console.log('⚙️ Initializing Platform Settings...');
        await PlatformSettings.initDefaults();

        // 3. Seed Admin & Users
        console.log('👤 Seeding Users...');
        const hashedPassword = await bcrypt.hash('Password@123', 10);

        const users = [
            {
                name: 'System Administrator',
                email: 'admin@investpro.com',
                password: hashedPassword,
                phone: '9876543210',
                role: 'admin',
                kycStatus: 'approved',
                isEmailVerified: true,
                isActive: true
            },
            {
                name: 'John Doe',
                email: 'user@test.com',
                password: hashedPassword,
                phone: '9876543211',
                role: 'user',
                kycStatus: 'approved',
                isEmailVerified: true,
                isActive: true
            },
            {
                name: 'Jane Smith',
                email: 'investor@test.com',
                password: hashedPassword,
                phone: '9876543212',
                role: 'user',
                kycStatus: 'pending',
                isEmailVerified: true,
                isActive: true
            }
        ];

        const seededUsers = await User.insertMany(users);
        const adminUser = seededUsers.find(u => u.role === 'admin');
        const regularUser = seededUsers.find(u => u.role === 'user' && u.email === 'user@test.com');

        // 4. Seed Indices
        console.log('📈 Seeding Indices...');
        const indices = [
            {
                name: 'Sovereign Core',
                description: 'Baseline volatility protection using bank-to-bank settlement proofs and premium debt instruments. This index focuses on capital preservation while providing steady returns.',
                shortDescription: 'Institutional-grade volatility protection and premium debt instruments.',
                minInvestment: 5000,
                currentReturnRate: 4.25,
                category: 'finance',
                riskLevel: 'low',
                icon: 'Shield',
                color: '#3b82f6',
                sortOrder: 1,
                features: ['Capital Protection', 'Weekly Settlement', 'Low Volatility'],
                isActive: true
            },
            {
                name: 'Blue Chip Tech',
                description: 'High-growth technology portfolio focusing on market leaders in AI, Cloud, and Semiconductors. Aggressive growth seeking with moderate volatility.',
                shortDescription: 'Strategic exposure to top-tier technology and infrastructure market leaders.',
                minInvestment: 10000,
                currentReturnRate: 4.85,
                category: 'technology',
                riskLevel: 'medium',
                icon: 'Activity',
                color: '#10b981',
                sortOrder: 2,
                features: ['AI Exposure', 'Global Growth', 'Tech Innovation'],
                isActive: true
            },
            {
                name: 'Tactical Commodity',
                description: 'Dynamic exposure to key essential commodities including energy, precious metals, and agricultural products. Designed to hedge against inflation.',
                shortDescription: 'Inflation-resistant dynamic exposure to global essential commodities.',
                minInvestment: 7500,
                currentReturnRate: 4.15,
                category: 'other',
                riskLevel: 'medium',
                icon: 'PieChart',
                color: '#8b5cf6',
                sortOrder: 3,
                features: ['Inflation Hedge', 'Resource Diversity', 'Global Supply Exposure'],
                isActive: true
            },
            {
                name: 'Health Yield',
                description: 'Focused on established pharmaceutical and medical technology giants providing essential services. Offers resilient performance across market cycles.',
                shortDescription: 'Resilient pharmaceutical and medical technology portfolio.',
                minInvestment: 7500,
                currentReturnRate: 3.75,
                category: 'healthcare',
                riskLevel: 'low',
                icon: 'Activity',
                color: '#ec4899',
                sortOrder: 4,
                features: ['Stable Dividends', 'Defensive Assets', 'Healthcare Megatrends'],
                isActive: true
            },
            {
                name: 'Energy Pulse',
                description: 'A mix of traditional energy giants and emerging renewable energy leaders. Capitalizes on the global energy transition.',
                shortDescription: 'Diversified exposure to global energy transition and renewable leaders.',
                minInvestment: 5000,
                currentReturnRate: 4.5,
                category: 'energy',
                riskLevel: 'high',
                icon: 'Activity',
                color: '#f59e0b',
                sortOrder: 5,
                features: ['Energy Transition', 'Infrastructure Play', 'High Yield'],
                isActive: true
            }
        ];

        const indicesWithSlugs = indices.map(idx => ({
            ...idx,
            slug: generateSlug(idx.name)
        }));

        await Index.insertMany(indicesWithSlugs);

        // 5. Seed Activity Logs
        console.log('📝 Seeding Activity Logs...');
        const logs = [
            {
                userId: regularUser._id,
                action: 'login',
                description: 'User logged in successfully',
                status: 'success'
            },
            {
                userId: regularUser._id,
                action: 'profile_update',
                description: 'Updated phone number',
                status: 'success'
            },
            {
                userId: adminUser._id,
                action: 'login',
                description: 'Admin logged in successfully',
                status: 'success'
            }
        ];
        await ActivityLog.insertMany(logs);

        // 6. Seed Tickets
        console.log('🎫 Seeding Tickets...');
        const tickets = [
            {
                userId: regularUser._id,
                subject: 'Help with KYC',
                description: 'I am unable to upload my PAN card photo. It says file too large.',
                category: 'kyc',
                priority: 'medium',
                status: 'open'
            }
        ];
        await Ticket.insertMany(tickets);

        console.log('✨ Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
