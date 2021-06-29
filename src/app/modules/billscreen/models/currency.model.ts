export class CurrencyModel {
  private currencyCulture: string;
  private currencyIsoCode: string;
  private currencySymbol: string;

  public getCurrencyCulture(): string {
    return this.currencyCulture;
  }

  public setCurrencyCulture(currencyCulture: string): void {
    this.currencyCulture = currencyCulture;
  }

  public getCurrencyIsoCode(): string {
    return this.currencyIsoCode;
  }

  public setCurrencyIsoCode(currencyIsoCode: string): void {
    this.currencyIsoCode = currencyIsoCode;
  }

  public getCurrencySymbol(): string {
    return this.currencySymbol;
  }

  public setCurrencySymbol(currencySymbol: string): void {
    this.currencySymbol = currencySymbol;
  }
}
