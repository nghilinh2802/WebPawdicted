export interface Flashsale {
  flashSale_id: string;        // ID của flash sale (có thể là UUID)
  flashSale_name: string;      // Tên flash sale
  startTime: number;           // Thời gian bắt đầu (timestamp - milliseconds)
  endTime: number;             // Thời gian kết thúc (timestamp - milliseconds)
  discountRate: number;        // Phần trăm giảm giá (int, ví dụ: 20)
  soldQuantity: number;        // Số lượng đã bán (có thể ban đầu là 0)
  product_id: string[];        // Danh sách các product_id được áp dụng
}
