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
class JSXGraph(DOMWidget, ValueWidget):
    """JSXGraph Widget
    """
    _model_name = Unicode('JSXGraphModel').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)
    _view_name = Unicode('JSXGraphView').tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)
    code = Unicode('const board = JXG.JSXGraph.initBoard("box", { boundingbox: [-5, 5, 5, -5], axis:true });').tag(sync=True)
    height = Int(600).tag(sync=True);
    width = Int(600).tag(sync=True);
    id = Unicode('box').tag(sync=True);
    mathjax_url = Unicode('https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js').tag(sync=True);
