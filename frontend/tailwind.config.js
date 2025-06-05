// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
     colors: {
       'cyber-bg': '#0f0f19',       // メイン背景
       'cyber-panel': '#1a1f2b',    // パネル／カード背景
       'cyber-hover': '#26304a',    // テーブル行ホバー
       'neon-cyan': '#06b6d4',
       'neon-pink': '#db2777',
       'neon-lime': '#84cc16',
     },
     fontFamily: {
       futuristic: ['Orbitron', 'sans-serif'], // 近未来フォント
     },
     boxShadow: {
       'glow-cyan': '0 0 10px rgba(6,182,212,0.7)',
       'glow-pink': '0 0 10px rgba(219,39,119,0.7)',
       'glow-lime': '0 0 10px rgba(132,204,22,0.7)',
     },
   },
  },
  plugins: [],
};
