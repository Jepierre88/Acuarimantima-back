import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import { DetailAccount } from "../models";


@injectable({scope: BindingScope.TRANSIENT})
export class SundryServicesService {
  constructor() {}

 async organizePayment(detailAccount:Array<DetailAccount>) {
  try {
   const organizedDetail= await detailAccount.sort((a, b) => {
    if (a.statusPayment === b.statusPayment) {
      return 0;
    } else if (a.statusPayment === 1) {
      return 1;
    } else {
      return -1;
    }
  })

  return organizedDetail

  } catch (error) {
    console.log(error)
  }
 }



}
