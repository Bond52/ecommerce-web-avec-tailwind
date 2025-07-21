import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <h1>Bienvenue sur Sawaka</h1>
      <p>Pour accéder à votre compte, veuillez vous connecter :</p>
      
      <Link href="/login">
        <button>Se connecter</button>
      </Link>
    </div>
  );
}
