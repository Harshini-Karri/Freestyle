const cds = require('@sap/cds');

module.exports = cds.service.impl(function () {

  const { POHeaders, POItems } = this.entities;

  this.before('CREATE', POHeaders, req => {
    const h = req.data;

    if (!h.po_number || h.po_number <= 0) {
      req.error(400, 'PO Number must be greater than zero');
    }

    if (!h.po_vm_id) {
      req.error(400, 'Vendor ID is mandatory');
    }

    if (h.po_doc_date && h.po_delivery_date &&
        new Date(h.po_delivery_date) < new Date(h.po_doc_date)) {
      req.error(400, 'Delivery Date cannot be before Document Date');
    }

    h.po_status ??= 'draft';
  });

  this.before('UPDATE', POHeaders, req => {
    if (req.data.po_vm_id === null) {
      req.error(400, 'Vendor ID cannot be cleared');
    }
  });

  this.before('DELETE', POHeaders, req => {
    req.error(403, 'Purchase Orders cannot be deleted');
  });


  

  this.on('READ', POHeaders, async req => {
    const tx = cds.tx(req);
    return tx.run(req.query);
  });

  this.on('CREATE', POHeaders, async req => {
    const tx = cds.tx(req);

    await tx.run(
      INSERT.into(POHeaders).entries(req.data)
    );

    return req.data;
  });



  this.after('CREATE', POHeaders, data => {
    console.log(
      `PO Header created: ${data.po_number}`
    );
  });

  this.after('READ', POHeaders, data => {
    const rows = Array.isArray(data) ? data : [data];
    rows.forEach(h => {
      h.po_status_text =
        h.po_status === 'draft' ? 'Draft PO' :
        h.po_status === 'approved' ? 'Approved PO' :
        'PO';
    });
  });


  

  this.before('CREATE', POItems, req => {
    const i = req.data;

    if (!i.po_id) {
      req.error(400, 'PO ID is mandatory');
    }

    if (!i.po_lineitem_number || i.po_lineitem_number <= 0) {
      req.error(400, 'Line Item Number must be greater than zero');
    }

    if (!i.po_item_material_id) {
      req.error(400, 'Material ID is mandatory');
    }

    if (!i.po_item_quan || i.po_item_quan.order_quan <= 0) {
      req.error(400, 'Quantity must be greater than zero');
    }

    if (i.po_item_discount < 0 || i.po_item_discount > 100) {
      req.error(400, 'Discount must be between 0 and 100');
    }

   
    const qty = i.po_item_quan.order_quan;
    const price = i.po_item_netprice || 0;
    const discount = (price * qty) * ((i.po_item_discount || 0) / 100);
    i.po_item_netprice_value = (price * qty) - discount;
  });

  this.before('UPDATE', POItems, req => {
    if (req.data.po_item_quan &&
        req.data.po_item_quan.order_quan <= 0) {
      req.error(400, 'Quantity must be greater than zero');
    }
  });


 

  this.on('READ', POItems, async req => {
    const tx = cds.tx(req);
    return tx.run(req.query);
  });

  this.on('CREATE', POItems, async req => {
    const tx = cds.tx(req);

    await tx.run(
      INSERT.into(POItems).entries(req.data)
    );

    return req.data;
  });


  

  this.after('CREATE', POItems, data => {
    console.log(
      `PO Item ${data.po_lineitem_number} created for PO ${data.po_id}`
    );
  });

  this.after('READ', POItems, data => {
    const rows = Array.isArray(data) ? data : [data];
    rows.forEach(i => {
      i.po_item_info =
        `Qty: ${i.po_item_quan?.order_quan || 0}`;
    });
  });

});
