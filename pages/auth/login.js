import React from 'react';
import Link from 'next/link';
import InputGroup from '../../components/form/InputGroup';
import Button from '../../components/Button';

export default function login() {
  return (
    <section className="container" id="login">
      <form className="form" noValidate>
        <h1 className="form__title">Connexion</h1>
        <InputGroup label="Adresse e-mail" name="email" placeholder="Adresse e-mail" />
        <InputGroup label="Mot de passe" name="password" placeholder="Mot de passe" />
        <Link href="/auth/forgot" as="/mot-de-passe-oublie">
          <a className="link">Mot de passe oublié ?</a>
        </Link>
        <Button type="submit" block blue>
          Connexion
        </Button>
      </form>
    </section>
  );
}
