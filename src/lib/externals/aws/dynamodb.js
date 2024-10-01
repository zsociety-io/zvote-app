import AWS from "aws-sdk";


AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const docClient = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const dynamoDB = new AWS.DynamoDB({
  apiVersion: '2012-08-10',
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});


export async function dynamodb_get(tablename, keydic) {
  const params = {
    TableName: tablename,
    Key: keydic
  };
  const aws_rep = await docClient.get(params).promise();

  if (!("Item" in aws_rep))
    return null
  else
    return aws_rep.Item;
}


export async function dynamodb_delete(tablename, keydic, return_exists) {
  const params = {
    TableName: tablename,
    Key: keydic
  };
  if (return_exists)
    params.ReturnValues = 'ALL_OLD'
  return await docClient.delete(params).promise();
}


export async function dynamodb_update(tablename, keydic, attib_update) {
  const update_expr = (
    "SET "
    + Object.keys(attib_update).map(
      (key) => `#${key}=:${key}`
    ).join(",")
  );
  const update_expr_attrib_values = Object.fromEntries(
    Object.keys(attib_update).map(
      (key) => [`:${key}`, attib_update[key]]
    )
  );
  const update_expr_attrib_names = Object.fromEntries(
    Object.keys(attib_update).map(
      (key) => [`#${key}`, key]
    )
  );
  const params = {
    "TableName": tablename,
    Key: keydic,
    UpdateExpression: update_expr,
    ExpressionAttributeValues: update_expr_attrib_values,
    ExpressionAttributeNames: update_expr_attrib_names,
    ReturnValues: "UPDATED_NEW"
  }
  return await docClient.update(params).promise();
}


export async function dynamodb_subkey_update(
  tablename, keydic, subkey, attib_update
) {
  const update_expr = (
    "SET "
    + Object.keys(attib_update).map(
      (key) => {
        return `#${subkey}.#a${key}=:b${key}`;
      }
    ).join(",")
  );
  const update_expr_attrib_values = Object.fromEntries(
    Object.keys(attib_update).map(
      (key) => [`:b${key}`, attib_update[key]]
    )
  );
  const update_expr_attrib_names = Object.fromEntries(
    Object.keys(attib_update).map(
      (key) => [`#a${key}`, key]
    )
  );
  update_expr_attrib_names[`#${subkey}`] = subkey;

  const params = {
    "TableName": tablename,
    Key: keydic,
    UpdateExpression: update_expr,
    ExpressionAttributeValues: update_expr_attrib_values,
    ExpressionAttributeNames: update_expr_attrib_names,
    ReturnValues: "UPDATED_NEW"
  }
  return await docClient.update(params).promise();
}


export async function dynamodb_delete_attributes(
  tablename,
  keydic,
  attibutes
) {
  const update_expr = (
    "REMOVE "
    + attibutes.map(
      (key) => `#${key}`
    ).join(",")
  );
  const update_expr_attrib_names = Object.fromEntries(
    attibutes.map(
      (attibute) => [`#${attibute}`, attibute]
    )
  );
  const params = {
    "TableName": tablename,
    Key: keydic,
    UpdateExpression: update_expr,
    ExpressionAttributeNames: update_expr_attrib_names,
    ReturnValues: "UPDATED_OLD"
  }
  return await docClient.update(params).promise();
}


export async function dynamodb_scan(tablename, scan_parameters) {
  const params = {
    ...scan_parameters,
    TableName: tablename
  };
  const scanResults = [];
  let items = [];
  do {
    items = await docClient.scan(params).promise();
    items.Items.forEach((item) => {
      scanResults.push(item)
    });
    params.ExclusiveStartKey = items.LastEvaluatedKey;
  } while (typeof items.LastEvaluatedKey !== "undefined");
  return scanResults;
};


export async function dynamodb_create_table(tablename, key_name, key_type) {
  const params = {
    TableName: tablename,
    KeySchema: [
      {
        AttributeName: key_name,
        KeyType: 'HASH'
      },
    ],
    AttributeDefinitions: [
      {
        AttributeName: key_name,
        AttributeType: key_type
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  };
  await dynamoDB.createTable(params).promise();

  let table = null;
  do {
    table = await dynamodb_describe_table(tablename);
  }
  while (table.TableStatus !== "ACTIVE");

  return table;
}


export async function dynamodb_describe_table(tablename) {
  const params = {
    TableName: tablename
  };
  const table = await dynamoDB.describeTable(params).promise();
  return table.Table;
}


export async function dynamodb_truncate(tablename) {
  const [
    rows,
    table_data
  ] = await Promise.all([
    dynamodb_scan(tablename),
    dynamodb_describe_table(tablename)
  ]);
  const primary_key = table_data.AttributeDefinitions[0].AttributeName;

  const to_exec = [];
  for (const row of rows) {
    to_exec.push(
      dynamodb_delete(
        tablename,
        { [primary_key]: row[primary_key] }
      )
    );
  }

  await Promise.all(to_exec);
}