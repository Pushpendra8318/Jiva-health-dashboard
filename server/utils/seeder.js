const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config();

const User = require('../models/User');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const FamilyMember = require('../models/FamilyMember');

mongoose.connect(process.env.MONGO_URI);

const seedData = async () => {
  try {
    await User.deleteMany();
    await Order.deleteMany();
    await Payment.deleteMany();
    await FamilyMember.deleteMany();

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@healthcare.com',
      password: 'admin123',
      role: 'Admin',
      isAdmin: true,
      status: 'Active',
      userType: 'Prime User',
      isPrime: true,
    });

    // Create regular users
    const users = await User.create([
      {
        name: 'Alice Williams',
        email: 'alice.williams@email.com',
        password: 'password123',
        phone: '+91 98765 43210',
        role: 'Patient',
        userType: 'Normal User',
        status: 'Active',
        gender: 'Female',
        dateOfBirth: new Date('1990-05-15'),
        bloodGroup: 'O+',
        joinedDate: new Date('2025-01-15'),
        lastActive: new Date('2026-04-02'),
        appointmentsCount: 5,
        totalOrders: 6,
        totalBookings: 5,
        totalSpent: 24500,
        totalFamilyMembers: 10,
        addresses: [
          {
            type: 'Home',
            area: 'Flat 301, Sunshine Apartments, MG Road',
            city: 'Mumbai',
            state: 'Maharashtra',
            pinCode: '400001',
            country: 'India',
            isDefault: true,
          },
        ],
      },
      {
        name: 'Eva Lopez',
        email: 'eva.lopez@email.com',
        password: 'password123',
        phone: '+1 (555) 555-5555',
        role: 'Patient',
        userType: 'Normal User',
        status: 'Active',
        joinedDate: new Date('2025-07-18'),
        lastActive: new Date('2026-03-21'),
        appointmentsCount: 8,
        totalOrders: 3,
        totalBookings: 8,
        totalSpent: 12000,
      },
      {
        name: 'Cecilia Smith',
        email: 'cecilia.smith@email.com',
        password: 'password123',
        phone: '+1 (555) 333-3333',
        role: 'Patient',
        userType: 'Normal User',
        status: 'Inactive',
        joinedDate: new Date('2024-05-22'),
        lastActive: new Date('2025-12-30'),
        appointmentsCount: 5,
        totalOrders: 2,
        totalBookings: 5,
        totalSpent: 8500,
      },
      {
        name: 'David Kim',
        email: 'david.kim@hospital.org',
        password: 'password123',
        phone: '+1 (555) 444-4444',
        role: 'Nurse',
        userType: 'Normal User',
        status: 'Active',
        joinedDate: new Date('2022-11-03'),
        lastActive: new Date('2026-03-22'),
        appointmentsCount: 30,
        totalOrders: 5,
        totalBookings: 30,
        totalSpent: 45000,
        userType: 'Prime User',
        isPrime: true,
      },
      {
        name: 'John Doe',
        email: 'john.doe@email.com',
        password: 'password123',
        phone: '+91 98765 11111',
        role: 'Patient',
        userType: 'Prime User',
        isPrime: true,
        status: 'Active',
        joinedDate: new Date('2023-06-10'),
        lastActive: new Date('2026-05-01'),
        appointmentsCount: 12,
        totalOrders: 8,
        totalBookings: 12,
        totalSpent: 32000,
      },
    ]);

    // Create orders for Alice Williams (explicit orderNumbers to avoid race in pre-save hook)
    const aliceUser = users[0];
    const orders = await Order.create([
      {
        userId: aliceUser._id,
        orderNumber: 'ORD-0001',
        type: 'Medicine',
        items: [{ name: 'Paracetamol 500mg - 30 tablets', quantity: 1, price: 250 }],
        status: 'Delivered',
        totalAmount: 250,
        orderDate: new Date('2026-03-28'),
        deliveryDate: new Date('2026-03-30'),
      },
      {
        userId: aliceUser._id,
        orderNumber: 'ORD-0002',
        type: 'Medicine',
        items: [{ name: 'Paracetamol 500mg - 30 capsules', quantity: 1, price: 250 }],
        status: 'Delivered',
        totalAmount: 250,
        orderDate: new Date('2026-03-28'),
        deliveryDate: new Date('2026-03-30'),
      },
      {
        userId: aliceUser._id,
        orderNumber: 'ORD-0003',
        type: 'Medicine',
        items: [{ name: 'Vitamin D3 - 60 tablets', quantity: 1, price: 480 }],
        status: 'Processing',
        totalAmount: 480,
        orderDate: new Date('2026-04-01'),
      },
    ]);

    // Create payments for Alice Williams
    await Payment.create([
      {
        userId: aliceUser._id,
        type: 'Consultation Fee',
        description: 'Paracetamol 500mg - 30 tablets',
        amount: 150,
        status: 'Completed',
        method: 'UPI',
        paymentDate: new Date('2026-03-28'),
        orderId: orders[0]._id,
      },
      {
        userId: aliceUser._id,
        type: 'Lab Test',
        description: 'Paracetamol 500mg - 30 capsules',
        amount: 80,
        status: 'Completed',
        method: 'Card',
        paymentDate: new Date('2026-03-28'),
        orderId: orders[1]._id,
      },
      {
        userId: aliceUser._id,
        type: 'Medicine Order',
        description: 'Vitamin D3 - 60 tablets',
        amount: 480,
        status: 'Pending',
        method: 'Net Banking',
        paymentDate: new Date('2026-04-01'),
        orderId: orders[2]._id,
      },
    ]);

    // Create family members for Alice Williams
    const familyMembers = await FamilyMember.create([
      {
        userId: aliceUser._id,
        name: 'John Williams',
        relation: 'Son',
        phone: '+1 (555) 111-1112',
        dateOfBirth: new Date('1988-03-20'),
        gender: 'Male',
      },
      {
        userId: aliceUser._id,
        name: 'Mary Williams',
        relation: 'Mother',
        phone: '+1 (555) 222-2223',
        dateOfBirth: new Date('1965-07-10'),
        gender: 'Female',
      },
      {
        userId: aliceUser._id,
        name: 'Robert Williams',
        relation: 'Father',
        phone: '+1 (555) 333-3334',
        dateOfBirth: new Date('1962-11-25'),
        gender: 'Male',
      },
    ]);

    // Update Alice's family member count
    await User.findByIdAndUpdate(aliceUser._id, { totalFamilyMembers: familyMembers.length });

    console.log('Data seeded successfully!');
    console.log(`Admin: admin@healthcare.com / admin123`);
    process.exit(0);
  } catch (error) {
    console.error('Seeder error:', error);
    process.exit(1);
  }
};

seedData();
