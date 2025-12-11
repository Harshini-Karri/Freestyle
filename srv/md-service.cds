using { po.ust as ust } from '../db/schema';

@path : '/md'
service MasterDataService {

  @Common.Label : 'Vendors'
  entity Vendors as projection on ust.vendormaster;

  @Common.Label : 'Materials'
  entity Materials as projection on ust.mastermaterial;
}
