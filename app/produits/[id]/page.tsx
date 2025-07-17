type Props = {
  params: {
    id: string;
  };
};

export default function Produit({ params }: Props) {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Produit ID : {params.id}</h1>
      <p>Description et détails du produit ici.</p>
    </main>
  );
}
