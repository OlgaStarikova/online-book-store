import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerUser } from '../api/auth';
import { useState } from 'react';

interface FormData {
  email: string;
  password: string;
  repeatPassword: string;
  firstName: string;
  lastName: string;
  shippingAddress: string;
}

export default function RegisterPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      await registerUser(data);
      navigate('/login');
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Помилка реєстрації');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Реєстрація</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="field-row">
            <div className="field">
              <label>Ім'я</label>
              <input {...register('firstName', { required: "Обов'язкове поле" })} placeholder="Олена" />
              {errors.firstName && <span className="field-error">{errors.firstName.message}</span>}
            </div>
            <div className="field">
              <label>Прізвище</label>
              <input {...register('lastName', { required: "Обов'язкове поле" })} placeholder="Коваль" />
              {errors.lastName && <span className="field-error">{errors.lastName.message}</span>}
            </div>
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" {...register('email', { required: "Обов'язкове поле" })} placeholder="your@email.com" />
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
          <div className="field">
            <label>Підтвердіть пароль</label>
            <input
              type="password"
              {...register('repeatPassword', {
                required: "Обов'язкове поле",
                validate: (v) => v === watch('password') || 'Паролі не збігаються',
              })}
              placeholder="••••••••"
            />
            {errors.repeatPassword && <span className="field-error">{errors.repeatPassword.message}</span>}
          </div>
          <div className="field">
            <label>Адреса доставки</label>
            <input {...register('shippingAddress')} placeholder="м. Київ, вул. Хрещатик 1" />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn-primary">Зареєструватися</button>
        </form>
        <p className="auth-link">
          Вже є акаунт? <Link to="/login">Увійти</Link>
        </p>
      </div>
    </div>
  );
}
