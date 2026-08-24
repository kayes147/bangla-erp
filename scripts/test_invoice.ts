import { createInvoice } from "../src/actions/invoiceActions";
import { prisma } from "../src/lib/prisma";

async function run() {
  console.log("Starting test...");
  
  // Need to get a real client ID first
  const client = await prisma.client.findFirst();
  
  if (!client) {
    console.log("No client found");
    return;
  }
  
  const res = await createInvoice({
    type: "product_in",
    clientId: client.id,
    items: [{
      productName: "Test Product",
      quantity: 10,
      pricePerUnit: 50
    }],
    paidAmount: 200,
    requestedBy: "owner",
    status: "APPROVED"
  });
  
  console.log("Result:", res);
}

run();
