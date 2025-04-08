'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type ClientFormProps = {
  clientId?: number;
  isEditMode?: boolean;
};

type ClientFormData = {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  passport_number: string;
  passport_issue_date: string;
  passport_expiry_date: string;
  driver_license_number: string;
  driver_license_expiry: string;
  notes: string;
};

export default function ClientForm({ clientId, isEditMode = false }: ClientFormProps) {
  const [formData, setFormData] = useState<ClientFormData>({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    passport_number: '',
    passport_issue_date: '',
    passport_expiry_date: '',
    driver_license_number: '',
    driver_license_expiry: '',
    notes: ''
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (isEditMode && clientId) {
      fetchClient();
    }
  }, [isEditMode, clientId]);

  const fetchClient = async () => {
    try {
      const response = await fetch(`/api/clients/${clientId}`);
      const data = await response.json();

      if (data.success && data.client) {
        setFormData({
          full_name: data.client.full_name,
          email: data.client.email || '',
          phone: data.client.phone,
          address: data.client.address || '',
          passport_number: data.client.passport_number,
          passport_issue_date: data.client.passport_issue_date || '',
          passport_expiry_date: data.client.passport_expiry_date || '',
          driver_license_number: data.client.driver_license_number || '',
          driver_license_expiry: data.client.driver_license_expiry || '',
          notes: data.client.notes || ''
        });
      } else {
        setError(data.message || 'Не удалось загрузить данные клиента');
      }
    } catch (err) {
      setError('Ошибка при загрузке данных');
      console.error('Fetch client error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const url = isEditMode 
        ? `/api/clients/${clientId}` 
        : '/api/clients';
      
      const method = isEditMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message || 'Операция выполнена успешно');
        
        if (!isEditMode) {
          // Clear form after successful creation
          setFormData({
            full_name: '',
            email: '',
            phone: '',
            address: '',
            passport_number: '',
            passport_issue_date: '',
            passport_expiry_date: '',
            driver_license_number: '',
            driver_license_expiry: '',
            notes: ''
          });
        }
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push('/clients');
        }, 2000);
      } else {
        setError(data.message || 'Произошла ошибка');
      }
    } catch (err) {
      setError('Произошла ошибка при отправке данных');
      console.error('Submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center p-8">Загрузка...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Редактирование клиента' : 'Добавление нового клиента'}
      </h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="full_name">
              ФИО *
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="full_name"
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
              Телефон *
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
              Адрес
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="address"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="passport_number">
              Номер паспорта *
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="passport_number"
              type="text"
              name="passport_number"
              value={formData.passport_number}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="passport_issue_date">
              Дата выдачи паспорта
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="passport_issue_date"
              type="date"
              name="passport_issue_date"
              value={formData.passport_issue_date}
              onChange={handleChange}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="passport_expiry_date">
              Срок действия паспорта
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="passport_expiry_date"
              type="date"
              name="passport_expiry_date"
              value={formData.passport_expiry_date}
              onChange={handleChange}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="driver_license_number">
              Номер водительского удостоверения
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="driver_license_number"
              type="text"
              name="driver_license_number"
              value={formData.driver_license_number}
              onChange={handleChange}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="driver_license_expiry">
              Срок действия водительского удостоверения
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="driver_license_expiry"
              type="date"
              name="driver_license_expiry"
              value={formData.driver_license_expiry}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
            Примечания
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Обработка...' : (isEditMode ? 'Сохранить изменения' : 'Добавить клиента')}
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={() => router.push('/clients')}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}
