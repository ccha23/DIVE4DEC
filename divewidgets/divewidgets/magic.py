from IPython.core.magic import (Magics, magics_class, line_magic,
                                cell_magic, line_cell_magic)
from IPython.core.magic_arguments import (argument, magic_arguments,
                                          parse_argstring)
from IPython.display import Javascript, display

from .widget import create_JSXGraph, create_mermaid, create_flowchart

@magics_class
class DIVEMagics(Magics):

    @magic_arguments()
    @argument(
        '-w', '--width', type=int, default=600,
        help="The width of the output frame (default: 600)."
    )
    @argument(
        '-i', '--id', type=str, default='box',
        help="id of a <div> element for embeding the board."
    )
    @argument(
        '-h', '--height', type=int, default=600,
        help="The height of the output frame (default: 600)."
    )
    @argument(
        '-m', '--mathjax_url', type=str, default='https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js',
        help="Absolute/relative url of the javascript file in loading mathjax."
    )
    @cell_magic
    def jsxgraph(self, line, cell):
        opts = parse_argstring(self.jsxgraph, line)
        return create_JSXGraph(code=cell.strip(), height=opts.height, width=opts.width, id=opts.id, mathjax_url=opts.mathjax_url)

    @magic_arguments()
    @argument(
        '-w', '--width', type=int, default=600,
        help="The width of the output frame (default: 600)."
    )
    @argument(
        '-h', '--height', type=int, default=600,
        help="The height of the output frame (default: 600)."
    )
    @cell_magic
    def mermaid(self, line, cell):
        opts = parse_argstring(self.mermaid, line)
        return create_mermaid(code=cell.strip(), height=opts.height, width=opts.width)

    @magic_arguments()
    @argument(
        '-w', '--width', type=int, default=600,
        help="The width of the output frame (default: 600)."
    )
    @argument(
        '-h', '--height', type=int, default=600,
        help="The height of the output frame (default: 600)."
    )
    @cell_magic
    def flowchart(self, line, cell):
        opts = parse_argstring(self.flowchart, line)
        return create_flowchart(code=cell.strip(), height=opts.height, width=opts.width)