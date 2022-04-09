module.exports = {
  // 指定使用tailwindcss的文件，根据文件的使用情况进行摇树优化
  // purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  important: true,
  theme: {
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: []
}
