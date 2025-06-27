import {
    Client, Course, Class, Order, Payment, Attendance
  } from '../models/index.js';
  
  const seedData = async () => {
    try {
     
      await Client.deleteMany({});
      await Course.deleteMany({});
      await Class.deleteMany({});
      await Order.deleteMany({});
      await Payment.deleteMany({});
      await Attendance.deleteMany({});
  
      
      const courses = [
        { name: 'Yoga Beginner', description: 'Introduction to yoga basics', duration: 8, price: 200, category: 'Yoga' },
        { name: 'Yoga Advanced', description: 'Advanced yoga techniques', duration: 8, price: 250, category: 'Yoga' },
        { name: 'Pilates Fundamentals', description: 'Core strength and flexibility', duration: 6, price: 180, category: 'Pilates' },
        { name: 'Meditation', description: 'Mindfulness and relaxation', duration: 4, price: 120, category: 'Wellness' },
        { name: 'Zumba', description: 'Dance fitness program', duration: 6, price: 150, category: 'Fitness' }
      ];
      const createdCourses = await Course.insertMany(courses);
  
      
      const classes = [
        { 
          courseId: createdCourses[0]._id, 
          instructor: 'Sarah Johnson', 
          schedule: { days: ['Mon', 'Wed'], startTime: '09:00', endTime: '10:00' },
          startDate: new Date('2025-06-25'), 
          endDate: new Date('2025-07-20'),
          maxCapacity: 15,
          room: 'Studio A'
        },
        { 
          courseId: createdCourses[1]._id, 
          instructor: 'Michael Chen', 
          schedule: { days: ['Tue', 'Thu'], startTime: '18:00', endTime: '19:30' },
          startDate: new Date('2025-06-25'), 
          endDate: new Date('2025-07-24'),
          maxCapacity: 12,
          room: 'Studio B'
        },
        { 
          courseId: createdCourses[2]._id, 
          instructor: 'Emma Wilson', 
          schedule: { days: ['Wed', 'Fri'], startTime: '07:00', endTime: '08:00' },
          startDate: new Date('2025-06-25'), 
          endDate: new Date('2025-07-12'),
          maxCapacity: 10,
          room: 'Studio C'
        },
        { 
          courseId: createdCourses[3]._id, 
          instructor: 'David Kim', 
          schedule: { days: ['Sat'], startTime: '10:00', endTime: '11:30' },
          startDate: new Date('2025-06-25'), 
          endDate: new Date('2025-07-01'),
          maxCapacity: 20,
          room: 'Meditation Room'
        },
        { 
          courseId: createdCourses[4]._id, 
          instructor: 'Lisa Rodriguez', 
          schedule: { days: ['Mon', 'Thu'], startTime: '17:00', endTime: '18:00' },
          startDate: new Date('2023-06-12'), 
          endDate: new Date('2023-07-17'),
          maxCapacity: 25,
          room: 'Main Hall'
        }
      ];
      const createdClasses = await Class.insertMany(classes);
  
      
      const clients = [
        { 
          name: 'Priya Sharma', 
          email: 'priya.sharma@example.com', 
          phone: '555-0101',
          birthday: new Date('1985-04-15'),
          address: {
            street: '123 Main St',
            city: 'Springfield',
            state: 'IL',
            zip: '62704',
            country: 'USA'
          }
        },
        { 
          name: 'James Wilson', 
          email: 'james.wilson@example.com', 
          phone: '555-0102',
          birthday: new Date('1990-08-22'),
          status: 'inactive',
          address: {
            street: '456 Oak Ave',
            city: 'Springfield',
            state: 'IL',
            zip: '62704',
            country: 'USA'
          }
        },
        { 
          name: 'Maria Garcia', 
          email: 'maria.garcia@example.com', 
          phone: '555-0103',
          birthday: new Date('1988-11-30'),
          address: {
            street: '789 Pine Rd',
            city: 'Springfield',
            state: 'IL',
            zip: '62704',
            country: 'USA'
          }
        },
        { 
          name: 'David Kim', 
          email: 'david.kim@example.com', 
          phone: '555-0104',
          birthday: new Date('1992-03-10'),
          address: {
            street: '321 Elm St',
            city: 'Springfield',
            state: 'IL',
            zip: '62704',
            country: 'USA'
          }
        },
        { 
          name: 'Emma Johnson', 
          email: 'emma.johnson@example.com', 
          phone: '555-0105',
          birthday: new Date('1987-07-18'),
          status: 'inactive',
          address: {
            street: '654 Maple Dr',
            city: 'Springfield',
            state: 'IL',
            zip: '62704',
            country: 'USA'
          }
        }
      ];
      const createdClients = await Client.insertMany(clients);
  
      
      const orders = [
        { 
          clientId: createdClients[0]._id, 
          items: [
            { classId: createdClasses[0]._id, courseId: createdCourses[0]._id, name: 'Yoga Beginner', price: 200 }
          ],
          totalAmount: 200,
          status: 'paid'
        },
        { 
          clientId: createdClients[1]._id, 
          items: [
            { classId: createdClasses[1]._id, courseId: createdCourses[1]._id, name: 'Yoga Advanced', price: 250 },
            { classId: createdClasses[2]._id, courseId: createdCourses[2]._id, name: 'Pilates Fundamentals', price: 180 }
          ],
          totalAmount: 430,
          status: 'pending'
        },
        { 
          clientId: createdClients[2]._id, 
          items: [
            { classId: createdClasses[3]._id, courseId: createdCourses[3]._id, name: 'Meditation', price: 120 }
          ],
          totalAmount: 120,
          status: 'paid'
        },
        { 
          clientId: createdClients[3]._id, 
          items: [
            { classId: createdClasses[4]._id, courseId: createdCourses[4]._id, name: 'Zumba', price: 150 }
          ],
          totalAmount: 150,
          status: 'paid'
        },
        { 
          clientId: createdClients[0]._id, 
          items: [
            { classId: createdClasses[2]._id, courseId: createdCourses[2]._id, name: 'Pilates Fundamentals', price: 180 }
          ],
          totalAmount: 180,
          status: 'pending'
        }
      ];
      const createdOrders = await Order.insertMany(orders);
  
      
      const payments = [
        { 
          orderId: createdOrders[0]._id, 
          amount: 200, 
          paymentMethod: 'credit_card',
          status: 'success'
        },
        { 
          orderId: createdOrders[2]._id, 
          amount: 120, 
          paymentMethod: 'debit_card',
          status: 'success'
        },
        { 
          orderId: createdOrders[3]._id, 
          amount: 150, 
          paymentMethod: 'bank_transfer',
          status: 'success'
        },
        { 
          orderId: createdOrders[1]._id, 
          amount: 100, 
          paymentMethod: 'credit_card',
          status: 'success'
        }
      ];
      await Payment.insertMany(payments);
  
      
      const attendanceRecords = [];
      const classDates = {
        [createdClasses[0]._id]: ['2023-06-05', '2023-06-07', '2023-06-12', '2023-06-14'],
        [createdClasses[1]._id]: ['2023-06-06', '2023-06-08', '2023-06-13', '2023-06-15'],
        [createdClasses[2]._id]: ['2023-06-07', '2023-06-09', '2023-06-14', '2023-06-16'],
        [createdClasses[3]._id]: ['2023-06-10', '2023-06-17', '2023-06-24'],
        [createdClasses[4]._id]: ['2023-06-12', '2023-06-15', '2023-06-19', '2023-06-22']
      };
  
      for (const classId in classDates) {
        const enrolledClients = createdOrders
          .filter(order => order.items.some(item => item.classId.toString() === classId))
          .map(order => order.clientId);
  
        for (const date of classDates[classId]) {
          for (const clientId of enrolledClients) {
            attendanceRecords.push({
              classId,
              clientId,
              date: new Date(date),
              status: Math.random() > 0.2 ? 'present' : 'absent'
            });
          }
        }
      }
  
      await Attendance.insertMany(attendanceRecords);
  
      console.log('Database seeded successfully!');
    } catch (error) {
      console.error('Error seeding database:', error);
    }
  };
  
  export default seedData;