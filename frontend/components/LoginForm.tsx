import React from 'react';
import client from '../lib/Client';
import { useRouter } from 'next/router';

export default function LoginForm() {
  const router = useRouter();

  function getErrorMessage(error: unknown) {
    if (error instanceof Error) return error.message;
    return String(error);
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { email, password } = document.forms[0];
      const res = await client.post('/login', {
        email: email.value,
        password: password.value,
      });
      console.log(res.data, 'response data');
      router.push('/loggedin');
    } catch ({ response }: unknown) {
      console.log(response);
    }
  };
  return (
    <div className="wrapperRegister">
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">
          <b>Email</b>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
        />

        <label htmlFor="password">
          <b>Password</b>
        </label>
        <input
          type="password"
          id="password"
          name="password"
          minLength={8}
          required
        />
        <button
          type="submit"
          className="btnLogin"
        >
          <b>Submit</b>
        </button>
      </form>
    </div>
  );
}
