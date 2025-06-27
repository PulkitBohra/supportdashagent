import { Class, Course, Client, Order, Payment } from "../../models/index.js";
import mongoose from "mongoose";

// Helper: Get classes in the upcoming week
async function getCurrentWeekClasses() {
  const now = new Date();
  const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  return await Class.find({
    startDate: { $lte: oneWeekLater },
    endDate: { $gte: now },
    status: { $in: ["scheduled", "ongoing"] },
  }).populate("courseId");
}

// Helper: Fetch client by identifier
async function getClientDetails(identifier) {
  return await Client.findOne({
    $or: [
      { email: identifier },
      { phone: identifier },
      { name: { $regex: identifier, $options: "i" } },
    ],
  }).populate({
    path: "orders",
    populate: { path: "items.classId items.courseId" },
  });
}

// Helper: Fetch order by ID
async function getOrderDetails(orderId) {
  return await Order.findById(orderId)
    .populate("clientId")
    .populate("items.classId items.courseId");
}

// Helper: Fetch payment status
async function getPaymentStatus(orderId) {
  const payments = await Payment.find({ orderId });
  const order = await Order.findById(orderId);
  const paidAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = order.totalAmount - paidAmount;
  return { paidAmount, pendingAmount, payments };
}

// Helper: Create an order
async function createNewOrder(clientId, className) {
  const course = await Course.findOne({
    name: { $regex: className, $options: "i" },
  });
  if (!course) throw new Error("Course not found");

  const classObj = await Class.findOne({
    courseId: course._id,
    status: "scheduled",
  });
  if (!classObj) throw new Error("No scheduled class found");

  const order = new Order({
    clientId,
    items: [
      {
        classId: classObj._id,
        courseId: course._id,
        name: course.name,
        price: course.price,
      },
    ],
    totalAmount: course.price,
  });

  return await order.save();
}

// Helper: Create client
async function createClient({ name, email, phone }) {
  const existing = await Client.findOne({ email });
  if (existing) return existing;
  const newClient = new Client({ name, email, phone });
  return await newClient.save();
}

// Main Agent Function
export default async function supportAgent(query) {
  try {
    const lower = query.toLowerCase();

    const emailLine = query.match(/email\s*:\s*([^\s,]+)/i)?.[1];
    const phoneLine = query.match(/phone\s*:\s*(\d{10,12})/i)?.[1];
    const nameLine = query.match(/name\s*:\s*([^\s,]+)/i)?.[1];

    if (emailLine && !query.includes(emailLine)) query += ` ${emailLine}`;
    if (phoneLine && !query.includes(phoneLine)) query += ` ${phoneLine}`;
    if (nameLine && !query.includes(nameLine)) query += ` ${nameLine}`;

     // 7. Show all pending payments
     if (
        lower.includes("pending payments") ||
        lower.includes("what payments are pending")
      ) {
        const orders = await Order.find({
          status: { $in: ["pending", "partially_paid"] },
        }).populate("clientId");
        if (orders.length === 0) return "No pending payments found.";
  
        const summaries = await Promise.all(
          orders.map(async (order) => {
            const payments = await Payment.find({
              orderId: order._id,
              status: "success",
            });
            const paid = payments.reduce((sum, p) => sum + p.amount, 0);
            const due = order.totalAmount - paid;
            return `Order #${order._id} (${
              order.clientId?.name || "Unknown"
            }): Paid $${paid}, Due $${due}`;
          })
        );
  
        return "Pending Payments:\n" + summaries.join("\n");
      }

       // 6. Show all active clients
    if (lower.includes("show") && lower.includes("active clients")) {
        const clients = await Client.find({ status: "active" });
        if (clients.length === 0) return "No active clients found.";
        return (
          "Active Clients:\n" +
          clients.map((c) => `- ${c.name} (${c.email})`).join("\n")
        );
      }

       // 5. Order creation (with fallback client creation)
       if (lower.includes("create order") || lower.includes("new order")) {
        const match = query.match(/create order for (.+?) for client (.+?)(?:$|\s|email|phone|name)/i);
        if (!match) return "Please specify class and client.";
        const [_, className, clientName] = match;
      
        // Extract email, phone if present anywhere in the query
        const emailMatch = query.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i);
        const phoneMatch = query.match(/\b\d{10,12}\b/);
      
        let client = await Client.findOne({
          $or: [
            { name: { $regex: clientName.trim(), $options: "i" } },
            ...(emailMatch ? [{ email: emailMatch[0] }] : []),
            ...(phoneMatch ? [{ phone: phoneMatch[0] }] : []),
          ],
        });
      
        if (!client) {
          if (!emailMatch || !phoneMatch) {
            return `Client "${clientName}" not found.\nPlease provide email and phone like:\n"create order for Yoga Beginner client Priya Sharma priyasharma@gmail.com 9082345432"`;
          }
      
          client = await createClient({
            name: clientName.trim(),
            email: emailMatch[0],
            phone: phoneMatch[0],
          });
        }
      
        const order = await createNewOrder(client._id, className);
        return `✅ Created order #${order._id} for ${client.name} - ${className}`;
      }
      
  

    // 3. Order Status
    if (
      lower.includes("order status") ||
      lower.includes("order #") ||
      lower.includes("order id") ||
      /\b[0-9a-fA-F]{24}\b/.test(query)
    ) {
      const orderId = query.match(/\b[0-9a-fA-F]{24}\b/)?.[0];
      if (!orderId) return "Please provide a valid order ID.";
      if (!mongoose.Types.ObjectId.isValid(orderId))
        return "Invalid order ID format.";
      const order = await getOrderDetails(orderId);
      if (!order) return "Order not found in the system.";
      return `Order #${order._id}\nStatus: ${order.status}\nClient: ${
        order.clientId.name
      }\nItems: ${order.items.map((i) => i.name).join(", ")}\nTotal: $${
        order.totalAmount
      }`;
    }

    // 4. Payment Status
    if (lower.includes("payment") || lower.includes("paid")) {
      const orderId = query.match(/\b[0-9a-fA-F]{24}\b/)?.[0];
      if (!orderId) return "Please provide an order ID.";
      if (!mongoose.Types.ObjectId.isValid(orderId))
        return "Invalid order ID format.";
      const { paidAmount, pendingAmount, payments } = await getPaymentStatus(
        orderId
      );
      return `Payments for order #${orderId}:\n- Paid: $${paidAmount}\n- Pending: $${pendingAmount}\n- Transactions: ${payments.length}`;
    }

    if (
        lower.includes("classes available this week") ||
        lower.includes("what classes")
      ) {
        const classes = await getCurrentWeekClasses();
        if (classes.length === 0) return "No classes scheduled this week.";
        return classes
          .map(
            (cls) =>
              `${cls.courseId.name} with ${
                cls.instructor
              } (${cls.schedule.days.join("/")} ${cls.schedule.startTime}-${
                cls.schedule.endTime
              })`
          )
          .join("\n");
      }

   

    // 2. Client Info
    if (lower.includes("client") || lower.includes("customer")) {
        const identifier = query
          .match(/(email|phone|name)\s*(is|:)?\s*([^\?]+)/i)?.[3]
          ?.trim();
        if (!identifier) return "Please provide client email, phone, or name.";
        const client = await getClientDetails(identifier);
        if (!client) return "Client not found.";
        return `Client: ${client.name}\nEmail: ${client.email}\nPhone: ${
          client.phone
        }\nStatus: ${client.status}\nEnrollments: ${client.orders?.length || 0}`;
      }

    // Default fallback
    return "I can help with:\n- Class schedules\n- Client information\n- Order status\n- Payment details\n- Creating new orders";
  } catch (err) {
    console.error("Support error:", err);
    return "Sorry, I encountered an error processing your request.";
  }
}
