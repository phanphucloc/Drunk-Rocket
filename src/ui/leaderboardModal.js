/**
 * Leaderboard & Score Submission Modal
 * Connects directly to Cloudflare Worker API (/api/leaderboard and /api/score)
 * with robust offline mock fallback for local testing.
 */
export class LeaderboardModal {
  constructor(apiBaseUrl = '') {
    this.apiBaseUrl = apiBaseUrl;
    this.currentTab = 'daily';
    this.isOpen = false;
    this.lastScore = 0;
    this.lastDurationMs = 0;

    this.modalEl = document.getElementById('leaderboard-modal');
    this.tableBody = document.getElementById('leaderboard-tbody');
    this.tabDaily = document.getElementById('tab-daily');
    this.tabAlltime = document.getElementById('tab-alltime');
    this.btnClose = document.getElementById('btn-close-modal');
    this.submitBox = document.getElementById('score-submit-box');
    this.inputName = document.getElementById('input-player-name');
    this.btnSubmit = document.getElementById('btn-submit-score');
    this.submitStatus = document.getElementById('submit-status');

    this._bindEvents();
  }

  _bindEvents() {
    if (this.tabDaily) {
      this.tabDaily.addEventListener('click', () => this.switchTab('daily'));
    }
    if (this.tabAlltime) {
      this.tabAlltime.addEventListener('click', () => this.switchTab('alltime'));
    }
    if (this.btnClose) {
      this.btnClose.addEventListener('click', () => this.hide());
    }
    if (this.btnSubmit) {
      this.btnSubmit.addEventListener('click', () => this.submitScore());
    }
    if (this.inputName) {
      this.inputName.value = localStorage.getItem('drunk_player_name') || 'ACE';
      this.inputName.addEventListener('input', (e) => {
        e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3);
      });
    }
  }

  show(pendingScore = 0, durationMs = 0) {
    this.lastScore = pendingScore;
    this.lastDurationMs = durationMs;
    this.isOpen = true;

    if (this.modalEl) {
      this.modalEl.classList.remove('hidden');
    }

    if (this.submitBox) {
      if (pendingScore > 0) {
        this.submitBox.style.display = 'block';
        if (this.submitStatus) {
          this.submitStatus.innerText = `Điểm ván này: ${pendingScore} (${(durationMs / 1000).toFixed(1)}s)`;
          this.submitStatus.style.color = '#00f0ff';
        }
      } else {
        this.submitBox.style.display = 'none';
      }
    }

    this.loadLeaderboard(this.currentTab);
  }

  hide() {
    this.isOpen = false;
    if (this.modalEl) {
      this.modalEl.classList.add('hidden');
    }
  }

  switchTab(tab) {
    this.currentTab = tab;
    if (tab === 'daily') {
      this.tabDaily?.classList.add('active');
      this.tabAlltime?.classList.remove('active');
    } else {
      this.tabAlltime?.classList.add('active');
      this.tabDaily?.classList.remove('active');
    }
    this.loadLeaderboard(tab);
  }

  async loadLeaderboard(tab = 'daily') {
    if (this.tableBody) {
      this.tableBody.innerHTML = '<tr><td colspan="4" class="loading">Đang tải bảng vàng...</td></tr>';
    }

    try {
      const res = await fetch(`${this.apiBaseUrl}/api/leaderboard?type=${tab}&limit=10`);
      if (!res.ok) throw new Error('API unavailable');
      const json = await res.json();
      if (json && json.success && Array.isArray(json.data)) {
        this.renderTable(json.data);
        return;
      }
      throw new Error('Invalid format');
    } catch (err) {
      // Local fallback mock data
      this.renderTable(this._getMockScores(tab));
    }
  }

  renderTable(scores) {
    if (!this.tableBody) return;
    if (!scores || scores.length === 0) {
      this.tableBody.innerHTML = '<tr><td colspan="4" class="empty">Chưa có ai ghi danh hôm nay!</td></tr>';
      return;
    }

    let html = '';
    scores.forEach((item, index) => {
      let medal = `${index + 1}`;
      let rowClass = '';
      if (index === 0) { medal = '🥇 1'; rowClass = 'top-1'; }
      else if (index === 1) { medal = '🥈 2'; rowClass = 'top-2'; }
      else if (index === 2) { medal = '🥉 3'; rowClass = 'top-3'; }

      const dateStr = item.created_at ? item.created_at.split('T')[0] : 'Vừa xong';

      html += `<tr class="${rowClass}">
        <td>${medal}</td>
        <td class="player-tag">${item.player_name || 'AAA'}</td>
        <td class="player-score">${item.score}</td>
        <td class="player-date">${dateStr}</td>
      </tr>`;
    });

    this.tableBody.innerHTML = html;
  }

  async submitScore() {
    const playerName = (this.inputName?.value || 'AAA').trim().toUpperCase() || 'AAA';
    localStorage.setItem('drunk_player_name', playerName);

    if (this.btnSubmit) this.btnSubmit.disabled = true;
    if (this.submitStatus) {
      this.submitStatus.innerText = 'Đang lưu kỷ lục lên D1...';
      this.submitStatus.style.color = '#ffd13b';
    }

    try {
      const payload = {
        player_name: playerName,
        score: this.lastScore,
        duration_ms: this.lastDurationMs,
        client_hash: ''
      };

      const res = await fetch(`${this.apiBaseUrl}/api/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (result && result.success) {
        if (this.submitStatus) {
          this.submitStatus.innerText = `Đã lưu thành công! Xếp hạng #${result.rank || 1}`;
          this.submitStatus.style.color = '#05ffa1';
        }
        if (this.submitBox) {
          setTimeout(() => { this.submitBox.style.display = 'none'; }, 1500);
        }
        this.loadLeaderboard(this.currentTab);
      } else {
        throw new Error(result.error || 'Submit failed');
      }
    } catch (e) {
      // Offline fallback: save locally
      this._saveLocalScore(playerName, this.lastScore);
      if (this.submitStatus) {
        this.submitStatus.innerText = 'Đã lưu cục bộ (Local Leaderboard)!';
        this.submitStatus.style.color = '#05ffa1';
      }
      setTimeout(() => {
        if (this.submitBox) this.submitBox.style.display = 'none';
        this.loadLeaderboard(this.currentTab);
      }, 1200);
    } finally {
      if (this.btnSubmit) this.btnSubmit.disabled = false;
    }
  }

  _saveLocalScore(name, score) {
    const list = JSON.parse(localStorage.getItem('drunk_local_scores') || '[]');
    list.push({ player_name: name, score, created_at: new Date().toISOString() });
    list.sort((a, b) => b.score - a.score);
    localStorage.setItem('drunk_local_scores', JSON.stringify(list.slice(0, 10)));
  }

  _getMockScores(tab) {
    const local = JSON.parse(localStorage.getItem('drunk_local_scores') || '[]');
    if (local.length > 0) return local;

    return [
      { player_name: 'ACE', score: 14, created_at: '2026-11-17' },
      { player_name: 'NEO', score: 9, created_at: '2026-11-17' },
      { player_name: 'PRO', score: 6, created_at: '2026-11-17' },
      { player_name: 'BOT', score: 3, created_at: '2026-11-17' },
      { player_name: 'FLY', score: 2, created_at: '2026-11-17' }
    ];
  }
}
