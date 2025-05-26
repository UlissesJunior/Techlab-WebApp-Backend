import { TransactionType } from "../entities/transaction.entity";

export class TransactionValidationUtils {
  static validateTransactionType(dto: { type: TransactionType }): { message: string[]; error: string; statusCode: number } | null {
    const allowedTypes: TransactionType[] = ["CREDITO", "DEBITO", "TRANSFERENCIA"];
    
    if (!allowedTypes.includes(dto.type as TransactionType)) {
      return {
        message: ["type does not match any of the allowed values"],
        error: "Bad Request",
        statusCode: 400,
      };
    }
    return null;
  }
}