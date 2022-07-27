#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Chung Chan.
# Distributed under the terms of the Modified BSD License.

"""
Interactive widgets for DIVE virtual learning environment.

%load_ext divewidgets

E.g., to create a mermaid graph 
%%mermaid
graph TD 
A[a] --> B[b] 
B --> C[c] 
B --> D[d]

from divewidgets import create_mermaid
create_mermaid(code='''
graph TD 
A[a] --> B[b] 
B --> C[c] 
B --> D[d]
''')
"""

from ipywidgets import DOMWidget, ValueWidget, register
from traitlets import Unicode, Int, Bool
from ._frontend import module_name, module_version

@register
class DIVEWidget(DOMWidget, ValueWidget):
    """Renders an IFrame from editable Javascript and HTML.

    Parameters
    ----------
    js: string
        Javascript code.
    html: string
        HTML code. 

    Returns
    -------
    Widget: html with js appended to the body. 
        The html and js code can be edited and re-rendered.
    """
    _model_name = Unicode('DIVEWidgetModel').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)
    _view_name = Unicode('DIVEWidgetView').tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)
    js = Unicode('// some code here').tag(sync=True)
    html = Unicode('<!-- some code here -->').tag(sync=True)
    height = Int(-1).tag(sync=True);
    width = Int(-1).tag(sync=True);

def create_JSXGraph(id='box', 
    code='const board = JXG.JSXGraph.initBoard("box", { boundingbox: [-5, 5, 5, -5], axis:true });', 
    mathjax_url='https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js', 
    height=600, width=600):
    html = r'''<!DOCTYPE html>
<html>
    <head>
    <style>
    html, body {
        height: 100%;
    }
    body {
        width: 100%;
        display: flex;
        padding: 0;
        margin: 0;
    }
    .jxgbox {
        width:100%; 
        flex-grow: 1;
    }
    </style>
    <link rel="stylesheet" type="text/css" href="https://jsxgraph.org/distrib/jsxgraph.css" />
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/jsxgraph/distrib/jsxgraphcore.js"></script>
    <script type="text/javascript" src="'''+ mathjax_url +r'''"></script>
    </head>
<body>
<div id="''' + id + r'''" class="jxgbox"></div>
</body>
</html>'''
    return DIVEWidget(js=code, html=html, height=height, width=width)


def create_mermaid(code="""
graph TD 
A[a] --> B[b] 
B --> C[c] 
B --> D[d]"""):
    js = r'''render(`
'''+code+'''
`);'''
    html = r'''<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
    <style>
        body {
            padding: 0;
            margin: 0;
        }        
        .mermaid > svg {
          max-width:100%;
          height: auto;
        }
    </style>
</head>
<body>
    <div class="mermaid">
    </div>
    <script>mermaid.initialize({startOnLoad:false});
    var render = (function () {
      var element = document.querySelector('.mermaid');
      var insertSvg = function(svgCode, bindFunctions) {
        element.innerHTML = svgCode;
      };
      return (code) => {
        mermaid.mermaidAPI.render('rendered-mermaid',code,insertSvg);
      };    
    })()
    </script>
</body>
</html>'''
    return DIVEWidget(js=js, html=html)


def create_flowchart(code="""
cond3=>condition: if (not input(1))
cond8=>condition: if input(2)
sub12=>subroutine: input(3)

cond3(yes)->cond8
cond8(yes)->sub12"""):
    js = r'''render(`
'''+code+'''
`);'''
    html = r'''<!DOCTYPE html>
<html>
<head>
  <script src="http://cdnjs.cloudflare.com/ajax/libs/raphael/2.3.0/raphael.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/flowchart/1.17.1/flowchart.min.js"></script>
    <style>
        body {
            padding: 0;
            margin: 0;
        }
        #diagram > svg {
          max-width:100%;
          height: auto;
        }
    </style>
</head>
<body>
    <div id="diagram">
    </div>
    <script>
    var render = (function () {
      return (code) => {
        document.getElementById('diagram').innerHTML = '';
        flowchart.parse(code).drawSVG('diagram');
      };    
    })()
    </script>
</body>
</html>'''
    return DIVEWidget(js=js, html=html)