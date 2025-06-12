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
       'neon-blue': '#0ea5e9',
        link: '#66ccff',      // リンク用に明るいシアン
        'link-hover': '#99e0ff',
     },
     fontFamily: {
       futuristic: ['Orbitron', 'sans-serif'], // 近未来フォント
     },
     fontSize: {
        base: '18px',    // 文字を少し大きめに
        lg: '20px',
        xl: '24px',
      },
     boxShadow: {
       'glow-cyan': '0 0 10px rgba(6,182,212,0.7)',
       'glow-pink': '0 0 10px rgba(219,39,119,0.7)',
       'glow-lime': '0 0 10px rgba(132,204,22,0.7)',
     },
     maxWidth: {
        'container': '800px',  // フォームやリストは最大800px幅に
      },
   },
  },
  plugins: [],
};
