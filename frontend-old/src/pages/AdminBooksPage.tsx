import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getBooks, createBook, updateBook, deleteBook } from '../api/books';
import { uploadImage } from '../api/upload';
import type { BookDto } from '../types';

interface BookFormData {
  title: string;
  author: string;
  isbn: string;
  price: number;
  description: string;
  coverImage: string;
}

const emptyForm: BookFormData = {
  title: '', author: '', isbn: '', price: 0, description: '', coverImage: '',
};

export default function AdminBooksPage() {
  const [books, setBooks] = useState<BookDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<BookFormData>();
  const coverImageValue = watch('coverImage');

  const loadBooks = async () => {
    setLoading(true);
    try {
      const res = await getBooks(0, 100);
      setBooks(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    reset(emptyForm);
    setShowForm(true);
  };

  const openEdit = (book: BookDto) => {
    setEditingId(book.id);
    reset({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      price: book.price,
      description: book.description ?? '',
      coverImage: book.coverImage ?? '',
    });
    setShowForm(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setValue('coverImage', url);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: BookFormData) => {
    const payload = { ...data, price: Number(data.price), categoryIds: [] };
    if (editingId !== null) {
      await updateBook(editingId, payload);
    } else {
      await createBook(payload);
    }
    setShowForm(false);
    loadBooks();
  };

  const handleDelete = async (id: number) => {
    await deleteBook(id);
    setDeleteConfirmId(null);
    loadBooks();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Управління книгами</h1>
        <button className="btn btn-primary" onClick={openAdd}>+ Додати книгу</button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? 'Редагувати книгу' : 'Нова книга'}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="form">
              <div className="field-row">
                <div className="field">
                  <label>Назва *</label>
                  <input {...register('title', { required: "Обов'язкове" })} />
                  {errors.title && <span className="field-error">{errors.title.message}</span>}
                </div>
                <div className="field">
                  <label>Автор *</label>
                  <input {...register('author', { required: "Обов'язкове" })} />
                  {errors.author && <span className="field-error">{errors.author.message}</span>}
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label>ISBN * (формат: ISBN 978-0-00-000000-0)</label>
                  <input {...register('isbn', { required: "Обов'язкове" })} placeholder="ISBN 978-0-00-000000-0" />
                  {errors.isbn && <span className="field-error">{errors.isbn.message}</span>}
                </div>
                <div className="field">
                  <label>Ціна *</label>
                  <input type="number" step="0.01" min="0" {...register('price', { required: "Обов'язкове", min: 0 })} />
                  {errors.price && <span className="field-error">{errors.price.message}</span>}
                </div>
              </div>
              <div className="field">
                <label>Опис</label>
                <textarea {...register('description')} rows={3} />
              </div>
              <div className="field">
                <label>Обкладинка</label>
                <div className="cover-input-row">
                  <input
                    {...register('coverImage')}
                    placeholder="https://example.com/book.jpg"
                    className="cover-url-input"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                  />
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? '...' : '📁 Файл'}
                  </button>
                </div>
                {coverImageValue && (
                  <img src={coverImageValue} alt="preview"
                    style={{ marginTop: '0.5rem', height: '80px', borderRadius: '4px', objectFit: 'cover' }} />
                )}
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Зберегти' : 'Створити'}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>
                  Скасувати
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirmId !== null && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmId(null)}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <h2>Видалити книгу?</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Цю дію неможливо скасувати.
            </p>
            <div className="form-actions">
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirmId)}>
                Так, видалити
              </button>
              <button className="btn btn-outline" onClick={() => setDeleteConfirmId(null)}>
                Скасувати
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading">Завантаження...</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Назва</th>
                <th>Автор</th>
                <th>ISBN</th>
                <th>Ціна</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td>{book.id}</td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td style={{ fontSize: '0.8rem' }}>{book.isbn}</td>
                  <td>{Number(book.price).toFixed(2)} ₴</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn btn-outline" onClick={() => openEdit(book)}>
                        Змінити
                      </button>
                      <button className="btn btn-danger" onClick={() => setDeleteConfirmId(book.id)}>
                        Видалити
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
