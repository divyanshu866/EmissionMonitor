import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Shared connection configuration
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true,
    ca: `-----BEGIN CERTIFICATE-----
MIIEQTCCAqmgAwIBAgIUFp4vR7EXMur/3tnlCtX1NiOLAtUwDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvZDQ0NmVlZGItOTVjMC00N2ExLTg3OGQtY2IyNzNlYjEy
NDU0IFByb2plY3QgQ0EwHhcNMjQxMjEwMDYzMzQ2WhcNMzQxMjA4MDYzMzQ2WjA6
MTgwNgYDVQQDDC9kNDQ2ZWVkYi05NWMwLTQ3YTEtODc4ZC1jYjI3M2ViMTI0NTQg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBAMx1QoF3
ZzRDwOahTuEqR1+OwBmp8zxPOiaDThjJXCMkQjqdeRiAaCbhCZU4wv9uppA2I9mj
Ksa/qVBad+pR4X9ZXuw5KcPxLSpY9ZPhVN0qb9U5FNbLIs3C329CtqFx6m84LqWY
pqbpRyI/GYA4a3KWOEM7AGok52wWEyJM67pzyHra520Cq+N0NFuuhLkeD6C5caSz
jG6FLMmQ4tD8rwu/nrFrcX+PKkeDDPpizfh1JZpIdp393tKFFTEqsNBbh60mnrbv
j2GeU05TG/G5Uliqt9kTjT2HHhSy/7/+tkyOBRBF9w2JkMi0+TcecVFzjfKAsq2o
p8530ae/eFKcDBdh/oNpPVepai3AFX7PCxIFQ5xo/Fqn0hu+NG9UD4jeDb8MAOw6
MtQwiaQvLDV0iViiCodDTNQ1IErW/ETuN+r+s5BM4ne3JmKi+ojtat+ogyJ0QHFt
9PaV9utyItmS281/iB76yl1o8qJqmz3SMRf1OwYqciPlNUPBoHuwZqF7YQIDAQAB
oz8wPTAdBgNVHQ4EFgQU45cMof27kFrK28s1D2MdUqFZzTAwDwYDVR0TBAgwBgEB
/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBAK8ON1/EotSxh0p9
ch2zscbtD/e26eECMqNfSEbQroYE2BHzlxTlslZahOcf0wkJerCCtrcWRUTJfClz
PZSaGjH3Ql+4akHYg8IWfLI/XJzN5EMDHGb12OYVeSnqEytOYH7gXDUQH1JtT9px
YYk1sApdEbuurfoYBtFtU0/BNPTA+qnpnC84gBBrn7vD2x2cTFe+tsVebjsCh/IV
xVRViOyzl3lX2aZHTEq/XuAteb8RlLsqeDCqhcK04oH7ntj3bYe3P1EAyA2CYWPA
CGDnKbpnADW7RAREPrOOPSDOBFw4GX1sOrjHxWou9B+5mr5I5Ygt9YIA5laMVI8x
+bW9BfE27OCfAKdD2vAAAp6l7I7lIz0w7LzLu2q0Xs/sIoL7yCgS3onjvX0EoWAp
vbdXqzmWXoO3ZgnxUyk7lxqlb7DNGKIS6qy9JcJY7q5DzT6b0BkETL8IVI0eJYAU
Cq1EttvDL29pSNvI5VSgyaGMTLZE6SL+NU+66AwTzIEN4YSLmA==
-----END CERTIFICATE-----`,
  },
  connectTimeout: 10000, // 10 seconds timeout
};

export async function POST(request) {
  let connection;
  try {
    // const authHeader = request.headers.get("authorization");
    const apiKey = process.env.API_KEY; // Bearer <token>

    if (!apiKey || apiKey !== process.env.API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    connection = await mysql.createConnection(dbConfig);

    // Using TRUNCATE instead of DELETE for better performance
    await connection.execute("TRUNCATE TABLE metrics");

    return NextResponse.json(
      { message: "Metrics table reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("TRUNCATE error:", error);
    return NextResponse.json(
      { error: "Failed to reset metrics" },
      { status: 500 }
    );
  } finally {
    if (connection) await connection.end();
  }
}
