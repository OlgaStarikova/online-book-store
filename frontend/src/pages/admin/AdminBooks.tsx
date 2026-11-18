import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useAppContext, type Book } from '../../lib/AppContext';
import { uploadImage } from '../../api/upload';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import type { BookDto } from '../../types';

interface BookFormData {
  title: string;
  author: string;
  isbn: string;
  price: number;
  description: string;
  coverImage: string;
}

const emptyForm: BookFormData = { title: '', author: '', isbn: '', price: 0, description: '', coverImage: '' };

export function AdminBooks() {
  const { books, categories, addBook, editBook, deleteBook } = useAppContext();
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<BookFormData>();
  const coverImageValue = watch('coverImage');

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAdd = () => {
    setEditingId(null);
    reset(emptyForm);
    setSelectedCategoryIds([]);
    setShowForm(true);
  };

  const openEdit = (book: Book) => {
    setEditingId(book.id);
    reset({
      title: book.title,
      author: book.author.name,
      isbn: book.isbn,
      price: book.price,
      description: book.description,
      coverImage: book.coverImage,
    });
    setSelectedCategoryIds(book.categories.map((c) => c.id));
    setShowForm(true);
  };

  const toggleCategory = (id: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
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
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: BookFormData) => {
    setSaving(true);
    try {
      const payload: Omit<BookDto, 'id'> = {
        title: data.title,
        author: data.author,
        isbn: data.isbn,
        price: Number(data.price),
        description: data.description,
        coverImage: data.coverImage,
        categoryIds: selectedCategoryIds,
      };
      if (editingId !== null) {
        await editBook(editingId, payload);
      } else {
        await addBook(payload);
      }
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteBook(id);
    setDeleteConfirmId(null);
  };

  const inputClass = "w-full px-4 py-2.5 border border-warm-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-indigo/50 text-sm";

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-warm-900 mb-2">Manage Books</h1>
          <p className="text-warm-500">Add, edit, or remove books from the catalog.</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-accent-terracotta hover:bg-[#a3360a] text-white px-5 py-2.5 rounded-full font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add New Book
        </button>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-warm-200">
              <h2 className="font-serif text-xl font-bold">{editingId ? 'Edit Book' : 'New Book'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-warm-100 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-warm-500 uppercase tracking-wider mb-1.5 block">Title *</label>
                  <input className={inputClass} {...register('title', { required: 'Required' })} />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold text-warm-500 uppercase tracking-wider mb-1.5 block">Author *</label>
                  <input className={inputClass} {...register('author', { required: 'Required' })} />
                  {errors.author && <p className="text-red-500 text-xs mt-1">{errors.author.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-warm-500 uppercase tracking-wider mb-1.5 block">ISBN *</label>
                  <input className={inputClass} placeholder="ISBN 978-0-00-000000-0" {...register('isbn', { required: 'Required' })} />
                  {errors.isbn && <p className="text-red-500 text-xs mt-1">{errors.isbn.message}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold text-warm-500 uppercase tracking-wider mb-1.5 block">Price *</label>
                  <input type="number" step="0.01" min="0" className={inputClass} {...register('price', { required: 'Required', min: 0 })} />
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-warm-500 uppercase tracking-wider mb-1.5 block">Description</label>
                <textarea className={inputClass + ' resize-none'} rows={3} {...register('description')} />
              </div>
              {categories.length > 0 && (
                <div>
                  <label className="text-xs font-semibold text-warm-500 uppercase tracking-wider mb-1.5 block">Categories</label>
                  <div className="flex flex-col gap-2">
                    {categories.map((cat) => (
                      <label
                        key={cat.id}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl border border-warm-200 cursor-pointer hover:bg-warm-50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategoryIds.includes(cat.id)}
                          onChange={() => toggleCategory(cat.id)}
                          className="h-4 w-4 rounded accent-accent-indigo"
                        />
                        <span className="text-sm text-warm-900">{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <label className="text-xs font-semibold text-warm-500 uppercase tracking-wider mb-1.5 block">Cover Image</label>
                <div className="flex gap-2">
                  <input className={inputClass} placeholder="https://example.com/book.jpg" {...register('coverImage')} />
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex-shrink-0 px-3 py-2 border border-warm-200 rounded-xl text-sm hover:bg-warm-50 transition-colors disabled:opacity-50"
                  >
                    {uploading ? '...' : 'Upload'}
                  </button>
                </div>
                {coverImageValue && (
                  <img src={coverImageValue} alt="preview" className="mt-2 h-20 rounded-lg object-cover border border-warm-200" />
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-accent-terracotta hover:bg-[#a3360a] text-white rounded-full font-medium transition-colors disabled:opacity-60"
                >
                  {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Book'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 border border-warm-200 rounded-full font-medium hover:bg-warm-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setDeleteConfirmId(null)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-serif text-xl font-bold mb-3">Delete book?</h2>
            <p className="text-warm-500 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 border border-warm-200 rounded-full font-medium hover:bg-warm-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-warm-200 overflow-hidden">
        <div className="p-4 border-b border-warm-200 flex items-center gap-3">
          <Search className="h-5 w-5 text-warm-400" />
          <input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full focus:outline-none bg-transparent"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-warm-50 border-b border-warm-200 text-sm font-semibold text-warm-500">
              <tr>
                <th className="px-6 py-4">Book</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-100">
              {filteredBooks.map((book) => (
                <tr key={book.id} className="hover:bg-warm-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {book.coverImage ? (
                        <img src={book.coverImage} alt={book.title} className="w-10 h-14 object-cover rounded shadow-sm bg-warm-100 flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-14 bg-warm-100 rounded flex-shrink-0" />
                      )}
                      <div>
                        <div className="font-bold text-warm-900 text-sm max-w-[200px] truncate">{book.title}</div>
                        <div className="text-xs text-warm-400">{book.isbn}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-warm-600 max-w-[150px] truncate">{book.author.name}</td>
                  <td className="px-6 py-4 font-medium text-warm-900">${book.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openEdit(book)} className="p-2 text-warm-400 hover:text-accent-indigo transition-colors" title="Edit">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => setDeleteConfirmId(book.id)} className="p-2 text-warm-400 hover:text-red-500 transition-colors" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredBooks.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-warm-500">No books found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
