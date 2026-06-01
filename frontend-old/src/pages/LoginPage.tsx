import { useForm } from 'react-hook-form';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { login, getMe } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import { useState } from 'react';

interface FormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionExpired = searchParams.get('session') === 'expired';
  const [error, setError] = useState('');

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      const res = await login(data.email, data.password);
      localStorage.setItem('token', res.data.token);
      const me = await getMe();
      setAuth(res.data.token, data.email, me.data.isAdmin);
      navigate('/books');
    } catch {
      setError('Невірний email або пароль');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Вхід</h1>
        {sessionExpired && <p className="form-error">Сесія закінчилась. Будь ласка, увійдіть знову.</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              {...register('email', { required: "Обов'язкове поле" })}
              placeholder="your@email.com"
            />
            {errors.email && <span className="field-error">{errors.email.message}</span>}
          </div>
          <div className="field">
            <label>Пароль</label>
            <input
              type="password"
              {...register('password', { required: "Обов'язкове поле", minLength: { value: 8, message: 'Мінімум 8 символів' } })}
              placeholder="••••••••"
            />
            {errors.password && <span className="field-error">{errors.password.message}</span>}
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn-primary">Увійти</button>
        </form>
        <p className="auth-link">
          Немає акаунту? <Link to="/register">Зареєструватися</Link>
        </p>
      </div>
    </div>
  );
}
