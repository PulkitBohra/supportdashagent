import {
    Client, Course, Class, Order, Payment, Attendance
  } from '../../models/index.js';
  
  class MongoDBTool {
    name = "mongodb_tool";
    description = "Tool for querying MongoDB database";
    constructor() {
      this.models = {
        Client, Course, Class, Order, Payment, Attendance
      };
    }
  
    async query(collection, query, options = {}) {
      if (!this.models[collection]) {
        throw new Error(`Collection ${collection} not found`);
      }
  
      try {
        let result;
        if (options.aggregate) {
          result = await this.models[collection].aggregate(query);
        } else if (query._id) {
          result = await this.models[collection].findById(query._id);
        } else {
          result = await this.models[collection].find(query);
        }
  
        return JSON.stringify(result);
      } catch (error) {
        console.error('MongoDB query error:', error);
        return `Error querying ${collection}: ${error.message}`;
      }
    }
  
    async count(collection, query = {}) {
      if (!this.models[collection]) {
        throw new Error(`Collection ${collection} not found`);
      }
  
      try {
        const count = await this.models[collection].countDocuments(query);
        return count.toString();
      } catch (error) {
        console.error('MongoDB count error:', error);
        return `Error counting documents in ${collection}: ${error.message}`;
      }
    }
  }
  
  export default MongoDBTool;