// ─── PremiumRoute ─────────────────────────────────────────────────────────────
// Wrapper de tela (substituto de "route guard" usado em apps web).
// Usar como HOC: `export default withPremium(MinhaTela)` ou como wrapper
// no register do navigator.
//
// Se o usuário não for premium, renderiza o componente <LockedContent />
// em vez da tela protegida.
import React from 'react';
import { useAuth } from '../context/AuthContext';
import LockedContent from './LockedContent';

export default function PremiumRoute({ feature, description, children }) {
  const { isPremium } = useAuth();
  if (isPremium) return <>{children}</>;
  return <LockedContent feature={feature} description={description} />;
}

// HOC para uso em screens registrados no navigator:
//   export default withPremium(SpeakingAIScreen, { feature: 'Speak AI' })
export function withPremium(Component, opts = {}) {
  return function PremiumGuarded(props) {
    return (
      <PremiumRoute feature={opts.feature} description={opts.description}>
        <Component {...props} />
      </PremiumRoute>
    );
  };
}
