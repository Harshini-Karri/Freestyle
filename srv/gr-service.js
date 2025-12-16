const cds = require('@sap/cds');

module.exports = cds.service.impl(function () {

  const { GRHeaders, GRItems } = this.entities;



  this.before('CREATE', GRHeaders, req => {
    const g = req.data;

    if (!g.gr_number || g.gr_number <= 0) {
      req.error(400, 'GR Number must be greater than zero');
    }

    if (!g.gr_po) {
      req.error(400, 'PO ID (gr_po) is mandatory');
    }

    g.gr_status ??= 'draft';
  });

  this.before('UPDATE', GRHeaders, req => {
    if (req.data.gr_po === null) {
      req.error(400, 'PO reference cannot be cleared');
    }
  });

  this.before('DELETE', GRHeaders, req => {
    req.error(403, 'Goods Receipt Header cannot be deleted');
  });


  

  this.on('READ', GRHeaders, async req => {
    const tx = cds.tx(req);
    return tx.run(req.query);
  });

  this.on('CREATE', GRHeaders, async req => {
    const tx = cds.tx(req);

    await tx.run(
      INSERT.into(GRHeaders).entries(req.data)
    );

    return req.data;
  });



  this.after('CREATE', GRHeaders, data => {
    console.log(`GR Header created: ${data.gr_number}`);
  });

  this.after('READ', GRHeaders, data => {
    const rows = Array.isArray(data) ? data : [data];
    rows.forEach(g => {
      g.gr_status_text =
        g.gr_status === 'draft' ? 'Draft GR' :
        g.gr_status === 'approved' ? 'Approved GR' :
        'GR';
    });
  });


  

  this.before('CREATE', GRItems, req => {
    const i = req.data;

    if (!i.gr_item_ref_id) {
      req.error(400, 'GR Header ID is mandatory');
    }

    if (!i.gr_item_po_id) {
      req.error(400, 'PO ID is mandatory');
    }

    if (!i.gr_item_poitem_id) {
      req.error(400, 'PO Item Material ID is mandatory');
    }

    if (!i.gr_item_received_quan || i.gr_item_received_quan <= 0) {
      req.error(400, 'Received Quantity must be greater than zero');
    }
  });

  this.before('UPDATE', GRItems, req => {
    if (req.data.gr_item_received_quan <= 0) {
      req.error(400, 'Received Quantity must be greater than zero');
    }
  });



  this.on('READ', GRItems, async req => {
    const tx = cds.tx(req);
    return tx.run(req.query);
  });

  this.on('CREATE', GRItems, async req => {
    const tx = cds.tx(req);

    await tx.run(
      INSERT.into(GRItems).entries(req.data)
    );

    return req.data;
  });



  this.after('CREATE', GRItems, data => {
    console.log(
      `GR Item created for PO ${data.gr_item_po_id}`
    );
  });

  this.after('READ', GRItems, data => {
    const rows = Array.isArray(data) ? data : [data];
    rows.forEach(i => {
      i.receipt_info =
        `Received: ${i.gr_item_received_quan}`;
    });
  });

});
