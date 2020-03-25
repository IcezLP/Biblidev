import React from 'react';
import Link from 'next/link';
import cookies from 'js-cookie';
import Router from 'next/router';
import InputGroup from '../../components/form/InputGroup';
import Button from '../../components/Button';
import useForm from '../../hooks/useForm';

export default () => {
  const setAuthToken = (data) => {
    cookies.set('auth', data.token);
    Router.push('/');
  };

  const { values, errors, isLoading, handleChange, handleSubmit } = useForm(
    setAuthToken,
    'post',
    '/api/auth/login',
  );

  return (
    <section className="container" id="login">
      <form className="form" noValidate onSubmit={handleSubmit}>
        <h1 className="form__title">Connexion</h1>
        {errors.message && <small>{errors.message}</small>}
        <InputGroup
          label="Adresse e-mail"
          name="email"
          placeholder="Adresse e-mail"
          value={values.email || ''}
          onChange={handleChange}
          error={errors.email}
          isLoading={isLoading}
        />
        <InputGroup
          label="Mot de passe"
          name="password"
          placeholder="Mot de passe"
          type="password"
          value={values.password || ''}
          onChange={handleChange}
          error={errors.password}
          isLoading={isLoading}
        />
        <Link href="/auth/forgot" as="/mot-de-passe-oublie">
          <a className="link">Mot de passe oublié ?</a>
        </Link>
        <Button type="submit" block blue>
          Connexion
        </Button>
      </form>
    </section>
  );
};
