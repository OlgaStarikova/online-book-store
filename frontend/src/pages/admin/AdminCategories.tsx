import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppContext } from '../../lib/AppContext';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

interface CategoryFormData {
  name: string;
  description: string;
}

export function AdminCategories() {
  const { categories, addCategory, editCategory, deleteCategory } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryFormData>();

  const openAdd = () => {
    setEditingId(null);
    reset({ name: '', description: '' });
    setShowForm(true);
  };

  const openEdit = (cat: typeof categories[0]) => {
    setEditingId(cat.id);
    reset({ name: cat.name, description: cat.description ?? '' });
    setShowForm(true);
  };

  const onSubmit = async (data: CategoryFormData) => {
    setSaving(true);
    try {
      if (editingId !== null) {
        await editCategory(editingId, data);
      } else {
        await addCategory(data);
      }
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteCategory(id);
    setDeleteConfirmId(null);
  };

  const inputClass = "w-full px-4 py-2.5 border border-warm-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-indigo/50 text-sm";

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-warm-900 mb-2">Manage Categories</h1>
          <p className="text-warm-500">Organize your bookstore inventory.</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-accent-terracotta hover:bg-[#a3360a] text-white px-5 py-2.5 rounded-full font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Category
        </button>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-warm-200">
              <h2 className="font-serif text-xl font-bold">{editingId ? 'Edit Category' : 'New Category'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-warm-100 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-warm-500 uppercase tracking-wider mb-1.5 block">Name *</label>
                <input className={inputClass} {...register('name', { required: 'Required' })} />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-warm-500 uppercase tracking-wider mb-1.5 block">Description</label>
                <textarea className={inputClass + ' resize-none'} rows={3} {...register('description')} />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-accent-terracotta hover:bg-[#a3360a] text-white rounded-full font-medium transition-colors disabled:opacity-60"
                >
                  {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create'}
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
            <h2 className="font-serif text-xl font-bold mb-3">Delete category?</h2>
            <p className="text-warm-500 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteConfirmId)} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium transition-colors">Delete</button>
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-2.5 border border-warm-200 rounded-full font-medium hover:bg-warm-50 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-warm-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-warm-50 border-b border-warm-200 text-sm font-semibold text-warm-500">
              <tr>
                <th className="px-6 py-4 w-16">ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4 w-full">Description</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-100">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-warm-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-warm-400">#{category.id}</td>
                  <td className="px-6 py-4 font-bold text-warm-900">{category.name}</td>
                  <td className="px-6 py-4 text-sm text-warm-500 max-w-xs truncate">{category.description}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openEdit(category)} className="p-2 text-warm-400 hover:text-accent-indigo transition-colors" title="Edit">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => setDeleteConfirmId(category.id)} className="p-2 text-warm-400 hover:text-red-500 transition-colors" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-warm-500">No categories found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
