import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer mt-16">
      <div className="footer-wrap grid gap-8 md:grid-cols-4">
        <div className="footer-col">
          <div className="footer-title">À propos</div>
          <Link href="/apropos" className="footer-link">Notre mission</Link>
          <Link href="/conditions" className="footer-link">Conditions générales</Link>
          <Link href="/livraison" className="footer-link">Livraison</Link>
        </div>

        <div className="footer-col">
          <div className="footer-title">Catégories</div>
          <Link href="/boutique?c=mode" className="footer-link">Mode</Link>
          <Link href="/boutique?c=maison" className="footer-link">Maison</Link>
          <Link href="/boutique?c=art" className="footer-link">Art</Link>
          <Link href="/boutique?c=beaute" className="footer-link">Beauté</Link>
        </div>

        <div className="footer-col md:col-span-2">
          <div className="footer-title">Recevez nos dernières créations</div>
          <div className="newsletter mt-2 max-w-md">
            <input type="email" placeholder="Votre email" className="px-3 py-2" />
            <button className="ok">OK</button>
          </div>
          <p className="mt-6 text-xs text-cream-300">
            Paiements acceptés : MTN • Orange • Visa
          </p>
        </div>
      </div>

      <div className="wrap py-6 border-t border-sawaka-800 text-xs text-cream-300">
        © {new Date().getFullYear()} Sawaka. Tous droits réservés.
      </div>
    </footer>
  );
}
