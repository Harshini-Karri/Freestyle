const cds = require('@sap/cds');

module.exports = cds.service.impl(function () {

  const { POAudits } = this.entities;
  this.before('CREATE', POAudits, req => {
    const a = req.data;

    if (!a.error_po) {
      req.error(400, 'PO ID (error_po) is mandatory');
    }

    if (!a.error_status) {
      a.error_status = '404';
    }

    if (!a.audit_status) {
      a.audit_status = 'Unchanged';
    }

    if (a.audit_log) {
      a.audit_log.auditat ??= new Date();
    }
  });

  this.before('UPDATE', POAudits, req => {
    if (req.data.error_po === null) {
      req.error(400, 'PO ID cannot be cleared');
    }
  });

  this.before('DELETE', POAudits, req => {
    req.error(403, 'Audit records cannot be deleted');
  });

  this.on('READ', POAudits, async req => {
    const tx = cds.tx(req); 
    return tx.run(req.query);
  });

  this.on('CREATE', POAudits, async req => {
    const tx = cds.tx(req);

    if (req.data.audit_log) {
      req.data.audit_log.auditat ??= new Date();
    }

    await tx.run(
      INSERT.into(POAudits).entries(req.data)
    );

    return req.data;
  });
  
  this.after('CREATE', POAudits, data => {
    console.log(
      `Audit entry created for PO: ${data.error_po}`
    );
  });

  this.after('READ', POAudits, data => {
    const rows = Array.isArray(data) ? data : [data];

    rows.forEach(r => {
      r.audit_display_text =
        `Status: ${r.audit_status} | Error: ${r.error_status}`;
    });
  });

});
