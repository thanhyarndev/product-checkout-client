'use client';

import { useState } from 'react';
import axios from 'axios';

export default function HomePage() {
  const [epc, setEpc] = useState('');
  const [productInfo, setProductInfo] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!epc) return;
    try {
      const res = await axios.get(`http://localhost:8080/api/epc/${epc}/detail`);
      setProductInfo(res.data);
      setError('');
    } catch (err: any) {
      setProductInfo(null);
      setError(err?.response?.data?.message || 'Không tìm thấy sản phẩm');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-3xl sm:text-4xl font-semibold mb-8 text-gray-800">
          Bạn muốn tìm gì hôm nay?
        </h1>

        <div className="flex items-center bg-white shadow-md rounded-full border border-gray-300 overflow-hidden">
          <input
            type="text"
            placeholder="Nhập mã EPC..."
            value={epc}
            onChange={(e) => setEpc(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow px-6 py-4 text-base sm:text-lg focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-4 bg-black text-white font-medium text-sm sm:text-base hover:bg-gray-800 transition-all"
          >
            Tìm kiếm sản phẩm
          </button>
        </div>

        {error && (
          <p className="text-red-500 mt-4 text-sm">{error}</p>
        )}

        {productInfo && (
          <div className="mt-8 p-6 border rounded-lg bg-gray-50 text-left">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Thông tin sản phẩm</h2>
            <p><strong>EPC:</strong> {productInfo.epc}</p>
            <p><strong>SKU:</strong> {productInfo.sku}</p>
            <p><strong>Tên:</strong> {productInfo.product.name}</p>
            <p><strong>Giá:</strong> {productInfo.product.price}đ</p>
            <p><strong>Mô tả:</strong> {productInfo.product.description}</p>
            <p><strong>Trạng thái:</strong> {productInfo.isCheckout ? 'Đã thanh toán' : 'Chưa thanh toán'}</p>
          </div>
        )}
      </div>
    </main>
  );
}
