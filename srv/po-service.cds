using { po.ust as ust } from '../db/schema';

@path : '/po'
service POService {

  @Common.Label : 'Purchase Order Header'
  entity POHeaders as projection on ust.poheader;

  @Common.Label : 'Purchase Order Items'
  entity POItems as projection on ust.poitem;

  @Common.Label : 'PO Audit Log'
  entity POAudits as projection on ust.audit;
}
