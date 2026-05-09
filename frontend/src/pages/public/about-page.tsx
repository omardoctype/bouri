import { Card } from '../../components/ui/card';

export const AboutPage = () => {
  return (
    <div className="page-shell py-10">
      <section>
        <h1 className="section-title">A propos de Bouri Events</h1>
        <p className="section-subtitle">
          Une agence digitale orientee excellence, nee pour simplifier l\'organisation d\'evenements premium en Tunisie.
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <Card>
            <h2 className="font-display text-2xl">Notre vision</h2>
            <p className="mt-3 text-sm leading-relaxed text-grayLuxury">
              Offrir une plateforme unique ou clients, prestataires et equipe admin collaborent avec transparence. Notre ambition: faire de chaque reservation une execution elegante, fluide et memorable.
            </p>
          </Card>

          <Card>
            <h2 className="font-display text-2xl">Notre methode</h2>
            <p className="mt-3 text-sm leading-relaxed text-grayLuxury">
              Nous combinons curation humaine, process operationnel et technologie pour garantir des standards premium. Men planification lel delivery, el focus dima sur qualite et precision.
            </p>
          </Card>
        </div>
      </section>

      <section className="mt-14 grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm uppercase tracking-[0.16em] text-grayLuxury">Valeur 01</p>
          <h3 className="mt-3 text-xl font-bold text-offWhite">Elegance</h3>
          <p className="mt-2 text-sm text-grayLuxury">Direction artistique premium dans chaque detail.</p>
        </Card>
        <Card>
          <p className="text-sm uppercase tracking-[0.16em] text-grayLuxury">Valeur 02</p>
          <h3 className="mt-3 text-xl font-bold text-offWhite">Rigueur</h3>
          <p className="mt-2 text-sm text-grayLuxury">Pilotage clair des delais, budgets et ressources.</p>
        </Card>
        <Card>
          <p className="text-sm uppercase tracking-[0.16em] text-grayLuxury">Valeur 03</p>
          <h3 className="mt-3 text-xl font-bold text-offWhite">Emotion</h3>
          <p className="mt-2 text-sm text-grayLuxury">Des evenements qui marquent les invites durablement.</p>
        </Card>
      </section>
    </div>
  );
};

