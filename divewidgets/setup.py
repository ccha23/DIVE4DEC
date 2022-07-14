#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Jupyter Development Team.
# Distributed under the terms of the Modified BSD License.

# from __future__ import print_function
# from glob import glob
import os
from os.path import join as pjoin
from setuptools import setup

HERE = os.path.dirname(os.path.abspath(__file__))
NAME = 'divewidgets'

try:
    from jupyter_packaging import (
        # create_cmdclass,
        # install_npm,
        # ensure_targets,
        # combine_commands,
        wrap_installers,
        npm_builder,
        get_version,
        get_data_files,
        # skip_if_exists
    )

    # Get the version
    version = get_version(pjoin(NAME, '_version.py'))


    # Representative files that should exist after a successful build
    jstargets = [
        pjoin(HERE, NAME, 'nbextension', 'index.js'),
        pjoin(HERE, NAME, 'labextension', 'package.json'),
    ]


    # package_data_spec = {
    #     NAME: [
    #         'nbextension/**js*',
    #         'labextension/**'
    #     ]
    # }


    data_files_spec = [
        ('share/jupyter/nbextensions/divewidgets', 'divewidgets/nbextension', '**'),
        ('share/jupyter/labextensions/jupyter-divewidgets', 'divewidgets/labextension', '**'),
        ('share/jupyter/labextensions/jupyter-divewidgets', '.', 'install.json'),
        ('etc/jupyter/nbconfig/notebook.d', '.', 'divewidgets.json'),
    ]

    
    
    cmdclass = wrap_installers(
        post_develop=npm_builder(path=HERE, build_cmd='build:prod'), 
        ensured_targets=jstargets
    )

    # cmdclass = create_cmdclass('jsdeps', package_data_spec=package_data_spec,
    #     data_files_spec=data_files_spec)
    # npm_install = combine_commands(
    #     install_npm(HERE, build_cmd='build:prod'),
    #     ensure_targets(jstargets),
    # )
    # cmdclass['jsdeps'] = skip_if_exists(jstargets, npm_install)

    setup_args = dict(
        # NAME            = NAME,
        # description     = 'Jupyter Widgets for DIVE virtual learning environment.',
        version         = version,
        # scripts         = glob(pjoin('scripts', '*')),
        cmdclass        = cmdclass,
        data_files = get_data_files(data_files_spec),
        # packages        = find_packages(),
        # author          = 'Chung Chan',
        # author_email    = 'chungc@alum.mit.edu',
        # url             = 'https://github.com/DIVE/divewidgets',
        # license         = 'BSD',
        # platforms       = "Linux, Mac OS X, Windows",
        # keywords        = ['Jupyter', 'Widgets', 'IPython'],
        # classifiers     = [
        #     'Intended Audience :: Education'
        #     'Intended Audience :: Developers',
        #     'Intended Audience :: Science/Research',
        #     'License :: OSI Approved :: BSD License',
        #     'Framework :: Jupyter',
        #     'Framework :: Jupyter :: JupyterLab',
        #     'Framework :: Jupyter :: JupyterLab :: 3',
        #     'Programming Language :: Python',
        #     'Programming Language :: Python :: 3.6',
        #     'Programming Language :: Python :: 3.7',
        #     'Programming Language :: Python :: 3.8',
        #     'Programming Language :: Python :: 3.9',
        #     'Programming Language :: Python :: 3.10',
        #     'Framework :: Jupyter',
        # ],
        # include_package_data = True,
        # python_requires=">=3.6",
        # install_requires = [
        #     'ipywidgets>=7.0.0',
        # ],
        # extras_require = {
        #     'test': [
        #         'pytest>=4.6',
        #         'pytest-cov',
        #         'nbval',
        #     ],
        #     'examples': [
        #         # Any requirements for the examples to run
        #     ],
        #     'docs': [
        #         'jupyter_sphinx',
        #         'nbsphinx',
        #         'nbsphinx-link',
        #         'pytest_check_links',
        #         'pypandoc',
        #         'recommonmark',
        #         'sphinx>=1.5',
        #         'sphinx_rtd_theme',
        #     ],
        # },
        # entry_points = {
        # },
    )

except ImportError:
    setup_args = {}

if __name__ == '__main__':
    setup(**setup_args)
