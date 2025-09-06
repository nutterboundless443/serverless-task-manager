const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const tasksTable = 'Tasks';

module.exports.createTask = async (event) => {
  const task = JSON.parse(event.body);
  const params = {
    TableName: tasksTable,
    Item: { id: task.id, name: task.name, completed: task.completed },
  };

  await dynamo.put(params).promise();
  return { statusCode: 201, body: JSON.stringify(task) };
};

module.exports.updateTask = async (event) => {
  const task = JSON.parse(event.body);
  const params = {
    TableName: tasksTable,
    Key: { id: event.pathParameters.id },
    UpdateExpression: 'set #name = :name, completed = :completed',
    ExpressionAttributeNames: { '#name': 'name' },
    ExpressionAttributeValues: { ':name': task.name, ':completed': task.completed },
    ReturnValues: 'UPDATED_NEW'
  };

  await dynamo.update(params).promise();
  return { statusCode: 200, body: JSON.stringify(task) };
};

module.exports.deleteTask = async (event) => {
  const params = {
    TableName: tasksTable,
    Key: { id: event.pathParameters.id }
  };

  await dynamo.delete(params).promise();
  return { statusCode: 204 };
};

module.exports.listTasks = async () => {
  const params = {
    TableName: tasksTable
  };

  const data = await dynamo.scan(params).promise();
  return { statusCode: 200, body: JSON.stringify(data.Items) };
};