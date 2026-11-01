export interface PaymentDto {
  id: number;
  orderId: number | null;
  paymentMethod: string;
  paymentGateway: string;
  amount: number;
  status: string;
  transactionId: string | null;
  paidAt: string | null;
}
