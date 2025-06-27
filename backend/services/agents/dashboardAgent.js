import { Class, Course, Client, Order, Payment,Attendance } from '../../models/index.js';
  
  
  async function getRevenueMetrics() {
    const [totalRevenue, outstandingPayments] = await Promise.all([
      Payment.aggregate([
        { $match: { status: 'success' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Order.aggregate([
        { $match: { status: 'pending' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ])
    ]);
    
    return {
      revenue: totalRevenue[0]?.total || 0,
      outstanding: outstandingPayments[0]?.total || 0
    };
  }
  
  async function getClientStats() {
    const [active, inactive, newClients] = await Promise.all([
      Client.countDocuments({ status: 'active' }),
      Client.countDocuments({ status: 'inactive' }),
      Client.countDocuments({ 
        enrollmentDate: { 
          $gte: new Date(new Date().setDate(new Date().getDate() - 30)) 
        }
      })
    ]);
    
    return { active, inactive, newClients };
  }
  
  async function getServiceAnalytics() {
    const [popularCourses, completionRates] = await Promise.all([
      Course.aggregate([
        { $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'items.courseId',
          as: 'orders'
        }},
        { $project: {
          name: 1,
          enrollmentCount: { $size: '$orders' }
        }},
        { $sort: { enrollmentCount: -1 } },
        { $limit: 3 }
      ]),
      Class.aggregate([
        { $match: { status: 'completed' } },
        { $lookup: {
          from: 'attendances',
          localField: '_id',
          foreignField: 'classId',
          as: 'attendances'
        }},
        { $project: {
          name: 1,
          completionRate: {
            $divide: [
              { $size: { $filter: {
                input: '$attendances',
                as: 'att',
                cond: { $eq: ['$$att.status', 'present'] }
              }}},
              { $size: '$attendances' }
            ]
          }
        }}
      ])
    ]);
    
    return { popularCourses, completionRates };
  }
  
  async function getAttendanceReports() {
    return await Attendance.aggregate([
      { $group: {
        _id: '$classId',
        total: { $sum: 1 },
        present: { $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } }
      }},
      { $lookup: {
        from: 'classes',
        localField: '_id',
        foreignField: '_id',
        as: 'class'
      }},
      { $unwind: '$class' },
      { $project: {
        className: '$class.courseId.name',
        attendanceRate: { $divide: ['$present', '$total'] }
      }}
    ]);
  }
  
  
  export default async function dashboardAgent(query) {
    try {
      
      if (query.toLowerCase().includes('revenue') || 
          query.toLowerCase().includes('income')) {
        const { revenue, outstanding } = await getRevenueMetrics();
        return `Revenue Metrics:\n` +
               `- Total Revenue: $${revenue.toFixed(2)}\n` +
               `- Outstanding Payments: $${outstanding.toFixed(2)}`;
      }
  
      
      else if (query.toLowerCase().includes('client') || 
               query.toLowerCase().includes('customer')) {
        const { active, inactive, newClients } = await getClientStats();
        return `Client Insights:\n` +
               `- Active Clients: ${active}\n` +
               `- Inactive Clients: ${inactive}\n` +
               `- New Clients (last 30 days): ${newClients}`;
      }
  
      
      else if (query.toLowerCase().includes('service') || 
               query.toLowerCase().includes('course')) {
        const { popularCourses, completionRates } = await getServiceAnalytics();
        
        let response = "Service Analytics:\n";
        response += "\nTop Courses:\n" + 
          popularCourses.map(c => `- ${c.name}: ${c.enrollmentCount} enrollments`).join('\n');
        
        response += "\n\nCompletion Rates:\n" +
          completionRates.map(c => `- ${c.name}: ${(c.completionRate * 100).toFixed(1)}%`).join('\n');
        
        return response;
      }
  
      
      else if (query.toLowerCase().includes('attendance')) {
        const reports = await getAttendanceReports();
        return "Attendance Reports:\n" +
          reports.map(r => 
            `- ${r.className}: ${(r.attendanceRate * 100).toFixed(1)}%`
          ).join('\n');
      }
  
      
      return "I can provide analytics on:\n" +
             "- Revenue metrics\n" +
             "- Client insights\n" +
             "- Service analytics\n" +
             "- Attendance reports";
      
    } catch (error) {
      console.error("Dashboard error:", error);
      return "Sorry, I encountered an error processing your request.";
    }
  }