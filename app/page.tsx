import Link from "next/link";
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);


export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-800">Bienvenue sur la boutique</h1>
      <Link href="/produits" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Voir le catalogue
      </Link>
    </main>
  );
}
