const cds = require('@sap/cds');

module.exports = cds.service.impl(function () {

  const { InvoiceHeaders, InvoiceItems } = this.entities;

  

  this.before('CREATE', InvoiceHeaders, req => {
    const h = req.data;

    if (!h.inv_header_invnumber) {
      req.error(400, 'Invoice Number is mandatory');
    }

    if (!h.inv_header_vendor_id) {
      req.error(400, 'Vendor ID is mandatory');
    }

    if (h.inv_header_postdate && h.inv_header_date &&
        new Date(h.inv_header_postdate) < new Date(h.inv_header_date)) {
      req.error(400, 'Posting date cannot be before Invoice date');
    }

    h.inv_header_status ??= 'draft';
  });

  this.before('UPDATE', InvoiceHeaders, req => {
    if (req.data.inv_header_vendor_id === null) {
      req.error(400, 'Vendor ID cannot be cleared');
    }
  });

  this.before('DELETE', InvoiceHeaders, req => {
    req.error(403, 'Invoice Header cannot be deleted');
  });




  this.on('READ', InvoiceHeaders, async req => {
    const tx = cds.tx(req);
    return tx.run(req.query);
  });

  this.on('CREATE', InvoiceHeaders, async req => {
    const tx = cds.tx(req);

    await tx.run(
      INSERT.into(InvoiceHeaders).entries(req.data)
    );

    return req.data;
  });


  

  this.after('CREATE', InvoiceHeaders, data => {
    console.log(
      `Invoice Header created: ${data.inv_header_invnumber}`
    );
  });

  this.after('READ', InvoiceHeaders, data => {
    const rows = Array.isArray(data) ? data : [data];
    rows.forEach(h => {
      h.invoice_status_text =
        h.inv_header_status === 'draft' ? 'Draft Invoice' :
        h.inv_header_status === 'approved' ? 'Approved Invoice' :
        'Invoice';
    });
  });



  this.before('CREATE', InvoiceItems, req => {
    const i = req.data;

    if (!i.inv_id) {
      req.error(400, 'Invoice Header ID is mandatory');
    }

    if (!i.inv_item_po_id) {
      req.error(400, 'PO ID is mandatory');
    }

    if (!i.inv_item_lineitem) {
      req.error(400, 'PO Line Item number is mandatory');
    }

    if (!i.inv_item_quaninv || i.inv_item_quaninv.order_quan <= 0) {
      req.error(400, 'Invoice Quantity must be greater than zero');
    }
  });

  this.before('UPDATE', InvoiceItems, req => {
    if (req.data.inv_item_quaninv &&
        req.data.inv_item_quaninv.order_quan <= 0) {
      req.error(400, 'Invoice Quantity must be greater than zero');
    }
  });


  

  this.on('READ', InvoiceItems, async req => {
    const tx = cds.tx(req);
    return tx.run(req.query);
  });

  this.on('CREATE', InvoiceItems, async req => {
    const tx = cds.tx(req);

    await tx.run(
      INSERT.into(InvoiceItems).entries(req.data)
    );

    return req.data;
  });


 

  this.after('CREATE', InvoiceItems, data => {
    console.log(
      `Invoice Item created for Invoice ${data.inv_id}`
    );
  });

  this.after('READ', InvoiceItems, data => {
    const rows = Array.isArray(data) ? data : [data];
    rows.forEach(i => {
      i.invoice_item_info =
        `Qty: ${i.inv_item_quaninv?.order_quan || 0}`;
    });
  });

});
