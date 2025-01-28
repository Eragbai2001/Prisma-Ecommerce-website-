export interface Order {
    id: string;
    reference: string;
    userId: string;
    amount: number;
    status: 'pending' | 'paid' | 'failed';
    items: Array<{
      productId: string;
      quantity: number;
      price: number;
    }>;
    createdAt: Date;
    updatedAt: Date;
  }