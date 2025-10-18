export class AnalyticsService {
  static async getAnalytics(_ownerId: string, range = '30d') {
    // Return aggregated velocity metrics and activity points for charts
    const pointsCount = range === '7d' ? 7 : range === '30d' ? 14 : range === '90d' ? 12 : 12;

    const activityTrend = Array.from({ length: pointsCount }).map((_, i) => {
      const date = new Date(Date.now() - (pointsCount - 1 - i) * (range === '7d' ? 86400000 : range === '30d' ? 86400000 * 2 : 86400000 * 7));
      return {
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        commits: Math.floor(4 + Math.sin(i) * 3 + Math.random() * 4),
        tasksCompleted: Math.floor(2 + (i % 3) + Math.random() * 2),
        focusMinutes: Math.floor(60 + Math.sin(i * 0.8) * 35 + Math.random() * 20),
      };
    });

    return {
      range,
      velocity: {
        completedTasks: range === '7d' ? 14 : range === '30d' ? 52 : 148,
        totalCommits: range === '7d' ? 48 : range === '30d' ? 194 : 580,
        focusHoursTotal: range === '7d' ? 14.5 : range === '30d' ? 62.0 : 184.5,
        velocityChangePercentage: '+18.4%',
      },
      projectDistribution: [
        { name: 'DevOS Platform', percentage: 55, color: '#3b82f6' },
        { name: 'Mausam Engine', percentage: 25, color: '#10b981' },
        { name: 'Heart Rate Pipeline', percentage: 20, color: '#8b5cf6' },
      ],
      activityTrend,
    };
  }
}
