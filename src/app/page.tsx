// --- src/app/page.tsx ---
'use client';

import { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Product {
  sku: string;
  name: string;
  price: number;
  description: string;
  isCheckout: boolean;
  quantity: number;
}

export default function HomePage() {
  const [epc, setEpc] = useState('');
  const [productList, setProductList] = useState<Product[]>([]);
  const [seenEPCs, setSeenEPCs] = useState<string[]>([]);

  const handleSearch = async () => {
    if (!epc) return;
    if (seenEPCs.includes(epc)) {
      toast.info('EPC đã được quét');
      setEpc('');
      return;
    }

    try {
      const res = await axios.get(`http://localhost:8080/api/epc/${epc}/detail`);
      const data = res.data;

      if (!data || !data.product) {
        toast.error('Không tìm thấy sản phẩm');
        return;
      }

      setSeenEPCs((prev) => [...prev, epc]);

      setProductList((prev) => {
        const exists = prev.find((p) => p.sku === data.sku);
        if (exists) {
          return prev.map((p) =>
            p.sku === data.sku ? { ...p, quantity: p.quantity + 1 } : p
          );
        } else {
          return [
            ...prev,
            {
              sku: data.sku,
              name: data.product.name,
              price: data.product.price,
              description: data.product.description,
              isCheckout: data.isCheckout,
              quantity: 1,
            },
          ];
        }
      });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Không tìm thấy sản phẩm');
    } finally {
      setEpc('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setProductList([]);
    setSeenEPCs([]);
  };

  const totalQuantity = productList.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = productList.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-3xl text-center">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">
          Bạn muốn tìm gì hôm nay?
        </h1>

        <div className="flex items-center bg-white shadow-md rounded-full border border-gray-300 overflow-hidden mb-6">
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

        {productList.length > 0 && (
          <div className="flex justify-between items-center mb-4">
            <div className="text-left">
              <p className="text-gray-700 text-sm">
                Tổng số lượng: <strong>{totalQuantity}</strong>
              </p>
              <p className="text-gray-700 text-sm">
                Tổng tiền: <strong>{totalPrice.toLocaleString()}đ</strong>
              </p>
            </div>
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Làm mới
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {productList.map((item, idx) => (
            <div key={idx} className="p-5 border rounded-xl bg-white shadow-sm text-left">
              <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
              <p className="text-gray-700">SKU: {item.sku}</p>
              <p className="text-gray-700">Giá: {item.price.toLocaleString()}đ</p>
              <p className="text-gray-700">Số lượng: {item.quantity}</p>
              <p className="text-gray-600 text-sm mt-1">{item.description}</p>
              <p className="mt-2 text-sm">
                Trạng thái:{' '}
                <span className={item.isCheckout ? 'text-green-600' : 'text-yellow-600'}>
                  {item.isCheckout ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </span>
              </p>
            </div>
          ))}
        </div>

        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    </main>
  );
}
