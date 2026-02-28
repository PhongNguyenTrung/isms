/**
 * PriorityCalculator - Domain service for FR7 queue prioritization.
 *
 * Calculates a priority score (0-10) for an incoming order based on
 * dish complexity, item count, and other factors.
 * Formula from FR7: Complexity (30%) + Wait time (40%) + VIP (20%) + Load (10%)
 */
class PriorityCalculator {
  calculate(order) {
    let score = 5; // Base score

    // Complexity factor: more items = more complex
    if (order.items && order.items.length > 3) {
      score += 2;
    }

    // TODO: Integrate real wait time, VIP level, and kitchen load
    // once those data points are available from the ordering-service payload.

    return Math.min(score, 10);
  }
}

module.exports = new PriorityCalculator();
