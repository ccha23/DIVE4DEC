#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Chung Chan.
# Distributed under the terms of the Modified BSD License.

"""
TODO: Add module docstring
"""

from ipywidgets import DOMWidget, ValueWidget, register
from traitlets import Unicode, Int, Bool
from ._frontend import module_name, module_version

@register
class DIVEWidget(DOMWidget, ValueWidget):
    """DIVEWidget Widget
    """
    _model_name = Unicode('DIVEWidgetModel').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)
    _view_name = Unicode('DIVEWidgetView').tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)
    code = Unicode('// some code here').tag(sync=True)
    html = Unicode('<!-- some code here -->').tag(sync=True)
    height = Int(600).tag(sync=True);
    width = Int(600).tag(sync=True);

def create_JSXGraph(id='box', code='const board = JXG.JSXGraph.initBoard("box", { boundingbox: [-5, 5, 5, -5], axis:true });', mathjax_url='https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js', height=600, width=600):
    html = r'''<!DOCTYPE html>
<html>
    <head>
    <style>
    html, body {
        height: 100%;
    }
    body {
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
    return DIVEWidget(code=code, html=html, height=height, width=width)
