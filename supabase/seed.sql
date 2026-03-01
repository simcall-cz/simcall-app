-- ============================================
-- SimCall - Seed Data
-- ============================================

-- ============================================
-- Agents
-- ============================================

insert into agents (id, name, personality, description, difficulty, avatar_initials, traits, elevenlabs_agent_id, example_scenario) values
(
  'agent-1',
  'Petr Horák',
  'Skeptický prodejce',
  'Petr vlastní rodinný dům 5+kk na okraji Prahy a prodává ho sám přes Bezrealitky. Měl špatné zkušenosti se dvěma makléři. Je úsečný, podezřívavý a cynický.',
  'hard',
  'PH',
  '["Úsečný", "Podezřívavý", "Cynický", "Přímý", "Frustrovaný"]',
  'agent_0301kjnbbx8rfs0rfy5kf12veac6',
  'Petr prodává rodinný dům 5+kk v Černošicích za 18,5 mil Kč. Prodává sám už 3 měsíce. Přesvědčte ho, že potřebuje profesionálního makléře.'
);

-- ============================================
-- Scenarios
-- ============================================

insert into scenarios (id, title, description, category, difficulty, objectives, agent_id) values
(
  'scenario-1',
  'Přesvědčení skeptického prodejce',
  'Petr Horák prodává rodinný dům 5+kk v Černošicích sám přes Bezrealitky už 3 měsíce. Měl špatné zkušenosti s dvěma makléři. Je frustrovaný, úsečný a podezřívavý.',
  'cold-lead',
  'hard',
  '["Překonat počáteční odmítnutí a cynismus", "Prokázat znalost lokality a konkrétních cen v Černošicích", "Identifikovat chyby předchozích makléřů a odlišit se", "Domluvit si osobní schůzku (i když jen 15 minut)"]',
  'agent-1'
);
