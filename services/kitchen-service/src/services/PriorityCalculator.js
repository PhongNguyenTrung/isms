/**
 * PriorityCalculator - Domain service for FR7 queue prioritization.
 *
 * Calculates a priority score (0-10) for an incoming order based on
 * dish complexity, item count, wait time, and order urgency.
 * Formula from FR7: Complexity (30%) + Wait time (40%) + VIP (20%) + Load (10%)
 */
class PriorityCalculator {
  calculate(order) {
    // Complexity factor (30%): more items & MAIN_DISH heavier
    let complexityScore = 0;
    if (order.items) {
      const mainDishCount = order.items.filter(i => i.category === 'MAIN_DISH').length;
      const totalItems = order.items.length;
      complexityScore = Math.min((mainDishCount * 2 + totalItems) / 2, 3);
    }

    // Wait time factor (40%): use timestamp if available (older = higher priority)
    let waitScore = 0;
    if (order.timestamp) {
      const ageMs = Date.now() - new Date(order.timestamp).getTime();
      const ageMin = ageMs / 60000;
      waitScore = Math.min(ageMin / 2, 4); // max 4 pts at 8+ minutes wait
    }

    // VIP factor (20%): explicit flag in event payload
    const vipScore = order.isVip ? 2 : 0;

    // Load factor (10%): not available at event time, use base
    const loadScore = 1;

    const total = complexityScore + waitScore + vipScore + loadScore;
    return Math.min(Math.round(total * 10) / 10, 10);
  }
}

module.exports = new PriorityCalculator();
