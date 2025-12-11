using { po.ust as ust } from '../db/schema';

@path : '/gr'
service GRService {

  @Common.Label : 'Goods Receipt Header'
  entity GRHeaders as projection on ust.gr_header;

  @Common.Label : 'Goods Receipt Items'
  entity GRItems as projection on ust.gr_item;
}
