import qz from "qz-tray";

qz.api.setPromiseType(function (resolver) {
  return new Promise(resolver);
});

export const connectPrinter = async () => {
  try {
    if (!qz.websocket.isActive()) {
      await qz.websocket.connect();
    }
  } catch (err) {
    console.error("Connection error:", err);
  }
};

export const findPrinters = async () => {
  return await qz.printers.find(); // list of printers
};

export const printOrder = async (order, selectedPrinter) => {
  try {
    const receipt = formatOrderText(order);

    await connectPrinter();

    const config = qz.configs.create(selectedPrinter); // printer name
    const data = [{ type: "raw", format: "plain", data: receipt }];

    await qz.print(config, data);
  } catch (err) {
    console.error("Printing error:", err);
  }
};

const formatOrderText = (order) => {
  let text = "**** NEW ORDER ****\n\n";
  text += `Name: ${order.address.firstName} ${order.address.lastName}\n`;
  text += `Phone: ${order.address.phone}\n`;
  text += `Address: ${order.address.houseNo}, ${order.address.street}, ${order.address.zipCode}\n\n`;

  order.items.forEach((item) => {
    text += `- ${item.name} x ${item.quantity}\n`;
    if (item.extras?.length) {
      item.extras.forEach(extra => {
        text += `   • ${extra.name} x ${extra.quantity}\n`;
      });
    }
    if (item.comment) text += `   ✎ ${item.comment}\n`;
  });

  text += `\nTotal: $${order.amount}.00\n`;
  text += `----------------------\n\n`;
  return text;
};
