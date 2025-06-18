export default class Leaderboard {
  constructor(scene) {
    this.scene = scene;
    this.storageKey = 'TECMUL_TP2_Leaderboard';
    this.maxEntries = 10;
  }

  loadScores() {
    try {
      const storedData = localStorage.getItem(this.storageKey);
      if (storedData) {
        return JSON.parse(storedData);
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
    return [];
  }

  saveScores(scores) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(scores));
      return true;
    } catch (error) {
      console.error('Error saving leaderboard:', error);
      return false;
    }
  }

  addScore(username, score) {
    const scores = this.loadScores();
    
    const newScore = {
      username: username || 'Anonymous',
      score: score || 0
    };

    scores.push(newScore);
    scores.sort((a, b) => b.score - a.score);
    const topScores = scores.slice(0, this.maxEntries);
    this.saveScores(topScores);
    
    const newScoreIndex = topScores.findIndex(entry => 
      entry.username === newScore.username && entry.score === newScore.score
    );
    return newScoreIndex >= 0 ? newScoreIndex + 1 : 0;
  }

  getScores() {
    return this.loadScores();
  }

  getTopScores(count = 5) {
    const scores = this.loadScores();
    return scores.slice(0, count);
  }

  isHighScore(score) {
    const scores = this.loadScores();
    if (scores.length < this.maxEntries) {
      return true;
    }
    const lowestScore = scores[scores.length - 1];
    return score > lowestScore.score;
  }


  getFormattedScores() {
    const scores = this.getScores();
    if (scores.length === 0) {
      return ['No scores yet!'];
    }
    return scores.map((entry, index) => {
      return `${index + 1}. ${entry.username} - ${entry.score}`;
    });
  }
}