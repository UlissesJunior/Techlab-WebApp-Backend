import { AccountType } from "../entities/account.entity";

export class AccountValidationUtils {
  static validateAccountType(dto: { type: AccountType }): { message: string[]; error: string; statusCode: number } | null {
    const allowedTypes: AccountType[] = ["CORRENTE", "POUPANCA", "CREDITO", "INVESTIMENTO"];
    
    if (!allowedTypes.includes(dto.type as AccountType)) {
      return {
        message: ["type does not match any of the allowed values"],
        error: "Bad Request",
        statusCode: 400,
      };
    }
    return null;
  }
}