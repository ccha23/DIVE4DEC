MathJax = {
    loader: {
        load: ['[tex]/amscd', '[tex]/bbox', '[tex]/braket', '[tex]/boldsymbol', '[tex]/tagformat', '[tex]/verb', '[tex]/upgreek', '[tex]/mathtools']
    },
  tex: {
      packages: {'[+]': ['amscd', 'bbox', 'braket', 'boldsymbol', 'tagformat','verb', 'upgreek', 'mathtools']},
      tags: 'ams',
      macros: {
          mc: ["\\mathcal{#1}", 1],
          rsfs: ["\\mathsc{#1}", 1],
          R: ["\\mathsf{#1}", 1],
          M: ["\\boldsymbol{#1}", 1],
          RM: ["\\R{\\M{#1}}", 1]
      },
      mathtools: {
          pairedDelimiters: {
              abs: ['\\lvert', '\\rvert'],
              Set: ['\\\{', '\\\}']
          }
      }
  }
};

(function () {
    let script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js';
    script.async = true;
    document.head.appendChild(script);
}) ();
