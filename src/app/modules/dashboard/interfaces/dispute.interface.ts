import { BipCurrencyAmount } from '../models/bipCurrencyAmt.model';

export interface DisputeInterface {

    bipHomeCurAmount: BipCurrencyAmount;
    currencyBreakDown: BipCurrencyAmount[];
    disputeFromDate: any;
    disputeToDate: any;
}
