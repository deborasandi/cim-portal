/*
 * Mock data shaped like QuickBooks Online API responses (Customer, Item, Term).
 * Prototype only. In Rails, this data comes from QuickBooks via the backend
 * (synced into the customers / products tables).
 * All names are fictional.
 */
window.CIM_MOCK = {
  currentCustomerId: "58",

  customers: [
    {
      Id: "58",
      DisplayName: "Summit Dental Group",
      PrimaryEmailAddr: "purchasing@summitdental.example",
      SalesTermRef: { value: "3", name: "Net 30" },
      BillAddr: { Line1: "5855 Oberlin Drive", City: "San Diego", CountrySubDivisionCode: "CA", PostalCode: "92121", Country: "United States" },
      ShipAddr: { Line1: "380 S 670 W, Ste. 150", City: "Lindon", CountrySubDivisionCode: "UT", PostalCode: "84042", Country: "United States" }
    },
    {
      Id: "61",
      DisplayName: "Blue Ridge Dental Lab",
      PrimaryEmailAddr: "orders@blueridgelab.example",
      SalesTermRef: { value: "2", name: "Net 15" },
      BillAddr: { Line1: "120 Main St", City: "Asheville", CountrySubDivisionCode: "NC", PostalCode: "28801", Country: "United States" },
      ShipAddr: { Line1: "120 Main St", City: "Asheville", CountrySubDivisionCode: "NC", PostalCode: "28801", Country: "United States" }
    },
    {
      Id: "64",
      DisplayName: "Coastal Milling Center",
      PrimaryEmailAddr: "ap@coastalmilling.example",
      SalesTermRef: { value: "3", name: "Net 30" },
      BillAddr: { Line1: "77 Harbor Blvd", City: "Tampa", CountrySubDivisionCode: "FL", PostalCode: "33602", Country: "United States" },
      ShipAddr: { Line1: "77 Harbor Blvd", City: "Tampa", CountrySubDivisionCode: "FL", PostalCode: "33602", Country: "United States" }
    },
    {
      Id: "70",
      DisplayName: "Prairie Smile Laboratories",
      PrimaryEmailAddr: "office@prairiesmile.example",
      SalesTermRef: { value: "1", name: "Due on receipt" },
      BillAddr: { Line1: "900 Grand Ave", City: "Des Moines", CountrySubDivisionCode: "IA", PostalCode: "50309", Country: "United States" },
      ShipAddr: { Line1: "900 Grand Ave", City: "Des Moines", CountrySubDivisionCode: "IA", PostalCode: "50309", Country: "United States" }
    }
  ],

  // QuickBooks Item. Category = QuickBooks product category (used as a filter)
  items: [
    { Id: "101", Sku: "MILLBOX5A_ROLAND", Name: "CS MB Roland Edition", Description: "MILLBOX 5-axis, Roland Edition", UnitPrice: 4000.0, Type: "NonInventory", Category: "MILLBOX licenses" },
    { Id: "102", Sku: "MILLBOX5A_IMES", Name: "CS MB imes-icore Edition", Description: "MILLBOX 5-axis, imes-icore Edition", UnitPrice: 4200.0, Type: "NonInventory", Category: "MILLBOX licenses" },
    { Id: "103", Sku: "MILLBOX3A_BASIC", Name: "CS MB 3-axis Basic", Description: "MILLBOX 3-axis, Basic license", UnitPrice: 2500.0, Type: "NonInventory", Category: "MILLBOX licenses" },
    { Id: "104", Sku: "MILLBOX_MAINT_12M", Name: "MILLBOX Maintenance 12 months", Description: "Software maintenance and updates, 12 months", UnitPrice: 950.0, Type: "Service", Category: "Maintenance" },
    { Id: "105", Sku: "SUM3D_DENTAL", Name: "SUM3D Dental license", Description: "SUM3D Dental CAM license", UnitPrice: 3800.0, Type: "NonInventory", Category: "SUM3D licenses" },
    { Id: "106", Sku: "MILLBOX_ADDON_IMPLANT", Name: "Implant Bars add-on", Description: "MILLBOX add-on module: implant bars", UnitPrice: 1200.0, Type: "NonInventory", Category: "Add-on modules" },
    { Id: "107", Sku: "TRAINING_REMOTE_4H", Name: "Remote training (4h)", Description: "Remote training session, 4 hours", UnitPrice: 480.0, Type: "Service", Category: "Services" },
    { Id: "108", Sku: "LICENSE_TRANSFER", Name: "License transfer", Description: "Transfer of license to a new dongle / PC", UnitPrice: 150.0, Type: "Service", Category: "Services" },
    { Id: "109", Sku: "MILLBOX5A_DGSHAPE", Name: "CS MB DGSHAPE Edition", Description: "MILLBOX 5-axis, DGSHAPE Edition", UnitPrice: 4000.0, Type: "NonInventory", Category: "MILLBOX licenses" },
    { Id: "110", Sku: "MILLBOX5A_VHF", Name: "CS MB vhf Edition", Description: "MILLBOX 5-axis, vhf Edition", UnitPrice: 4100.0, Type: "NonInventory", Category: "MILLBOX licenses" },
    { Id: "111", Sku: "MILLBOX5A_AMANN", Name: "CS MB Amann Girrbach Edition", Description: "MILLBOX 5-axis, Amann Girrbach Edition", UnitPrice: 4300.0, Type: "NonInventory", Category: "MILLBOX licenses" },
    { Id: "112", Sku: "MILLBOX5A_ZIRKON", Name: "CS MB Zirkonzahn Edition", Description: "MILLBOX 5-axis, Zirkonzahn Edition", UnitPrice: 4200.0, Type: "NonInventory", Category: "MILLBOX licenses" },
    { Id: "113", Sku: "MILLBOX5A_ROLAND_UPG", Name: "Roland Edition upgrade", Description: "Upgrade Roland Edition to the latest version", UnitPrice: 1500.0, Type: "NonInventory", Category: "Upgrades" },
    { Id: "114", Sku: "MILLBOX5A_IMES_UPG", Name: "imes-icore Edition upgrade", Description: "Upgrade imes-icore Edition to the latest version", UnitPrice: 1500.0, Type: "NonInventory", Category: "Upgrades" },
    { Id: "115", Sku: "MILLBOX3A_PRO", Name: "CS MB 3-axis Pro", Description: "MILLBOX 3-axis, Pro license", UnitPrice: 3200.0, Type: "NonInventory", Category: "MILLBOX licenses" },
    { Id: "116", Sku: "MILLBOX_MAINT_24M", Name: "MILLBOX Maintenance 24 months", Description: "Software maintenance and updates, 24 months", UnitPrice: 1800.0, Type: "Service", Category: "Maintenance" },
    { Id: "117", Sku: "SUM3D_MAINT_12M", Name: "SUM3D Maintenance 12 months", Description: "SUM3D maintenance and updates, 12 months", UnitPrice: 900.0, Type: "Service", Category: "Maintenance" },
    { Id: "118", Sku: "SUM3D_DENTAL_UPG", Name: "SUM3D Dental upgrade", Description: "Upgrade SUM3D Dental to the latest version", UnitPrice: 1400.0, Type: "NonInventory", Category: "Upgrades" },
    { Id: "119", Sku: "SUM3D_PRO", Name: "SUM3D Pro license", Description: "SUM3D Pro CAM license", UnitPrice: 5200.0, Type: "NonInventory", Category: "SUM3D licenses" },
    { Id: "120", Sku: "MILLBOX_ADDON_ABUTMENT", Name: "Custom abutments add-on", Description: "MILLBOX add-on module: custom abutments", UnitPrice: 1100.0, Type: "NonInventory", Category: "Add-on modules" },
    { Id: "121", Sku: "MILLBOX_ADDON_DENTURE", Name: "Dentures add-on", Description: "MILLBOX add-on module: dentures", UnitPrice: 1300.0, Type: "NonInventory", Category: "Add-on modules" },
    { Id: "122", Sku: "MILLBOX_ADDON_SINTER", Name: "Sintering strategies add-on", Description: "MILLBOX add-on module: sintering strategies", UnitPrice: 800.0, Type: "NonInventory", Category: "Add-on modules" },
    { Id: "123", Sku: "MILLBOX_ADDON_SIM", Name: "5-axis simulation add-on", Description: "MILLBOX add-on module: 5-axis simulation", UnitPrice: 900.0, Type: "NonInventory", Category: "Add-on modules" },
    { Id: "124", Sku: "MILLBOX_ADDON_NEST", Name: "Auto nesting add-on", Description: "MILLBOX add-on module: automatic nesting", UnitPrice: 700.0, Type: "NonInventory", Category: "Add-on modules" },
    { Id: "125", Sku: "MILLBOX_EXTRA_SEAT", Name: "Additional workstation", Description: "Additional MILLBOX workstation license", UnitPrice: 1200.0, Type: "NonInventory", Category: "MILLBOX licenses" },
    { Id: "126", Sku: "TRAINING_ONSITE_1D", Name: "On-site training (1 day)", Description: "On-site training, 1 day", UnitPrice: 1500.0, Type: "Service", Category: "Services" },
    { Id: "127", Sku: "TRAINING_REMOTE_8H", Name: "Remote training (8h)", Description: "Remote training sessions, 8 hours", UnitPrice: 900.0, Type: "Service", Category: "Services" },
    { Id: "128", Sku: "POSTPROCESSOR_CUSTOM", Name: "Custom post-processor", Description: "Post-processor customized for the customer's machine", UnitPrice: 2000.0, Type: "Service", Category: "Services" },
    { Id: "129", Sku: "MACHINE_SETUP_REMOTE", Name: "Remote machine setup", Description: "Remote setup of a milling machine", UnitPrice: 600.0, Type: "Service", Category: "Services" },
    { Id: "130", Sku: "DONGLE_REPLACEMENT", Name: "Dongle replacement", Description: "Replacement of a damaged license dongle", UnitPrice: 120.0, Type: "NonInventory", Category: "Hardware" },
    { Id: "131", Sku: "DONGLE_USB_NEW", Name: "New USB dongle", Description: "Additional USB license dongle", UnitPrice: 90.0, Type: "NonInventory", Category: "Hardware" }
  ],

  // ProductGroup: a reusable set of products assigned to many customers
  productGroups: [
    { id: "g1", name: "Roland labs", description: "Labs milling with Roland machines", itemIds: ["101", "104", "113"] },
    { id: "g2", name: "imes-icore labs", description: "Labs milling with imes-icore machines", itemIds: ["102", "104", "114"] },
    { id: "g3", name: "SUM3D users", description: "Customers with a SUM3D license", itemIds: ["105", "117", "118"] },
    { id: "g4", name: "Add-on modules", description: "All MILLBOX add-on modules", itemIds: ["106", "120", "121", "122", "123", "124"] },
    { id: "g5", name: "Standard services", description: "Services every customer can order", itemIds: ["107", "108", "127", "129", "130"] }
  ],

  // Access per customer: product groups + products added individually.
  // Rails: CustomerProductGroup and CustomerProduct tables.
  customerAccess: {
    "58": { groupIds: ["g1", "g5"], itemIds: ["102"] },
    "61": { groupIds: [], itemIds: ["103", "104", "108", "115"] },
    "64": { groupIds: ["g3", "g4", "g5"], itemIds: ["101"] },
    "70": { groupIds: [], itemIds: [] }
  },

  shipMethods: ["FedEx Ground", "FedEx 2Day", "FedEx Priority Overnight", "UPS Ground", "UPS 2nd Day Air", "Customer pickup", "Electronic delivery (license)"],

  // Estimate status in the portal: pending | accepted | rejected | closed | cancelled
  // (pending / accepted / rejected / closed follow the QuickBooks Estimate TxnStatus)
  estimates: [
    {
      id: "1057", customerId: "58", poNumber: "P78412", poRevision: 0, txnDate: "2026-09-18", status: "pending",
      contactName: "Jane Cooper", billEmail: "purchasing@summitdental.example",
      shipAddr: { name: "Utah Valley Dental Lab", attn: "Richard Willis", line1: "380 S 670 W, Ste. 150", city: "Lindon", state: "UT", postalCode: "84042", country: "United States", phone: "801-373-4750", email: "richard@uvdl.example" },
      shipMethod: "FedEx Ground", carrierAccount: "314613740", fob: "Shipping point",
      memo: "Please send the license keys to Richard as well.",
      pdf: "P78412.pdf",
      lines: [
        { itemId: "104", description: "Software maintenance and updates, 12 months", customerItemNumber: "132911", qty: 1, unitPrice: 950.0, serviceDate: "2026-09-30" },
        { itemId: "107", description: "Remote training session, 4 hours", customerItemNumber: "", qty: 1, unitPrice: 480.0, serviceDate: "2026-10-10" }
      ],
      history: [
        { date: "2026-09-18 10:42", text: "Order submitted by Jane Cooper" },
        { date: "2026-09-18 10:42", text: "Estimate #1057 created in QuickBooks" }
      ]
    },
    {
      id: "1042", customerId: "58", poNumber: "P78366", poRevision: 0, txnDate: "2026-09-03", status: "accepted",
      contactName: "Jane Cooper", billEmail: "purchasing@summitdental.example",
      shipAddr: { name: "Utah Valley Dental Lab", attn: "Richard Willis", line1: "380 S 670 W, Ste. 150", city: "Lindon", state: "UT", postalCode: "84042", country: "United States", phone: "801-373-4750", email: "richard@uvdl.example" },
      shipMethod: "FedEx Ground", carrierAccount: "314613740", fob: "Shipping point",
      memo: "",
      pdf: "P78366.pdf",
      lines: [
        { itemId: "101", description: "MILLBOX 5-axis, Roland Edition", customerItemNumber: "132804", qty: 1, unitPrice: 4000.0, serviceDate: "2026-09-10" }
      ],
      history: [
        { date: "2026-09-03 09:15", text: "Order submitted by Jane Cooper" },
        { date: "2026-09-03 09:15", text: "Estimate #1042 created in QuickBooks" },
        { date: "2026-09-04 14:02", text: "Approved by Mark Ellis" }
      ]
    },
    {
      id: "0988", customerId: "58", poNumber: "P77950", poRevision: 1, txnDate: "2026-07-22", status: "closed",
      contactName: "Jane Cooper", billEmail: "purchasing@summitdental.example",
      shipAddr: { name: "Summit Dental Group", attn: "", line1: "5855 Oberlin Drive", city: "San Diego", state: "CA", postalCode: "92121", country: "United States", phone: "", email: "" },
      shipMethod: "UPS Ground", carrierAccount: "", fob: "Shipping point",
      memo: "",
      pdf: "P77950.pdf",
      lines: [
        { itemId: "102", description: "MILLBOX 5-axis, imes-icore Edition", customerItemNumber: "", qty: 1, unitPrice: 4200.0, serviceDate: "2026-07-31" }
      ],
      history: [
        { date: "2026-07-22 16:30", text: "Order submitted by Jane Cooper" },
        { date: "2026-07-23 08:50", text: "Approved by Mark Ellis" },
        { date: "2026-08-02 11:10", text: "Invoiced in QuickBooks, estimate closed" }
      ]
    },
    {
      id: "0961", customerId: "58", poNumber: "P77801", poRevision: 0, txnDate: "2026-06-30", status: "rejected",
      contactName: "Jane Cooper", billEmail: "purchasing@summitdental.example",
      shipAddr: { name: "Summit Dental Group", attn: "", line1: "5855 Oberlin Drive", city: "San Diego", state: "CA", postalCode: "92121", country: "United States", phone: "", email: "" },
      shipMethod: "Electronic delivery (license)", carrierAccount: "", fob: "Shipping point",
      memo: "",
      pdf: "P77801.pdf",
      rejectionReason: "The unit price on the PO ($400.00) does not match the current price ($480.00). Please send a new PO.",
      lines: [
        { itemId: "107", description: "Remote training session, 4 hours", customerItemNumber: "", qty: 1, unitPrice: 480.0, serviceDate: "" }
      ],
      history: [
        { date: "2026-06-30 13:05", text: "Order submitted by Jane Cooper" },
        { date: "2026-07-01 10:20", text: "Rejected by Mark Ellis" }
      ]
    },
    {
      id: "1055", customerId: "64", poNumber: "CMC-2209", poRevision: 0, txnDate: "2026-09-15", status: "pending",
      contactName: "Paul Grant", billEmail: "ap@coastalmilling.example",
      shipAddr: { name: "Coastal Milling Center", attn: "Paul Grant", line1: "77 Harbor Blvd", city: "Tampa", state: "FL", postalCode: "33602", country: "United States", phone: "813-555-0142", email: "ap@coastalmilling.example" },
      shipMethod: "Electronic delivery (license)", carrierAccount: "", fob: "Shipping point",
      memo: "",
      pdf: "CMC-2209.pdf",
      lines: [
        { itemId: "105", description: "SUM3D Dental CAM license", customerItemNumber: "", qty: 1, unitPrice: 3800.0, serviceDate: "2026-09-25" },
        { itemId: "106", description: "MILLBOX add-on module: implant bars", customerItemNumber: "", qty: 1, unitPrice: 1200.0, serviceDate: "2026-09-25" }
      ],
      history: [
        { date: "2026-09-15 15:48", text: "Order submitted by Paul Grant" },
        { date: "2026-09-15 15:48", text: "Estimate #1055 created in QuickBooks" }
      ]
    },
    {
      id: "1049", customerId: "61", poNumber: "BR-0418", poRevision: 0, txnDate: "2026-09-09", status: "accepted",
      contactName: "Amy Lin", billEmail: "orders@blueridgelab.example",
      shipAddr: { name: "Blue Ridge Dental Lab", attn: "Amy Lin", line1: "120 Main St", city: "Asheville", state: "NC", postalCode: "28801", country: "United States", phone: "", email: "" },
      shipMethod: "FedEx 2Day", carrierAccount: "", fob: "Destination",
      memo: "",
      pdf: "BR-0418.pdf",
      lines: [
        { itemId: "103", description: "MILLBOX 3-axis, Basic license", customerItemNumber: "BR-77", qty: 1, unitPrice: 2500.0, serviceDate: "2026-09-20" },
        { itemId: "108", description: "Transfer of license to a new dongle / PC", customerItemNumber: "", qty: 1, unitPrice: 150.0, serviceDate: "" }
      ],
      history: [
        { date: "2026-09-09 11:00", text: "Order submitted by Amy Lin" },
        { date: "2026-09-10 09:30", text: "Approved by Mark Ellis" }
      ]
    }
  ]
};

window.CIM_MOCK.findEstimate = function (id) {
  const data = window.CIM_MOCK;
  const estimate = data.estimates.find((e) => e.id === id) || data.estimates[0];
  const customer = data.customers.find((c) => c.Id === estimate.customerId);
  const lines = estimate.lines.map((line) => {
    const item = data.items.find((i) => i.Id === line.itemId);
    return Object.assign({ item, amount: line.qty * line.unitPrice }, line);
  });
  const total = lines.reduce((sum, line) => sum + line.amount, 0);
  return Object.assign({}, estimate, { customer, lines, total });
};

window.CIM_MOCK.statusLabels = {
  pending: "Pending review",
  accepted: "Approved",
  rejected: "Rejected",
  closed: "Closed",
  cancelled: "Cancelled"
};

/* ---------- Generated customers (to test the screens with ~150 customers) ---------- */
(function () {
  const data = window.CIM_MOCK;
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const pick = (list) => list[Math.floor(rand() * list.length)];

  const first = ["Alpine", "Apex", "Aspen", "Bayview", "Beacon", "Bright", "Canyon", "Cedar", "Central", "Clearwater", "Crown", "Crystal", "Delta", "Eagle", "Evergreen", "Fairview", "Frontier", "Golden", "Granite", "Harbor", "Heritage", "Highland", "Horizon", "Lakeside", "Liberty", "Lone Star", "Maple", "Meridian", "Metro", "Mountain", "Northstar", "Oak", "Ocean", "Pacific", "Park", "Pinnacle", "Pioneer", "Precision", "Redwood", "Ridge", "River", "Riverside", "Sierra", "Silver", "Southern", "Sunrise", "Sunset", "Valley", "Vista", "Westside"];
  const last = ["Dental Lab", "Dental Studio", "Dental Group", "Milling Center", "Smile Lab", "Prosthetics", "Dental Arts", "Ceramics", "Dental Design", "Digital Dental"];
  const places = [["Austin", "TX", "78701"], ["Denver", "CO", "80202"], ["Phoenix", "AZ", "85004"], ["Seattle", "WA", "98101"], ["Portland", "OR", "97204"], ["Boise", "ID", "83702"], ["Chicago", "IL", "60601"], ["Columbus", "OH", "43215"], ["Nashville", "TN", "37203"], ["Atlanta", "GA", "30303"], ["Miami", "FL", "33130"], ["Charlotte", "NC", "28202"], ["Boston", "MA", "02108"], ["Newark", "NJ", "07102"], ["Dallas", "TX", "75201"], ["Salt Lake City", "UT", "84101"], ["Minneapolis", "MN", "55401"], ["Kansas City", "MO", "64105"], ["Louisville", "KY", "40202"], ["Sacramento", "CA", "95814"]];
  const terms = [{ value: "3", name: "Net 30" }, { value: "3", name: "Net 30" }, { value: "2", name: "Net 15" }, { value: "1", name: "Due on receipt" }];
  const used = new Set(data.customers.map((c) => c.DisplayName));

  for (let id = 200; data.customers.length < 150; id++) {
    const name = `${pick(first)} ${pick(last)}`;
    if (used.has(name)) continue;
    used.add(name);
    const [city, state, zip] = pick(places);
    const addr = { Line1: `${100 + Math.floor(rand() * 9800)} ${pick(["Main St", "Oak Ave", "Park Blvd", "Market St", "1st Ave", "Center Dr"])}`, City: city, CountrySubDivisionCode: state, PostalCode: zip, Country: "United States" };
    const domain = name.toLowerCase().replace(/[^a-z]+/g, "");
    data.customers.push({
      Id: String(id), DisplayName: name, PrimaryEmailAddr: `orders@${domain}.example`,
      SalesTermRef: pick(terms), BillAddr: addr, ShipAddr: addr
    });

    const r = rand();
    const groupIds = r < 0.14 ? [] : ["g5"];
    if (groupIds.length) {
      groupIds.push(pick(["g1", "g1", "g2", "g2", "g3"]));
      if (rand() < 0.35) groupIds.push("g4");
    }
    const itemIds = [];
    if (groupIds.length && rand() < 0.4) itemIds.push(pick(["103", "109", "110", "111", "112", "115", "125", "126", "128"]));
    if (r >= 0.08 && r < 0.14) itemIds.push(pick(["101", "102", "105"]), "104", "107"); // only individual products
    data.customerAccess[String(id)] = { groupIds, itemIds };
  }

  data.customers.sort((a, b) => a.DisplayName.localeCompare(b.DisplayName));

  // Extra stats shown in the customers list
  data.customers.forEach((c) => {
    const orders = data.estimates.filter((e) => e.customerId === c.Id).map((e) => e.txnDate).sort();
    c.portalUsers = { "58": 2, "61": 1, "64": 1, "70": 1 }[c.Id] ?? Math.floor(rand() * 3);
    c.lastOrder = orders.length ? orders[orders.length - 1]
      : rand() < 0.6 ? `2026-0${1 + Math.floor(rand() * 9)}-${String(1 + Math.floor(rand() * 28)).padStart(2, "0")}` : null;
  });
})();

/* ---------- Access helpers ---------- */
window.CIM_MOCK.accessFor = function (customerId) {
  const access = window.CIM_MOCK.customerAccess;
  return access[customerId] || (access[customerId] = { groupIds: [], itemIds: [] });
};

// Effective products = products of the customer's groups + products added individually
window.CIM_MOCK.allowedItemIdsFor = function (customerId) {
  const data = window.CIM_MOCK;
  const access = data.accessFor(customerId);
  const ids = new Set(access.itemIds);
  access.groupIds.forEach((gid) => {
    const group = data.productGroups.find((g) => g.id === gid);
    if (group) group.itemIds.forEach((id) => ids.add(id));
  });
  return Array.from(ids);
};

window.CIM_MOCK.customersInGroup = function (groupId) {
  const data = window.CIM_MOCK;
  return data.customers.filter((c) => data.accessFor(c.Id).groupIds.includes(groupId));
};
