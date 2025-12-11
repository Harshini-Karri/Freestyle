using { po.ust as ust } from '../db/schema';

@path : '/inv'
service InvoiceService {

  @Common.Label : 'Invoice Header'
  entity InvoiceHeaders as projection on ust.inv_header;

  @Common.Label : 'Invoice Items'
  entity InvoiceItems as projection on ust.inv_item;
}
